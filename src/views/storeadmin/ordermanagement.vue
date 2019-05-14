<template>
  <div class="app-container">
    <div class="filter-container" align="right">
      <el-input v-model="listQuery.user_id" :placeholder="'user_id'" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">{{ '搜索' }}</el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'订单ID'" prop="id" align="center" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺ID'" align="center" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.shop }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户ID'" width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'物流单号'" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_logistics }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'订单状态'" min-width="90px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_status | tagFilter">{{ scope.row.order_status | statusFilter}}</el-tag >
        </template>
      </el-table-column>
      <el-table-column :label="'订单创建'" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'店铺联系'" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'发货地址'" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_address }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'收货人联系'" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.singer_mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'收货地址'" min-width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.address }}</span>
      </template>
    </el-table-column>
      <el-table-column :label="'订单更新时间'" class-name="status-col" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.order_updatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '商品' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item v-for="good in temp.goods">
          ID：{{ good.goods_id  }} <br />
          商品：{{ good.goods_name  }}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '关闭' }}</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { ordersList } from '@/api/storeadmin'
  import waves from '@/directive/waves' // Waves directive 水波纹特效
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination 分页

  const statusTypeOptions = [
    { key: 'TRADE_SUCCESS', display_name: '成功' },
    { key: 'TRADE_CLOSE', display_name: '超时关闭' },
    { key: 'WAIT_BUYER_PAY', display_name: '交易创建' },
    { key: 'TRADE_FINISHED', display_name: '交易结束' },
    { key: 'paying', display_name: '待支付' }
  ]

  // arr to obj ,such as { key: 'TRADE_SUCCESS', display_name: '成功' }
  const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ordermanagement',
    components: { Pagination }, // 分页插件
    directives: { waves }, // 水波纹特效
    filters: {
      // el-tag类型转换
      tagFilter(status) {
        const tagMap = {
          TRADE_SUCCESS: 'success',
          paying: 'primary',
          TRADE_CLOSE: 'danger',
          WAIT_BUYER_PAY: 'info',
          TRADE_FINISHED: 'warning'
        }
        return tagMap[status]
      },
      statusFilter(type) {
        return statusTypeKeyValue[type]
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
          order_id: 0, // 订单id
          shop: 0, // 店铺id
          user: 0, // 用户id
          goods: undefined, // 商品信息
          order_logistics: undefined, // 物流信息（物流单号）
          order_status: undefined, // 订单状态
          order_addtime: undefined, // 订单创建时间
          shop_phone: undefined, // 店铺联系方式
          shop_address: undefined, // 发货地址 TRADE_SUCCESS-成功 TRADE_CLOSE-超时关闭 WAIT_BUYER_PAY-交易创建 TRADE_FINISHED-交易结束 paying-待支付
          singer_mobile: undefined, // 收货人联系方式
          address: undefined, // 收货地址
          order_updatetime: undefined // 更新时间
        },
        temp: {
          order_id: 0, // 订单id
          shop: 0, // 店铺id
          user: 0, // 用户id
          goods: undefined, // 商品信息
          order_logistics: undefined, // 物流信息（物流单号）
          order_status: undefined, // 订单状态
          order_addtime: undefined, // 订单创建时间
          shop_phone: undefined, // 店铺联系方式
          shop_address: undefined, // 发货地址 TRADE_SUCCESS-成功 TRADE_CLOSE-超时关闭 WAIT_BUYER_PAY-交易创建 TRADE_FINISHED-交易结束 paying-待支付
          singer_mobile: undefined, // 收货人联系方式
          address: undefined, // 收货地址
          order_updatetime: undefined // 更新时间
        },
        dialogFormVisible: false, // 关闭按钮
        dialogStatus: '', // 0 编辑 1 添加
        textMap: {
          update: '订单的商品信息',
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
        ordersList(this.listQuery).then(response => {
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
          order_id: 0, // 订单id
          shop: 0, // 店铺id
          user: 0, // 用户id
          goods: undefined, // 商品信息
          order_logistics: undefined, // 物流信息（物流单号）
          order_status: undefined, // 订单状态
          order_addtime: undefined, // 订单创建时间
          shop_phone: undefined, // 店铺联系方式
          shop_address: undefined, // 发货地址 TRADE_SUCCESS-成功 TRADE_CLOSE-超时关闭 WAIT_BUYER_PAY-交易创建 TRADE_FINISHED-交易结束 paying-待支付
          singer_mobile: undefined, // 收货人联系方式
          address: undefined, // 收货地址
          order_updatetime: undefined // 更新时间
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
        })
      },
    }
  }
</script>
