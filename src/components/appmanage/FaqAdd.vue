<template>
  <div id="FaqAdd">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separator=">" separator-class="el-icon-d-arrow-right">
        <el-breadcrumb-item :to="{path:'/faq'}">常见问题管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增常见问题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input type="textarea"
                    :rows="3" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="seq">
          <el-input v-model="ruleForm.seq" class="index"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="close other-button" @click="$router.push('/faq')">关闭</el-button>
          <el-button size="small" type="primary" @click="saveFaq" class="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default{
    data(){
      return {
        ruleForm: {
          title: '',
        },
        session: sessionStorage.getItem('session'),
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请填写排序', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      saveFaq(){
        var vm = this;
        vm.ruleForm.enableFlag=0;
        vm.ruleForm = unit.removeEmptyString(vm.ruleForm);
        if(vm.ruleForm.title==null){this.$alert('请填写标题');return}
        if(vm.ruleForm.content==null){this.$alert('请填写内容');return}
        if(vm.ruleForm.seq==null){this.$alert('请填写排序');return}
        var add = new RemoteCall();
        add.init({
          router: '/ips/faq/add',
          session: vm.session,
          data: vm.ruleForm,
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              vm.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.ruleForm = {}
                }
              })
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  #FaqAdd {
    background: #fff;
    padding: 24px 0;
    .breadcrumb {
      vertical-align: middle;
      padding-left: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8
    }
    .breadcrumb span {
      display: inline-block;
      font-size: 14px;
      line-height: 16px;
      vertical-align: middle;
    }
    .el-breadcrumb {
      display: inline-block;
      vertical-align: middle;
    }
    .wrap {
      width: 740px;
      min-height: 760px;
      margin: 20px auto;
      margin-top: 90px;
    }
    .index {
      width: 80px;
    }
  }
</style>
