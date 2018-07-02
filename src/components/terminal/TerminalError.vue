<template>
  <div id="TerminalError">
    <div class="form-wrap">
      <el-form :inline="true">
        <el-form-item label="异常预警时间" label-width="100px">
          <!--<el-input v-model="form.name" placeholder="请输入商户名称"></el-input>-->
          <el-date-picker
            size="small"
            v-model="timeValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="终端号" label-width="100px">
          <el-input v-model="form.terminalNo" size="small" placeholder="请输入终端号"></el-input>
        </el-form-item>
        <el-form-item label="终端状态" label-width="100px">
          <!--<el-input v-model="form."  size="small" placeholder=""></el-input>-->
          <el-select size="small" v-model="form.enableFlag" clearable placeholder="请选择">
            <el-option
              v-for="item in enableFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-button">
          <div class="button-wrap">
            <el-button @click="searchget" size="small">查询</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        align="center"
        style="width: 100%;">
        <el-table-column
          align="center"
          prop="sfsCreate"
          label="异常预警时间"
          width="180"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="terminalNo"
          label="终端编号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="pSimNo"
          label="PSAM卡号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          label="终端状态"
          show-overflow-tooltip
        >
          <template slot-scope="props">
            {{props.row.enableFlag==1?'已生效':'交易禁止'}}
          </template>

        </el-table-column>
        <el-table-column
          align="center"
          prop="code"
          label="异常代码号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="异常情况说明"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <span class="button" @click="handleClick(scope.row,1)">查看</span>
            <span class="button" type="text" @click="handleClick(scope.row,2)">异常处理</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--终端信息弹窗-->
    <div class="terminalMessage">
      <el-dialog :title="dialogType==1?'终端信息':'终端异常管理'" v-loading="dialogLoading" :visible.sync="outerVisible">
        <el-form :model="formData" inline>
          <el-form-item label="归属商户" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.companyName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="PSAM卡号" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.pSimNo" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="安装地址" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.address" auto-complete="off"
                      class="address-input"></el-input>
          </el-form-item>
          <el-form-item label="维护公司" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.maintainCompany" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收单机构" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.acquirerName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="代理申请主体" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.asc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="归属地区" :label-width="formLabelWidth">
            <!--<el-input readonly size="small" v-model="formData.areaId"-->
                      <!--auto-complete="off"></el-input>-->
              <Province :propdata="formData" :startArea="area" :disabled="true"></Province>
          </el-form-item>
          <el-form-item label="开通日期" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.sfsCreate"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商户编码" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.merchantNo"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="申请日期" :label-width="formLabelWidth">
            <el-input readonly  size="small" v-model="formData.sfsModified"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端编号" :label-width="formLabelWidth">
            <el-input readonly  size="small" v-model="formData.terminalNo"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商户主营业务" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.summary" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端密钥索引" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.mainKeyId"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端厂家" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.terminalCompany"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端型号" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.model" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" v-if="dialogType==2" class="deal">
          <span class="radio-title">交易状态:</span>
          <el-radio v-model="radio" label="0">禁止交易</el-radio>
          <el-radio v-model="radio" label="1">开放交易</el-radio>
        </div>
        <div slot="footer" class="dialog-footer" center>
          <el-button v-if="dialogType==1" @click="outerVisible = false">关闭</el-button>
          <el-button v-if="dialogType==2" @click="outerVisible = false">关闭</el-button>
          <el-button v-if="dialogType==2" @click="submitError">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="内层 Dialog"
        :visible.sync="innerVisible"
        append-to-body
        class="innerdialog"
      >
      </el-dialog>
    </div>
    <!--终端信息弹窗end-->

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
  import Province from '@/common/Province'
  import unit from '@/unit/unit.js'
  export default{
    components:{
      Province
    },

    data(){
      return {
        enableFlagOptions: [
          {
            value: 0,
            label: '交易禁止'
          }, {
            value: 1,
            label: '已生效'
          }
        ],
        area:null,
        outerVisible: false,
        innerVisible: false,
        loading:false,
        dialogLoading:false,
        currentPage: 1,
        formLabelWidth: '120px',
        radio: '1',
        form: {},
        dialogType: 1,//定义弹窗的类型1为查看 2为异常处理
        formData: {
          name: '中国移动',
          psam: '1008610086',
          address: '中国北京天安门广场东南天格北门自莫西门店'
        },
        tableData: [
          {
            id: 1,
            incident: 12131,
            number: 1214,
            psam: 123456,
            status: 1,
            explain: 10,
          },
        ],
        timeValue: null,
        session:sessionStorage.getItem('session'),
        pageNum:1,
        total:0
      }
    },
    methods: {
      handleClick(row, dialogType){

        this.dialogType = dialogType;
        this.outerVisible = true;
        this.dialogLoading=true;
        var vm=this;
        var getTerminal=new RemoteCall();
        getTerminal.init({
          router:'/base/terminal/get',
          session:vm.session,
          data:{
            terminalNo:row.terminalNo
          },
          callback:function(data){
              vm.dialogLoading=false;
              if(data.ret.errorCode===0){
                  vm.formData=data.rows[0];
                  vm.area=vm.formData.areaId;
                  vm.radio=vm.formData.enableFlag.toString();
              }
          }
        })
      },
      handleCurrentChange(val){
        this.pageNum=val;
        this.search();
//        console.log('当前页' + val)
      },
      getError(obj){
        var vm=this;
        vm.loading=true;
        if(obj){
            var postData=obj;
        }else{
          var postData={}
        }
        postData.pageInfo={
          pageSize:10,
          pageNum:vm.pageNum
        }

        var get=new RemoteCall();
        get.init({
          router:'/base/terminalException/get',
          session:vm.session,
          data:postData,
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
                setTimeout(function(){
                  vm.loading=false;
                },200)
              }
          }
        })
      },
      searchget(){
        this.pageNum=1;
        this.search();
      },
      search(){

         console.log(this.timeValue);
         if(this.timeValue){
           if(this.timeValue[0]){
             this.form.beginSfsCreate=this.timeValue[0]+' 00:00:00';
           }else{
             this.form.beginSfsCreate=null;
           }
           if(this.timeValue[1]){
             this.form.endSfsCreate=this.timeValue[1]+' 23:59:59'
           }else{
             this.form.endSfsCreate=null;
           }
         }else{
           this.form.beginSfsCreate=null;
           this.form.endSfsCreate=null;
         }
         this.form=unit.removeEmptyString(this.form);
          this.getError(this.form);
      },
      submitError(){
        var vm=this;
        var updateTerminal=new RemoteCall();
        updateTerminal.init({
          router:'/base/terminal/update',
          session:vm.session,
          data:{
              id:vm.formData.id,
              enableFlag:vm.radio
          },
          callback:function(data){
              if(data.ret.errorCode===0){
                  vm.$alert('操作成功','提示',{
                      confirmButtonText:'确定',
                      callback:()=>{
                        vm.outerVisible = false;
                        vm.getError();
                      }
                  })
              }
          }
        })
      }
    },
    mounted:function(){
        this.getError();
    }
  }
