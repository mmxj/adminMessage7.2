<template>
  <div id="TerminalAudit">
    <div class="form-wrap">
      <el-form :inline="true">
        <el-form-item label="商户名称" label-width="100px">
          <el-input size="small" v-model="form.merchantName" placeholder="请输入商户名称"></el-input>
          <!--<GetCompany :data="company" :holder="'请输入商户名称'"></GetCompany>-->
        </el-form-item>
        <el-form-item label="PSAM卡号" label-width="100px">
          <el-input size="small" v-model="form.pSimNo" placeholder="请输入PSAM卡号"></el-input>
        </el-form-item>
        <el-form-item size="small" label="终端状态" label-width="100px">
          <!--<el-input v-model="form.address" placeholder="请输入终端状态"></el-input>-->
          <el-select v-model="form.auditFlag" clearable placeholder="请选择">
            <el-option
              v-for="item in enableFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端号" label-width="100px">
          <el-input size="small" v-model="form.terminalNo" placeholder="请输入终端号"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-wrap">
            <el-button @click="sreachget">查询</el-button>
          </div>
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
        <el-table-column align="center" label="归属商户" prop="merchantName" min-width="180"></el-table-column>
        <el-table-column align="center" label="商户号" prop="merchantNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="终端编号" prop="terminalNo" min-width="80"></el-table-column>
        <!--<el-table-column align="center" label="终端密钥索引" prop="mainKeyId" min-width="100"></el-table-column>-->
        <el-table-column align="center" label="PSAM卡号" prop="pSimNo" min-width="100"></el-table-column>
        <!--<el-table-column align="center" label="安装地址" prop="address" min-width="100"-->
                         <!--show-overflow-tooltip></el-table-column>-->
        <el-table-column align="center" label="收单机构" prop="acquirerName" min-width="90"></el-table-column>
        <el-table-column align="center" label="详情" min-width="70">
          <template slot-scope="props">
            <span class="button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="100">
          <template slot-scope="props">
            <span class="button" @click="audit(props.row)">审核</span>
          </template>
        </el-table-column>
        <el-table-column type="expand" v-if="off">
          <template slot-scope="props">
            <el-form label-position="left" :inline="true" class="expand-wrap">
              <el-form-item label="维护公司：" label-width="110px">
                <span>{{props.row.maintainCompany}}</span>
              </el-form-item>
              <el-form-item label="终端经纬度：" label-width="110px">
                <span>{{props.row.position}}</span>
              </el-form-item>
              <el-form-item label="代理申请主体：" label-width="110px">
                <span>{{props.row.agency}}</span>
              </el-form-item>
              <el-form-item label="归属地区：" label-width="110px">
                  <span>
                    <ReadArea :areaId="props.row.areaId"></ReadArea>
                  </span>
              </el-form-item>
              <el-form-item label="开通日期：" label-width="110px">
                <span>{{props.row.sfsCreate}}</span>
              </el-form-item>
              <el-form-item label="终端型号：" label-width="110px">
                <span>{{props.row.model}}</span>
              </el-form-item>
              <el-form-item label="终端密钥索引：" label-width="110px">
                <span>{{props.row.mainKeyId}}</span>
              </el-form-item>
              <el-form-item label="终端厂家：" label-width="110px">
                <span>{{props.row.terminalCompany}}</span>
              </el-form-item>
              <el-form-item label="终端状态：" label-width="110px">
                <span>{{props.row.auditFlag}}</span>
              </el-form-item>
              <el-form-item label="详细安装地址：" label-width="110px" style="width:100%">
                <span>{{props.row.address}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹窗-->
    <!--终端信息弹窗-->
    <div class="terminalMessage">
      <el-dialog title="终端审核" :visible.sync="outerVisible">
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
            <el-input readonly size="small" v-model="formData.agency" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="归属地区" :label-width="formLabelWidth">
            <div class="form-select">
              <Province :disabled="true" :propdata="formData" :startArea="startAreas"></Province>
            </div>
          </el-form-item>
          <el-form-item label="开通日期" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.openDate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商户号" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.merchantNo" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="申请日期" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.sfsCreate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端号" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.terminalNo" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端密钥索引" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.mainKeyId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端厂家" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.terminalCompany" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端型号" :label-width="formLabelWidth">
            <el-input readonly size="small" v-model="formData.model" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="deal">
          <span class="radio-title"><i>*</i>审核结果:</span>
          <el-radio v-model="formData.auditFlag" label="1">审核通过</el-radio>
          <el-radio v-model="formData.auditFlag" label="2">审核不通过</el-radio>
          <div>
            <span style="vertical-align: top;margin-top:20px;display:inline-block">备注：</span>
            <el-input type="textarea"
                      :autosize="{ minRows: 4}"
                      placeholder="请输入内容"
                      v-model="formData.summary"
                      resize="none"
                      style="width: 650px;margin-top:10px"
            ></el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" center>
          <el-button @click="outerVisible = false" class="other-button">关闭</el-button>
          <el-button @click="submit">确定</el-button>
        </div>
      </el-dialog>
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
  import unit from '@/unit/unit';
  import Province from '@/common/Province';
  import ReadArea from '@/common/ReadArea';
  export default{
    components: {
      Province,
      ReadArea
    },
    data(){
      return {
        off:true,
        session: sessionStorage.getItem('session'),
        staffAreaId:sessionStorage.getItem("areaId"),
        staffCityId:sessionStorage.getItem("cityId"),
        staffProvinceId:sessionStorage.getItem("provinceId"),
        total: 0,//总条数
        pageNum: 1,//单前页码
        startAreas: null,//初始地区
        form: {},
        currentPage: 1,
        textarea: null,
        formData: {},
        radio: null,
        enableFlagOptions: [{value: '0', label: '待审核'}, {value: '2', label: '审核不通过'}],
        outerVisible: false,
        formLabelWidth: '100px',
        tableData: [],
        getRowKeys(row) {
          return row.index
        },
        expands: [],
        loading:false
      }
    },
    methods: {
      handleCurrentChange(val){
//        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.sreach();
      },
      show(data){

        if (this.expands[0] !== data) {
          this.expands = [];
          this.expands.push(data);
        } else {
          this.expands = [];
        }

      },
      getTerminal(){ //获取终端信息
        var vm = this;
        vm.loading=true;
        vm.tableData = [];
        var getterminal = new RemoteCall();
        getterminal.init({
          router: '/base/terminal/get',
          session: vm.session,
          data: {
            pageInfo: {
              pageSize: 10,
              pageNum: vm.pageNum
            },
            areaId:unit.removeEmptyString(vm.staffAreaId),
            cityId:unit.removeEmptyString(vm.staffCityId),
            provinceId:unit.removeEmptyString(vm.staffProvinceId),
            auditFlagIn: '0'
          },
          callback: function (data) {
            vm.loading=false;
            if (data.ret.errorCode === 0) {
              if (data.pageInfo.total) {
                if (data.pageInfo.total > 0) {
                  vm.total = data.pageInfo.total
                }
              } else if (data.pageInfo.total === 0) {
                vm.total = 0
              };
              vm.tableData = [];
              data.rows.forEach(function (item, i) {
                item.index = i;
                item.auditFlag = unit.auditFlag(item.auditFlag);
                vm.$set(vm.tableData, i, item)
              })
              vm.expands = [];
            }
          }
        })
      },//获取终端信息
      audit(data){//审核显示界面
        var vm = this;
        this.formData = data;
        this.startAreas = this.formData.areaId;
        this.outerVisible = true;
//        console.log(data);


      },
      submit(){//提交修改
        var vm = this;
        if(vm.formData.auditFlag==1){
            vm.formData.enableFlag=1
        }else if(vm.formData.auditFlag==2){
          vm.formData.enableFlag=0
        }
        unit.removeEmptyString(vm.formData);
        var submitUpdata = new RemoteCall();
        submitUpdata.init({
          router: '/base/terminal/update',
          session: vm.session,
          data: vm.formData,
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              vm.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: function () {
                  vm.outerVisible = false;
                  vm.getTerminal();
                }
              })
            } else {
              vm.$alert('修改失败' + data.ret.errorMessage, '提示', {
                confirmButtonText: '确定',
                callback: function () {
                  vm.outerVisible = false;
                  vm.getTerminal();
                }
              })
            }
          }
        })
      },
      sreachget(){
          this.pageNum=1;
        this.sreach();
      },
      sreach(){//根据条件查询终端信息 缺少地址查询的功能
//        this.form.companyId=this.company.id;

        var vm = this;
        vm.loading=true;
        this.form.pageInfo = {
          pageSize: 10,
          pageNum: vm.pageNum
        };
        this.form.areaId=vm.staffAreaId;
        this.form.cityId=vm.staffCityId,
        this.form.provinceId=vm.staffProvinceId,
        this.form.auditFlagIn = '0,2';
        this.form=unit.removeEmptyString(this.form);

        var searchCompany = new RemoteCall();
        searchCompany.init({
          router: '/base/terminal/get',
          session: vm.session,
          data: vm.form,
          callback: function (data) {

            if (data.pageInfo.total) {
              if (data.pageInfo.total > 0) {
                vm.total = data.pageInfo.total
              }
            } else if (data.pageInfo.total === 0) {
              vm.total = 0
            }
            vm.tableData = [];
            data.rows.forEach(function (item, i) {
              item.index = i;
              item.auditFlag = unit.auditFlag(item.auditFlag);
              vm.$set(vm.tableData, i, item)
            })
            setTimeout(function(){
              vm.loading=false;
            },200)
          }
        })
      },//根据条件查询
    },
    mounted: function () {
      this.off=false;
      this.getTerminal();
    }
  }
