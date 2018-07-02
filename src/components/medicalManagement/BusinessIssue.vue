<template>
  <div id="BussinessIssue">
    <!--<div class="breadcrumb">-->
      <!--<span>位置：</span>-->
      <!--<el-breadcrumb separator=">" separator-class="el-icon-d-arrow-right">-->
        <!--<el-breadcrumb-item :to="{path:'/carousel'}">轮播广告管理</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>新增轮播广告</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <div class="wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="产品名称：" prop="productName">
          <el-input size="small" v-model="ruleForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="一句话介绍：" prop="summary">
          <el-input size="small" v-model="ruleForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="img">
          <div>
            <el-upload
              class="upload-demo"
              drag
              :on-change="fileChange"
              action=""
              list-type="picture"
              :http-request="upload"
              :file-list="fileLists"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </el-form-item>
        <!--<el-form-item label="排序：" prop="seq">-->
          <!--<el-input size="small"  v-model="ruleForm.seq" class="index"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="发布区域：" prop="areaRange">
          <el-select size="small"  v-model="areaId" multiple placeholder="请选择">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接：" prop="url">
          <el-input size="small"  v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addContent" class="save">发布业务</el-button>
          <el-button size="small" class="close other-button" @click="$router.push('/carousel')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js';
  export default{
    data(){
      return {
        ruleForm: {
          productName: '',
          summary:'',
          picSavePath: '',
          url: '',
          areaRange:null
        },
        areaId: [],
        session: sessionStorage.getItem('session'),
        fileLists: [],
        areaOptions: [{//areaId 字段 这里应该是cityId的
          value: '441600',
          label: '河源'
        }, {
          value: '441300',
          label: '惠州'
        }, {
          value: '0',
          label: '其他'
        }],
        rules: {
          productName: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          img: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请填写排序', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请填写一句话介绍', trigger: 'blur'}
          ],
          areaRange: [
            {required: true, message: '请选择发布区域', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请填写链接', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      fileChange(file, fileList){
        fileList = [];
        fileList[0] = file;
        this.fileLists = [];
        this.fileLists[0] = file;
      },
      upload(param){
        var vm = this;
        var fileObj = param.file;
        var FileComtroller = "http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
        var form = new FormData();
        form.append('file', fileObj);
        form.append('upload_type', '4');
        vm.$http.post(FileComtroller, form, {"Content-Type": "multipart/form-data;"}).then(function (data) {
          if(data.data.ret===0){
            vm.ruleForm.picSavePath=data.data.data[0].saved_file;
          }
        }, function (data) {
          console.log('失败');
        })
      },
      addContent(){
        var vm = this;
        if(vm.areaId.length>0) {
          vm.ruleForm.areaRange = vm.areaId.toString();
        }
        vm.ruleForm = unit.removeEmptyString(vm.ruleForm);
        vm.ruleForm.enableFlag=0;
        var add = new RemoteCall();
        add.init({
          router: '/ips/product/add',
          session: vm.session,
          data: vm.ruleForm,
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              vm.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.ruleForm = {};
                  vm.areaId=[];
                  vm.fileLists=[];
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
  #BussinessIssue {
    background: #fff;
    padding: 40px 0;
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
      min-height: 500px;
      margin: 20px auto;
    }
    .index {
      width: 80px;
    }
    .close {

    }
    .el-button {
      width: 100px;
    }
    .el-select{
      width:100%;
    }
  }
</style>