</script>
<style scoped>
  #TerminalError {
    background: #fff;
    padding: 20px 0;
  }

  .button-wrap {
    width: 90px;
    text-align: right;
  }

  .table-wrap {
    margin: 20px 0;
    padding: 0 32px;
    font-size: 12px;
  }

  .button {
    color: #1890ff;
    padding: 0 10px;
    cursor: pointer;
    text-decoration: underline;
  }

  .deal {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  .radio-title {
    padding-right: 20px;
  }
</style>
<style>



  #TerminalError .el-form-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  #TerminalError .address-input {
    width: 574px;
  }

  #TerminalError .el-dialog__body {
    margin-top: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  #TerminalError .dialog-footer {
    text-align: center;
  }

  #TerminalError .dialog-footer .el-button {
    width: 100px;
  }

  #TerminalError .el-radio__inner {
    width: 14px;
    height: 14px;
    margin-left: 10px;
  }
</style>
<style lang="scss">
  #TerminalError {
    .form-wrap{
      padding-left:30px;
    }
    .el-form-item__content{
      width: 250px;
    }
    .el-select{
      width:100%;
    }
    .el-date-editor{
      width:100%;
    }
    .el-button{
      width:100px;
    }
    .button-wrap{
      padding-left:20px;
    }
    .search-button{
      .el-form-item__content{
        width:auto;
      }
    }
    .el-pagination {
      float: right;
      margin-right: 30px;
      font-weight: normal;
      .el-input{
        width:46px;
      }
    }
    .el-dialog{
      width: 826px;
    }
  }
</style>
