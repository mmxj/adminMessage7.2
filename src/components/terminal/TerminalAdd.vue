<template>
  <div id="TerminalAdd">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separator=">" separator-class="el-icon-d-arrow-right">
        <el-breadcrumb-item :to="{path:'/terminalmanage'}">终端管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:'/terminaladd'}">终端申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="message">
      <div class="title"><span>*</span>终端信息填写:</div>
      <el-form :inline="true">
        <el-form-item label="归属商户" label-width="150px">
          <GetCompany :data.sync="company1" :holder="'请输入归属商户'"></GetCompany>
          <!--<el-input size="small" v-model="messageForm.merchantName"></el-input>-->
        </el-form-item>
        <el-form-item label="归属商户编号" label-width="150px">
          <el-input size="small" v-model="messageForm.merchantNo" placeholder="查无该商户商户号"></el-input>
        </el-form-item>
        <el-form-item label="安装地址" label-width="150px">
          <el-input size="small" v-model="messageForm.address"></el-input>
        </el-form-item>
        <el-form-item label="PSAM卡号" label-width="150px">
          <el-input size="small" v-model="messageForm.pSimNo"></el-input>
        </el-form-item>
        <el-form-item label="维护公司" label-width="150px">
          <el-input size="small" v-model="messageForm.maintainCompany"></el-input>
        </el-form-item>
        <el-form-item label="归属地区" label-width="150px">
          <div class="area">
            <Province :propdata="messageForm" :noall="true"></Province>
          </div>
        </el-form-item>
        <el-form-item label="终端厂家" label-width="150px">
          <el-input size="small" v-model="messageForm.terminalCompany"></el-input>
        </el-form-item>
        <el-form-item label="收单机构" label-width="150px">
          <!--<el-input size="small" v-model="messageForm.acquirerId"></el-input>-->
          <GetCompany :data="company2" :type="1" :holder="'请输入收单机构'"></GetCompany>
        </el-form-item>
        <el-form-item label="终端型号" label-width="150px">
          <el-input size="small" v-model="messageForm.model"></el-input>
        </el-form-item>
        <el-form-item label="终端号" label-width="150px">
          <el-input size="small" v-model="messageForm.terminalNo"></el-input>
        </el-form-item>
        <!--<el-form-item label="终端密匙索引" label-width="150px">-->
          <!--<el-input size="small" v-model="messageForm.mainKeyId"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="经纬度" label-width="150px">
          <el-input size="small" v-model="messageForm.position"></el-input>
          <span class="position" @click="dialogMapVisible=true">在地图上选点</span>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button class="clear other-button" size="small"  >清空</el-button>
        <el-button class="submit" size="small" @click="submit">确定</el-button>
      </div>
    </div>
    <!--根据条件查询-->
    <div id="TerminalAudit2">
      <div class="form-wrap">
        <el-form :inline="true">
          <el-form-item label="商户名称" label-width="100px">
            <el-input v-model="form.merchantName" size="small" placeholder="请输入商户名称"></el-input>
            <!--<GetCompany :data="company3" :holder="'请输入商户名称'"></GetCompany>-->
          </el-form-item>
          <el-form-item label="终端号" label-width="100px">
            <el-input v-model="form.terminalNo" size="small" placeholder="请输入终端编号"></el-input>
          </el-form-item>
          <el-form-item label="安装地址" label-width="100px">
            <el-input v-model="form.address" size="small" placeholder="请输入安装地址"></el-input>
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
          v-loading="loading"
          style="width:100%"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @selection-change="handleSelectionChange"
          @filter-change="filterFlag"
          ref="multipleTable"
        >
          <el-table-column v-if="showButton" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="归属商户" prop="merchantName" min-width="180"></el-table-column>
          <el-table-column align="center" label="PSAM卡号" prop="pSimNo" min-width="120"></el-table-column>
          <el-table-column align="center" label="终端号" prop="terminalNo" min-width="120"></el-table-column>
          <el-table-column align="center" label="归属商户编号" prop="merchantNo" min-width="120"></el-table-column>
          <!--<el-table-column align="center" label="安装地址" prop="address" min-width="100"-->
                           <!--show-overflow-tooltip></el-table-column>-->
          <!--<el-table-column align="center" label="收单机构" prop="acquirerName" min-width="100"></el-table-column>-->
          <el-table-column align="center" label="终端状态"
                           :filters="[{text:'待审核',value:0},{text:'审核通过',value:1},{text:'审核失败',value:2}]"
                           column-key="flag"
                           prop="" min-width="100">
            <template slot-scope="props">
              <div class="status-wrap">
                <i class="circle" :class="circle(props.row.auditFlag)"></i><span>{{props.row.auditFlag}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="详情" min-width="100">
            <template slot-scope="props">
              <span class="button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="120">
            <template slot-scope="props">
              <span :class="props.row.auditFlag=='待审核'||props.row.auditFlag=='审核失败'?'button':'button2'"
                    @click="upData(props.row)">编辑</span>
              <span :class="props.row.auditFlag=='待审核'?'button':'button2'" @click="deleteTerminal(props.row)">删除</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" v-if="off">
            <template slot-scope="props">
              <el-form label-position="left" :inline="true" class="demo-table-expand expand-wrap">
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
                  <span>{{props.row.createDate}}</span>
                </el-form-item>
                <el-form-item label="收单机构：" label-width="110px">
                  <span>{{props.row.acquirerName}}</span>
                </el-form-item>
                <el-form-item label="申请日期：" label-width="110px">
                  <span>{{props.row.sfsCreate}}</span>
                </el-form-item>

                <!--<el-form-item label="商户主营业务" label-width="100px">-->
                <!--<span>{{props.row.summary}}</span>-->
                <!--</el-form-item>-->
                <el-form-item label="终端密匙索引：" label-width="110px">
                  <span>{{props.row.mainKeyId}}</span>
                </el-form-item>
                <el-form-item label="终端厂家：" label-width="110px">
                  <span>{{props.row.terminalCompany}}</span>
                </el-form-item>
                <el-form-item label="终端型号：" label-width="110px">
                  <span>{{props.row.model}}</span>
                </el-form-item>
                <el-form-item label="备注：" label-width="110px">
                  <span>{{props.row.summary}}</span>
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
      <!--删除按钮弹窗-->
      <div class="delete">
        <el-dialog :visible.sync="deleteDialog">
          <div class="title">
            <img :src="tanhao" alt="" width="">
            <p>是否删除该商户终端申请信息？</p>
            <p>该信息一旦删除，将无法找回。</p>
          </div>
          <div slot="footer" class="dialog-footer" center>
            <el-button size="small" class="other-button" @click="deleteDialog = false">取消</el-button>
            <el-button class="submit" size="small" @click="deleteItem">确定删除</el-button>
          </div>
        </el-dialog>
      </div>
      <!--终端信息弹窗-->
      <div class="terminalMessage">
        <el-dialog title="终端申请" :visible.sync="outerVisible">
          <el-form :model="formData" inline>
            <el-form-item label="归属商户" :label-width="formLabelWidth">
              <el-input readonly size="small" v-model="formData.companyName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="PSAM卡号" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.pSimNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="安装地址" :label-width="formLabelWidth" style="width:100%;">
              <el-input size="small" v-model="formData.address" auto-complete="off"
                        class="address-input"></el-input>
            </el-form-item>
            <el-form-item label="维护公司" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.maintainCompany" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="收单机构" :label-width="formLabelWidth">
              <GetCompany :data="company4" :start="formData.acquirerName" :type="1" :holder="'请输入收单机构'"></GetCompany>
              <!--<el-input size="small" v-model="formData.acquirerName" auto-complete="off"></el-input>-->
            </el-form-item>
            <el-form-item label="代理申请主体" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.agency" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="归属地区" :label-width="formLabelWidth">
              <div class="form-select">
                <Province2 :propdata="formData" :startArea="startAreas"></Province2>
              </div>
              <!--<el-input size="small" v-model="formData.affiliation" auto-complete="off"></el-input>-->
            </el-form-item>
            <el-form-item label="申请日期" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.sfsCreate" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="归属商户号" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.merchantNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="商户主营业务" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.summary" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="终端编号" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.terminalNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="终端厂家" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.terminalCompany" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="终端密钥索引" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.mainKeyId" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="终端型号" :label-width="formLabelWidth">
              <el-input size="small" v-model="formData.model" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" center>
            <el-button size="small" class="other-button" @click="outerVisible = false">关闭</el-button>
            <el-button class="submit" size="small" type="primary" @click="submitouterVisible">提交申请 </el-button>
          </div>
        </el-dialog>
      </div>
      <!--分页-->
      <div class="pagination clearfix">
        <div class="exportpassword">
          <el-button v-if="!showButton" @click="showButton=!showButton" class="other-button" size="small">导出密匙</el-button>
          <div v-if="showButton">
            <el-button size="mini" class="button-mini" type="primary">确定导出</el-button>
            <el-button size="mini" class="button-mini other-button" @click="channelchoose">取消</el-button>
            <span class="chose">已选择 <b>{{multipleSelection.length}}</b> 项目</span>
          </div>
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
    <el-dialog :visible.sync="dialogMapVisible" title="地图" width="820px">
      <MAmap :position="position"></MAmap>
      <el-button class="buttons" @click="addressPosition" size="small">确认</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import Province from '@/common/Province';
  import Province2 from '@/common/Province';
  import GetCompany from '@/common/GetCompany';
  import ReadArea from '@/common/ReadArea';
  import tanhao from '@/assets/img/tanghao.png';
  import MAmap from '@/common/MAmap/MAmap'
  import unit from '@/unit/unit';
  export default{
    components: {
      Province,
      GetCompany,
      Province2,
      ReadArea,
      MAmap
    },
    data(){
      return {
        loading: true,
        off:true,
        company1: {},//商户
        company2: {},//收单机构
        company3: {},//搜索的商户名
        company4: {},//修改弹窗中的收单机构
        total: 0,//总条数
        pageNum: 1,//单前页码
        deleteDialog: false,
        messageForm: {
          isAppPay: 1,//是否用于移动支付
          departmentId: sessionStorage.getItem('departmentId')
        },
        startAreas: null,
        provinceData: {},
        cityData: {},
        areaData: {},
        form: {},
        tanhao: tanhao,
        currentPage: 1,
        textarea: null,
        formData: {},
        radio: null,
        outerVisible: false,
        formLabelWidth: '120px',
        tableData: [],
        session: sessionStorage.getItem('session'),
        getRowKeys(row){
          return row.index
        },
        expands: [],
        deleteId: null,
        multipleSelection: [],
        showButton: false,
        flag: null,
        timer:11,
        staffAreaId:sessionStorage.getItem("areaId"),
        staffCityId:sessionStorage.getItem("cityId"),
        staffProvinceId:sessionStorage.getItem("provinceId"),
        dialogMapVisible: false,
        position:{}
      }
    },
    methods: {
      handleCurrentChange(val){
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
      submit(){//提交新增终端
        var vm = this;
        this.messageForm.merchantName = this.company1.name;
        this.messageForm.companyId = this.company1.id;

        this.messageForm.acquirerId = this.company2.id;
        this.messageForm = unit.removeEmptyString(this.messageForm);
        if (this.messageForm.companyId == null) {
          vm.$alert('请填写正确的归属商户', '提示', {
            confirmButtonText: '确定',
          })
          return
        }
        if (this.messageForm.merchantNo == null) {
          vm.$alert('请填写归属商户编号', '提示', {
            confirmButtonText: '确定',
          })
          return
        }
        if (this.messageForm.terminalNo == null) {
          vm.$alert('终端号不能为空', '提示', {
            confirmButtonText: '确定',
          })
          return
        };
        vm.messageForm.enableFlag=0;
        var submitForm = new RemoteCall();
        submitForm.init({
          router: '/base/terminal/add',
          session: vm.session,
          data: vm.messageForm,
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              vm.$alert('添加终端成功,等待审核', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.messageForm.provinceId = null;
                  vm.messageForm = {
                    isAppPay: 1,//是否用于移动支付
                    departmentId: sessionStorage.getItem('departmentId')
                  }
                  vm.company1 = {};
                  vm.company2 = {};
                  vm.pageNum = 1;
                  vm.getTerminal();
                }
              })
            }
          }
        })
      },//提交新增
      getTerminal(){ //获取终端信息
        var vm = this;
        vm.loading= true;
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
            areaId:vm.staffAreaId,
            cityId:vm.staffCityId,
            provinceId:vm.staffProvinceId,
            auditFlagIn: vm.flag
          },
          callback: function (data) {
            vm.loading= false;
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

            }
          }
        })
      },//获取终端信息
      upData(data){
        if (data.auditFlag == '待审核' || data.auditFlag == '审核失败') {
          var vm = this;
          for (var i in data) {
            vm.$set(vm.formData, i, data[i])
          }
          this.startAreas = vm.formData.areaId;
          vm.outerVisible = true
        }
      },
      sreachget(){
        this.pageNum=1;

        this.sreach();
      },
      sreach(){//根据条件查询终端信息 缺少地址查询的功能
//        this.form.companyId=this.company3.id;
        var vm = this;
        vm.loading=true;
        this.form.pageInfo = {
          pageSize: 10,
          pageNum: vm.pageNum
        };
        this.form.areaId=vm.staffAreaId;
        this.form.cityId=vm.staffCityId,
        this.form.provinceId=vm.staffProvinceId,
//        this.form.auditFlagIn='0,2';
        unit.removeEmptyString(this.form);
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
              item.index = i
              item.auditFlag = unit.auditFlag(item.auditFlag);
              vm.$set(vm.tableData, i, item)
            })
            setTimeout(function(){
              vm.loading=false;
            },200)
          }
        })
      },//根据条件查询
      submitouterVisible(){//修改终端信息
        var vm = this;
        vm.formData.acquirerName = vm.company4.name;
        vm.formData.acquirerId = vm.company4.id;
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
            }
          }
        })

      },//提交修改
      deleteTerminal(data){
        if (data.auditFlag == '待审核') {
          this.deleteId = data.id;
          this.deleteDialog = true
        }
      },
      deleteItem(){
        var vm = this;
        var del = new RemoteCall();
        del.init({
          router: '/base/terminal/delete',
          session: vm.session,
          data: {
            id: vm.deleteId
          },
          callback: function (data) {
            console.log(data);
            vm.getTerminal();
          }
        })
        this.deleteDialog = false
      },
      handleSelectionChange(val){//将选中的项目放到其他数组
        this.multipleSelection = val;
      },
      filterFlag(value){//筛选过滤
        this.flag = null;
        for (var i = 0; i < value.flag.length; i++) {
          if (this.flag == null) {
            this.flag += value.flag[i];
          } else {
            this.flag += ',' + value.flag[i];
          }

        }
        if (this.flag != null) {
          this.flag = this.flag.toString();
        }
        this.getTerminal();
      },
      circle(name){//返回对应的颜色类名
        if (name == '待审核') {
          return 'blueCircle'
        } else if (name == '审核通过') {
          return 'greenCircle'
        } else {
          return 'redCircle'
        }
      },
      channelchoose(){
        this.showButton=!this.showButton;
        this.$refs.multipleTable.clearSelection();
      },
      addressPosition(){

          if(this.position.lng){
            this.messageForm.position='东经'+this.position.lng+'度,'+'北纬'+this.position.lat+'度';
            this.dialogMapVisible=false;
          }
      }
    },
    mounted: function () {
      this.off=false;
      this.getTerminal();
    },
    watch:{
      company1:{//监听商户编号基于商户号
          handler:function(){
            this.$set(this.messageForm,'merchantNo',this.company1.no)
          },
        deep:true
      }
    }
  }