</script>
<style scoped>
  #TerminalAudit {
    background: #fff;
    padding: 20px 0;
  }

  .el-button {
    height: 30px;
    line-height: 0px;
    marign-top: 3px;
    width: 100px;
  }

  .button-wrap {
    width: 90px;
    text-align: right;
    margin-left: 30px;
  }

  .el-input {
    width: 200px;
  }

  .form-wrap {
    border-bottom: 1px solid #e8e8e8;
  }

  @media screen and (max-width: 1600px) {
    /*.el-input{*/
    /*width:240px;*/
    /*}*/
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 43%;
  }

  .table-wrap {
    margin: 20px 0;
    padding: 0 32px;
  }

  .el-pagination {
    float: right;
    margin-right: 30px;
    font-weight: normal;
  }

  .demo-table-expand {
    text-align: left;
    padding: 10px 80px;
  }

  .apply {
    padding: 20px 32px 0 32px;
  }

  .apply-button {
    padding: 10px 25px;
  }

  .button {
    color: #1890ff;
    padding: 0 10px;
    cursor: pointer;
    text-decoration: underline;
  }

  .terminalMessage .el-dialog--small {
    width: 826px;
    border-radius: 5px;
  }

  /*.terminalMessage .el-dialog__body{*/
  /*text-align: center;*/
  /*}*/
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

  .radio-title i {
    color: red;
    padding: 4px;
    vertical-align: middle;
    position: relative;
    top: 2px;
  }
