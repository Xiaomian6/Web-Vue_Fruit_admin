<template>
  <div class="app-container">
    <div class="filter-container" align="right">
      <el-input v-model="listQuery.shop_id" :placeholder="'shop_id'" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">{{ '搜索' }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'ID'" prop="id" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺名'" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺主'" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺信用'" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user.user_creditscore }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺地址'" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_address }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'联系电话'" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺信息'" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_extra }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'最近活跃时间'" class-name="status-col" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '编辑' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'店铺名：'">
          <el-input v-model="temp.shop_name" />
        </el-form-item>
        <el-form-item :label="'联系方式：'">
          <el-input v-model="temp.shop_phone" />
        </el-form-item>
        <el-form-item :label="'店铺地址：'">
          <el-input v-model="temp.shop_address" />
        </el-form-item>
        <el-form-item :label="'店铺信息：'">
          <el-input v-model="temp.shop_extra" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData(temp.shop_id)">{{ '确认' }}</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { fetchList, updateStore, deleteStore } from '@/api/storeadmin'
  import waves from '@/directive/waves' // Waves directive 水波纹特效
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination 分页

  export default {
    inject: ["reload"],
    name: 'storeinfo',
    components: { Pagination }, // 分页插件
    directives: { waves }, // 水波纹特效
    filters: {
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: { // 创建一个列表
          page: 1,
          limit: 20,
          shop_id: 0,
          user: undefined, // 用户信息
          shop_name: undefined,
          shop_address: undefined,
          shop_phone: undefined,
          shop_extra: undefined, // 店铺信息
          shop_updateTime: undefined
        },
        temp: {
          shop_id: 0,
          shop_name: undefined,
          shop_address: undefined,
          shop_phone: undefined,
          shop_extra: undefined, // 店铺信息
        },
        dialogFormVisible: false, // 关闭按钮
        dialogStatus: '', // 0 编辑 1 添加
        textMap: {
          update: '编辑店铺',
          create: '添加店铺'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() { // 抓取数据api
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          // alert(response.data.items.length)
          this.list = response.data
          this.total = response.data.length
          const a = JSON.stringify(response.data)
          console.log(a)
          console.log(response.data.length + "已经刷新")
          // Just to simulate the time of the request 模拟请求时间
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      resetTemp() { // 返回缓存
        this.temp = {
          shop_id: 0,
          shop_name: undefined,
          shop_address: undefined,
          shop_phone: undefined,
          shop_extra: undefined, // 店铺信息
        }
      },
      handleCreate() { // 添加弹出窗口
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true  // 关闭按钮
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() { // 调用创建api
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.temp.author = 'admin'
            createUser(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false // 关闭按钮
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) { // 编辑弹出窗口
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true // 关闭按钮
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData(up_id) { // 调用更新api
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log("send" + up_id)
            const tempData = Object.assign({}, this.temp)
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateStore(tempData, up_id).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
          setTimeout(() => {
            this.reload()
          }, 1.5 * 100)
        })
      },
    }
  }
</script>