</script>
<style lang="scss">
  #TerminalAdd {
    background: #fff;
    padding: 20px 0;
    .breadcrumb {
      vertical-align: middle;
      padding-left: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8
    }
    .breadcrumb span {
      display: inline-block;
      font-size: 14px;
      line-height: 16px;
      vertical-align: middle;
    }
    .el-breadcrumb {
      display: inline-block;
      vertical-align: middle;
    }
    .message {
      padding: 10px 24px;
      border-bottom: 1px solid #e8e8e8;
      .el-form{
        text-align: left;
      }
      .el-input {
        width: 280px;
      }
      .title {
        margin-bottom: 10px;
        font-size: 14px;
        span {
          color: red;
          position: relative;
          top: 2px;
          padding: 0 2px;
        }
      }
    }

    .area {
      width: 280px;
      .el-select {
        width: 32%;
        .el-input {
          width: 100%;
        }
      }
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-button {
      width: 100px;
    }
    .button-mini {
      width: auto;
      padding: 7px 10px;
    }
    .button {
      .el-button {
        padding: 8px 0;
      }
      margin-top: 20px;
      margin-bottom: 10px;
      text-align: center;
      .submit {
        color: #fff;
      }
    }
    .button-wrap {
      margin-left: 30px;
      .el-button {
        height: 30px;
        padding: 0;
        color: #fff;
        vertical-align: middle;
      }
    }
    .form-wrap {
      padding: 20px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #e8e8e8;
    }
    .table-wrap {
      padding: 0 30px;
      margin: 20px 0;
      .button {
        color: #1890ff;
        padding: 0 5px;
        cursor: pointer;
        text-decoration: underline;
      }
      .button2 {
        color: #aaaaaa;
        padding: 0 5px;
        cursor: not-allowed;
        text-decoration: line-through;
      }
      .el-form-item {
        span {
          display: inline-block;
          min-width: 240px;
        }
      }
    }
    .is-center {
      padding:0;
    }
    .el-table__expand-column {
      padding: 0;
      width: 0;
    }
    .terminalMessage {
      .el-dialog {
        width: 826px;

      }
      .el-input {
        width: 250px;
      }
      .address-input {
        width: 635px;
      }
      .el-dialog__body {
        margin-top: 20px;
        border-top: 1px solid #e8e8e8;
      }
    }
    .el-table__expand-column .cell {
      width: 0;
      marign: 0;
      padding: 0;
      display: none;
    }
    .circle {
      display: inline-block;
      vertical-align: middle;
      width: 6px;
      height: 6px;
      background: #000;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      border-radius: 6px;
      position: relative;
      top: -1px;
      margin-right: 3px;
    }
    .greenCircle {
      background: #52c41a;
    }
    .blueCircle {
      background: #0F8DFF;
    }
    .redCircle {
      background: #FB3C3B;
    }
    .status-wrap {
      width: 80px;
      text-align: left;
      margin: 0 auto;
    }


  .demo-table-expand {
    text-align: left !important;
  }

  .dialog-footer {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #e8e8e8;
    .submit {
      color: #fff;
      margin-left: 30px;
    }
  }

  .el-pagination {
    float: right;
    margin-right: 30px;
    font-weight: normal;
  }

  .delete {
    .el-dialog {
      width: 466px;
    }
    .title {
      text-align: center;
      padding: 20px 0;
    }
    p {
      margin-top: 5px;
    }
    .submit {
      background: #1890FF;
    }
    .submit:active {
      background: #0068c8;
    }
    .el-dialog__footer {
      padding: 0;
    }
    .el-dialog__body {
      padding: 20px 20px;
    }

  }

  .exportpassword {
    display: inline-block;
    margin-left: 30px;
  }
  .form-select {
    width: 250px;
  }

  .chose {
    font-size: 14px;
    color: #666;
    vertical-align: middle;
    b {
      color: #1890ff
    }
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
    .position{
      color: #1890FF;
      text-decoration: underline;
      cursor:pointer;
    }
    .el-dialog__body{
      padding:10px;
      padding-bottom:60px;
    }
    .buttons{
      position:absolute;
      right:10px;
      bottom:10px;
    }
  }
</style>
