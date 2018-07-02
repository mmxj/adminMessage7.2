<template>
  <div id="Order">
    <div  class="search-wrap">
      <el-form inline :model="formData" label-width="120px">
        <el-form-item label="订单编号">
          <el-input size="small" v-model="formData.no"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input size="small" v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select  clearable v-model="formData.businessType" size="small">
            <el-option v-for="item in businessTypeOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单发起时间">
          <el-date-picker
            v-model="timer"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input size="small" v-model="beginAmount" class="amount"></el-input>
          ~
          <el-input size="small" v-model="endAmount"  class="amount"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select  clearable v-model="formData.status" size="small">
            <el-option v-for="item in statusOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易商户">
          <el-input size="small" v-model="formData.companyName"></el-input>
        </el-form-item>
        <el-form-item  class="group-wrap" label="交易商户分组">
          <el-autocomplete
            v-model="group"
            :fetch-suggestions="querySearch"
            placeholder="请选择分组"
            popper-class="my-autocomplete"
            size="small"
          >
            <template slot-scope="{ item }"  >
             <el-popover
                placement="right-start"
                width="280"
                trigger="click"
                popper-class="my-popover"

             >
                <!--<span class="addr">{{ item.address }}</span>-->
                <div class="name" slot="reference">{{ item.value }}</div>
              </el-popover>
            </template>

          </el-autocomplete>
          <!--<div class="group-add" >-->
                <!--<span class="title">-->
                  <!--分组管理-->
                <!--</span>-->
            <!--<img :src="addImg" alt="" class="group-logo">-->
          <!--</div>-->
        </el-form-item>
        <el-form-item label="" class="button-wrap">
          <el-button  size="small" @click="searchget" >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="tableData" size="small" style="width:100%"
      v-loading="loading"
      >
        <el-table-column align="center" prop="no" label="订单编号" min-width="120">
        </el-table-column>
        <el-table-column align="center" prop="businessType" label="订单类型" min-width="100"></el-table-column>
        <el-table-column align="center" prop="sfsCreate" label="订单发起时间" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="clinicDate" label="订单交易时间" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="companyName" label="交易商户" min-width="160">
          <!--医院名字没有返回-->
        </el-table-column>
        <el-table-column align="center" prop="address" label="商户地址" min-width="100" show-overflow-tooltip>
          <!--医院地址没有返回-->
        </el-table-column>
        <el-table-column align="center" prop="user.idCardName" label="交易用户" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="phone" label="手机号码" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="amount" label="交易金额" min-width="100">
        </el-table-column>
        <el-table-column align="center" label="订单状态" min-width="70">
          <template  slot-scope="props">
            {{paystatus(props.row.payStatus)}}
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="交易产品" min-width="70">-->
          <!--&lt;!&ndash;。。。 这个得做个弹窗&ndash;&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="isXybPay" label="乡银保交易" min-width="80">-->
          <!--&lt;!&ndash;是否是乡银保支付&ndash;&gt;-->
        <!--</el-table-column>-->
      </el-table>
      <div class="sum">
        <span class="sum-title">交易笔数小计：</span>
        <span><b>{{thousand(payTotalCount)}}</b>笔</span>
        <span class="sum-title">交易金额小计：</span>
        <span><b>{{thousand(payTotalMoney/100)}}</b>元</span>
      </div>
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
<script type="text/javascript">
//  import {DateHelp} from '@/assets/js/dateHelp.js'
  import unit from '@/unit/unit.js'
  export default{
    data() {
      return {
        group:null,
        restaurants: [],
        addImg:require('@/assets/img/order_icon_group.png'),
        tableData: [{//表格信息
          ordinal: "111"
        }],
        formData: {
        },
        timer:[],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        session:sessionStorage.getItem('session'),
        businessTypeOption:[
          {value:1,label:'缴费'},
          {value:2,label:'挂号'},
          {value:3,label:'门诊'},
          {value:4,label:'转运'},
          {value:5,label:'开放平台接口'},
            ],
        statusOptions:[
          {value:1,label:'待支付'},
          {value:2,label:'交易成功'},
          {value:3,label:'交易失败'},
          {value:4,label:'冲正'},
          {value:5,label:'交易撤销'},
        ],
        loading:false,
        payTotalCount:0,
        payTotalMoney:0,
        list:null,
      };
    },
    computed:{

      beginAmount:{
        get:function(){
          if(!isNaN(this.formData.beginAmount)){
            return this.formData.beginAmount/100
          }
        },
        set:function(val){
          if(val==null||val==""){
            this.formData.beginAmount=null;
          }else if(!isNaN(val)){
            this.formData.beginAmount=val*100
          }
        }
      },
      endAmount:{
        get:function(){
          if(!isNaN(this.formData.endAmount)){
            return this.formData.endAmount/100
          }

        },
        set:function(val){
          if(val==null||val==""){
            this.formData.endAmount=null;
          }else if(!isNaN(val)){
            this.formData.endAmount=val*100
          }
        }
      }
    },
    methods: {
      querySearch(queryString, cb){
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [{},
//          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        ]},
      //获取订单类型
      getBusiness(index){
        this.isActive1 = index;
        if (index) {
          this.inputData.businessType = index;
        } else {
          this.inputData.businessType = null;
        }

      },
      thousand(num){
        return unit.thousand(num)
      },
      searchget(){
        this.currentPage = 1;
        this.search()
      },
      search(){
        var vm = this;
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
        vm.formData.pageInfo={
            pageSize:10,
            pageNum:vm.currentPage
        };
        vm.payTotalMoney=0;
        vm.payTotalCount=0;
        vm.formData=unit.removeEmptyString(vm.formData);
        var searchOrder = new RemoteCall();
        searchOrder.init({
          router: '/order/prescription/get',
          session: vm.session,
          data: vm.formData,
          callback: function (data) {

            if(data.ret.errorCode===0){

              if (data.pageInfo.total) {
                vm.total = data.pageInfo.total;

              }
              if (data.rows.length <= 0) {
                vm.total = 0
              }
              vm.payTotalMoney=data.totalAmount;
              vm.payTotalCount=vm.total;
              vm.tableData = data.rows;
              for (var i = 0; i < vm.tableData.length; i++) {
                switch (vm.tableData[i].businessType) {
                  case 1:
                    vm.tableData[i].businessType = '缴费';
                    break;
                  case 2:
                    vm.tableData[i].businessType = '挂号';
                    break;
                  case 3:
                    vm.tableData[i].businessType = '门诊';
                    break
                  case 4:
                    vm.tableData[i].businessType = '转运';
                    break
                  case 5:
                    vm.tableData[i].businessType = '开放平台接口';
                    break
                  default:
                    vm.tableData[i].businessType = null;
                    break;
                }
                vm.tableData[i].amount = vm.tableData[i].amount / 100;
                if (vm.tableData[i].isXybPay) {
                  if (vm.tableData[i].isXybPay === 0) {
                    vm.tableData[i].isXybPay = '否'
                  } else if (vm.tableData[i].isXybPay == 1) {
                    vm.tableData[i].isXybPay = '是'
                  }
                }
              }
            }
            setTimeout(function(){
                vm.loading=false
            },200)
          }
        })
      },
      handleSizeChange(val) { //页面
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.search();
      },
      startTimes(data){
        if (data != null) {
          this.isActive2 = 0;
          this.startTime = data;
          this.inputData.beginCreate = data;
        }

      },
      endTimes(data){
        if (data != null) {
          this.isActive2 = 0;
          this.endTime = data;
          this.inputData.endCreate = data;
        }
      },
      paystatus(status){//支付状态转换
          if(status==1){
              return '待支付'
          }else if(status==2){
              return '交易成功'
          }else if(status==3){
              return '交易撤销'
          }else if(status==4){
              return '冲正'
          }else if(status==5){
              return '退货'
          }else if(status==6){
              return '交易失败'
          }
      },
      managePage(){
          this.$router.push('/merchantGroup')
      }
    },
    mounted:function(){
        var vm=this;
      this.search();
      this.restaurants = this.loadAll();
      let autocomplete=document.getElementsByClassName('my-autocomplete')[0];
      let newbutton=document.createElement('div');
      newbutton.innerHTML=`<div class="group-add" ><span class="title">分组管理</span><img src="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do?download_type=2&file_name=1528943043049-order_icon_group.png" alt="" class="group-logo"></div>`;
      newbutton.addEventListener('click',function(){
        vm.managePage()
      });
      autocomplete.appendChild(newbutton);
    },
    watch: {
    }
  }
</script>
<style type="text/css" lang="scss">
  .my-popover{
    max-height:280px;
  }
  .my-autocomplete{
    .el-scrollbar__wrap{
      /*height:280px;*/
    }
      .group-add{
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        background: #fff;
        position: relative;
        /*left:2px;*/
        width:280px;
        cursor: pointer;
        /*width: e("calc(100%-1px)");*/
        height: 40px;
        border-radius:0 0 5px 5px;
        /*border-top:1px solid #f3f3f3;*/
        border-left:1px solid #e4e7ed;
        border-right:1px solid #e4e7ed;
        border-bottom:1px solid #e4e7ed;
        .title{
          font-size:14px;
          padding-left:20px;
          line-height:40px;
          vertical-align: top;
          display: inline-block;
          color: #606266;
        }
      }
      .group-logo{
        width:40px;
        position: absolute;
        right:6px;
        top:0;
      }
      .group-add:hover{
        background-color:#f5f7fa ;
      }
      .addr{
        width: 280px;
        position: absolute;
        height:280px;
        background: #fff;
        top:0;
        right:-240px;
      }
  }
  #Order {
    .search-wrap{
      padding-top: 20px;
      .button-wrap{
        margin-left:20px;
      }
      .el-button{
        margin-left:30px;
        width: 100px;
      }
      .el-select{
        width:280px;
      }
      .el-input__prefix{
        width:20px;
      }
      .el-date-editor{
        width:280px;
      }
    }
    .el-input{
      width: 280px;
    }
    background: #fff;
    .table-box{
      padding:20px;
    }
    .amount{
      width: 130px;
    }
    .el-pagination{
      text-align: right;
      padding-top: 20px;
      .el-input{
        width:60px;
      }
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
    .group-wrap{
      position: relative;
    }

  }

</style>
