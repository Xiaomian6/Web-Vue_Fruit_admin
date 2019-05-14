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
      <el-table-column :label="'任务ID'" prop="id" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.task_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户名'" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'任务标题'" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'价格'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'任务描述'" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'任务状态'" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.task_status | tagFilter">{{ scope.row.task_status | statusFilter }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.task_status == 0" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '审核' }}</el-button>
          <el-button v-if="scope.row.task_status == 1" disabled size="mini" type="success" @click="handleUpdate(scope.row)">{{ '已通过' }}</el-button>
          <el-button v-if="scope.row.task_status == 2 || scope.row.task_status == 3" disabled size="mini" type="danger" @click="handleUpdate(scope.row)">{{ '未通过' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'任务ID：'">
          {{temp.task_id}}
        </el-form-item>
        <el-form-item :label="'用户名：'">
          {{ temp.username }}
        </el-form-item>
        <el-form-item :label="'任务标题：'">
          {{ temp.task_title }}
        </el-form-item>
        <el-form-item :label="'价格：'">
          {{ temp.task_price }}
        </el-form-item>
        <el-form-item :label="'任务描述：'">
          {{ temp.task_desc }}
        </el-form-item>
        <el-form-item :label="'任务状态：'">
          <el-tag >{{temp.task_status | statusFilter}}</el-tag >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="danger" @click="dialogStatus==='create'?createData():updateData(temp.task_id, 2)">{{ '不通过' }}</el-button>
        <el-button type="success" @click="dialogStatus==='create'?createData():updateData(temp.task_id, 1)">{{ '通过' }}</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { procureTaskList ,updateTask} from '@/api/purchaseadmin'
  import waves from '@/directive/waves' // Waves directive 水波纹特效
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination 分页

  const statusTypeOptions = [
    { key: '0', display_name: '待审核' },
    { key: '1', display_name: '审核通过' },
    { key: '2', display_name: '审核未通过' },
    { key: '3', display_name: '超过截止日期' }
  ]

  // arr to obj ,such as { key: '0', display_name: '待审核' }
  const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    inject: ["reload"],
    name: 'taskreview',
    components: { Pagination }, // 分页插件
    directives: { waves }, // 水波纹特效
    filters: {
      statusFilter(type) {
        return statusTypeKeyValue[type]
      },
      tagFilter(status) {
        const tagMap = {
          0: 'primary',
          1: 'warning',
          2: 'danger',
          3: 'warning'
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
          task_id: 0, // 任务ID
          username: undefined, // 用户名
          task_title: undefined, // 任务标题
          task_price: 0, // 价格
          task_status: undefined, // 任务状态 0-待审核任务 1-任务审核通过 2-任务审核不通过 3-任务超过截止日期
          task_desc: undefined // 任务描述

        },
        temp: {
          task_id: 0, // 任务ID
          username: undefined, // 用户名
          task_title: undefined, // 任务标题
          task_price: 0, // 价格
          task_status: undefined, // 任务状态 0-待审核任务 1-任务审核通过 2-任务审核不通过 3-任务超过截止日期
          task_desc: undefined // 任务描述
        },
        dialogFormVisible: false, // 关闭按钮
        dialogStatus: '', // 0 编辑 1 添加
        textMap: {
          update: '任务审核',
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
        procureTaskList(this.listQuery).then(response => {
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
          task_id: 0, // 任务ID
          username: undefined, // 用户名
          task_title: undefined, // 任务标题
          task_price: 0, // 价格
          task_status: undefined, // 任务状态 0-待审核任务 1-任务审核通过 2-任务审核不通过 3-任务超过截止日期
          task_desc: undefined // 任务描述
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
            tempData.task_status = up_status
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateTask(tempData, up_id).then(() => {
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
