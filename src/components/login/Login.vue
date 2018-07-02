<template>
  <div id="login" :style="{height:windowHeight}">
    <div class="login-wrap">

      <div class="login-box">
        <img :src="loginLogo" class="logo" alt="">
        <img :src="loginBg" alt="">
        <div class="form-wrap">
          <div class="login-title">登录运营管理后台系统</div>
          <el-form :model="formData" label-width="100px">
            <el-form-item label="登录账号：">
              <el-input size="small" v-model="formData.loginName"></el-input>
            </el-form-item>
            <el-form-item label="登录密码：">
              <el-input size="small" v-model="password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="验证码：">
              <template slot-scope="props">
                <el-input v-model="formData.validateCode" class="idcode" size="small" ref="validate" @keyup.enter.native="loginUp"></el-input>
                <img class="code"  :src="codeUrl" alt="" @click="getpic">
              </template>
            </el-form-item>

          </el-form>
          <el-button class="login" @click="loginUp">登录</el-button>
        </div>
      </div>
      <div class="bg-img">
        <img :src="bgImg" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default{
      data(){
          return{
              windowHeight:window.innerHeight +'px',
              bgImg:require('@/assets/img/536812115468005991.png'),
              loginBg:require('@/assets/img/102651232735025264.png'),
              formData:{
                deviceType:3,
                validateCodeId:null
              },
              codeUrl:null,
              password:null,
              loginLogo:require('@/assets/img/loginLogo.png')
          }
      },
      methods: {
          getpic(){
              var vm=this;
            var getCode = new RemoteCall();
            getCode.init({
              router:'/base/validatecode/picture/get',
              data:{
                "deviceType": 3,
                "validateCodeType": 4
              },
              callback:function(data){
                vm.codeUrl = "data:image/png;base64," + data.validateCode;
                vm.formData.validateCodeId = data.validateCodeId;
              }
            })
          },
        loginUp(){
              var vm=this;
              if(vm.formData.validateCode == null)return;
              vm.formData=unit.removeEmptyString(vm.formData);
              if (vm.formData.loginName == '' || vm.formData.loginName  == null) {
                this.$alert('登录账号不能为空', '提示', {
                  confirmButtonText: '确定'
                });
                vm.formData.validateCode=null;
                return
              }
              if (vm.password  == '' || vm.password == null) {
                this.$alert('密码不能为空', '提示', {
                  confirmButtonText: '确定'
                });
                vm.formData.validateCode=null;
                return
              }
              vm.formData.password=$.md5(vm.password).toUpperCase();
              var get=new RemoteCall();
              get.init({
              router:'/company/staff/login',
              data:vm.formData,
              callback:function(data){
                  if(data.ret.errorCode===0){
                      var session=data.session;
                    sessionStorage.setItem('session', session);
                    sessionStorage.setItem('userName', data.staffName)
                    sessionStorage.setItem('companyName', data.companyName);
                    sessionStorage.setItem('roleId', data.roleId)
                    sessionStorage.setItem('companyId', data.companyId);
                    sessionStorage.setItem('loginName', vm.formData.loginName);
                    sessionStorage.setItem('departmentId', data.departmentId);
                    sessionStorage.setItem('departmentName', data.departmentName);
                    sessionStorage.setItem('staffId', data.staffId);
                    vm.$router.push({path: '/homepage'});
                    var get=new RemoteCall();
                    get.init({
                      router:'/company/staff/get',
                      session:session,
                      data:{
                          name:data.staffName
                      },
                      callback:function(str){
                          if(str.ret.errorCode===0){
                              if(str.rows[0].provinceId){
                                  sessionStorage.setItem('areaId',str.rows[0].areaId);
                                  sessionStorage.setItem('cityId',str.rows[0].cityId);
                                  sessionStorage.setItem('provinceId',str.rows[0].provinceId);
                                  vm.$router.push({path: '/homepage'});
                              }else{
                                  vm.$alert("该员工账号未分配管理区域，请联系管理员分配");
                                  vm.$router.push({path: '/login'});
                              }
                          }
                      }
                    })

                  }else if(data.ret.errorCode === -1){
                    switch (data.ret.errorMessage) {
                      case 'password error':
                        vm.$alert('密码错误', '提示', {
                          confirmButtonText: '确定',
                          callback:function(){
                            vm.formData.validateCode=null;
                          }
                        });
                        break;
                      case 'user login not exist':
                        vm.$alert('账号不存在', '提示', {
                          confirmButtonText: '确定',
                          callback:function(){
                            vm.formData.validateCode=null;
                          }
                        });
                        break;
                      case 'Exception: 字段：validateCode为空字符串，请检查!':
                        vm.$alert('验证码不能为空', '提示', {
                          confirmButtonText: '确定',
                          callback:function(){
                            vm.formData.validateCode=null;
                          }
                        });
                        break;
                      case  'ValidateCode error':
                        vm.$alert('验证码错误', '提示', {
                          confirmButtonText: '确定',
                          callback:function(){
                            vm.formData.validateCode=null;
                            vm.getpic();
                          }
                        });
                        break;
                      case  'departmentStaff not exist':
                        vm.$alert('账号不存在', '提示', {
                          confirmButtonText: '确定',
                          callback:function(){
                            vm.formData.validateCode=null;
                          }
                        });
                        break;

                    }
                  }
              }
            })
        }

      },
      mounted:function(){
          this.getpic();
        sessionStorage.removeItem('session');
          window.onresize=()=>{
              this.windowHeight=window.innerHeight +'px';
          }
      }
  }
</script>
<style lang="scss">
 #login{
   width: 100%;
   position: absolute;
   top:0;
   background: #fff;
   left:0;
  .login-wrap{
    width: 100%;
    height:443px;
    background: #66B8F6;
    position: relative;
    top: 50%;
    left:0;
    margin-top:-250px;
    .bg-img{
      overflow: hidden;
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      img{
        width:1920px;
        height:443px;
        position: relative;
        left:50%;
        top:50%;
        margin-top:-221.5px;
        margin-left:-960px;
      }
    }
    .login-box{
      position: absolute;
      z-index: 100;
      width:415px;
      height:302px;
      left:50%;
      top:50%;
      margin-top:-100px;
      margin-left:-207px;
      img{
        position: absolute;
        top:-2px;
        left:-9px;
        width: 432px;
        height: 302px;
      }
      .logo{
        position: absolute;
        width: 165px;
        height: 59px;
        left:-300px;
        top:-90px;
        z-index: 999;
      }
      .form-wrap{
        width: 100%;
        height:100%;
        position: relative;
        z-index: 100;
        .login-title{
          font-family:"Microsoft YaHei UI Light";
          text-align: center;
          color: rgba(73,73,73,0.9);
          font-size:20px;
          border-bottom:1px solid #efeeee;
          line-height:60px;
          font-weight: 600;
        }
        .el-form{
          padding:10px 25px;
          .el-input{

            width: 243px;
          }
          .el-input__inner{
            background: #eaf7fc;
            border-color:transparent;
          }
          .el-input__inner:focus{
            border:1px solid #69ccff;
          }
        }
        .idcode.el-input{
          width:140px;
        }
        .el-form-item{
          margin-bottom:5px;
        }
        img.code{
          width: 90px;
          background: #fff;
          height: 34px;
          position: absolute;
          left:150px;
          right:0;
          top:4px;
          cursor: pointer;
        }
      }
      .login{
        width:320px;
        display: block;
        margin:0 auto;
      }
    }
  }
 }
</style>
