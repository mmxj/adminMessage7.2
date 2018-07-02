<template>
  <div id="AppUpdate">
    <div class="AppNav">
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="Android" name="Android"></el-tab-pane>
        <el-tab-pane label="iOS" name="iOS"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="android">
      <div class="message-box">
        <div>
          <i class="el-icon-info"></i>
          当前版本信息
        </div>
        <div class="version-info">
          <div class="img">
            <img :src=logo alt="">
          </div>
          <div class="version-message">
            <el-form label-position="top" :inline="true" :model="versionData"  >
              <el-form-item label="当前版本号：" >
                <span>{{activeName}} ( {{versionData.version}} )</span>
              </el-form-item>
              <el-form-item label="是否强制更新：">
                <span>{{versionData.constraint==true?'是':'否'}}</span>
              </el-form-item>
              <el-form-item label="更新时间：">
                <span>{{versionData.sfsCreate}}</span>
              </el-form-item>
            </el-form>
            <div class="mark">
              更新日志：{{versionData.updateLog}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-title">
        <span>版本信息：</span>
        <el-button size="mini" @click="$router.push({name:'AppUpdateNew',params:{data:activeName}})">新增版本</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" >
        <el-table-column align="center" label="版本号" prop="version"></el-table-column>
        <el-table-column align="center" label="下载地址" prop="fileUrl"></el-table-column>
        <el-table-column align="center" label="是否强制更新" >
          <template slot-scope="prop">
            {{prop.row.constraint==true?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" prop="sfsCreate"></el-table-column>
        <el-table-column align="center" label="更新日志" prop="updateLog">
          <template slot-scope="prop">
            {{prop.row.updateLog}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="updateLog">
          <template slot-scope="prop">
            <span class="delete" @click="deleteapp(prop.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination clearfix">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  export default{
      data(){
          return{
            activeName:'Android',
            Apptype:true,
            logo:require('@/assets/img/web_img_app_logo.png'),
            versionData:{
            },
            tableData:[],
            pageNum:1,
            total: 0,
            session: sessionStorage.getItem('session'),
            loading:false
         }
      },
      methods:{
        handleClick(){
          this.pageNum=1;
          this.versionData={};
          this.getList(this.activeName)
        },
        handleCurrentChange(val){//页面跳转事件
          this.pageNum = val;
          this.getList(this.activeName)
        },
        getList(type){
            var vm=this;
            vm.loading=true;
            if(type=='Android'){
              var appType=1;
            }else{
              var appType=2
            }
            vm.tableData=[];
            var get=new RemoteCall();
            get.init({
              router:'/app/version/get',
              session:vm.session,
              data:{
                  pageInfo:{
                      pageSize:10,
                      pageNum:vm.pageNum,
                  },
                  appType:appType,
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
                    vm.tableData=data.rows;
                    if(vm.tableData[0]){
                      vm.versionData=vm.tableData[0]
                    }

                  }
                  setTimeout(function(){
                      vm.loading=false;
                  },200)
              }
            })
        },
        deleteapp(id){
          var vm=this;
          console.log(id);
          this.$confirm('将删除该app版本，是否继续？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            var del=new RemoteCall();
            del.init({
              router:'/app/version/delete',
              session:vm.session,
              data:{
                id:id
              },
              callback:function(data){
                if(data.ret.errorCode===0){
                  vm.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  vm.getList(this.activeName);
                }
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });


        }
      },
      mounted:function(){
        this.getList(this.activeName)
      }
  }
</script>
<style lang="scss">
  #AppUpdate{
    .AppNav{
      background: #fff;
      font-size:14px;
    }
    .el-tabs__nav-scroll{
      text-align: center;

      .el-tabs__nav{
        display: inline-block;
        float: none;
      }
    }
    .el-tabs__header{
      padding-top:10px;
    }
    .el-tabs__nav-wrap::after{
      height:1px;
      background-color: #eff1f4;
    }
    .el-tabs__item{
      width:160px;
    }

    .android{
      height:205px;
      background: #fff;
      text-align: center;
      padding-top:10px;
    }
    .message-box{
      text-align: left;
      display: inline-block;
      i{
        color:#1890FF;
      }
      .version-info{
        padding:20px 18px;
        .img{
          width:107px;
          height:107px;
          display: inline-block;
          img{
            width:100%;
          }
        }
        .version-message{
          display: inline-block;
          margin-left:80px;
          vertical-align: top;
          .el-form--label-top .el-form-item__label{
            padding:0;
          }
          .el-form-item__label{
            line-height: 24px;
            width: 160px;
          }
          .el-form-item__content{
            line-height: 24px;
          }
          .mark{
            margin-top:30px;
            width:519px;
            height:25px;
            color: #999;
            font-size:14px;
            overflow: hidden;
            white-space:nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .table-wrap{
      background: #fff;
      margin-top:10px;
      padding:20px 32px;
      font-size: 14px;
      .table-title{
        padding-left:20px;
        margin-bottom:20px;
      }
    }
    .el-pagination {
      float: right;
      margin-right: 30px;
      font-weight: normal;
      margin-top: 10px;
    }
    .delete{
      cursor: pointer;
      color: #1890FF;
      text-decoration: underline;
    }
  }
</style>
