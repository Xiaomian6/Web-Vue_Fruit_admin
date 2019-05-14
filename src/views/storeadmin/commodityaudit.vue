<template>
  <div class="app-container">
    <div class="filter-container" align="right">
      <el-input v-model="listQuery.goods_id" :placeholder="'user_id'" style="width: 200px;" class="filter-item" />
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
      <el-table-column :label="'商品ID'" prop="id" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺ID'" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.shop }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'商品标题'" min-width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'总库存'" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_stock }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'产地'" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_productarea }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'货运类型'" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_post | timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'上架时间'" class-name="status-col" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_dateadded }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'审核状态'" min-width="100px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.goods_isvertify | tagFilter">{{ scope.row.goods_isvertify | statusFilter}}</el-tag >
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.goods_isvertify == 1 " size="mini" @click="handleUpdate(scope.row)">{{ '审核' }}</el-button>
          <el-button type="primary" v-if="scope.row.goods_isvertify == 2 " disabled size="mini" @click="handleUpdate(scope.row)">{{ '已上架' }}</el-button>
          <el-button type="danger" v-if="scope.row.goods_isvertify == 3 " disabled size="mini" @click="handleUpdate(scope.row)">{{ '未通过' }}</el-button>
</template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'商品ID：'">
          {{temp.goods_id}}
        </el-form-item>
        <el-form-item :label="'店铺ID：'">
          {{ temp.shop }}
        </el-form-item>
        <el-form-item :label="'商品标题：'">
          {{ temp.goods_title }}
        </el-form-item>
        <el-form-item :label="'总库存：'">
          {{ temp.goods_stock }}
        </el-form-item>
        <el-form-item :label="'产地：'">
          {{ temp.goods_productarea }}
        </el-form-item>
        <el-form-item :label="'货运类型：'">
          {{temp.goods_post | timeFilter}}
        </el-form-item>
        <el-form-item :label="'上架时间：'">
          {{temp.goods_dateadded}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="danger" @click="dialogStatus==='create'?createData():updateData(temp.goods_id, 3)">{{ '不通过' }}</el-button>
        <el-button type="success" @click="dialogStatus==='create'?createData():updateData(temp.goods_id, 2)">{{ '通过' }}</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { goodsList, updateGoods } from '@/api/storeadmin'
  import waves from '@/directive/waves' // Waves directive 水波纹特效
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination 分页

  const timeTypeOptions = [
    { key: 'true', display_name: '包邮' },
    { key: 'false', display_name: '不包邮' }
  ]

  const statusTypeOptions = [
    { key: '1', display_name: '待审核' },
    { key: '2', display_name: '审核通过' },
    { key: '3', display_name: '审核不通过' }
  ]

  // arr to obj ,such as { key: 'true', display_name: '包邮' }
  const timeTypeKeyValue = timeTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  // arr to obj ,such as { key: '1', display_name: '待审核' }
  const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    inject: ["reload"],
    name: 'commodityaudit',
    components: { Pagination }, // 分页插件
    directives: { waves }, // 水波纹特效
    filters: {
      timeFilter(type) {
        return timeTypeKeyValue[type]
      },
      statusFilter(type) {
        return statusTypeKeyValue[type]
      },
      tagFilter(status) {
        const tagMap = {
          1: 'warning',
          2: 'success',
          3: 'danger',
        }
        return tagMap[status]
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
          goods_id: 0, // 商品id
          shop: 0, // 店铺id
          goods_title: undefined, // 商品标题
          goods_stock: 0, // 总库存
          goods_productarea: undefined, // 产地
          goods_post: true, // 货物类型
          goods_dateadded: undefined, // 上架时间
          goods_isvertify: undefined // 审核 1-待审核 2-审核通过 3-审核不通过
        },
        temp: {
          goods_id: 0, // 商品id
          shop: 0, // 店铺id
          goods_title: undefined, // 商品标题
          goods_stock: 0, // 总库存
          goods_productarea: undefined, // 产地
          goods_post: true, // 货物类型
          goods_dateadded: undefined, // 上架时间
          goods_isvertify: undefined // 审核 1-待审核 2-审核通过 3-审核不通过
        },
        dialogFormVisible: false, // 关闭按钮
        dialogStatus: '', // 0 编辑 1 添加
        textMap: {
          update: '商品上架审核',
          create: '审核确认'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() { // 抓取数据api
        this.listLoading = true
        goodsList(this.listQuery).then(response => {
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
          goods_id: 0, // 商品id
          shop: 0, // 店铺id
          goods_title: undefined, // 商品标题
          goods_stock: 0, // 总库存
          goods_productarea: undefined, // 产地
          goods_post: true, // 货物类型
          goods_dateadded: undefined, // 上架时间
          goods_isvertify: undefined // 审核 1-待审核 2-审核通过 3-审核不通过
        }
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
      updateData(up_id, up_status) { // 调用更新api
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // console.log("send" + up_id)
            const tempData = Object.assign({}, this.temp)
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            tempData.goods_isvertify = up_status
            updateGoods(tempData, up_id).then(() => {
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
