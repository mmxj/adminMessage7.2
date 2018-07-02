<template>
  <div id="PayData">
    <div>
      <el-form ref="formData"  inline :model="formData" label-width="120px">

        <el-form-item label="商户编号" >
          <el-input size="small" v-model="formData.merchantNo"></el-input>
        </el-form-item>
         <el-form-item label="商户类型">
            <!--<el-input size="small" ></el-input>-->
           <el-select  clearable v-model="formData.companyType" size="small">
             <el-option v-for="item in companyTypeOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="交易金额" v-if="openMenu">
            <el-input class="amountInput" size="small" v-model="lowAmount" placeholder="请输入起始金额"></el-input>
            <el-input class="amountInput" size="small" v-model="highAmount" placeholder="请输入结束金额"></el-input>
         </el-form-item>
        <el-form-item label="交易开始日期" v-if="openMenu">
          <!--<el-input size="small" ></el-input>-->
          <el-date-picker v-model="formData.beginCreate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
        </el-form-item>
        <el-form-item label="商户名称" v-if="openMenu">
          <el-input size="small" v-model="formData.companyName"></el-input>
        </el-form-item>
        <el-form-item label="收单机构" v-if="openMenu">
          <el-input size="small" v-model="formData.acquirerName" ></el-input>
        </el-form-item>
        <el-form-item label="交易结束日期" v-if="openMenu">
          <el-date-picker v-model="formData.endCreate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
        </el-form-item>
        <el-form-item label="交易状态" v-if="openMenu">
          <!--<el-input size="small" v-model="formData.endCreate"></el-input>-->
          <el-select clearable v-model="formData.status" size="small">
            <el-option v-for="item in statusOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社保支付类型" v-if="openMenu">
          <el-select  clearable v-model="formData.planPayType" size="small">
            <el-option v-for="item in payStatus" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡号" v-if="openMenu">
          <el-input size="small" v-model="formData.account"></el-input>
        </el-form-item>
        <el-form-item label="终端号" v-if="openMenu">
          <el-input size="small" v-model="formData.terminalNo"></el-input>
        </el-form-item>
        <el-form-item label="支付卡类型" v-if="openMenu">
          <el-select  clearable v-model="formData.cardType" size="small">
            <el-option v-for="item in cardOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div class="button" :class="openMenu?null:'inline'">
          <el-button class="search" size="small" @click="getDataget">搜索</el-button>
          <el-button  size="small" class="other-button" @click="formData={}">重置</el-button>
          <span class="text" v-if="openMenu" @click="openMenu=false">收起<i class="el-icon-arrow-up"></i></span>
          <span class="text" v-else @click="openMenu=true">展开<i class="el-icon-arrow-down"></i></span>
        </div>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        size="samll"
        :data="tableData"
        style="width: 100%"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="loading"
      >
        <el-table-column align="center" prop="indexs" label="序号" min-width="55"></el-table-column>
        <!--<el-table-column align="center"  prop="settlmentData" label="清算日期" width="100"></el-table-column>-->
        <el-table-column align="center"  prop="orderNo" label="订单号" min-width="190"></el-table-column>
        <el-table-column align="center"  prop="sfsCreate" label="提交支付时间" min-width="130"></el-table-column>
        <el-table-column align="center"  prop="account" label="卡号" min-width="170"></el-table-column>
        <el-table-column align="center"  prop="terminalNo" label="终端号" min-width="95"></el-table-column>
        <el-table-column align="center"  prop="merchantNo" label="商户编号" min-width="130"></el-table-column>
        <el-table-column align="center"  prop="companyName" label="商户名称" min-width="100"></el-table-column>
        <el-table-column align="center"  prop="amount" label="交易金额" min-width="80"></el-table-column>
        <el-table-column align="center"  prop="status" label="交易状态" min-width="100"></el-table-column>
        <!--<el-table-column align="center"  prop="extraParams" label="备注" width="100"></el-table-column>-->

        <el-table-column align="center" label="详情" min-width="100">
          <template  slot-scope="props">
            <span class="open-button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
          </template>
        </el-table-column>

        <el-table-column type="expand" v-if="off">
          <template slot-scope="props">
            <el-form label-position="left" inline  class="expand-wrap demo-table-expand" label-width="120px">
              <el-form-item label="交易日期：">
                <span>{{props.row.payTime}}</span>
              </el-form-item>
              <el-form-item label="商户类型：">
                <span>{{props.row.companyType}}</span>
              </el-form-item>
              <el-form-item label="收单机构：">
                <span>{{props.row.acquirerId}}</span>
              </el-form-item>
              <el-form-item label="支付卡类型：">
                <span>{{props.row.cardType}}</span>
              </el-form-item>
              <el-form-item label="支付流水号：">
                <span>{{props.row.dealingJournalNo}}</span>
              </el-form-item>
              <el-form-item label="支付通道协议：">
                <span>{{props.row.payChannelDealNo}}</span>
              </el-form-item>
              <el-form-item label="清算日期：">
                <span>{{props.row.date}}</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{props.row.extraParams}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum">
        <span class="sum-title">交易笔数小计：</span>
        <span><b>{{thousand(payTotalCount)}}</b>笔</span>
        <span class="sum-title">交易金额小计：</span>
        <span><b>{{thousand(payTotalMoney/100)}}</b>元</span>
      </div>
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
          return{
            expands: [],
            off:true,
            getRowKeys(row) {
              return row.index
            },
            openMenu:false,
            formData:{},
              total:0,
              currentPage:1,
            tableData:[],

            session:sessionStorage.getItem('session'),
            companyTypeOptions:[
              {value:1,label:'药店'},
              {value:2,label:'卫生站'},
              {value:3,label:'卫生院'},
              {value:4,label:'合作商家'},
              {value:5,label:'一般商户'},
            ],
            statusOptions:[
              {value:1,label:'待支付'},
              {value:2,label:'已支付'},
              {value:3,label:'撤销'},
              {value:4,label:'冲正'},
              {value:5,label:'退货'},
              {value:6,label:'支付失败'},
            ],
            payStatus:[
              {value: 1, label: '社保局统筹报销'},
              {value: 2, label: '微信统筹报销'},
              {value: 3, label: '支付宝统筹报销'}
            ],
            cardOptions:[
              {value:1,label:'社保卡'},
              {value:2,label:'诊疗卡'},
              {value:3,label:'储蓄卡'},
              {value:4,label:'信用卡'},
            ],
            loading:false,
            payTotalCount:0,
            payTotalMoney:0,
          }
      },
      computed:{
        lowAmount:{
            get:function(){
                if(!isNaN(this.formData.lowAmount)){
                  return this.formData.lowAmount/100
                }else{
                  return null
                }
            },
            set:function(val){

              if(val==null||val==""){
                this.formData.lowAmount=null;
              }else if(!isNaN(val)){
                this.formData.lowAmount=val*100
              }
            }
        },
        highAmount:{
          get:function(){
            if(!isNaN(this.formData.highAmount)){
              return this.formData.highAmount/100
            }else{
                return null
            }

          },
          set:function(val){
            if(val==null||val==""){
              this.formData.highAmount=null;
            }else if(!isNaN(val)){
              this.formData.highAmount=val*100
            }
          }
        }
      },
      methods:{
        handleCurrentChange(val){
          this.currentPage=val;
          this.getData();
        },
        getDataget(){
          this.currentPage=1;
          this.getData();
        },
        getData(){
          var vm = this;
          vm.loading=true;
          this.formData.pageInfo={
              pageSize:10,
              pageNum:this.currentPage
          };
          this.formData=unit.removeEmptyString(this.formData);
          vm.payTotalMoney=0;
          vm.payTotalCount=0;
          var getPayData = new RemoteCall();
          getPayData.init({
            router: '/payment/paymentdeal/get',
            session: this.session,
            data: this.formData,
            callback: function (data) {
              if (data.ret.errorCode === 0) {
                vm.tableData = data.rows;
                if (data.rows.length > 0) {
                  if (data.pageInfo.total) {
                    vm.total = data.pageInfo.total;
                  }
                  vm.payTotalMoney=data.totalAmount;
                  vm.payTotalCount=vm.total;
                  for (let i = 0; i < vm.tableData.length; i++) {
                    vm.tableData[i].index=i;
                    vm.tableData[i].indexs = (i + 1) + (vm.formData.pageInfo.pageSize * (vm.formData.pageInfo.pageNum - 1));
                    vm.tableData[i].amount = vm.tableData[i].amount / 100;
                    if (vm.tableData[i].status == 1) {
                      vm.tableData[i].status = '待支付'
                    }
                    if (vm.tableData[i].status == 2) {
                      vm.tableData[i].status = '已支付'
                    }
                    if (vm.tableData[i].status == 3) {
                      vm.tableData[i].status = '撤销'
                    }
                    if (vm.tableData[i].status == 4) {
                      vm.tableData[i].status = '冲正'
                    }
                    if (vm.tableData[i].status == 5) {
                      vm.tableData[i].status = '退货'
                    }
                    if (vm.tableData[i].status == 6) {
                      vm.tableData[i].status = '支付失败'
                    }
                    if (vm.tableData[i].cardType == 1) {
                      vm.tableData[i].cardType = '社保卡'
                    }else
                    if (vm.tableData[i].cardType == 2) {
                      vm.tableData[i].cardType = '诊疗卡'
                    }else
                    if (vm.tableData[i].cardType == 3) {
                      vm.tableData[i].cardType = '储蓄卡'
                    }else
                    if (vm.tableData[i].cardType == 4) {
                      vm.tableData[i].cardType = '信用卡'
                    }else{
                      vm.tableData[i].cardType = null
                    }
                    switch (vm.tableData[i].companyType) {
                      case 1:
                        vm.tableData[i].companyType = '收单机构'
                        break;
                      case 2:
                        vm.tableData[i].companyType = '支付通道机构'
                        break;
                      case 3:
                        vm.tableData[i].companyType = '社保局'
                        break;
                      case 4:
                        vm.tableData[i].companyType = '医院(卫生站)'
                        break;
                      case 5:
                        vm.tableData[i].companyType = '药店'
                        break;
                      case 6:
                        vm.tableData[i].companyType = '平台'
                        break;
                      case 7:
                        vm.tableData[i].companyType = '卫计局'
                        break;
                    }
                  }
                } else {
                  vm.total = 0;
                }
              } else {
//                alert(data.ret.errorMessage);
                vm.$alert(data.ret.errorMessage, '提示', {
                  confirmButtonText: '确定',
                });
              }
              setTimeout(function(){
                  vm.loading=false
              },200)
            },
            errorCallback: function (data) {
              if (data) {
                vm.$router.push('/login')
              }
            }
          })
        },
        show(data){
          if (this.expands[0] !== data) {
            this.expands = [];
            this.expands.push(data);
          } else {
            this.expands = [];
          }
        },
        thousand(num){
          return unit.thousand(num)
        },
      },
    mounted:function(){
      this.getData();
      this.off=false;
    }
  }
</script>
<style lang="scss">
  #PayData{
    background: #fff;
    .el-form{
      padding-top:10px;
      border-bottom:1px solid #e8e8e8;
      .el-input{
        width:320px;
      }
      .amountInput{
        width:158px;
      }
    }
    .button{
      text-align: right;
      padding-bottom:20px;
      padding-top:10px;
      .search{
        margin-left: 20px;
      }
      .el-button{
        font-size:12px;
        width: 100px;
      }
      .text{
        font-size: 12px;
        color:#595959;
        padding:4px;
        margin-right:30px;
        cursor: pointer;
      }
    }
    .inline{
      display: inline-block;
      padding-top:5px;
    }
    .table-wrap{
      padding:20px;
      .el-table{
        font-size: 12px;
      }
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
    .el-input__prefix{
      width: 20px;
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
    .sum{
      background: #f4fbff;
      border-bottom:1px solid #e8e8e8;
      border-left:1px solid #e8e8e8;
      border-right:1px solid #e8e8e8;
      font-size:12px;
      height:42px;
      line-height:42px;
      span{
        display: inline-block;
        b{
          font-weight: normal;
          padding:0 4px;
        }
      }
      .sum-title{
        padding:0 0 0 26px;
      }
    }
  }
</style>
