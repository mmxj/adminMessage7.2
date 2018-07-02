<template>
  <div id="UserList">
    <div class="form-wrap">
      <div class="form-title">用户基础信息</div>
      <el-form inline :model="formData">
        <el-form-item label="用户姓名：" labelWidth="130px" >
            <span>
               {{formData.idCardName}}
            </span>
        </el-form-item>
        <el-form-item label="身份证号：" labelWidth="130px" >
          <span>
            {{formData.idCardNo}}
          </span>
        </el-form-item>
        <el-form-item label="手机号码：" labelWidth="130px" >
          <span>
            {{formData.moblie}}
          </span>
        </el-form-item>
        <el-form-item label="注册商户：" labelWidth="130px" >
          <span>
             {{formData.merchantName}}
          </span>
        </el-form-item>
        <el-form-item label="注册日期：" labelWidth="130px" >
          <span>
            {{formData.sfsCreate}}
          </span>
        </el-form-item>
        <el-form-item label="注册地址：" labelWidth="130px" >
          <span>
             <ReadArea :areaId="formData.areaId"></ReadArea>
          </span>
        </el-form-item>
        <el-form-item label="是否绑定社保卡：" labelWidth="130px" >
          <span>
             {{formData.bindSecurityCardFlag==1?'是':'否'}}
          </span>
        </el-form-item>
        <el-form-item label="是否绑定银行卡：" labelWidth="130px" >
          <span>
             {{formData.bindBankCardFlag==1?'是':'否'}}
          </span>
        </el-form-item>
        <el-form-item label="是否注册：" labelWidth="130px" >
          <span>
            已经注册乡银保
          </span>
        </el-form-item>
        <el-form-item label="家庭地址：" labelWidth="130px" >
          <span>
            {{formData.address}}
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="社保卡信息" name="social">
            <el-form size="mini" v-for="item in tableData" inline  :model="item"  v-bind:key="item.id">
              <el-form-item label="用户姓名：" labelWidth="130px" >
                <span>
                  {{item.userName}}
                </span>
            </el-form-item>
            <el-form-item label="关系：" labelWidth="130px" >
              <span>
                {{item.relationTypeName}}
              </span>
            </el-form-item>
            <el-form-item label="社保类型：" labelWidth="130px" >
              <span>
                {{item.securityTypeName}}
              </span>
            </el-form-item>
            <el-form-item label="社保卡号：" labelWidth="130px" >
              <span>
                {{item.account}}
              </span>
            </el-form-item>
            <el-form-item label="社保归属地：" labelWidth="130px" >
                <span>
                 {{item.areaId}}
               </span>
            </el-form-item>
            <el-form-item label="卡发行日期：" labelWidth="130px" >
              <span>
               {{item.issueDate}}
             </span>
            </el-form-item>
            <el-form-item label="绑卡日期：" labelWidth="130px" >
              <span>
               {{item.sfsCreate}}
             </span>
            </el-form-item>
            <el-form-item label="绑卡商户：" labelWidth="130px" >
              <span>
               {{item.merchantName}}
             </span>
            </el-form-item>
            <el-form-item label="社保个账余额：" labelWidth="130px" >
              <span>
               {{null}}
              </span>
            </el-form-item>
          </el-form>
          <div v-if="tableData.length==0" class="no-data">
            暂无数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="银行卡信息" name="bank">
            <el-table
              :data="tableData"
              size="mini"
              style="width:100%"
            >
              <el-table-column align="center" prop="index"  label="序号" width="50"></el-table-column>
              <el-table-column align="center" prop="userName"  label="用户名"></el-table-column>
              <el-table-column align="center" prop="relationTypeName"  label="用户关系"></el-table-column>
              <el-table-column align="center" prop="cardTypeName"  label="卡类型"></el-table-column>
              <el-table-column align="center" prop="account"  label="银行卡号"></el-table-column>
              <el-table-column align="center" prop="bankName"  label="归属银行"></el-table-column>
              <el-table-column align="center" prop="branchName"  label="支行信息"></el-table-column>
              <el-table-column align="center" prop="mobile"  label="手机号码"></el-table-column>
              <el-table-column align="center" prop="sfsCreate"  label="绑卡日期"></el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="家人关系" name="family">
          <el-table
            :data="tableData"
            size="mini"
            style="width:100%"
          >
            <el-table-column align="center" prop="index"  label="序号"></el-table-column>
            <el-table-column align="center" label="与本人关系">
              <template slot-scope="props">
                {{relation(props.row.relationType)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="idCardName"  label="家人姓名"></el-table-column>
            <el-table-column align="center" prop="telephone"  label="联系电话"></el-table-column>
            <el-table-column align="center" prop="idCardNo"  label="身份证号"></el-table-column>
            <el-table-column align="center" prop="socialNum"  label="社保卡号"></el-table-column>
            <el-table-column align="center" prop="ruralAccout"  label="乡银保账户"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="使用记录" name="record">
          <el-table
            :data="tableData"
            size="mini"
            style="width:100%"
          >
            <el-table-column align="center" prop="index"  label="序号"></el-table-column>
            <el-table-column align="center" prop="no"  label="消费订单号"></el-table-column>
            <el-table-column align="center" label="消费类型">
              <template slot-scope="props">
                {{business(props.row.businessType)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="companyId"  label="消费商户"></el-table-column>
            <el-table-column align="center"   label="订单金额">
              <template slot-scope="props">
                {{props.row.amount/100}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="clinicDate"  label="支付日期"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="用户乡银保" name="township">
          <el-table
            :data="tableData"
            size="mini"
            style="width:100%"
          >
            <el-table-column align="center" prop="moblie"  label="登录账号"></el-table-column>
            <el-table-column align="center" prop="moblie"  label="注册手机号码"></el-table-column>
            <el-table-column align="center" prop="sfsCreate"  label="注册时间"></el-table-column>
            <el-table-column align="center" prop=""  label="注册商户"></el-table-column>
            <el-table-column align="center" prop=""  label="最后一次消费时间"></el-table-column>
            <el-table-column align="center"  label="重置密码">
              <template slot-scope="scope">
                <el-button size="small" class="setPassword" @click="reset(scope)">点击发送密码到注册手机</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import ReadArea from '@/common/ReadArea';
  export default{
      components:{
        ReadArea
      },
      data(){
          return{
              formData:{

              },
            activeName:'social',
            tableData:[],
            session:sessionStorage.getItem("session")
          }
      },
      methods:{
        handleClick(){
            console.log(this.activeName);
            this.getCard()
        },
        getCard(){
            var vm=this;
            vm.tableData=[];
            if(vm.activeName=="social"){
              var get=new RemoteCall();
              get.init({
                router:'/user/card/bind/get',
                session:vm.session,
                data:{
                  userId:vm.formData.id,
                  pageInfo:{
                    pageSize:100,
                    pageNum:1
                  }
                },
                callback:function(data){
                  if(data.ret.errorCode===0){
                    data.rows.forEach(function(item){
                        if(item.cardType==1){
                          vm.tableData.push(item)
                        }
                    })
//                    vm.tableData=data.rows;
                  }
                }
              })
            }else if(vm.activeName=="bank"){
              var get=new RemoteCall();
              get.init({
                router:'/user/card/bind/get',
                session:vm.session,
                data:{
                    userId:vm.formData.id,
                    pageInfo:{
                        pageSize:100,
                        pageNum:1
                    }
                },
                callback:function(data){
                  if(data.ret.errorCode===0){
                    data.rows.forEach(function(item){
                      if(item.cardType==3){
                        vm.tableData.push(item)
                      }
                    })
                    vm.tableData.forEach(function(item,i){
                        item.index=(i+1)
                    })

                  }
                }
              })
            }else if(vm.activeName=="family"){
              var get=new RemoteCall();
              get.init({
                router:'/user/family/get',
                session:vm.session,
                data:{
                  userId:vm.formData.id,
                  pageInfo:{
                    pageSize:100,
                    pageNum:1
                  }
                },
                callback:function(data){
                  if(data.ret.errorCode===0){
                    vm.tableData=data.rows;
                    vm.tableData.forEach(function(item,i){
                      item.index=(i+1);
                    })
                  }
                }
              })
            }else if(vm.activeName=="record"){
              var get=new RemoteCall();
              get.init({
                router:'/order/prescription/get',
                session:vm.session,
                data:{
                  userId:vm.formData.id,
                  pageInfo:{
                    pageSize:100,
                    pageNum:1
                  }
                },
                callback:function(data){
                  if(data.ret.errorCode===0){
                    vm.tableData=data.rows;
                    vm.tableData.forEach(function(item,i){
                      item.index=(i+1);
                      if(!item.amount){
                          item.amount=0;
                      }
                    })
                  }
                }
              })
            }else if(vm.activeName=="township"){
              vm.tableData.push(vm.formData)
            }

        },
        relation(type){
          switch (type) {
            case 1:
              return '父亲'
              break;
            case 2:
              return '母亲'
              break;
            case 3:
              return  '丈夫'
              break;
            case 4:
              return '妻子'
              break;
            case 5:
              return '儿子'
              break;
            case 6:
              return '女儿'
              break;
            case 7:
              return '爷爷'
              break;
            case 8:
              return  '奶奶'
              break;
            case 9:
              return  '本人'
              break;
            default:

          }
        },
        business(type){
          switch (type) {
            case 1:
              return '缴费';
              break;
            case 2:
              return '挂号';
              break;
            case 3:
              return '门诊';
              break;
            default:
              return '其他';
              break;
          }
        },
        reset(name){
          var vm = this;
          if (name.row.moblie == '' || name.row.moblie == null) {
            return;
          }
          var resetPassword = new RemoteCall();
          resetPassword.init({
            router: '/base/validatecode/sms/get',
            session: this.session,
            data: {
              deviceType: 3,
              validateCodeType: 2,
              moblie: name.row.moblie
            },
            callback: function (data) {
              if (data.ret.errorCode === 0) {
                vm.$alert('发送成功', '提示', {
                  confirmButtonText: '确定',
                })
              } else {
                vm.$alert('发送失败,' + data.ret.errorMessage, '提示', {
                  confirmButtonText: '确定',
                })
              }
            }
          })
        },
      },
      mounted:function(){
        if(!this.$route.params.data){
          this.$router.push('/user');
          return
        }
        this.formData=this.$route.params.data;
        this.getCard();
      }
  }
</script>
<style lang="scss">
  #UserList{
    background: #fff;
    .form-title{
      font-size:16px;
      padding:20px 30px;
      border-bottom:1px solid #e4e4e4;
    }
    .el-form{
      font-size:14px;
      padding: 20px;
      span{
        width:280px;
        display: inline-block;
      }
    }
    .tab-wrap{
      padding:20px 20px 0  20px;
      min-height:400px;
      border-top:20px solid #F0F2F5;
      .el-form{
        margin:0 20px;
        border-bottom:1px solid #e4e8f1;
      }
    }
    .no-data{
      padding:30px;
      text-align: center;
      color: #c0c0c0;
    }
  }
</style>
