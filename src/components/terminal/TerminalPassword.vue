<template>
  <div id="TerminalPassword">
    <div class="form-wrap">
      <el-form :inline="true">
        <el-form-item label="终端密匙索引" label-width="100px">
          <el-input size="small" id="searchInput" class="searchInput" v-model="formData.id" placeholder="输入终端密匙索引"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="getMainget">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        stripe
        row-class-name="table-column"
        v-loading="loading"
        align="center"
        style="width: 100%;">
        <el-table-column
          align="center"
          prop="id"
          label="终端密匙索引"
          show-overflow-tooltip
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="mainKey"
          label="明文主密匙"
          min-width="200"
        >

        </el-table-column>
        <el-table-column
          align="center"
          prop="enableFlag"
          label="状态"
          min-width="80"
          show-overflow-tooltip>
          <template slot-scope="prop">
            {{prop.row.enableFlag==1?'生效':'不生效'}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="sfsCreate"
          label="创建时间"
          min-width="100"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination clearfix">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default {
    data(){
      return {
        formData: {
          id: null
        },
        total:0,
        session:sessionStorage.getItem('session'),
        currentPage: 1,
        tableData: [

        ],
        loading:false
      }
    },
    methods: {
      handleCurrentChange(val){
        this.currentPage=val;
        this.getMain();
      },
      getMainget(){
          this.currentPage=1;
          this.getMain();
      },
      getMain(){

        var vm = this;
        vm.loading=true;
        setTimeout(function(){
          vm.formData.pageInfo={
            pageSize:10,
            pageNum:vm.currentPage
          }
          vm.formData=unit.removeEmptyString(vm.formData);
          var get=new RemoteCall();
          get.init({
            router:'/base/mainKey/get',
            session:vm.session,
            data:vm.formData,
            callback:function(data){
              vm.loading=false;
              if(data.ret.errorCode===0){
                if (data.pageInfo.total) {
                  if (data.pageInfo.total > 0) {
                    vm.total = data.pageInfo.total
                  }
                } else if (data.pageInfo.total === 0) {
                  vm.total = 0
                };
                vm.tableData=data.rows;
              }
            }
          })
        },200)

      }
    },
    mounted:function(){
        this.getMain();
    }
  }
</script>
<style lang="scss" >
  #TerminalPassword {
    background: #fff;
    padding: 20px 0;
    margin: 20px 24px;


  .el-pagination {
    float: right;
    margin-right: 30px;
    font-weight: normal;
  }
  .el-form {
    font-size: 14px;
    color: #262626;

  }

  .searchInput {
    height: 30px;
    width: 280px;
  }

  .form-wrap {
    border-bottom: 1px solid #e8e8e8;
    padding: 0 32px;
  }

  .table-wrap {
    margin: 20px 0;
    padding: 0 32px;
  }

  .el-table {
    text-align: center;
  }

  .pagination {

  }

  .el-pagination {
    float: right;
    margin-right: 30px;
    font-weight: normal;
  }
    .el-button{
      width:100px;
    }
  }
</style>

