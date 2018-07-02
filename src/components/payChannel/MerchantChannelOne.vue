<template>
  <div id="MerchantChannelOne">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separatorClass="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/merchant'}">商户管理</el-breadcrumb-item>
        <el-breadcrumb-item>配置渠道</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="merchantMessage">
        <div class="messageBox">
          <span class="messageBox-title"><i class="icon el-icon-info"></i>商户信息</span>
          <br>
          <span>商户编号：</span>
          <span class="merchant">{{startData.no}}</span>
          <span>商户名称：</span>
          <span class="merchant">{{startData.name}}</span>
          <span>已配置支付渠道：</span>
          <span class="merchant">{{channelName?channelName:'无'}}</span>
          <br>
          <div class="form1" v-if="startData.terminalNo">
            <span>商户终端：</span>
            <span class="merchant">{{startData.terminalNo}}</span>
          </div>
          <div class="form1" v-else>
            <div v-if="showAdd">
              <span>商户终端：</span>
              <span class="button" @click="showAdd=!showAdd">添加</span>
            </div>
            <el-form v-else  :inline="true" :model="formData2"  >
              <el-form-item label="商户终端：">
                <el-input size="mini" v-model="formData2.terminalNo"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" @click="upDateTerminalNo">确定</el-button>
                <el-button size="mini" class="other-button"  @click="showAdd=!showAdd">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
    </div>
    <div class="forms">
      <div class="form-tab">
        <div class="tab" :class="app?null:'tab-active'" @click="app=false;status=1">支付渠道配置 <i></i></div>
        <div class="tab" :class="app?'tab-active':null" @click="appSet">APP端渠道配置 <i></i></div>
      </div>
      <div class="form-box">
        <div class="steps" >
          <el-steps :active="status" align-center v-if="status!=3">
            <el-step title="选择配置终端编号"></el-step>
            <el-step title="配置支付渠道"></el-step>
          </el-steps>
        </div>
        <el-form v-if="status==3" :model="formData" label-width="155px">
          <el-form-item label="可配置支付渠道：">
            <el-select size="small" v-model="formData.payChannelTypeId" placeholder="请选择">
              <el-option v-for="item in channelOptions2" :label="item.channelName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form v-if="status==2" :model="formData" label-width="155px">
          <el-form-item label="可配置支付渠道：">
            <el-select size="small" v-model="formData.payChannelTypeId" placeholder="请选择">
              <el-option v-for="item in channelOptions" :label="item.channelName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.payChannelTypeId==3" label="收款码：">
            <el-input size="small" v-model="qr.qrNo"></el-input>
          </el-form-item>
          <el-form-item v-if="formData.payChannelTypeId==3"  label="收款码图片：">
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
          <el-form-item v-if="formData.payChannelTypeId==2" label="证书密码：">
            <el-input size="small" v-model="payCer.payCerPassword "></el-input>
          </el-form-item>
          <el-form-item v-if="formData.payChannelTypeId==2" label="证书路径：">
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

        </el-form>
        <div class="channel-box" v-if="status==1">
          <div class="left">*请选择配置的终端编号：</div>
          <div class="right">
            <div class="radio-box">
              <el-radio v-for="item in terArr" v-model="radio" :label="item.terminalNo" :key="item.id" @change="radioChange">终端编号：{{item.terminalNo}}</el-radio>
            </div>
          </div>
        </div>
        <div class="button-box" v-if="status==1">
          <el-button size="small" @click="next">下一步</el-button>
          <el-button size="small" @click="$router.push('/merchant')" class="other-button">关闭</el-button>
        </div>
        <div class="button-box" v-if="status==2||status==3">
          <el-button size="small" @click="submitMerchant">提交</el-button>
          <el-button size="small" class="other-button"  @click="app=false;status=1">取消</el-button>
        </div>
      </div>
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
          formData:{
            enableFlag:1
          },
          formData2:{},
          status:1,
          radio:null,
          startData:{},
          session:sessionStorage.getItem('session'),
          terArr:[],
          channelOptions:[],
          channelOptions2:[],
          imgUrl:null,
          qr:{
              show:false
          },
          picURl:null,
          dialogTableVisible:false,
          flieList:[],
          payCer:{},
          channelName:null,
          hasApp:false,
          app:false,
          hasChannel:[],
          upStatus:true,
          showAdd:true,
        }
      },
      methods:{
        getTerminal(){
            var vm=this;
            var get=new RemoteCall();
            get.init({
              router:'/base/terminal/get',
              session:vm.session,
              data:{
                companyId:vm.startData.id,
                auditFlagIn:'1',
              },
              callback:function(data){
                  if(data.ret.errorCode===0){
                    if(data.rows.length==0){
                        vm.$alert('查询不到该商户的终端信息，请先添加',{
                            callback:function(){
                                vm.$router.push('/merchant');
                                return
                            }
                        })
                    }
                    vm.terArr=[];
                    data.rows.forEach(function(item,i){
                      vm.terArr[i]=item;
                    })

                  }
              }
            })
        },
        next(){ //下一步
          if(this.radio!=null){
            this.formData.terminalNo=this.radio;
            this.status=2;
//            this.formData.payChannelTypeId='';
            this.$set(this.formData,'payChannelTypeId',null);
          }else{
              this.$alert('请选择终端号');
              return;
          }

        },
        check(id){
            for(var i=0;i<this.channelOptions.length;i++){
                if(this.channelOptions[i].id==id){
                    return this.channelOptions[i].channelName
                }
            }
//            this.channelOptions.forEach(function(item.))
        },
        submitMerchant(){
          var vm=this;
          if(this.upStatus){
            this.upStatus=false;
            if(this.terArr[0]){
              var merchantNo=this.terArr[0].merchantNo
              var merchantName=this.terArr[0].merchantName
            }
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
            vm.formData.merchantName=merchantName;
            vm.formData.merchantNo=merchantNo;
            vm.formData.companyId=this.startData.id;
            vm.formData=unit.removeEmptyString(vm.formData);
            if(vm.formData.payChannelTypeId==null){
              this.$alert('请选择支付渠道');
              return
            }
            var set=new RemoteCall();
            set.init({
              router:'/base/payChannel/add',
              session:vm.session,
              data:vm.formData,
              callback:function(data){
                if(data.ret.errorCode===0){
                  vm.$alert('配置成功',{
                    callback:function(){
                      vm.upStatus=true;
                      vm.$router.push('/merchant');
                    }
                  })
                }else{
                  vm.$alert('配置失败'+data.ret.errorMessage,{
                    callback:function(){
                      vm.upStatus=true;
                    }
                  })
                }
              }
            })
          }
        },
        getChannel(){
          var vm=this;
          var get=new RemoteCall();
          get.init({
            router:'/base/payChannelType/get',
            session:vm.session,
            data:{
              pageInfo:{
                pageSize:10,
                pageNum:1
              }
            },
            callback:function(data){
              if(data.ret.errorCode===0){
                vm.channelOptions=[];
                data.rows.forEach(function(item,i){
                  var off=true
                  if(item.id==4){
                      off=false;
                       vm.channelOptions2.push(item);
                  }
                  if(off){
                    vm.channelOptions.push(item);
                  }
                })
              }
            }
          })
        },
        imgChange(file,fileList){
          this.imgUrl=file.url;
        },
        upload(param){
            var vm=this;
            var fileObj=param.file;
            var FileComtroller="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
            var form=new FormData();
            form.append('file',fileObj);
            form.append('upload_type','3');
            form.append('id',this.startData.id);
            vm.$http.post(FileComtroller,form,{"Content-Type":'multipart/form-data'}).then(function(data){
              if(data.data.ret===0){
                param.data.qr.qrPath=data.data.data[0].saved_file;
                vm.$set(param.data.qr,'imageUrl',vm.imgUrl)
              }
            },function(data){
              alert('失败');
            })
        },
        bigPic(obj){//查看大图
          this.dialogTableVisible=true;
          this.picURl=obj.imageUrl;
        },
        deletePic(obj){
          obj.imageUrl=null;
        },
        uploadPay(param){
          var vm=this;
          var fileObj=param.file;
          var FileComtroller="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
          var form=new FormData();
          form.append('file',fileObj);
          form.append('upload_type','6');
          form.append('id',this.startData.id);
          vm.$http.post(FileComtroller,form,{"Content-Type":'multipart/form-data'}).then(function(data){
            if(data.data.ret===0){
              param.data.payCer.payCerPath=data.data.data[0].saved_file;
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
        getPay(){
            var vm=this;
            var get=new RemoteCall();
            get.init({
              router:'/base/payChannel/get',
              session:vm.session,
              data:{
                  companyId:this.startData.id
              },
              callback:function(data){
                  if(data.ret.errorCode===0){

                      data.rows.forEach(function(item){
                          if(item.payChannelTypeId==4){
                              vm.hasApp=true;
                              vm.hasChannel.push(item.channelName);
                              vm.channelName=vm.hasChannel.join();
                          }
                      });
                      vm.getChannel();
                  }
              }
            })
        },
        appSet(){
          if(this.hasApp){
            this.$alert('您已配置过app渠道了，无需再次配置');
          }else{
            this.app=true;
            this.status=3;
            this.formData.terminalNo=null;
            this.$set(this.formData,'payChannelTypeId','4');
          }
        },
        radioChange(no){
            var vm=this;
            var get=new RemoteCall();
            get.init({
              router:'/base/payChannel/get',
              session:vm.session,
              data:{
                terminalNo:no
              },
              callback:function(data){
                if(data.ret.errorCode===0){
                    var arr=vm.channelOptions;
                    vm.channelOptions=[];
                    if(vm.hasChannel[0]=='APP端支付'){
                      vm.hasChannel.splice(1,vm.hasChannel.length)
                    }else{
                      vm.hasChannel.splice(0,vm.hasChannel.length)
                    }
                    data.rows.forEach(function(item){
                        if(item.payChannelTypeId != 4){
                          var off=true
                          for(var i=0;i<vm.hasChannel.length;i++){
                              if(vm.hasChannel[i]==item.channelName){
                                  off=false;
                              }
                          }
                          if(off){
                            vm.hasChannel.push(item.channelName);
                          }

                         }

                        for(var i=0;i<arr.length;i++){
                            if(arr[i].channelName==item.channelName){
                                arr[i].new=true;
                            }
                        }
                    });
                    arr.forEach(function(item){
                        if(!item.new){
                            vm.channelOptions.push(item);
                        }
                    });

                    vm.channelName=vm.hasChannel.join();
                }
              }
            })

        },
        upDateTerminalNo(){
            var vm=this;
          this.formData2=unit.removeEmptyString(this.formData2)
            if(this.formData2.terminalNo){
                  var setTermin=new RemoteCall();
                  setTermin.init({
                    router:'/company/update',
                    session:vm.session,
                    data:{
                      id:this.startData.id,
                      terminalNo:this.formData2.terminalNo
                    },
                    callback:function(data){
                        if(data.ret.errorMessage=='success'){}
                          vm.$alert('添加商户终端成功','提示',{
                            confirmButtonTextL:'确定',
                            callback:function(){
                              vm.startData.terminalNo=vm.formData2.terminalNo;
                            }
                          })
                      }
                  })
            }
        }
      },
      mounted:function(){
          if(!this.$route.params.data){
              this.$router.push('/merchant');
              return
          }
        this.startData=this.$route.params.data;
//        this.startData.terminalNo=1111;
        this.getTerminal();
        this.getPay();
      }
  }
</script>
<style lang="scss">
  #MerchantChannelOne{
    font-size:14px;
    .form1{
      margin-top:20px;
      line-height:40px;
      color:#000;
      .el-form{
        height:40px;
      }
      .el-form-item__label{
        color: #000;
      }
    }
    .breadcrumb{
      padding: 10px;
      background: #fff;
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
    .merchantMessage{
      background: #fff;
      padding: 20px;
      text-align: center;
      .messageBox{
        padding-bottom:20px;
        display:inline-block;
        text-align: left;
        .messageBox-title{
          font-size:16px;
          display: inline-block;
          padding-bottom:30px;
        }
        .icon{
          color: #1890FF;
          font-size:14px;
          padding-right:8px;
        }
        .merchant{
          display: inline-block;
          min-width:200px;
        }
      }
    }
    .forms{
      min-height: 600px;
      background: #fff;
      margin-top:20px;
      /*padding:0 30px 0px;*/
      .form-tab{
        height:62px;
        line-height:62px;
        font-size:16px;
        color: #8c8c8c;
        text-align: center;
        border-bottom:1px solid #f0f1f5;
        margin-bottom: 40px;
        .tab{
          cursor: pointer;
          width: 140px;
          display:inline-block;
        }
        .tab-active{
          color: #1890ff;
          position: relative;
          i{
            position: absolute;
            bottom:-3px;
            left:50%;
            width: 96px;
            margin-left:-48px;
            height: 6px;
            background: #1890ff;
          }
        }
      }
      .form-box{
        width: 800px;
        margin:0 auto;
        .el-form{
          width: 600px;
          margin:0 auto;
          margin-top:60px;
          .el-select{
            width: 380px;
          }
          .el-button{
            margin-top: 10px;
          }
          .el-input{
            width: 380px;
          }
        }
        .steps{
          margin:0 auto;
          width: 600px;
        }
      }
    }
    .el-step__icon.is-text{
      vertical-align:top;
    }
    .channel-box{
      margin-top:20px;
      padding:10px 0;
      border-top:1px solid #eff1ef;
      border-bottom:1px solid #eff1ef;
      .left{
        width:390px;
        margin-right:10px;
        display: inline-block;
        text-align: right;
        vertical-align: top;
        line-height:40px;
      }
      .right{
        width:390px;
        vertical-align: top;
        display: inline-block;
        .title{
          display: inline-block;
          padding: 4px 8px;
          border-radius:3px;
          color: #595959;
          background:#e6f7ff;
          margin-bottom:10px;
        }
        .radio-box{
          max-height: 360px;
          width:250px;
          overflow: auto;
        }
        .el-radio{
          display: block;
          height:40px;
          margin:0;
          line-height:40px;

        }
      }
    }
    .button{
      color: #1890FF;
      text-decoration: underline;
      cursor: pointer;
    }
    .button-box{
      padding-top:30px;
      text-align: center;
      .el-button{
        width:100px;
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
    .el-dialog{
      img{
        width:100%;
      }
    }
  }
</style>
