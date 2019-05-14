<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
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
          <span>{{ scope.row.roles }}</span>
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
          <span>{{ scope.row.user_ifrealname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" class-name="status-col" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.is_active }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'最近活跃时间'" class-name="status-col" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getList } from '@/api/commentadmin'

  export default {
    data() {
      return {
        list: null,
        listLoading: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.list = response
          const a = JSON.stringify(response)
          console.log(a)
          // console.log(response + "已经刷新")
          this.listLoading = false
        })
      }
    }
  }
</script>

