<template>
  <div class="app-container">
    <div class="filter-container" align="right">
      <el-input v-model="listQuery.user_id" :placeholder="'user_id'" style="width: 200px;" class="filter-item" />
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
      <el-table-column :label="'认证ID'" prop="id" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.verified_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户ID'" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户名'" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'真实姓名'" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.verified_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'身份证号码'" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.verified_idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'认证角色'" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.verified_role |roleTagFilter">{{ scope.row.verified_role | roleFilter}}</el-tag >
        </template>
      </el-table-column>
      <el-table-column :label="'押金'" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.verified_deposit  }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'申请时间'" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.apply_time  }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="90px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '审核' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="'认证ID：'">
            {{temp.verified_id}}
          </el-form-item>
          <el-form-item :label="'用户ID：'">
            {{ temp.user_id }}
          </el-form-item>
          <el-form-item :label="'用户名：'">
            {{ temp.username }}
          </el-form-item>
          <el-form-item :label="'真实姓名：'">
            {{ temp.verified_name }}
          </el-form-item>
          <el-form-item :label="'身份证号码：'">
            {{ temp.verified_idcard }}
          </el-form-item>
          <el-form-item :label="'认证角色：'">
            <el-tag :type="temp.verified_role |roleTagFilter">{{ temp.verified_role | roleFilter}}</el-tag >
          </el-form-item>
          <el-form-item :label="'押金：'">
            {{ temp.verified_deposit }}
          </el-form-item>
          <el-form-item :label="'申请时间：'">
            {{ temp.apply_time }}
          </el-form-item>
          <el-form-item :label="'不通过原因：'">
            <el-input v-model="temp.verified_exrea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
          <el-button type="danger" @click="dialogStatus==='create'?createData():updateData(temp.verified_id, 2)">{{ '不通过' }}</el-button>
          <el-button type="success" @click="dialogStatus==='create'?createData():updateData(temp.verified_id, 1)">{{ '通过' }}</el-button>
        </div>
     </el-dialog>


  </div>
</template>

<script>
  import { applyList ,updateStatus} from '@/api/authentication'
  import waves from '@/directive/waves' // Waves directive 水波纹特效
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination 分页

  const roleTypeOptions = [
    { key: '0', display_name: '采购' },
    { key: '1', display_name: '收购' },
    { key: '2', display_name: '运输' },
    { key: '3', display_name: '店主' }
  ]

  // arr to obj ,such as { key: '0', display_name: '待审核' }
  const roleTypeKeyValue = roleTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    inject: ["reload"],
    name: 'authenticateapply',
    components: { Pagination }, // 分页插件
    directives: { waves }, // 水波纹特效
    filters: {
      roleFilter(type) {
        return roleTypeKeyValue[type]
      },
      roleTagFilter(status) {
        const roleTagMap = {
          0: 'success', // 采购
          1: 'info', // 收购
          2: 'warning', // 运输
          3: 'danger' // 店铺
        }
        return roleTagMap[status]
      }
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: { // 创建一个列表
          page: 1,
          limit: 20,
          verified_id: 0, // 认证id
          user_id: 0, // 用户id
          username: undefined, // 用户名
          verified_name: undefined, // 真实姓名
          verified_idcard: undefined, // 身份证号码
          verified_phone: undefined, // 手机号码
          verified_role: undefined, // 角色 0-采购 1-收购 2-运输 3-店主
          verified_deposit: 0, // 押金
          apply_time: undefined, // 申请时间
          verified_exrea: undefined // 失败原因
        },
        temp: {
          verified_id: 0, // 认证id
          user_id: 0, // 用户id
          username: undefined, // 用户名
          verified_name: undefined, // 真实姓名
          verified_idcard: undefined, // 身份证号码
          verified_phone: undefined, // 手机号码
          verified_role: undefined, // 角色 0-采购 1-收购 2-运输 3-店主
          verified_deposit: 0, // 押金
          apply_time: undefined ,// 申请时间
          verified_exrea: undefined // 失败原因
        },
        dialogFormVisible: false, // 关闭按钮
        dialogStatus: '', // 0 编辑 1 添加
        textMap: {
          update: '用户实名认证',
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
        applyList(this.listQuery).then(response => {
          // alert(response.data.items.length)
          this.list = response.data
          this.total = response.data.length
          // const a = JSON.stringify(response.data)
          // console.log(a)
          // console.log(response.data.length + "已经刷新")
          // Just to simulate the time of the request 模拟请求时间
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      resetTemp() { // 返回缓存
        this.temp = {
          verified_id: 0, // 认证id
          user_id: 0, // 用户id
          username: undefined, // 用户名
          verified_name: undefined, // 真实姓名
          verified_idcard: undefined, // 身份证号码
          verified_phone: undefined, // 手机号码
          verified_role: undefined, // 角色 0-采购 1-收购 2-运输 3-店主
          verified_deposit: 0, // 押金
          apply_time: undefined, // 申请时间
          verified_exrea: undefined // 失败原因
        }
      },
      handleUpdate(row) { // 编辑弹出窗口
        this.temp = Object.assign({}, row) // copy obj
        this.verified_exrea = undefined // 失败原因清空
        this.dialogStatus = 'update'
        this.dialogFormVisible = true // 关闭按钮
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData(up_id, up_status) { // 调用更新api
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // console.log("send" + up_id)
            const tempData = Object.assign({}, this.temp)
            tempData.verified_status = up_status
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateStatus(tempData, up_id).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
        setTimeout(() => {
          this.reload()
        }, 1.5 * 100)
      },
    }
  }
</script>
