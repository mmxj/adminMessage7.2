<template>
  <div id="HealthStationAdd">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separatorClass="el-icon-arrow-right">
        <!--<el-breadcrumb-item :to="{path:'/healthstation'}">商户申请列表</el-breadcrumb-item>-->
        <el-breadcrumb-item>添加卫生站</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <el-form class="form" :inline="true" :model="formData" :rules="rules"  ref="ruleForm" >
        <el-form-item label="卫生站编号：" label-width="130px" prop="no">
          <el-input size="small" v-model="formData.no"></el-input>
        </el-form-item>
        <el-form-item label="卫生站名称：" label-width="130px" prop="name">
          <el-input size="small" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="所属区域：" label-width="130px" prop="area">
          <div class="area">
            <Province :propdata="formData" :noall="true"></Province>
          </div>
        </el-form-item>
        <el-form-item label="卫生站联系人：" label-width="130px" prop="leaderName">
          <el-input size="small" v-model="formData.leaderName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="130px" prop="telephone">
          <el-input size="small" v-model="formData.telephone"></el-input>
        </el-form-item>
        <el-form-item label="银行账号名：" label-width="130px" prop="accountName">
          <el-input size="small" v-model="formData.accountName"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" label-width="130px" prop="account">
          <el-input size="small" v-model="formData.account"></el-input>
        </el-form-item>

        <!--<el-form-item label="商户类型：" label-width="120px" prop="companyTypeId">-->
          <!--<div class="select">-->
            <!--<el-select v-model="formData.companyTypeId" clearable size="small">-->
              <!--<el-option v-for="item in companyType"  :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</div>-->
        <!--</el-form-item>-->
        <el-form-item label="卫生站法人：" label-width="130px" prop="corporation">
          <el-input size="small" v-model="formData.corporation" ></el-input>
        </el-form-item>
        <el-form-item label="卫生站终端：" label-width="130px">
          <el-input size="small" v-model="formData.terminalNo"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" label-width="130px" prop="certificateNo">
          <el-input size="small" v-model="formData.certificateNo"></el-input>
        </el-form-item>


        <el-form-item label="卫生站地址：" label-width="130px" prop="address">
          <el-input size="small" v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱：" label-width="130px" prop="email">
          <el-input size="small" v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="上级卫生院：" label-width="130px">
          <!--<el-input size="small"  v-model="formData.parentCompanyId"></el-input>-->
          <GetCompany :data="company"></GetCompany>
        </el-form-item>
        <el-form-item label="收单机构：" label-width="130px">
          <el-input size="small"></el-input>
        </el-form-item>
        <!--<el-form-item label="主营业务：" label-width="120px">-->
        <!--<el-input size="small"  v-model="formData.summary"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="upPic">
      <el-form inline label-position="top">
        <el-form-item v-for="item in imgData" :label="item.certificateTypeName" class="pic" :key="item.id">
          <div class="upload-wrap" ref="uploadPic"  @mouseenter="item.show=true" @mouseleave="item.show=false">
            <el-upload
              class="avatar-uploader"
              :http-request="upload"
              action=""
              :data="{item:item}"
              :on-change="imgChange"
              :show-file-list="false">
              <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="upload-tool" v-if="item.imageUrl&&item.show">
              <i class="el-icon-zoom-in" @click="bigPic(item)"></i>
              <!--<i class="el-icon-refresh" @click="uploadClick"></i>-->
              <i class="el-icon-delete"  @click="deletePic(item)"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-button">
      <el-button size="small" @click="submit">确认</el-button>
      <el-button size="small" class="other-button" @click="$router.push('/healthstation')">关闭</el-button>
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <img v-if="picURl" :src="picURl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import Province from '@/common/Province';
  import GetCompany from '@/common/GetCompany';
  import unit from '@/unit/unit.js'
  export default{
    components:{
      Province,
      GetCompany
    },
    data(){
      return {
        session:sessionStorage.getItem('session'),
        company:{},
        dialogTableVisible:false,
        picURl:false,
        companyType:[
          {
            value:1,
            label:'收单机构'
          },{
            value:2,
            label:'支付通道机构'
          },{
            value:3,
            label:'社保局'
          },{
            value:5,
            label:'药店'
          },{
            value:6,
            label:'一般商户'
          },{
            value:7,
            label:'卫计局'
          }
        ],
        rules:{
          no:[{required:true,message: '卫生站编号不能为空',trigger:'blur'}],
          name:[{required:true,message: '卫生站名称不能为空',trigger:'blur'}],
//          leaderName:[{required:true,message: '联系人不能为空',trigger:'blur'}],
//          telephone:[{required:true,message: '联系电话不能为空',trigger:'blur'}],
//          accountName:[{required:true,message: '银行账号名不能为空',trigger:'blur'}],
//          account:[{required:true,message: '银行账号不能为空',trigger:'blur'}],
//          corporation:[{required:true,message: '卫生站法人不能为空',trigger:'blur'}],
          area:[{required:true,message: '所属区域不能为空',trigger:'blur'}],
//          address:[{required:true,message: '卫生站地址不能为空',trigger:'blur'}],
//          certificateNo:[{required:true,message: '身份证号码不能为空',trigger:'blur'}],
        },
        imgData:[
          {
            certificateTypeName:'营业执照：',
            isPersonal:0,
            certificateType:1,
            show:false

          },
//              {
//                certificateTypeName:'从业资格证：',
//                isPersonal:0,
//                certificateType:1,
//                show:false
//              },
          {
            certificateTypeName:'身份证正面：',
            isPersonal:0,
            certificateType:1,
            show:false
          },{
            certificateTypeName:'身份证反面：',
            isPersonal:0,
            certificateType:1,
            show:false
          }
        ],
        formData:{
          certificateList:[],
          code:'1',
          companyTypeId:4,
          auditFlag:1,
          enableFlag:1
        },
        startData:{
          certificateList:[],
          code:'1',
          companyTypeId:4,
          auditFlag:1,
          enableFlag:1
        },
        imgUrl:null
      }
    },
    methods:{
      handleAvatarSuccess(res, file,fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      upload(param){
        var vm=this;
//          console.log(param)
        var fileObj = param.file;
//          console.log(this.imgUrl);
        var FileComtroller = "http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
        var form=new FormData();
        form.append('file',fileObj);
        form.append('upload_type','4');
        vm.$http.post(FileComtroller,form,{"Content-Type":'multipart/form-data'}).then(function(data){
          if(data.data.ret===0){
            param.data.item.picSavePath=data.data.data[0].saved_file;
            vm.$set(param.data.item,'imageUrl',vm.imgUrl)
          }
        },function(data){
          alert('失败');
        })

      },
      imgChange(file,fileList){
        this.imgUrl=file.url;
      },
      submit(){
        var vm=this;
        vm.formData.certificateList=[];
        vm.formData.certificateType=1;
        vm.imgData.forEach(function(item){
          if(item.imageUrl){
            vm.formData.certificateList.push(item);
          }
        })
        if(this.company.name){
          vm.formData.parentCompanyId=this.company.id;
        }
        var regArr=[
          {type:1,name:vm.formData.no,text:'卫生站'},
          {type:2,name:vm.formData.leaderName,text:'卫生站联系人'},
          {type:2,name:vm.formData.corporation,text:'卫生站法人'},
          {type:3,name:vm.formData.telephone},
          {type:4,name:vm.formData.account},
          {type:5,name:vm.formData.email},
        ]
        if(!this.regName(regArr))return;
        vm.formData=unit.removeEmptyString(vm.formData);
        if(vm.formData.no==null){this.$alert('卫生站编号不能为空');return}
        if(vm.formData.name==null){this.$alert('卫生站名称不能为空');return}
//        if(vm.formData.leaderName==null){this.$alert('卫生站联系人不能为空');return}
//        if(vm.formData.telephone==null){this.$alert('卫生站联系电话不能为空');return}
//        if(vm.formData.accountName==null){this.$alert('银行账号名不能为空');return}
//        if(vm.formData.account==null){this.$alert('银行账号不能为空');return}
//        if(vm.formData.corporation==null){this.$alert('卫生站法人不能为空');return}
//        if(vm.formData.certificateNo==null){this.$alert('身份证号码不能为空');return}
        if(vm.formData.areaId==null){this.$alert('请选择归属区域');return}
//        if(vm.formData.address==null){this.$alert('卫生站地址不能为空');return}
        var add = new RemoteCall();
        add.init({
          router:'/company/add',
          session:vm.session,
          data:vm.formData,
          callback:function(data){
            if(data.ret.errorMessage=='success'){
              vm.$alert('卫生站添加成功','提示',{
                confirmButtonTextL:'确定',
                callback:function(){
                  vm.formData={};
                  vm.company={};
                  for(var item in vm.startData){
                    vm.formData[item]=vm.startData[item]
                  }
                  vm.imgData.forEach(function(item){
                    item.imageUrl=null;
                  })
                }
              })
            }else{
              if(data.ret.errorMessage=='name重复'){
                vm.$alert('卫生站名已存在','提示', {
                  confirmButtonTextL: '确定',
                })
              }else{
                vm.$alert('申请发生错误，请联系工作人员','提示', {
                  confirmButtonTextL: '确定',
                })
              }

            }
          }
        })
      },
      deletePic(obj){
        obj.imageUrl=null;

      },
      bigPic(obj){//查看大图
        this.dialogTableVisible=true;
        this.picURl=obj.imageUrl;
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
      }
    },

  }
</script>
<style lang="scss">
  #HealthStationAdd{
    background: #fff;
    .breadcrumb{
      padding: 10px;
      border-bottom:1px solid #e8e8e8;
      span{
        display: inline-block;
        font-size:14px;
        vertical-align: middle;
      }
      .el-breadcrumb{
        vertical-align: middle;
        display: inline-block;
      }
    }

    .el-form-item__content{
      width:300px;
    }
    .form-wrap{
      padding: 30px;

      .form{
        padding-bottom:30px;
        border-bottom:1px solid #e8e8e8;
      }
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader{
      overflow: hidden;
      width:180px;
      height: 180px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      display: block;
    }
    .upPic{
      .el-form-item{
        padding-left:30px;
      }

    }
    .el-button{
      width: 100px;
    }
    .submit-button{
      margin-top:20px;
      padding-bottom:100px;
      text-align: center;
    }
    .select{
      width: 100%;
      .el-select{
        width: 100%;
      }
    }
    .pic{
      width:178px;
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
    .upload-wrap{
      position: relative;
      .upload-tool{
        position: absolute;
        width: 180px;
        height: 100%;
        background: rgba(0,0,0,0.5);
        top:0;
        left: 0;
        text-align:center;
        padding-top:130px;
        box-sizing: border-box;
        i{
          color: #fff;
          font-size: 24px;
          padding:0 5px;
          cursor: pointer;
        }
        i:hover{
          color:#1890ff
        }
      }
    }
  }
</style>
