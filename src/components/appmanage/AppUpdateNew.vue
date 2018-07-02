<template>
  <div id="AppUpdateNew">
    <div class="breadcrumb">
      <span class="location">位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/appupdate' }">自动更新管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增版本</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <div class="form-box">
          <el-form labelPosition="top" :model="formData">
            <el-form-item label="版本号："  class="is-required">
             <el-input size="small" v-model="formData.version"></el-input>
            </el-form-item>
            <el-form-item label="下载地址：" class="is-required">
              <el-input size="small"  v-model="formData.fileUrl"></el-input>
            </el-form-item>
            <el-form-item label="系统类型" class="is-required">
              <el-select v-model="formData.appType" size="small">
                <el-option label="Android" value="1"></el-option>
                <el-option label="iOS" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否强制更新：" class="is-required">
              <el-radio v-model="radio" label="1">是</el-radio>
              <el-radio v-model="radio" label="2">否</el-radio>
            </el-form-item>
            <!--<el-form-item label="更新时间：">-->
              <!--<el-date-picker-->
                <!--v-model="dateData"-->
                <!--type="date"-->
                <!--placeholder="选择日期">-->
              <!--</el-date-picker>-->
            <!--</el-form-item>-->
            <el-form-item label="更新日志：" class="is-required">
              <el-input
                type="textarea"
                :autosize="{ minRows:10}"
                placeholder="示例：
1.优化操作;
2.修复bug;
"
                v-model="formData.updateLog"
                resize="none"
              >
              </el-input>
            </el-form-item>
          </el-form>
        <el-button class="other-button" size="mini">关闭</el-button>
        <el-button size="mini" @click="submit">保存</el-button>
      </div>

      <div>

      </div>
    </div>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default{
      data(){
          return  {
            formData:{
              area:''
            },
            radio: '1',
            dateData:'',
            textarea:'',
            appType:null,
            session: sessionStorage.getItem('session'),
            off:true,
          }
      },
      methods: {
        submit(){
            var vm=this;
            if(this.off){
              this.off=false;

//              if(this.appType=='android'){
//                this.formData.appType=1
//              }else{
//                this.formData.appType=2
//              }
              this.formData=unit.removeEmptyString(this.formData);
              this.formData.area='';
              if(this.radio=='1'){
                this.formData.constraint=true
              }else{
                this.formData.constraint=false;
              }
              if(this.formData.appType==null){
                vm.$alert('请选择系统类型',{callback:function(){
                  vm.off=true;
                }})
                return
              }
              if(this.formData.version==null){
                vm.$alert('请填写版本号',{callback:function(){
                  vm.off=true;
                }})
                return
              }
              if(this.formData.fileUrl==null){
                vm.$alert('请填写下载地址',{callback:function(){
                  vm.off=true;
                }})
                return
              }
              if(this.formData.updateLog==null){
                vm.$alert('请填写更新日志',{callback:function(){
                  vm.off=true;
                }})
                return
              }
              var set=new RemoteCall();
              set.init({
                router:'/app/version/add',
                session:vm.session,
                data:vm.formData,
                callback:function(data){
                    if(data.ret.errorCode===0){
                      vm.$alert('添加成功',{callback:function(){
                      vm.formData={
                        area:''
                        };
                     }})
                    }
                  }
              })
              vm.off=true;
            }

        }
      },
      mounted:function(){
        if(!this.$route.params.data){
          this.$router.push('/appupdate')
          return
        }
        this.appType=this.$route.params.data
      }
  }
</script>
<style lang="scss">
  #AppUpdateNew{
    background:#fff;
    .breadcrumb{
      padding:10px;
      padding-left:20px;
      border-bottom:1px solid #e8e8e8;
      .location{
        font-size: 14px;
        vertical-align: middle;
      }
      .el-breadcrumb{
        vertical-align: middle;
        display: inline-block;
        font-weight: normal;
        .el-breadcrumb__inner{
          font-weight: normal;
        }
      }
    }
    .form-wrap{
      padding:50px 0;
      text-align: center;
      .el-select{
        width: 100%;
      }
      .form-box{
        width: 640px;
        display: inline-block;
        text-align: left;
        .el-form--label-top .el-form-item__label{
          padding:0;
        }
        .el-form-item__label{
          line-height:32px;
        }
        .el-input__prefix{
          width:25px;
        }
        .el-date-editor{
          width:100%;
        }
        .el-button{
          width:80px;
        }
      }
    }
  }
</style>
