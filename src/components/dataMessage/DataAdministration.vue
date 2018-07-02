<template>
  <div id="DataAdministration">
    <el-form ref="formData" :model="formData" inline label-width="120px">
      <el-form-item label="绑卡类型">
        <el-select size="small" multiple v-model="cardType">
          <el-option v-for="item in cardTypeOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
        <!--<el-input size="small"></el-input>-->
      </el-form-item>
      <el-form-item label="卡归属地">
        <div class="province">
          <Province :propdata="formData"></Province>
        </div>
      </el-form-item>
      <el-form-item label="绑卡商户号">
        <el-input size="small" v-model="formData.merchantNo"></el-input>
      </el-form-item>
      <el-form-item label="绑卡手机号">
        <el-input size="small" v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="绑卡终端号">
        <el-input size="small" v-model="formData.terminalNo"></el-input>
      </el-form-item>
      <el-form-item label="绑卡时间">
        <el-date-picker
          v-model="timer"
          type="daterange"
          size="small"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <!--<el-input size="small" ></el-input>-->
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="getDataget">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        size="samll"
        :data="tableData"
        style="width: 100%"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="loading"
      >
        <el-table-column align="center" prop="indexs" label="序号" min-width="70"></el-table-column>
        <el-table-column align="center"  prop="userName" label="姓名" min-width="100"></el-table-column>
        <el-table-column align="center"  prop="account" label="卡号" min-width="120"></el-table-column>
        <el-table-column align="center"  prop="cardTypeName" label="社保卡类型" min-width="120"></el-table-column>
        <el-table-column align="center"  prop="idCardNo" label="身份证号" min-width="120"></el-table-column>
        <el-table-column align="center"  prop="terminalNo" label="绑卡终端号" min-width="120"></el-table-column>
        <el-table-column align="center"  prop="merchantNo" label="绑卡商户号" min-width="120"></el-table-column>
        <el-table-column align="center"  prop="mobile" label="绑卡手机号" min-width="120"></el-table-column>
        <el-table-column align="center" label="详情" min-width="100">
          <template slot-scope="props">
            <span class="open-button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand" v-if="off">
          <template slot-scope="props">
            <el-form label-position="left" inline class="expand-wrap demo-table-expand" label-width="110px">
              <el-form-item label="卡发行日期：">
                <span>{{props.row.issueDate}}</span>
              </el-form-item>
              <el-form-item label="卡有效期：">
                <span>{{props.row.expiryDate}}</span>
              </el-form-item>
              <el-form-item label="卡序列号：">
                <span>{{props.row.serialNumber}}</span>
              </el-form-item>
              <el-form-item label="绑卡日期：">
                <span>{{props.row.sfsCreate}}</span>

              </el-form-item>
              <el-form-item label="卡归属地：">
                <span>{{props.row.areaName}}</span>
              </el-form-item>
              <el-form-item label="绑卡商户地址：">
                <span>{{props.row.address}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pagination clearfix">
      <el-button class="export" size="small" @click="exportData">导出绑卡数据</el-button>
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
  import Province from '@/common/Province';
  import unit from '@/unit/unit.js'
  export default{
      components:{
        Province
      },
      data(){
          return {
            expands: [],
            off:true,
            getRowKeys(row) {
              return row.index
            },
            timer:[],
            currentPage:1,
            total:0,
            cardType:[],
            formData:{

            },
            cardTypeOptions:[
              {value:1,label:'社保卡'},
              {value:2,label:'诊疗卡'},
              {value:3,label:'储蓄卡'},
              {value:4,label:'信用卡'},
            ],
            tableData:[],
            session:sessionStorage.getItem('session'),
            loading:false
          }
      },
      methods:{
        show(data){
          if (this.expands[0] !== data) {
            this.expands = [];
            this.expands.push(data);
          } else {
            this.expands = [];
          }
        },
        handleCurrentChange(val){
            this.currentPage=val;
            this.expands=[];
            this.getData()
        },
        getDataget(){
            this.currentPage=1;
            this.getData();
        },
        getData(){
            var vm=this;
            vm.loading=true;
            if(this.timer){
              if(this.timer[0]){
                this.formData.beginCreate=this.timer[0]+ ' 00:00:00';
              }else{
                this.formData.beginCreate=null;
              }
              if(this.timer[1]){
                this.formData.endCreate=this.timer[1]+ ' 23:59:59'
              }else{
                this.formData.endCreate=null;
              }
            }else{
              this.formData.beginCreate=null;
              this.formData.endCreate=null;
            }
            this.formData.pageInfo={
                pageSize:10,
                pageNum:this.currentPage
            };
            if(this.cardType.length>0){
              this.formData.cardType=this.cardType
            }else{
              this.formData.cardType=null
            }
            this.formData=unit.removeEmptyString(this.formData);
            var get=new RemoteCall();
            get.init({
              router:'/user/card/bind/get',
              session:vm.session,
              data:vm.formData,
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
                      vm.tableData.forEach(function(item,i){
                          item.indexs=(i+1)+(10*(vm.formData.pageInfo.pageNum-1))
                          item.index=i;
                      })
                  }
                  setTimeout(function () {
                    vm.loading=false;
                  },200)
              }
            })
        },
        exportData(){

          var vm=this;
          vm.$confirm('是否导出该查询数据?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            const loading=this.$loading({
              lock:true,
              text:'正在导出，请不要关闭浏览器',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            var get=new RemoteCall();
            vm.formData.pageInfo=null;
            get.init({
              router:'/user/card/bind/export',
              data:vm.formData,
              session:vm.session,
              callback:function(data) {
                if (data.ret.errorCode === 0) {
                  window.location.href="http://www.yxunionpay.com:8091/user/card/bind/excel/get?id=" + data.id;
                }else{
                  vm.$alert('导出失败');
                }
                loading.close();
              }
            })
          }).catch(()=>{
            vm.$message({
              type: 'info',
              message: '已取消导出'
            });
          })

        }
      },
      mounted:function(){
          this.off=false;
          this.getData();
//        terminalNo merchantNo sfsCreate
      }
  }
</script>
<style lang="scss">
  #DataAdministration{
    background: #fff;
    padding:20px;
    .el-input{
      width: 280px;
    }
    .el-form{
      #Provice{
        width: 280px;
      }
      .el-button{
        margin-left:30px;
        width:100px;
      }
    }
    .table-wrap{
      margin-top:10px;
      padding-top: 20px;
      border-top:1px solid #e8e8e8;
    }
    .expand-wrap{
      border:0;
      padding:0;
      .el-form-item{
        margin:0;
        height:28px;
        line-height:28px;
      }
      span{
        display: inline-block;
        width: 300px;
      }
      .el-form-item__label{
        line-height:28px;
        text-align:right;
      }
      .el-form-item__content{
        line-height:28px;
      }
    }
    .open-button {
      color: #1890ff;
      padding: 0 10px;
      cursor: pointer;
      text-decoration: underline;
    }
    .pagination{
      padding:10px 0;
      padding-bottom:20px;
      .el-pagination {
        float: right;
        margin-right: 30px;
        font-weight: normal;
        .el-input{
          width:60px;
        }
      }
    }
    .el-date-editor{
      width:280px;
    }
  }
</style>
