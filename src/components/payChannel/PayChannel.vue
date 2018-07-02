<template>
  <div id="PayChannel">
    <div class="search">
      <el-form inline ref="form" :model="formData">
          <el-form-item>
            <el-input size="small" v-model="formData.name" placeholder="渠道名称"></el-input>
          </el-form-item>
          <el-form-item><el-button size="small" @click="getChannel">搜索</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        v-loading="loading"
      >
        <el-table-column align="center" label="渠道名称" prop="channelName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="sfsCreate"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="props">
            {{props.row.enableFlag==1?'生效':'不生效'}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
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
  import unit from '@/unit/unit'
  export default{
     data(){
         return {
          session:sessionStorage.getItem("session"),
           formData:{},
           total:0,
           currentPage:1,
           tableData:[],
           loading:false
         }
     },
      methods:{
        handleCurrentChange(val){
          this.currentPage=val;
          this.getChannel();
        },
          getChannel(){
              var vm=this;
              vm.loading=true;
              this.formData.name=unit.removeEmptyString(this.formData.name);
              var get=new RemoteCall();
              get.init({
                router:'/base/payChannelType/get',
                session:vm.session,
                data:{
                    pageInfo:{
                        pageSize:10,
                        pageNum:this.currentPage
                    },
                  channelName:vm.formData.name
                },
                callback:function(data){
                    if(data.ret.errorCode===0){
                      if (data.pageInfo.total) {
                        if (data.pageInfo.total > 0) {
                          vm.total = data.pageInfo.total
                        }
                      } else if (data.pageInfo.total === 0) {
                        vm.total = 0
                      };
                      vm.tableData=data.rows
                    }
                    setTimeout(function(){
                        vm.loading=false
                    },200)
                }
              })
          }
      },
      mounted:function () {
          this.getChannel();
      }
  }
</script>
<style lang="scss">
  #PayChannel{
    background: #fff;
    .search{
      padding-top:15px;
      padding-bottom:5px;
      text-align: center;
      .el-input{
        width: 280px;
      }
    }
    .table-wrap{
      padding:0 20px;
    }
    .pagination{
      padding:10px 0;
      padding-bottom:20px;
      .el-pagination {
        float: right;
        margin-right: 30px;
        font-weight: normal;
        .el-input{
          width:42px;
        }
      }
    }
  }
</style>
