<template>
  <div id="MerchantAudit">
    <div class="form-wrap">
      <el-form inline :model="formData">
        <el-form-item label="商户编号" labelWidth="100px">
          <el-input size="small" v-model="formData.no" placeholder="填写商户编号" ></el-input>
        </el-form-item>
        <el-form-item label="商户名称"  labelWidth="100px">
          <el-input size="small"  v-model="formData.name" placeholder="商户名称" ></el-input>
        </el-form-item>
        <el-form-item label="商户状态"  labelWidth="100px">
          <!--<el-input size="small"  v-model="formData.auditFlag" placeholder="选择商户状态" ></el-input>-->
          <el-select size="small" v-model="formData.auditFlag" clearable >
            <el-option v-for="item in auditOptions" :value="item.value" :label="item.name" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="searchget" type="primary" >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <div class="tool-button">
        <!--<el-button icon="el-icon-plus" size="small" class="addMerchant" @click="$router.push('/merchantadd')">新增商户</el-button>-->
        <el-button size="small" class="addMerchant" @click="examine" >{{showHint?'取消':'批量审核'}}</el-button>
      </div>
      <div class="hint" v-if="showHint">
        <i class="el-icon-info info"></i>
        已选择 <span class="num">{{multipleSelection.length}}</span> 项
        <span class="button first" @click="approve(1)">审批通过</span>
        <span class="button" @click="approve(2)">审批不通过</span>
        <span class="button clear" @click="$refs.multipleTable.clearSelection()">清空</span>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          size="mini"
          style="width:100%"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @filter-change="filterFlag"
          v-loading="loading"
        >
          <el-table-column type="selection" width="55" v-if="showHint"></el-table-column>
          <el-table-column align="center" label="商户编号" prop="no" min-width="100"></el-table-column>
          <el-table-column align="center" label="商户类型"  min-width="80" >
            <template slot-scope="props">
              {{companyTypeShow(props.row.companyType)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="商户名称" prop="name" min-width="120"></el-table-column>
          <el-table-column align="center" label="商户地址" prop="address" show-overflow-tooltip min-width="100" ></el-table-column>
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
                <el-form-item label="商户法人：" label-width="110px">
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
                <el-form-item label="商户主营业务：" label-width="110px">
                  <span>{{props.row.summary}}</span>
                </el-form-item>
                <el-form-item label="上级商户：" label-width="110px">
                  <span>{{props.row.parentCompanyName}}</span>
                </el-form-item>
                <el-form-item label="银行账号名：" label-width="110px">
                  <span>{{props.row.accountName}}</span>
                </el-form-item>
                <!--<el-form-item label="商户状态：" label-width="110px">-->
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
                <el-form-item label="商户ID：" label-width="110px">
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
          <el-table-column align="center" label="操作" width="160">
            <template slot-scope="props">
              <span class="button"  :class="props.row.auditFlag=='待审核'?null:'disable'" @click="props.row.auditFlag=='待审核'?audit({id:props.row.id,type:1}):null">审核通过</span>
              <span class="button"  :class="props.row.auditFlag=='待审核'?null:'disable'"  @click="props.row.auditFlag=='待审核'?audit({id:props.row.id,type:2}):null">审核不通过</span>
              <!--<span class="button" @click="$router.push({name:'MerchantUpdate',params:{data:props.row}})">编辑</span>-->
              <!--<span class="button" @click="deleteMerchant(props.row.id)">删除</span>-->
              <!--<el-dropdown @command="handleCommand">-->
                <!--<span class="el-dropdown-link">-->
                  <!--审核<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                <!--</span>-->
                <!--<el-dropdown-menu slot="dropdown">-->
                  <!--<el-dropdown-item :command="{id:props.row.id,type:1}">审核通过</el-dropdown-item>-->
                  <!--<el-dropdown-item :command="{id:props.row.id,type:2}">审核失败</el-dropdown-item>-->
                <!--</el-dropdown-menu>-->
              <!--</el-dropdown>-->
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
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <img v-if="picURl" :src="picURl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js';
  import GetCompany from '@/common/GetCompany';
  import ReadArea from '@/common/ReadArea'
  export default{
    components:{
      GetCompany,
      ReadArea
    },
    data(){
      return {
        off:true,
        session:sessionStorage.getItem('session'),
        formData:{

        },
        showHint:false,
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
        multipleSelection:[],
        flag: null,
        staffAreaId:sessionStorage.getItem("areaId"),
        staffCityId:sessionStorage.getItem("cityId"),
        staffProvinceId:sessionStorage.getItem("provinceId"),
        loading:false
      }
    },
    methods:{
      handleCurrentChange(val){
        this.pageNum=val;
        this.expands= [],
          this.getCompanys();
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
        var obj={
          pageInfo:{
            pageSize:10,
            pageNum:vm.pageNum
          },
//          enableFlag:1,
          companyTypes:'1,2,3,5,6,7',
          auditFlagIn: vm.flag,
          areaId:vm.staffAreaId,
          cityId:vm.staffCityId,
//          provinceId:vm.staffProvinceId,
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
                vm.loading=false;
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
      audit(command) {//下拉菜单选项
//        this.$message('click on item ' + command);
//          console.log(command);
        var vm=this;
        var text=null;
        if(command.type==1){
            text='通过'
        }else{
            text='不通过'
        }
        this.$confirm('是否让该商户'+text+'审核','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
          }).then(()=>{
          var get=new RemoteCall();
          get.init({
            router:'/company/update',
            session:vm.session,
            data:{
              id:command.id,
              auditFlag:command.type
            },
            callback:function(data){
//                console.log(data);
              if(data.ret.errorCode===0){
                vm.$message({
                  type: 'success',
                  message: '操作成功'
                })
                vm.getCompanys();
              }else{
                vm.$message({
                  type: 'info',
                  message: '操作失败'
                })
                vm.getCompanys();
              }
            }
          })
        })

      },
      deleteMerchant(id){
        var vm=this;
        this.$confirm('此操作将永久删除该商户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var del=new RemoteCall();
          del.init({
            router:'/company/delete',
            session:vm.session,
            data:{
              id:id
            },
            callback:function(data){
              if(data.ret.errorCode===0){
                vm.$message({
                  type:'success',
                  message:'删除成功'
                })
                vm.getCompanys();
              }else{
                vm.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
            companyName:companyName,

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
                  confirmButtonTextL: '确定',
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
      handleSelectionChange(val){//多项选择审核
        this.multipleSelection = val;

      },
      examine(){
        this.showHint=!this.showHint;
        this.$refs.multipleTable.clearSelection();
      },
      approve(flag){//批量审核
        var vm=this;
        for(var i=0;i<vm.multipleSelection.length;i++){
            if(vm.multipleSelection[i].auditFlag!='待审核'){
                vm.$alert('只能选择待审核的进行批量审核','提示');
                return
            }
        }
        vm.multipleSelection.forEach(function(item,i){
          var update=new RemoteCall();
          update.init({
            router:'/company/update',
            session:vm.session,
            data:{
              id:item.id,
              auditFlag:flag
            },
            callback:function(data){
              if(i>=vm.multipleSelection.length-1){
                vm.$nextTick(function(){
                  vm.$alert('操作成功','提示',{
                    confirmButtonTextL: '确定',
                    callback:function(){
                      vm.showHint=!vm.showHint;
                      vm.$refs.multipleTable.clearSelection();
                      vm.getCompanys();
                    }
                  })
                })
              }
            }
          })
        })
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
            return '一般商户';
            break;
          case 7 :
            return '卫计局';
            break;
          default :
              return '未知';
        }
      }
    },
    mounted:function(){
      this.getCompanys();
      this.off=false;
    }
  }
</script>
<style lang="scss">
  #MerchantAudit{
    background: #fff;
    .el-input{
      width:280px;
    }
    .el-button{
      width:100px;
      margin-left:15px;
    }
    .form-wrap{
      padding:20px 20px 10px;
      border-bottom:1px solid #e8e8e8;
    }
    .table-wrap{
      padding:10px 20px;
    }
    .tool-button{
      .addMerchant{
        background: #1890FF;
        color: #fff;
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
          font-size: 12px;
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
    .el-dropdown-link{
      color:#1890ff;
      font-size:12px;
      cursor: pointer;
    }
    .el-dropdown{
      display: inline-block;
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
    .el-button{
      font-size:12px;
    }
    .hint{
      margin-top:20px;
      height:38px;
      width:100%;
      border:1px solid #91d5ff;
      background: #e6f7ff;
      border-radius:5px;
      margin-bottom:10px;
      line-height: 38px;
      font-size:12px;
      padding-left:16px;
      .info{
        color: #1890ff;
        margin-right: 8px;
      }
      .clear{
        text-decoration: none;
      }
      .num{
        font-weight:bold;
        font-size:14px;
        color: #1890ff;
      }
      .first{
        margin-left:10px;
      }
    }
    .disable{
      color: #ccc;
      cursor: no-drop;
    }
  }
</style>
