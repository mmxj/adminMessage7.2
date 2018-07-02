<template>
  <div id="MPage" class="pagination clearfix">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default{
    props: ['handleCurrentChange', 'currentPage', 'total']
  }
</script>
<style lang="scss">
  #MPage {
    .el-pagination {
      float: right;
      margin-right: 30px;
      font-weight: normal;
    }
  }
</style>
