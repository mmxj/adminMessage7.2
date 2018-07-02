<template>
  <div id="MerchantAdd">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separatorClass="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/merchantlist'}">商户申请列表</el-breadcrumb-item>
        <el-breadcrumb-item>商户修改</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <el-form  class="form" :inline="true">
        <el-form-item label="商户编号：" label-width="120px">
          <el-input size="small" v-model="formData.no"></el-input>
        </el-form-item>
        <el-form-item label="商户名称：" label-width="120px">
          <el-input size="small" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="商户联系人：" label-width="120px">
          <el-input size="small" v-model="formData.leaderName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="120px">
          <el-input size="small" v-model="formData.telephone"></el-input>
        </el-form-item>
        <el-form-item label="银行账号名：" label-width="120px">
          <el-input size="small" v-model="formData.accountName"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" label-width="120px">
          <el-input size="small" v-model="formData.account"></el-input>
        </el-form-item>
        <el-form-item label="收单机构：" label-width="120px">
          <el-input size="small"></el-input>
        </el-form-item>
        <el-form-item label="商户类型：" label-width="120px">
          <!--<el-input size="small"  v-model="formData.companyTypeId"></el-input>-->
          <div class="select">
            <el-select v-model="formData.companyTypeId" clearable size="small">
              <el-option v-for="item in companyType"  :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="商户法人：" label-width="120px">
          <el-input size="small" v-model="formData.corporation"></el-input>
        </el-form-item>
        <el-form-item label="商户终端：" label-width="120px" prop="terminalNo">
          <el-input size="small" v-model="formData.terminalNo"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱：" label-width="120px">
          <el-input size="small" v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="所属区域：" label-width="120px">
          <div class="area">
            <Province :propdata="formData"></Province>
          </div>
        </el-form-item>
        <el-form-item label="商户地址：" label-width="120px">
          <el-input size="small" v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="上级卫生院：" label-width="120px">
          <!--<el-input size="small"  v-model="formData.parentCompanyId"></el-input>-->
          <GetCompany :data="company"></GetCompany>
        </el-form-item>
        <el-form-item label="主营业务：" label-width="120px">
          <el-input size="small"  v-model="formData.summary"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="upPic">
      <el-form inline label-position="top">
        <el-form-item  v-for="(item,index) in imgData" :label="item.certificateTypeName" class="pic" :key="item.id">
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
    <div class="submit-button" >
      <el-button size="small" @click="submit">确认</el-button>
      <el-button size="small" class="other-button" @click="$router.push('/merchantlist')">关闭</el-button>
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
        dialogTableVisible:false,
        picURl:false,
        company:{},
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
        imgData:[
          {
            certificateTypeName:'营业执照：',
            isPersonal:0,
            certificateType:1,
            show:false
          },{
            certificateTypeName:'从业资格证：',
            isPersonal:0,
            certificateType:1,
            show:false
          },{
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
          auditFlag:0
        },
        startData:{
          certificateList:[],
          code:'1',
          auditFlag:0
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
//                  console.log(vm.imgUrl);
//                  param.data.item.imageUrl=vm.imgUrl;

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
        vm.imgData.forEach(function(item){//
          if(item.imageUrl){
              if(item.picSavePath){
                vm.formData.certificateList.push(item);
              }
          }
        })
        vm.formData.certificateList.forEach(function(item){
            item.imageUrl=null
        })
        if(this.company.name){
          vm.formData.parentCompanyId=this.company.id;
        }
        var regArr=[
          {type:1,name:vm.formData.no},
          {type:2,name:vm.formData.leaderName,text:'商户联系人'},
          {type:2,name:vm.formData.corporation,text:'商户法人'},
          {type:3,name:vm.formData.telephone},
          {type:4,name:vm.formData.account},
          {type:5,name:vm.formData.email},
        ]
        if(!this.regName(regArr))return;

        vm.formData=unit.removeEmptyString(vm.formData);
        var add = new RemoteCall();
        add.init({
          router:'/company/update',
          session:vm.session,
          data:vm.formData,
          callback:function(data){
            if(data.ret.errorMessage=='success'){
              vm.$alert('修改成功','提示',{
                confirmButtonTextL:'确定',
                callback:function(){
                  vm.$router.push('/merchantlist')
                }
              })
            }else{
                vm.$alert('修改过程中发生错误，请联系工作人员','提示', {
                  confirmButtonTextL: '确定',
                })
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
      getCertificatePic(name){
          var vm=this;
          var getPic=new RemoteCall();
          getPic.init({
            router:'/company/certificate/get',
            session:vm.session,
            data:{
                pageInfo:{
                    pageSize:100,
                    pageNum:1
                },
                companyName:name
            },
            callback:function(data){
              if(data.ret.errorCode===0){
                data.rows.forEach(function(item){
                  item.picSavePath=item.certificatePic;
                  if(item.certificateTypeName=='营业执照：'||item.certificateTypeName=='从业资格证：'||item.certificateTypeName=='身份证正面：'||item.certificateTypeName=='身份证反面：'){
                      vm.formData.certificateList.push(item);
                      vm.readpic(item)
                  }
                })
              }
            }
          })
      },
      readpic(pic){//读取图片链接放置在标签上
        var vm=this;
        $.ajax({
          url: "http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download_base64.do",
          type: 'post',
          data: {
            'download_type': '4',
            'file_name': pic.certificatePic,
            'id': '0'
          },
          success: function (res) {
              if(res){
                var picURl='data:image/png;base64,' +JSON.parse(res).data;
                for(var i=0;i<vm.imgData.length;i++){
                  if(vm.imgData[i].certificateTypeName==pic.certificateTypeName){
                    vm.$set(vm.imgData[i],'imageUrl',picURl);
                    vm.$set(vm.imgData[i],'picSavePath',pic.certificatePic)
                  }
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
    mounted:function(){
      if(!this.$route.params.data){
        this.$router.push('/merchantlist')
        return
      }
//      item.auditFlag=vm.auditStatus(item.auditFlag);

      this.formData=this.$route.params.data;
      this.formData.companyTypeId=this.formData.companyType;
      this.formData.auditFlag=0;
      this.formData.certificateList=[];
      this.getCertificatePic(this.formData.name);
    },
  }
</script>
<style lang="scss">
  #MerchantAdd{
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
    .el-dialog{
      width:600px;
      img{
        width:100%;
      }
      .el-dialog__body{
        padding-top:20px
      }
    }
  }
</style>
