<template>
  <div id="CarouselAdd">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separator=">" separator-class="el-icon-d-arrow-right">
        <el-breadcrumb-item :to="{path:'/carousel'}">轮播广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增轮播广告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
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
              :on-remove="remove"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="排序：" prop="seq">
          <el-input v-model="ruleForm.seq" class="index"></el-input>
        </el-form-item>
        <el-form-item label="发布区域：" prop="area">
          <el-select v-model="area" multiple placeholder="请选择">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章类型：">
          <el-switch
            style="display: block"
            v-model="textType"
            active-color="#13ce66"
            inactive-color="#18e"
            active-text="转载"
            inactive-text="原创"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="链接：" prop="jumpUrl" v-if="textType">
          <el-input v-model="ruleForm.jumpUrl"></el-input>
        </el-form-item>
        <el-form-item label="内容：" v-else>
          <quill-editor ref="myTextEditor"
                        v-model="content"
                        :options="editorOption"
          ></quill-editor>
          <el-upload style="display:block;height:0;"   action="" :show-file-list="false" :http-request="upload2"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
          <el-tooltip content="点击预览" placement="right">
            <i class="el-icon-mobile-phone preview" @click="preview"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="close other-button" @click="$router.push('/carousel')">关闭</el-button>
          <el-button size="small" type="primary" @click="addContent" class="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="预览" :visible.sync="dialogTableVisible" top="5vh">
      <div class="preview-mobile ql-editor" id="divDom">

      </div>
    </el-dialog>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js';
  export default{
    data(){
      return {
        dialogTableVisible:false,
        content: '',
        textType:false,
        ruleForm: {
          name: '',
          imageDownloadUrl: '',
          jumpUrl: '',
        },
        area: [],
        session: sessionStorage.getItem('session'),
        fileLists: [],
        editorOption: {
//            debug:'info',
          placeholder: '请输入内容',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike','image',{'color':[]},{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'align': []},'blockquote', {'list': 'ordered'}, {'list': 'bullet'}],
              ['clean']
            ]
          },
          theme: 'snow'
        },
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
          name: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          img: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请填写排序', trigger: 'blur'}
          ],
          area: [
            {required: true, message: '请选择发布区域', trigger: 'blur'}
          ],
          jumpUrl: [
            {required: true, message: '请填写链接', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      preview(){
        var vm=this;
        this.dialogTableVisible=true;
        if(vm.content){
          vm.$nextTick(function(){
            document.getElementById("divDom").innerHTML=vm.content
          })
        }
      },
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
        form.append('upload_type', '1');
        vm.$http.post(FileComtroller, form, {"Content-Type": "multipart/form-data;"}).then(function (data) {
            if(data.data.ret===0){
              vm.ruleForm.imageDownloadUrl=data.data.data[0].saved_file;
           }
        }, function (data) {
          console.log('失败');
        })
      },
      upload2(param){
        var vm = this;
        var fileObj = param.file;
        var FileComtroller = "http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
        var form = new FormData();
        form.append('file', fileObj);
        form.append('upload_type', '2');
        vm.$http.post(FileComtroller, form, {"Content-Type": "multipart/form-data;"}).then(function (data) {
          if(data.data.ret===0){
            var url='http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do?download_type=2&file_name='+data.data.data[0].saved_file;
            vm.content+='<img src='+url+'/>';
            vm.$nextTick(function() {
              vm.$refs.myTextEditor.quill.blur();
            });
          }
        }, function (data) {
          console.log('失败');
        })
      },
      addContent(){
        var vm=this;
        vm.content=unit.removeEmptyString(vm.content);
        vm.ruleForm.htmlDownloadUrl=null;
        if(vm.textType){
          if(vm.ruleForm.jumpUrl==null){
            this.$alert('请输入文章地址');
            return
          }
          vm.uploaddata();
        }else{
          if(vm.content==null){
            this.$alert('请输入填写文章');
            return
          }
          this.upDateText(vm.content);
        }
      },
      uploaddata(){
        var vm = this;
        if(vm.areaId){
          if(vm.areaId.length>0) {
            vm.ruleForm.areaIds = vm.areaId.toString();
          }
        }
        vm.ruleForm = unit.removeEmptyString(vm.ruleForm);
        if(vm.textType){
          vm.ruleForm.htmlDownloadUrl='';
        }
        if(vm.ruleForm.name==null){this.$alert('请填写标题');return}
        vm.ruleForm.enableFlag=0;
        var add = new RemoteCall();
        add.init({
          router: '/ips/slider/update',
          session: vm.session,
          data: vm.ruleForm,
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              vm.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.$router.push('/carousel')
                }
              })
            }
          }
        })

      },
      newsFlag(status){//状态转换 0|null = 未发布 1=发布
        if (status == '已发布') {
          return 1
        } else {
          return 0
        }
      },
      checkImg(url){
        var src=null;
        var vm=this;
        if(url){
          if(url.split('/').length>1){
            src=url
          }else{
//            $.ajax({
//              url:'http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download_base64.do',
//              type: 'post',
//              async:false,
//              data: {
//                'download_type': '1',
//                'file_name':url,
//              },
//              success:function(res){
//                if(res){
//                  src='data:image/png;base64,' +JSON.parse(res).data;
//                }else{
//                  src= vm.nofind;
//                }
//              }
//            })
            src="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do?download_type=1&file_name="+url;
          }
        }else{
          src= this.nofind;
        }
        return src
      },
      remove(file,fileList){
        this.ruleForm.imageDownloadUrl='1522632455120-nofind.png';
      },
      upDateText(data){
        var vm=this;
        data= `
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
<link href="http://cdn.quilljs.com/1.3.4/quill.snow.css" type="text/css" rel="stylesheet">
<link href="http://cdn.quilljs.com/1.3.4/quill.bubble.css"  type="text/css"  rel="stylesheet">
<link href="http://cdn.quilljs.com/1.3.4/quill.core.css"  type="text/css"  rel="stylesheet">
<style>body{width:100%margin: 0;height: 100%;overflow: auto;}.ql-editor{width:100%;padding: 5px;height: 100%;-webkit-overflow-scrolling : touch;}img{max-width: 100%;}</style>
                  <div class="ql-editor">`
          +data+
          '</div>'
        ;
        var filename=new Date().getTime()+'.html';
        var FileComtroller = "http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/upload/upload.do";
        var form = new FormData();
        form.append('htmlContent', data);
        form.append('filename', filename);
        form.append('upload_type', '9');
        vm.$http.post(FileComtroller, form, {"Content-Type": "multipart/form-data;"}).then(function (data) {
          if(data.data.ret===0){
            var htmlDownloadUrl= data.data.data[0].saved_file;
            if(htmlDownloadUrl){
              vm.ruleForm.htmlDownloadUrl=htmlDownloadUrl;
              vm.ruleForm.jumpUrl= 'http://www.yxunionpay.com:8087/upload/html/'+htmlDownloadUrl;
              vm.uploaddata();
            }

          }
        }, function (data) {
          alert('提交失败')
        })
      },
    },
    mounted: function () {
        var vm=this;
      if(!this.$route.params.data){
          this.$router.push('/carousel')
        return
      }
      var imgHandler = async function(state) {
        if (state) {
          vm.$nextTick(function() {
            var fileInput =document.querySelector('#uniqueId input') //隐藏的file元素
            fileInput.click() //触发事件
          })
        }
      }
      this.$refs.myTextEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
      this.$route.params.data.enableFlag = this.newsFlag(this.$route.params.data.enableFlag);
      this.ruleForm = this.$route.params.data;

      if(this.ruleForm.areaIds!=null&&this.ruleForm.areaIds!='undefined'){
        var area=this.ruleForm.areaIds.split(',');
        this.area=area;
      }
      if(this.ruleForm.imageDownloadUrl!=null&&this.ruleForm.imageDownloadUrl!='undefined'){
        this.fileLists=[{name:this.ruleForm.name,url:this.checkImg(this.ruleForm.imageDownloadUrl)}]
      }
      vm.ruleForm = unit.removeEmptyString(vm.ruleForm);
      if(this.ruleForm.htmlDownloadUrl){
        $.ajax({
          url:'http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do',
          type: 'post',
          async:false,
          data: {
            'download_type': '9',
            'file_name':this.ruleForm.htmlDownloadUrl,
          },
          success:function(res){
            vm.content=res;
          }
        })
      }else{
        vm.textType=true
      }
    }
  }
</script>
<style lang="scss">
  #CarouselAdd {
    background: #fff;
    padding: 20px 0;
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
      width: 280px;
    }
    .ql-blank {
      height: 250px;
    }
    .ql-editor {
      height: 250px;
    }
    .el-select{
      width:280px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label::before, .ql-snow .ql-picker.ql-header .ql-picker-item::before{
      content:'字体大小';
      vertical-align: top;
    }
    .ql-snow .ql-color-picker .ql-picker-label svg, .ql-snow .ql-icon-picker .ql-picker-label svg{
      vertical-align: top;
    }
  }
</style>