</style>
<style lang="scss">
  .el-dialog__footer {
    padding-left: 0;
    padding-right: 0;
  }

  .terminalMessage .el-dialog__title {
    font-weight: normal;
    font-size: 16px;
  }

  #TerminalAudit .el-dialog__body {
    margin-top: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  #TerminalAudit .dialog-footer .el-button {
    width: 100px;
  }

  #TerminalAudit .dialog-footer {
    text-align: center;
  }

  #TerminalAudit .terminalMessage .el-form-item {
    margin-right: 70px;
    margin-bottom: 10px;
  }

  .el-table__expand-column .cell {
    width: 0;
    marign: 0;
    padding: 0;
    display: none;
  }

  .el-table__expand-column {
    width: 0 !important;
    marign: 0;
    padding: 0;
  }

  .terminalMessage .el-dialog--small {
    width: 826px;
    border-radius: 5px;
  }
  .el-dialog{
    width: 826px;
    border-radius: 5px;
  }
  .form-select {
    width: 220px;
  }

  .el-dialog .el-input {
    width: 220px;
  }
  .expand-wrap{
    .el-form-item{
      margin:0;

      span{
        display: block;
        font-size:12px;
        width: 280px;
      }
      .el-form-item__label,.el-form-item__content{
        line-height: 26px;
        font-size:12px;
      }
    }
  }
</style>
