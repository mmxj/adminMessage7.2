<template>
  <div id="DataMerchantSocial">
    <div class="form-wrap">
      <el-form inline :model="formData">
        <el-form-item label="交易时间"  labelWidth="100px">
          <el-date-picker
            v-model="date"
            type="daterange"
            size="small"
            width="300px"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结算日期"
            unlink-panels
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="流水号" labelWidth="100px">
          <el-input size="small" v-model="formData.dealNo" placeholder="流水号" ></el-input>
        </el-form-item>
        <el-form-item label="订单编号"  labelWidth="100px">
          <el-input size="small"  v-model="formData.orderNo" placeholder="订单编号" ></el-input>
        </el-form-item>
        <el-form-item label="归属地区"  labelWidth="100px">
          <div style="width: 280px;">
            <Province :propdata="areaData"   :disabled="disabled" :startAreaData.sync="startAreaData"></Province>
          </div>
        </el-form-item>
        <el-form-item label="商户编号"  labelWidth="100px">
          <el-input size="small"  v-model="formData.merchantNo" placeholder="商户编号" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        size="mini"
        style="width:100%"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="loading"
      >
        <el-table-column align="center" label="流水号" prop="dealNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="订单编号" prop="orderNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="终端号" prop="terminalNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="交易时间" prop="payTime" min-width="130"></el-table-column>
        <el-table-column align="center" label="交易金额" prop="amount" min-width="120">
          <template slot-scope="props">
            {{props.row.amount?(props.row.amount/100):null}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="入账金额" prop="selfMoney" min-width="100">
          <template slot-scope="props">
            {{props.row.selfMoney?(props.row.selfMoney/100):null}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商户编号" prop="merchantNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="详情" min-width="100">
          <template  slot-scope="props">
            <span class="button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand" v-if="off">
          <template slot-scope="props">
            <el-form label-position="left" inline class="expand-wrap">
              <el-form-item label="商户名：" label-width="110px">
                <span>{{props.row.merchantName}}</span>
              </el-form-item>
              <el-form-item label="归属地区：" label-width="110px">
                <ReadArea :startAreaData="{areaId:props.row.areaId,cityId:props.row.cityId,provinceId:props.row.provinceId}"></ReadArea>
              </el-form-item>
              <el-form-item label="收单机构：" label-width="110px">
                <span>{{props.row.agency}}</span>
              </el-form-item>
              <el-form-item label="清算日期：" label-width="110px">
                <span>{{props.row.settleDate}}</span>
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
  import unit from '@/unit/unit.js';
  import Province from '@/common/Province';
  import ReadArea from '@/common/ReadArea'
  export default{
      components:{
        Province,
        ReadArea
      },
      data(){
          return {
            off:true,
            formData:{},
            date:null,
            areaData:{},
            tableData:[
              {
                  index:0
              }
            ],
            getRowKeys(row) {
              return row.index
            },
            expands: [],
            total: 0,//总条数
            pageNum: 1,//单前页码
            currentPage: 1,
            session:sessionStorage.getItem('session'),
            startAreaData:null,
            area:null,
            staffAreaId:sessionStorage.getItem("areaId"),
            staffCityId:sessionStorage.getItem("cityId"),
            staffProvinceId:sessionStorage.getItem("provinceId"),
            departmentId:sessionStorage.getItem('departmentId'),//214953758759583744==全部权限
            disabled:false,
            payTotalCount:0,
            payTotalMoney:0,
            loading:false
          }
      },
      methods:{
        handleCurrentChange(val){
          this.pageNum = val;
          this.getData()
        },
        show(data){
          if (this.expands[0] !== data) {
            this.expands = [];
            this.expands.push(data);
          } else {
            this.expands = [];
          }
        },
        search(){
          this.pageNum=1;

          if(this.date){
            if(this.date[0]){
              this.formData.beginSettle=this.date[0]+ ' 00:00:00';
            }else{
              this.formData.beginSettle=null;
            }
            if(this.date[1]){
              this.formData.endSettle=this.date[1]+ ' 23:59:59'
            }else{
              this.formData.endSettle=null;
            }
          }else{
            this.formData.beginSettle=null;
            this.formData.endSettle=null;
          }
          this.getData();
        },
        getData(){
          var vm=this;
          vm.loading=true;
          vm.formData.pageInfo={
            pageSize:10,
            pageNum:vm.pageNum
          };
          vm.payTotalMoney=0;
          vm.payTotalCount=0;
          vm.formData=unit.removeEmptyString(vm.formData);
          var get=new RemoteCall();
          get.init({
            router:'/report/order/security/list',
            session:vm.session,
            data:vm.formData,
            callback:function(data){
              vm.tableData=[];
              if(data.ret.errorCode==0){
                if (data.pageInfo.total) {
                  if (data.pageInfo.total > 0) {
                    vm.total = data.pageInfo.total
                  }
                } else if (data.pageInfo.total === 0) {
                  vm.total = 0
                }
                data.rows.forEach(function(item,i){
                    item.index=i
                });
                vm.payTotalMoney=data.payTotalMoney;
                vm.payTotalCount=data.payTotalCount;
                vm.tableData=data.rows;
              }
              setTimeout(function(){
                vm.loading=false;
              },200)
            }
          })
        },
        thousand(num){
          return unit.thousand(num)
        },
      },
      mounted:function(){
        var vm=this;
        if(this.$route.params.data){
          this.formData.merchantNo=this.$route.params.data.merchantNo;
        }
        this.getData();
        this.off=false;
        if(this.departmentId!="214953758759583744"){
          this.disabled=true;
        };

        vm.startAreaData={};
        vm.startAreaData.provinceId=unit.removeEmptyString(vm.staffProvinceId);
        vm.startAreaData.cityId=unit.removeEmptyString(vm.staffCityId);
        vm.startAreaData.areaId=unit.removeEmptyString(vm.staffAreaId);

      }
  }
</script>
<style lang="scss">
  #DataMerchantSocial{
    background: #fff;
    font-size: 14px;
    .el-date-editor{
      width:280px;
    }
    .el-input{
      width:280px;
    }
    .el-button{
      width:100px;
      margin-left:15px;
    }
    .form-wrap{
      padding:20px 20px 0;
      border-bottom:1px solid #e8e8e8;
    }
    .table-wrap{
      padding:20px;
      .button{
        color: #1890ff;
        padding: 0 10px;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .expand-wrap{
      font-size:12px;
      .el-form-item__label{
        font-size: 12px;
      }
      .el-form-item__content{
        min-width: 200px;
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
    .el-pagination {
      float: right;
      margin-top:20px;
      margin-right: 30px;
      font-weight: normal;
      .el-input{
        width:60px;
      }
    }
  }
</style>
