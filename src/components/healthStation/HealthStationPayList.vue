<template>
  <div id="HealthStationPayList">
    <div class="breadcrumb">
      <span class="location">位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/healthstation' }">卫生站管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理渠道</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form :inline="true" :model="formData">
        <el-form-item label="终端号" labelWidth="120px">
          <el-input size="small" v-model="formData.terminalNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="getChannel">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        size="mini"
      >
        <el-table-column align="center" label="归属卫生站" prop="merchantName" min-width="180"></el-table-column>
        <el-table-column align="center" label="卫生站号" prop="merchantNo" min-width="180"></el-table-column>
        <el-table-column align="center" label="终端号" prop="terminalNo" min-width="180"></el-table-column>
        <el-table-column align="center" label="支付渠道" prop="channelName" min-width="180"></el-table-column>
        <el-table-column align="center" label="操作" min-width="180">
          <template slot-scope="prop">
            <span class="tool" :class="prop.row.payChannelTypeId=='2'||prop.row.payChannelTypeId=='3'?null:'noclick'" @click="prop.row.payChannelTypeId=='2'||prop.row.payChannelTypeId=='3'?$router.push({name:'HealthStationUpdate',params:{data:prop.row,start:startData}}):null">编辑</span>
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
  import unit from '@/unit/unit.js'
  export default{
    data(){
      return{
        startData:null,
        tableData:[{}],
        formData:{
          companyId:null,
          pageInfo:{
            pageSize:10,
          }
        },
        currentPage:1,
        total:0,
        session:sessionStorage.getItem('session')
      }
    },
    methods:{
      handleCurrentChange(val){
        this.currentPage=val;
        this.getChannel();
      },
      getChannel(){ //查询已配置支付通道
        var vm=this;
        var get=new RemoteCall();
        vm.formData.companyId=vm.startData.id;
        vm.formData.pageInfo.pageNum=vm.currentPage;
        vm.formData=unit.removeEmptyString(vm.formData);
        get.init({
          router:'/base/payChannel/get',
          session:vm.session,
          data:vm.formData,
          callback:function(data){
            console.log(data);
            if(data.ret.errorCode===0){
              if (data.pageInfo.total) {
                if (data.pageInfo.total > 0) {
                  vm.total = data.pageInfo.total
                }
              } else if (data.pageInfo.total === 0) {
                vm.total = 0
              }
              vm.tableData=data.rows
            }
          }
        })
      }
    },
    mounted:function(){
      if(!this.$route.params.data){
        this.$router.push('/healthstation');
        return
      }
      console.log(this.$route.params.data)
      this.startData=this.$route.params.data;
      this.getChannel();
    }
  }
</script>
<style lang="scss">
  #HealthStationPayList{
    background: #fff;
    font-size:12px;
    min-height:600px;
    .breadcrumb{
      padding:10px;
      padding-left:20px;
      border-bottom:1px solid #e8e8e8;
      .location{
        font-size: 14px;
        vertical-align: middle;
      }
      .el-breadcrumb{
        vertical-align: middle;
        display: inline-block;
        font-weight: normal;
        .el-breadcrumb__inner{
          font-weight: normal;
        }
      }
    }
    .merchantMessage{
      background: #fff;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      .messageBox{
        padding-bottom:20px;
        display:inline-block;
        text-align: left;
        .messageBox-title{
          font-size:16px;
          display: inline-block;
          padding-bottom:30px;
        }
        .icon{
          color: #1890FF;
          font-size:14px;
          padding-right:8px;
        }
        .merchant{
          display: inline-block;
          min-width:200px;
        }
      }
    }
    .el-form{
      padding:10px 0;
      .el-input{
        width: 280px;
      }
      .el-button {
        width: 100px;
      }
    }
    .table-wrap{
      padding:0 20px;
    }
    .tool{
      color: #1e90ff;
      cursor: pointer;
      text-decoration: underline;
    }
    .pagination{
      padding:10px 0;
      .el-pagination {
        float: right;
        margin-right: 30px;
        font-weight: normal;
      }
    }
    .noclick{
      color:#c6c6c6;
      cursor: no-drop;
    }

  }
</style>
