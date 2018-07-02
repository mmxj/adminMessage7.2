/**
 * Created by webmxj on 2018/3/7.
 */
export default {
  removeEmptyString,//将所有的''空字符串转为null
  enableFlag,//处理enableFlag的值 将它转为汉字和转为数字
  auditFlag,//处理enableFlag的值 将它转为汉字和转为数字
  findCity, //返回城市名称 只能在管理后台使用 或者自己导入新的城市数据
  countDown,
  reg,//处理正则验证 接受type类型和data要验证的信息text特殊名称  返回message提示信息和status是否正确
  thousand,//处理金额数字满3位加一个逗号
}
function removeEmptyString(data) {//将所有的''空字符串转为null
  var type = typeof data;
  if (type == 'object') {
    if (toString.call(data) == '[object Array]') {
      data.forEach(function (items) {
        items = removeEmptyString(items)
      })
    } else {
      for (let items in data) {
        data[items] = removeEmptyString(data[items])
      }
    }
  } else if (data == ""||data=="null") {
    if(data===0){

    }else{
      data = null
    }
  }
  return data
}
function enableFlag(data) {//处理enableFlag的值 将它转为汉字和转为数字
  if (data == 0) {
    return "交易禁止"
  } else if (data == 1) {
    return "已生效"
  } else if (data == '交易禁止') {
    return 0
  } else if (data == "已生效") {
    return 1
  }
}
function auditFlag(data) {//处理enableFlag的值 将它转为汉字和转为数字
  if (data === 0) {
    return "待审核"
  } else if (data == 1) {
    return "审核通过"
  } else if (data == 2) {
    return "审核失败"
  } else if (data == '待审核') {
    return 0
  } else if (data == "审核通过") {
    return 1
  } else if (data == "审核失败") {
    return 2
  }
}
function findCity(id){//返回城市名称
  var cityData=[{//areaId 字段 这里应该是cityId的
    value: '441600',
    label: '河源'
  }, {
    value: '441300',
    label: '惠州'
  }, {
    value: '0',
    label: '其他'
  }];
  for(var i=0;i<cityData.length;i++){
    if(id==cityData[i].value){
      return cityData[i].label
    }else if(id==cityData[i].label){
      return cityData[i].value
    }
  }
}
function countDown(){
  var minute=20;
  var second=0;
  var time='00'+':'+minute+':'+second;
  var timer=setInterval(function(){
    if(second>0){
      second--;
      time='00'+':'+minute+':'+second;
    }else if(second<=0&&minute>0){
      minute--;
      second=59;
      time='00'+':'+minute+':'+second;
    }else if(minute==0&&second==0){
      alert('时间到')
      clearTimeout(timer)
    }
  },1000)
}
function reg(obj){
  // type
  // 1 商户编号只能为15位
  /*2 姓名只能为汉字或英文
  /3 联系电话必须是数字
  * 4 银行卡号必须为数字
   *  */
    switch (obj.type){
      case 1:
        var patt=/^.{15}$/;
        if(patt.test(obj.name)){
          return {message:null, status:true}
        }else{
          if(obj.text){
            return {message:obj.text+'编号应该为15位字符',status:false}
          }else{
            return {message:'商户编号应该为15位字符',status:false}
          }

        };
        break;
      case 2:
        var patt=/^[A-Za-z\u4e00-\u9fa5]+$/;
        if(patt.test(obj.name)){
          return {message:null, status:true}
        }else{
          if(obj.text){
            return {message:obj.text+'只能为字母或汉字',status:false}
          }else{
            return {message:'姓名只能为字母或汉字',status:false}
          }

        }
        break;
      case 3:
        var patt=/^[\d,\-]+$/;
        if(patt.test(obj.name)){
          return {message:null, status:true}
        }else{
          return {message:'联系电话必须是数字或“区号-号码”格式',status:false}
        }
        break;
      case 4:
        var patt=/^\d+$/;
        if(patt.test(obj.name)){
          return {message:null, status:true}
        }else{
          return {message:'银行卡号必须是数字',status:false}
        }
        break;
      case 5:
        var patt=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(patt.test(obj.name)){
          return {message:null, status:true}
        }else{
          return {message:'请输入正确的邮箱',status:false}
        }
        break;
    }
}
function thousand(num){
  num=num.toString();
  let Num=num.split('.');
  let NumArr=Num[0].split('');
  if(NumArr.length>3){
    let index=NumArr.length%3;
    let length=parseInt(NumArr.length/3);
    for(var i=0;i<length;i++){
       if(i*3+index-1>=0){
         NumArr[i*3+index-1]+=' , ';
       }
    }
  }
  if(Num[1]){
    return NumArr.join('')+'.'+Num[1];
  }else{
    return NumArr.join('')
  }
}
