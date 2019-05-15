<template>
  <div class="app-container">
    <div class="filter-container" align="right">
      <el-input v-model="listQuery.user_id" :placeholder="'user_id'" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">{{ '搜索' }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ '添加' }}</el-button>
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
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户名'" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'角色'" min-width="150px" align="center">
        <template slot-scope="scope">
          <template v-for="role in scope.row.roles">
            <el-tag :type="role | roleTagFilter">{{ role | typeFilter }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="'手机号码'" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'信用积分'" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_creditscore }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'实名验证'" width="90px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.user_ifrealname | tagFilter">{{ scope.row.user_ifrealname | isFilter}}</el-tag >
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" class-name="status-col" align="center" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_active | tagFilter">{{ scope.row.is_active |  timeFilter}}</el-tag >
        </template>
      </el-table-column>
      <el-table-column :label="'最近活跃时间'" class-name="status-col" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '编辑' }}</el-button>
          <el-button v-if="scope.row.is_active!=false" size="mini" type="danger" @click="handleModifyStatus(scope.row,false)">
            {{ '锁定' }}
          </el-button>
          <el-button v-if="scope.row.is_active!=true"size="mini" type="success" @click="handleModifyStatus(scope.row,true)">
            {{ '解锁' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'*用户名：'">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item :label="'*密码：'">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item :label="'手机号码：'">
          <el-input v-model="temp.user_phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { fetchList, createUser, updateUser } from '@/api/useradmin'
import waves from '@/directive/waves' // Waves directive 水波纹特效
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination 分页

const calendarTypeOptions = [
  { key: '1', display_name: '采购' },
  { key: '2', display_name: '收购' },
  { key: '3', display_name: '运输' },
  { key: '4', display_name: '普通' },
  { key: '5', display_name: '店铺' }
]

const isTypeOptions = [
  { key: 'true', display_name: '是' },
  { key: 'false', display_name: '否' }
]

const timeTypeOptions = [
  { key: 'true', display_name: '激活' },
  { key: 'false', display_name: '锁定' }
]

// arr to obj ,such as { key: '1', display_name: '普通' }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

// arr to obj ,such as { key: 'true', display_name: '是' }
const isTypeKeyValue = isTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

// arr to obj ,such as { key: 'true', display_name: '在线' }
const timeTypeKeyValue = timeTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  inject: ["reload"],
  name: 'UserTable',
  components: { Pagination }, // 分页插件
  directives: { waves }, // 水波纹特效
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    isFilter(type) {
      return isTypeKeyValue[type]
    },
    timeFilter(type) {
      return timeTypeKeyValue[type]
    },
    // el-tag类型转换
    tagFilter(status) {
      const tagMap = {
        true: 'success',
        false: 'danger'
      }
      return tagMap[status]
    },
    roleTagFilter(status) {
      const roleTagMap = {
        1: 'primary', // 普通
        2: 'success', // 采购
        3: 'info', // 收购
        4: 'warning', // 运输
        5: 'danger' // 店铺
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
        user_id: 0, // 用户id
        username: undefined, // 用户名
        password: undefined, // 密码
        roles: undefined, // 角色
        user_phone: undefined, // 手机号码
        user_creditscore: 0, // 信用积分
        user_avator: undefined, // 头像
        user_ifrealname: false, // 是否实名
        is_active: false, // 最近生效
        last_login: undefined // 最近活跃
      },
      temp: {
        user_id: 0, // 用户id
        username: undefined, // 用户名
        password: undefined, // 密码
        roles: undefined, // 角色
        user_phone: undefined, // 手机号码
        user_creditscore: 0, // 信用积分
        user_avator: undefined, // 头像
        user_ifrealname: false, // 是否实名
        is_active: false, // 最近生效
        last_login: undefined // 最近活跃
      },
      dialogFormVisible: false, // 关闭按钮
      dialogStatus: '', // 0 编辑 1 添加
      textMap: {
        update: '编辑用户',
        create: '添加用户'
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
        this.total = response.count
        // const a = JSON.stringify(response.data)
        // console.log(a)
        // console.log(response.count + "已经刷新")
        // Just to simulate the time of the request 模拟请求时间
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() { // 返回缓存
      this.temp = {
        username: undefined, // 用户名
        password: undefined, // 密码
        user_phone: undefined, // 手机号码
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
        setTimeout(() => {
          this.reload()
        }, 1.5 * 100)
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
    updateData() { // 调用更新api
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
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
    handleModifyStatus(row, status) { // 锁定
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.is_active = status
      /*
      lockUser(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
      */
    },
  }
}
</script>
