<template>
  <div id="OpenapiExpense">
    <div class="form-wrap">
      <div class="form-title">公共参数配置：</div>
      <el-form inline :model="formData" labelWidth="110px">
        <el-form-item label="版本号：">
          <el-input size="small" v-model="formData.version"></el-input>
        </el-form-item>
        <el-form-item label="编码格式：">
          <el-select size="small" v-model="formData.charset">
            <el-option label="UTF-8" value="UTF-8"></el-option>
            <el-option label="GBK" value="GBK"></el-option>
            <el-option label="GB2312" value="GB2312"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="appId：">
           <el-input size="small" v-model="formData.appId" placeholder="乡银保分配给开发者的ID"></el-input>
        </el-form-item>
        <el-form-item label="签名算法类型：">
          <el-select size="small" v-model="formData.signType">
            <el-option label="RSA2" value="RSA2"></el-option>
            <el-option label="RSA" value="RSA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户签名串：">
            <el-input size="small" v-model="signature"></el-input>
        </el-form-item>
        <el-form-item label="主动通知地址：">
          <el-input size="small" v-model="notifyUrl" placeholder="非必填"></el-input>
        </el-form-item>
      </el-form>
      <div class="list">
        <el-radio-group v-model="labelPosition" size="small" @change="radioChange">
          <el-radio-button label="consumption">社保卡消费</el-radio-button>
          <el-radio-button label="cancel">社保卡消费撤销</el-radio-button>
          <el-radio-button label="check">交易查询</el-radio-button>
          <el-radio-button label="balance">查询社保卡余额</el-radio-button>
        </el-radio-group>
      </div>
      <el-form v-if="labelPosition=='consumption'" ref="formConsumption" inline :model="formConsumption" labelWidth="110px">
        <el-form-item label="服务器名称：">
          <el-input size="small" v-model="method.service" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口号：">
          <el-input size="small" v-model="method.point" placeholder="必填"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="订单编号：">
          <el-input size="small" v-model="formConsumption.orderId" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="商户编号：">
          <el-input size="small" v-model="formConsumption.merCd" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input size="small" v-model="formConsumption.merNm" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="社保卡号：">
          <el-input size="small" v-model="formConsumption.accNo" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input size="small" v-model="formConsumption.phone" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select size="small" v-model="formConsumption.certifTp">
            <el-option label="身份证" value="00"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input size="small" v-model="formConsumption.certif" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input size="small" v-model="formConsumption.customerNm" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="发卡机构：">
          <el-input size="small" v-model="formConsumption.rcvInst" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="卡序列号：">
          <el-input size="small" v-model="formConsumption.cardSn" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="发卡日期：">
          <el-input size="small" v-model="formConsumption.issuDt" placeholder="非必填(格式：20150801)"></el-input>
        </el-form-item>
        <el-form-item label="卡有效期：">
          <el-input size="small" v-model="formConsumption.cardExp" placeholder="非必填(格式：20150801)"></el-input>
        </el-form-item>
        <el-form-item label="消费金额：">
          <el-input size="small" v-model="amt" placeholder="必填"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="labelPosition=='cancel'" ref="formCancel" inline :model="formCancel"  labelWidth="110px">
        <el-form-item label="服务器名称：">
          <el-input size="small" v-model="method.service" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口号：">
          <el-input size="small" v-model="method.point" placeholder="必填"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="商户编号：">
          <el-input size="small" v-model="formCancel.merCd" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input size="small" v-model="formCancel.orderId" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="社保卡号：">
          <el-input size="small" v-model="formCancel.accNo" placeholder="必填"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="labelPosition=='check'" ref="formCheck" inline :model="formCheck"  labelWidth="110px">
        <el-form-item label="服务器名称：">
          <el-input size="small" v-model="method.service" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口号：">
          <el-input size="small" v-model="method.point" placeholder="必填"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="商户编号：">
          <el-input size="small" v-model="formCheck.merCd" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input size="small" v-model="formCheck.orderId" placeholder="必填"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="labelPosition=='balance'" ref="formBalance" inline :model="formBalance" labelWidth="110px">
        <el-form-item label="服务器名称：">
          <el-input size="small" v-model="method.service" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口号：">
          <el-input size="small" v-model="method.point" placeholder="必填"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="商户编号：">
          <el-input size="small" v-model="formBalance.merCd" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input size="small" v-model="formBalance.merNm" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="社保卡号：">
          <el-input size="small" v-model="formBalance.accNo" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input size="small" v-model="formBalance.phone" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select size="small" v-model="formBalance.certifTp">
            <el-option label="身份证" value="00"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input size="small" v-model="formBalance.certif" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input size="small" v-model="formBalance.customerNm" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="发卡机构：">
          <el-input size="small" v-model="formBalance.rcvInst" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="卡序列列号：">
          <el-input size="small" v-model="formBalance.cardSn" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="发卡⽇日期：">
          <el-input size="small" v-model="formBalance.issuDt" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="卡有效期：">
          <el-input size="small" v-model="formBalance.cardExp" placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input size="small" v-model="formBalance.orderId" placeholder="必填"></el-input>
        </el-form-item>
      </el-form>
      <div class="button-wrap">
        <el-button size="small" @click="submitForm">提交</el-button>
      </div>
      <div v-if="callbackContent" class="callback-wrap">
        <div class="callbackTitle">响应参数：</div>
        <div class="callbackContent">
          {{callbackContent}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        formData:{
          charset:'UTF-8',
          format:'JASON',
          signType:'RSA',
          timestamp:null,
          version:'1.0.0',
          appId:'1',
          notifyUrl:null,
        },
        session:sessionStorage.getItem('session'),
        formDataStart:{
          charset:'UTF-8',
          signType:'RSA',
          charset:'UTF-8',
          format:'JASON',
          signType:'RSA',
          timestamp:null,
          version:'1.0.0',
          appId:'1',
          notifyUrl:null,
        },

        method:{
          service:'PAYMENT-SERVICE',
          point:'payment'
        },
        formConsumption:{
          certifTp:'00',
          orderId:null,
          merCd:null,
          accNo:null,
          amt:null
        },
        formConsumptionStart:{
          certifTp:'00'
        },
        signature:"qazwsxedc",
        formCancel:{
//          accNo:'0'
        },
        formBalance:{
//          orderId:'0'
        },
        formCheck:{
            accNo:'0'
        },
        labelPosition:'consumption',
        callbackContent:null,
        sendData:null,
        notifyUrl:null,
        amt:null
      }
    },
    methods: {
      radioChange(){

        this.$set(this,'callbackContent',null)
        if (this.labelPosition == 'consumption') {
          this.method.service='PAYMENT-SERVICE';
          this.method.point='payment';
        }else if (this.labelPosition == 'cancel') {
          this.method.service='PAYMENT-SERVICE';
          this.method.point='cancel';
        }else if (this.labelPosition == 'check') {
          this.method.service='PAYMENT-SERVICE';
          this.method.point='query';
        }else if (this.labelPosition == 'balance') {
          this.method.service='PAYMENT-SERVICE';
          this.method.point='balance';
        }
      },
      formatDateToString(date){
        if (checkIsNull(date)) {
          date = new Date();
        }
        function checkIsNull(date) {
          if (date) {
            return false;
          } else {
            return true
          }
        }

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return year + month + day;
      },
      formateDateAndTimeToString(date)
      {
        var hours = date.getHours();
        var mins = date.getMinutes();
        var secs = date.getSeconds();
        var msecs = date.getMilliseconds();
        if (hours < 10) hours = "0" + hours;
        if (mins < 10) mins = "0" + mins;
        if (secs < 10) secs = "0" + secs;
        if (msecs < 10) secs = "0" + msecs;
        return this.formatDateToString(date) + hours + mins + secs + msecs;
      },
      submitForm(){
        var vm = this;
        this.formData.timestamp = this.formateDateAndTimeToString(new Date());
        this.formData.timestamp = new Date().getTime();
        if(this.labelPosition== 'consumption'){
          if(isNaN(vm.amt)){
            vm.amt=0
          }
          this.formConsumption.amt=vm.amt*100;
        }else{

          vm.amt=null
        }
        if (this.labelPosition == 'consumption') {
          this.sendData = this.formConsumption;

          this.formData.biz_content = $.md5(JSON.stringify(this.formConsumption)).toUpperCase()
        } else if (this.labelPosition == 'cancel') {
          this.sendData = this.formCancel;

          this.formData.biz_content = $.md5(JSON.stringify(this.formCancel)).toUpperCase()
        } else if (this.labelPosition == 'balance') {

          this.sendData = this.formBalance;
          this.formData.biz_content = $.md5(JSON.stringify(this.formBalance)).toUpperCase()
        } else if (this.labelPosition == 'check') {
          this.sendData = this.formCheck;
          this.formData.biz_content = $.md5(JSON.stringify(this.formCheck)).toUpperCase()
        };
        this.formData.method = encodeURIComponent(JSON.stringify(this.method));
        if(this.formData.notifyUrl){
          this.formData.notifyUrl= encodeURIComponent(this.notifyUrl)
        }

        this.RemoteCall({
          router:'/openPayApi',
          session:vm.session,
          method:vm.formData.method,
          data:vm.sendData,
          callback:function(data){
            vm.$set(vm,'callbackContent',data)
//              vm.callbackContent=data;

          }
        })
      },
      RemoteCall(obj){
        var vm=this;
        var setting = {//外部传进来的参数http://192.168.0.104
          openUrl: "http://www.yxunionpay.com:8091",//设置生成环境请求的域名
          router: "/base/validatecode/picture/get", //设置请求的地址路径
          appid: 1,
          async: true,
//          nonce:28,
          nonce : Math.ceil(Math.random() * 1000),//随机数
          timestamp : new Date().getTime(),//时间戳
//          timestamp :1523844860811,//时间戳
          version:"1.0.0", //版本号 默认是1.0.0
          key : "qazwsxedc",//参数密匙
          tempSignature:null,
          callback: function () {
          },
          errorCallback: function () {

          }
        }
        this.extend(setting,obj);
        var url = null;//定义地址
        var res = null;

        setting.data=JSON.stringify(obj.data);
        if(this.formData.notifyUrl){
          url=setting.openUrl+setting.router+"?appid=" +setting.appid +
            "&charset=" + this.formData.charset +
            "&format=" + this.formData.format +
            "&method=" + this.formData.method+
            "&nonce=" + setting.nonce +
            "&notify_url=" + this.formData.notifyUrl+
            "&session="+ vm.session +
            "&sign_type=" + this.formData.signType +
            "&timestamp=" + setting.timestamp +
            "&version=" +setting.version+
            "&signature=" + this.makeSignature(vm.session, setting.data,setting);
        }else{

          url=setting.openUrl+setting.router+"?appid=" +setting.appid +
            "&charset=" + this.formData.charset +
            "&format=" + this.formData.format +
            "&method=" + this.formData.method+
            "&nonce=" + setting.nonce +
            "&session="+ vm.session +
            "&sign_type=" + this.formData.signType +
            "&timestamp=" + setting.timestamp +
            "&version=" +setting.version+
            "&signature=" + this.makeSignature(vm.session, setting.data,setting);
        }

        $.ajax({
          type: 'POST',
          async: setting.async,
          url: url,
          contentType: "application/json; charset=utf-8",
          data:setting.data,
          dataType: 'json',
          success:function(data){
              setting.callback(data);
          }
        })

      },
      makeSignature(session, biz_content,setting){
        var vm=this;
        console.log(biz_content);
        var md5Content = $.md5(biz_content).toUpperCase();
        if(this.formData.notifyUrl){
          var signature="appid="+setting.appid +
            "&biz_content="+md5Content +
            "&charset=" + this.formData.charset+
            "&format=" + this.formData.format +
            "&method="   + this.formData.method+
            "&nonce="+ setting.nonce +
            "&notify_url=" + this.formData.notifyUrl +
            "&session="+vm.session+ "&sign_type=" + this.formData.signType +
            "&timestamp=" +setting.timestamp  +
            "&version=" + setting.version +
            "&key=" + setting.key;
        }else{
          var signature="appid="+setting.appid +"&biz_content="+md5Content + "&charset=" + this.formData.charset+"&format=" + this.formData.format
            +"&method="   + this.formData.method+ "&nonce="+ setting.nonce  +"&session="+vm.session+ "&sign_type=" + this.formData.signType
            +"&timestamp=" +setting.timestamp  + "&version=" + setting.version + "&key=" + setting.key;
        }
        setting.tempSignature = $.md5(signature).toUpperCase();
        return setting.tempSignature;
      },
      extend(obj1,obj2){
        for(var i in obj2){
          obj1[i]=obj2[i]
        }
      }

    }
  }
</script>
<style lang="scss">
  #OpenapiExpense{
    background: #fff;
    .form-wrap{
      font-size:14px;
      width: 1000px;
      padding: 20px;
      margin:0 auto;
      .form-title{
        padding: 20px 10px;
        color: #555;
      }
      .el-input{
        width:210px;
      }
      .el-select{
        width:210px;
      }
    }
    .list{
      padding:20px  0;
    }
    .button-wrap{
      text-align: right;
      padding: 20px 0;
      .el-button{
        width:100px;
      }
    }
    .callbackTitle{
      margin-top: 20px;
      padding:0 20px;
    }
    .callbackContent{
      padding: 20px;
    }
  }
</style>
