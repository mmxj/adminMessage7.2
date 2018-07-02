<template>
  <div id="MerchantChannelUpdate">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separatorClass="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/merchant'}">商户管理</el-breadcrumb-item>
        <el-breadcrumb-item><span @click="$router.push({name:'MerchantChannelList',params:{data:start}})">管理支付渠道</span></el-breadcrumb-item>
        <el-breadcrumb-item>编辑支付渠道</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <el-form :inline="true" :model="formData" labelWidth="120px">
        <el-form-item label="支付渠道名称：">
           <span>{{formData.channelName}}</span>
        </el-form-item>
        <el-form-item v-if="startData.payChannelTypeId==3" label="收款码：">
          <el-input size="small" v-model="qr.qrNo"></el-input>
        </el-form-item>
        <el-form-item v-if="startData.payChannelTypeId==3" label="收款码图片：">
          <div class="upload-wrap" ref="uploadPic"  @mouseenter="qr.show=true" @mouseleave="qr.show=false">
            <el-upload
              class="avatar-uploader"
              :http-request="upload"
              action=""
              :data="{qr:qr}"
              :on-change="imgChange"
              :show-file-list="false"
            >
              <img v-if="qr.imageUrl" :src="qr.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="upload-tool" v-if="qr.imageUrl&&qr.show">
              <i class="el-icon-zoom-in" @click="bigPic(qr)"></i>
              <!--<i class="el-icon-refresh" @click="uploadClick"></i>-->
              <i class="el-icon-delete"  @click="deletePic(qr)"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="证书密码：" v-if="startData.payChannelTypeId==2" >
          <el-input size="small" v-model="payCer.payCerPassword "></el-input>
        </el-form-item>
        <el-form-item label="证书路径：" v-if="startData.payChannelTypeId==2">
          <el-upload
            class="upload-demo"
            action=""
            :data="{payCer:payCer}"
            :file-list="flieList"
            :http-request="uploadPay"
            :on-change="fileChange"
          >
            <el-button size="small" type="primary">选择证书</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="' '">
          <div style="width:280px;">
            <el-button size="small" style="width: 100px" @click="update">修改</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <img v-if="picURl" :src="picURl" alt="">
    </el-dialog>

  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default{
      data(){
          return{
            start:null,
            startData:{
              payChannelTypeId:null
            },
            formData:{

            },
            qr:{
              show:false
            },
            imgUrl:null,
            picURl:null,
            dialogTableVisible:false,
            payCer:{},
            flieList:[],
            session:sessionStorage.getItem('session')
          }
      },
      methods:{
        imgChange(file,fileList){
          this.imgUrl=file.url;
        },
        bigPic(obj){//查看大图
          this.dialogTableVisible=true;
          this.picURl=obj.imageUrl;
        },
        deletePic(obj){
          obj.imageUrl=null;
        },
        upload(param){
          var vm=this;
          var fileObj=param.file;
          var FileComtroller="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
          var form=new FormData();
          form.append('file',fileObj);
          form.append('upload_type','3');
          form.append('id',this.startData.companyId);
          vm.$http.post(FileComtroller,form,{"Content-Type":'multipart/form-data'}).then(function(data){
            if(data.data.ret===0){
              param.data.qr.qrPath=data.data.data[0].saved_file;
              vm.$set(param.data.qr,'imageUrl',vm.imgUrl);

            }
          },function(data){
            alert('失败');
          })
        },
        fileChange(file,fileList){
          this.flieList=[];
          this.$nextTick(()=>{
            this.flieList=[
              {
                name:file.name
              }
            ];
          })
        },
        uploadPay(param){
          var vm=this;
          var fileObj=param.file;
          var FileComtroller="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
          var form=new FormData();
          form.append('file',fileObj);
          form.append('upload_type','6');
          form.append('id',this.startData.companyId);
          vm.$http.post(FileComtroller,form,{"Content-Type":'multipart/form-data'}).then(function(data){
            if(data.data.ret===0){
              param.data.payCer.payCerPath=data.data.data[0].saved_file;
            }
          },function(data){
            alert('失败');
          })
        },
        getPic(){//qr  type=3  parCer type=6
            var vm=this;
            var src=null;
            $.ajax({
              url:'http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download_base64.do',
              type:'post',
              async:false,
              data:{
                  download_type:3,
                  file_name:vm.startData.qrPath,
                  id:vm.startData.companyId
              },
              success:function(res){
                  if(res){
                    vm.$set(vm.qr,'imageUrl','data:image/png;base64,'+ JSON.parse(res).data);
                  }
              }
            });

        },
        update(){
            var vm=this;
            var upDateData={}
          if(this.formData.payChannelTypeId==2){
            this.formData.payCerPassword=this.payCer.payCerPassword;
            this.formData.payCerPath=this.payCer.payCerPath;
          }else{
            this.formData.payCerPassword=null;
            this.formData.payCerPath=null;
          }
          if(this.formData.payChannelTypeId==3){
            this.formData.qrNo=this.qr.qrNo;
            this.formData.qrPath=this.qr.qrPath;
          }else{
            this.formData.qrNo=null;
            this.formData.qrPath=null;
          }
          upDateData.id=vm.formData.id;
          upDateData.payCerPassword=vm.payCer.payCerPassword;
          upDateData.payCerPath=vm.payCer.payCerPath;
          upDateData.qrNo=vm.qr.qrNo;
          upDateData.qrPath=vm.qr.qrPath;
          upDateData.enableFlag=1;
          upDateData.companyId=vm.formData.companyId;
          upDateData.merchantName=vm.formData.merchantName;
          upDateData.merchantNo=vm.formData.merchantNo;
          upDateData.mccNo=vm.formData.mccNo;
          upDateData.payChannelTypeId=vm.formData.payChannelTypeId;
          upDateData=unit.removeEmptyString(upDateData);
          var update=new RemoteCall();
            update.init({
              router:'/base/payChannel/update',
              session:vm.session,
              data:upDateData,
              callback:function(data){
                  console.log(data);
                  if(data.ret.errorCode===0){
                      vm.$alert('修改成功',{
                          callback:function(){
                              vm.$router.push('/merchantchannellist')
                          }
                      })
                  }
              }
            })
        }
      },
      mounted:function(){
        if(!this.$route.params.data){
          this.$router.push('/merchantchannellist');
          return
        }
        this.startData=this.$route.params.data;
        this.formData=this.startData;
        this.qr.qrNo=this.startData.qrNo;
        this.qr.qrPath=this.startData.qrPath;
        this.getPic();
        this.payCer.payCerPassword=this.startData.payCerPassword;
        this.payCer.payCerPath=this.startData.payCerPath;
        this.flieList=[
          {
            name:this.startData.payCerPath
          }
        ];
        this.start=this.$route.params.start;
      }
  }
</script>
<style lang="scss">
  #MerchantChannelUpdate{
    background: #fff;
    min-height: 600px;
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
    .form-wrap{
      position: relative;
      display: block;
      margin:0 auto;
      margin-top: 20px;
      width:600px;
      .el-input{
        width:400px;
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
      img{
        width:100%;
      }
    }
  }
</style>
