<template>
  <div class="app-container">
    <div class="dashboard-text">用户名:{{ name }}</div>
    <div class="address-layout">

    </div>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="order" class="total-icon">
            </svg-icon>
            <div class="total-title">今日注册总数</div>
            <div class="total-value">28</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="total-today" class="total-icon">
            </svg-icon>
            <div class="total-title">今日成交总额</div>
            <div class="total-value">￥2325.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="total-yesterday" class="total-icon">
            </svg-icon>
            <div class="total-title">昨日成交总额</div>
            <div class="total-value">￥2843.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="total-week" class="total-icon">
            </svg-icon>
            <div class="total-title">今天订单总数</div>
            <div class="total-value">187</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待审核店铺商品</span>
              <span style="float: right" class="color-danger">(3)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待审核运输任务</span>
              <span style="float: right" class="color-danger">(1)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">未读评论数量</span>
              <span style="float: right" class="color-danger">(0)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待审核采购任务</span>
              <span style="float: right" class="color-danger">(2)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待审核认证申请</span>
              <span style="float: right" class="color-danger">(3)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理财务问题</span>
              <span style="float: right" class="color-danger">(0)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待审核收购任务</span>
              <span style="float: right" class="color-danger">(1)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">客服待处理</span>
              <span style="float: right" class="color-danger">(0)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">出错数据量</span>
              <span style="float: right" class="color-danger">(0)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">6</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5</el-col>
                <el-col :span="6" class="color-danger overview-item-value">10</el-col>
                <el-col :span="6" class="color-danger overview-item-value">29</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">店铺量</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">商品量</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">任务总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">3</el-col>
                <el-col :span="6" class="color-danger overview-item-value">2</el-col>
                <el-col :span="6" class="color-danger overview-item-value">7</el-col>
                <el-col :span="6" class="color-danger overview-item-value">43</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日任务</el-col>
                <el-col :span="6" class="overview-item-title">进行任务</el-col>
                <el-col :span="6" class="overview-item-title">完成任务</el-col>
                <el-col :span="6" class="overview-item-title">任务总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
