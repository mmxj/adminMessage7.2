<template>
  <div id="HealtStation">
    <div class="form-wrap">
      <el-form inline :model="formData">
        <el-form-item label="卫生站编号" labelWidth="120px">
          <el-input size="small" v-model="formData.no" placeholder="填写卫生站编号" ></el-input>
        </el-form-item>
        <el-form-item label="卫生站名称"  labelWidth="120px">
          <el-input size="small"  v-model="formData.name" placeholder="卫生站名称" ></el-input>
        </el-form-item>
        <el-form-item label="卫生站状态"  labelWidth="120px">
          <!--<el-input size="small"  v-model="formData.auditFlag" placeholder="选择卫生站状态" ></el-input>-->
          <el-select size="small" v-model="formData.auditFlag" clearable >
            <el-option v-for="item in auditOptions" :value="item.value" :label="item.name" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卫生站地区"  labelWidth="120px">
          <div class="address">
            <Province :propdata="formData" :startArea.sync="area"  :disabled="disabled" :startAreaData.sync="startAreaData"></Province>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="searchget" type="primary" >查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-wrap">
      <!--<div class="tool-button">-->
      <!--<el-button icon="el-icon-plus" size="small" class="addMerchant" @click="$router.push('/merchantadd')">新增卫生站</el-button>-->
      <!--<el-button size="small" class="addMerchant">卫生站申请列表</el-button>-->
      <!--</div>-->
      <div class="table-box">
        <el-table
          :data="tableData"
          size="mini"
          style="width:100%"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @filter-change="filterFlag"
          v-loading="loading"
        >
          <el-table-column align="center" label="卫生站编号" prop="no" min-width="100"></el-table-column>
          <el-table-column align="center" label="类型"  min-width="70">
            <template slot-scope="props">
              {{companyTypeShow(props.row.companyType)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="卫生站名称" prop="name" min-width="90"></el-table-column>
          <el-table-column align="center" label="卫生站地址" prop="address" show-overflow-tooltip min-width="100" ></el-table-column>
          <el-table-column align="left" label="审核状态" prop="auditFlag" width="100"
                           :filters="[{text:'待审核',value:0},{text:'审核通过',value:1},{text:'不通过',value:2}]"
                           column-key="flag"
          >
            <template slot-scope="props">
              <div class="status-wrap">
                <i class="circle" :class="circle(props.row.auditFlag)"></i><span>{{props.row.auditFlag}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系人" prop="leader" width="100" ></el-table-column>
          <el-table-column align="center" label="联系电话" prop="telephone" width="100" ></el-table-column>
          <el-table-column align="center" label="详情" min-width="60">
            <template  slot-scope="props">
              <span class="button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" v-if="off">
            <template slot-scope="props">
              <el-form label-position="left" inline  class="expand-wrap demo-table-expand">
                <el-form-item label="卫生站法人：" label-width="110px">
                  <span>{{props.row.corporation}}</span>
                </el-form-item>
                <el-form-item label="营业执照：" label-width="110px">
                  <span class="lookPic" @click="lookPictrue(props.row.name,1)">查看图片</span>
                </el-form-item>
                <el-form-item label="联系邮箱：" label-width="110px">
                  <span>{{props.row.email}}</span>
                </el-form-item>
                <el-form-item label="法人身份证：" label-width="110px">
                  <span>
                      <b class="lookPic"  @click="lookPictrue(props.row.name,2)">正面图片</b>
                      <b class="lookPic"  @click="lookPictrue(props.row.name,3)">反面图片</b>
                  </span>

                </el-form-item>
                <el-form-item label="卫生站主营业务：" label-width="110px">
                  <span>{{props.row.summary}}</span>
                </el-form-item>
                <el-form-item label="上级卫生站：" label-width="110px">
                  <span>{{props.row.parentCompanyName}}</span>
                </el-form-item>
                <el-form-item label="银行账号名：" label-width="110px">
                  <span>{{props.row.accountName}}</span>
                </el-form-item>
                <!--<el-form-item label="卫生站状态：" label-width="110px">-->
                <!--<span>{{props.row.maintainCompany}}</span>-->
                <!--</el-form-item>-->
                <el-form-item label="银行卡号：" label-width="110px">
                  <span>{{props.row.account}}</span>
                </el-form-item>
                <el-form-item label="支付渠道：" label-width="110px">
                  <span>{{props.row.payChannel}}</span>
                </el-form-item>
                <el-form-item label="收单机构：" label-width="110px">
                  <span>无</span>
                </el-form-item>
                <el-form-item label="卫生站ID：" label-width="110px">
                  <span>{{props.row.id}}</span>
                </el-form-item>
                <el-form-item label="所属区域：" label-width="110px">
                  <!--<span>{{props.row.maintainCompany}}</span>-->
                  <span>
                    <ReadArea :areaId="props.row.areaId"></ReadArea>
                  </span>
                </el-form-item>
                <el-form-item label="申请时间：" label-width="110px">
                  <span>{{props.row.sfsCreate}}</span>
                </el-form-item>
                <el-form-item label="审批时间：" label-width="110px">
                  <span>{{props.row.auditTime}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" label="支付渠道配置" min-width="110">
            <template slot-scope="props">
              <span class="button" :class="props.row.auditFlag=='审核通过'?null:'nobutton'" @click="props.row.auditFlag=='审核通过'?$router.push({name:'HealthStationPayChannel',params:{data:props.row}}):null">配置渠道</span>
              <span class="button" :class="props.row.auditFlag=='审核通过'?null:'nobutton'" @click="props.row.auditFlag=='审核通过'?$router.push({name:'HealthStationPayList',params:{data:props.row}}):null">管理渠道</span>
            </template>
          </el-table-column>
        </el-table>
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
      <div class="statistics">总共 {{total}} 个卫生站</div>
    </div>

    <el-dialog :visible.sync="dialogTableVisible">
      <img v-if="picURl" :src="picURl" alt="">
    </el-dialog>

  </div>
</template>
<script>
  import unit from '@/unit/unit.js';
  import GetCompany from '@/common/GetCompany';
  import ReadArea from '@/common/ReadArea';
  import Province from '@/common/Province'
  export default{
    components:{
      GetCompany,
      ReadArea,
      Province
    },
    data(){
      return {
        off:true,
        session:sessionStorage.getItem('session'),
        formData:{

        },
        tableData:[],
        getRowKeys(row) {
          return row.index
        },
        expands: [],
        pageNum:1,
        currentPage:1,
        total:0,
        picName:null,
        picURl:null,
        dialogTableVisible:false,
        flag: null,
        auditOptions:[{
          value:0,
          name:'待审核'
        },
          {
            value:1,
            name:'审核通过'
          },{
            value:2,
            name:'审核不通过'
          }],
        staffAreaId:sessionStorage.getItem("areaId"),
        staffCityId:sessionStorage.getItem("cityId"),
        staffProvinceId:sessionStorage.getItem("provinceId"),
        disabled:true,
        startAreaData:null,
        area:null,
        loading:false
      }
    },
    methods:{
      handleCurrentChange(val){
        this.pageNum=val;

        this.search();
      },
      show(data){

        if (this.expands[0] !== data) {
          this.expands = [];
          this.expands.push(data);
        } else {
          this.expands = [];
        }
      },
      getCompanys(keyword){
        var vm=this;
        vm.loading=true;
//        vm.tableData=[];
        var obj={
          pageInfo:{
            pageSize:10,
            pageNum:vm.pageNum
          },
//              enableFlag:1,
          auditFlagIn: vm.flag,
          companyTypes:'4',
          areaId:vm.staffAreaId,
          cityId:vm.staffCityId,
//              provinceId:vm.staffProvinceId,
        };
        if(keyword){
          for(var item in keyword){
            obj[item]=keyword[item]
          }
        }
        obj=unit.removeEmptyString(obj);
        var getCompany=new RemoteCall();
        getCompany.init({
          router:'/company/get',
          session:vm.session,
          data:obj,
          callback:function(data){
            if (data.ret.errorCode === 0) {
              if (data.pageInfo.total) {
                if (data.pageInfo.total > 0) {
                  vm.total = data.pageInfo.total
                }
              } else if (data.pageInfo.total === 0) {
                vm.total = 0
              }
              vm.tableData=[];
//                    vm.tableData=data.rows;
              data.rows.forEach(function(item,i){
                item.index=i;
                item.auditFlag=vm.auditStatus(item.auditFlag);
                vm.$set(vm.tableData,i,item);
              })
            }
            setTimeout(function(){
              vm.loading=false
            },200)
          }
        })
      },
      searchget(){
        this.pageNum=1;
        this.search();
      },
      search(){
        var vm=this;

        var regArr=[
          {type:1,name:vm.formData.no},
        ]
        if(!this.regName(regArr))return;
        vm.formData=unit.removeEmptyString(vm.formData);
        vm.getCompanys(vm.formData)
      },
      lookPictrue(companyName,type){//type 1是营业执照 2是法人身份证 点击查看图片函数
        var vm=this;
        vm.picName=null;
        vm.picURl=null;
        var get=new RemoteCall();
        get.init({
          router:'/company/certificate/get',
          session:vm.session,
          data:{
            pageInfo:{
              pageSize:100,
              pageNum:1
            },
            companyName:companyName
          },
          callback:function(data){
            if(data.ret.errorCode===0){
              data.rows.forEach(function(item){
                if(type==1){
                  if(item.certificateTypeName=='营业执照'||item.certificateTypeName=='营业执照：'){

                    vm.picName=item.certificatePic;
                  }
                }else if(type==2){
                  if(item.certificateTypeName=="身份证正面"||item.certificateTypeName=='身份证正面：'){
                    vm.picName=item.certificatePic;
                  }
                }else if(type==3){
                  if(item.certificateTypeName=="身份证反面"||item.certificateTypeName=='身份证反面：'){
                    vm.picName=item.certificatePic;
                  }
                }
              });
              if(vm.picName){
                $.ajax({
                  url: "http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download_base64.do",
                  type: 'post',
                  data: {
                    'download_type': '4',
                    'file_name': vm.picName,
                    'id': '0'
                  },
                  success: function (res) {
                    vm.picURl='data:image/png;base64,' +JSON.parse(res).data;
                    vm.dialogTableVisible=true
                  }
                })
              }else{
                vm.$alert('查询不到该证件信息，请添加','提示', {
                  confirmButtonTextL: '确定'
                })
              }
            }
          }
        })
      },
      auditStatus(str){
        if(str==1){
          return '审核通过'
        }else if(str==2){
          return '审核不通过'
        }else if(str=='待审核'){
          return 0
        }else if(str=='审核通过'){
          return 1
        }else if(str=='审核不通过'){
          return 2
        }else{
          return '待审核'
        }
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
      filterFlag(value){//筛选过滤
//         console.log(value)
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
        this.getCompanys();
      },
      regName(arr){//传入数组[{type:1,name:验证信息}] type验证类型 name 验证的信息 text特殊名需要特殊加载提示语前面的 must是否是必填
        //正则处理
        var reg=[];
        for(var i=0;i<arr.length;i++){
          if(arr[i].name!=null&&arr[i].name!=''){
            reg.push(unit.reg(arr[i]))
          }else{
            if(arr[i].must==true){
              reg.push(unit.reg(arr[i]))
            }
          }
        }
        for(var i=0;i<reg.length;i++){
          if(!reg[i].status){
            this.$alert(reg[i].message, '提示', {
              confirmButtonText: '确定',
            });
            return false
          }
        }
        return true
      },
      companyTypeShow(type){
        switch(type){
          case 1 :
            return '收单机构';
            break;
          case 2 :
            return '支付通道机构';
            break;

          case 3 :
            return '社保局';
            break;
          case 4 :
            return '卫生站'
            break;
          case 5:
            return '药店';
            break;
          case 6:
            return '一般卫生站';
            break;
          case 7 :
            return '卫计局';
            break;
          default :
            return '未知'

        }
      }
    },
    mounted:function(){
      var vm=this;
      this.getCompanys();
      this.off=false;
      this.area=vm.staffAreaId;
      vm.startAreaData={};
      vm.startAreaData.provinceId=unit.removeEmptyString(vm.staffProvinceId);
      vm.startAreaData.cityId=unit.removeEmptyString(vm.staffCityId);
      vm.startAreaData.areaId=unit.removeEmptyString(vm.staffAreaId);
    }
  }
</script>
<style lang="scss">
  #HealtStation{
    background: #fff;

    .form-wrap{
      padding:20px 20px 10px;
      border-bottom:1px solid #e8e8e8;
      .el-input{
        width:280px;
      }
      .el-select{
        .el-input{
          width:auto;
        }
      }
      .el-button{
        width:100px;
        margin-left:15px;
      }
    }
    .table-wrap{
      padding:10px 20px;
    }
    .tool-button{
      .addMerchant{
        width: 100px;
        margin:0;
      }
    }
    .table-box{
      padding-top:10px;
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
        }
      }
    }
    .el-table__expanded-cell[class*=cell]{
      padding:10px 50px;
    }
    .button {
      color: #1890ff;
      padding: 0 5px;
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
          width:42px;
        }
      }
    }
    .lookPic{
      text-decoration: underline;
      cursor: pointer;
      color: #1890ff;
      font-weight: normal;
    }
    b.lookPic{
      padding-right:0px;
    }
    .el-dialog{
      width:600px;
      img{
        width:100%;
      }
      .el-dialog__body{
        padding-top:20px
      }
    }
    .status-wrap {
      text-align: left;
      margin: 0 auto;
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
    .nobutton{
      color: #d9d9d9;
      cursor:no-drop;
    }
    .address{
      width:280px;
    }
    .statistics{
      color: #555;
      font-size:14px;
      padding-left:23px;
    }
  }
</style>
