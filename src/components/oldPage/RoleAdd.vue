<template>
  <div id="RoleAdd">

    <el-row :gutter="20">
      <el-col :span="2">
        <label for="">归属公司<span class="must">*</span></label>
      </el-col>
      <el-col :span="6">
        <el-select v-model="company" filterable remote reserve-keyword :remote-method="remoteMethod"
                   placeholder="请选择公司">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <label for="">角色名称<span class="must">*</span></label>
      </el-col>
      <el-col :span="6">
        <input type="text" v-model="inputData.name">
      </el-col>
      <el-col :span="2">
        <label for="">角色编号<span class="must">*</span></label>
      </el-col>
      <el-col :span="6">
        <input type="text" v-model="inputData.code">
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2">
        <label for="">角色职责</label>
      </el-col>
      <el-col :span="6">
        <input type="text" v-model="inputData.description">
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="22" :span="2">
        <el-button @click="addDepartment">点击添加</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        options: [],
        company: null,
        session: sessionStorage.getItem('session'),
        inputData: {}
      }
    },
    methods: {
      getParentId(keyword){//获取父级卫生院数据 插入到节点中
        var vm = this;
        if (keyword && keyword != '') {
          var company = keyword;
        } else {
          var company = null;
        }
        var getParent = new RemoteCall();
        getParent.init({
          router: "/company/get",
          session: this.session,
          data: {
//            aredId:parseInt(this.inputData.areaId)
            name: company,
            pageInfo: {
              "pageSize": "50",
              "pageNum": "1"
            }
          },
          callback: function (data) {
            vm.options = [];
            for (var i = 0; i < data.rows.length; i++) {
              var parentData = {};
              parentData.label = data.rows[i].name;
              parentData.value = data.rows[i].id;
              vm.options.push(parentData);
            }
          }
        })
      },
//      companyChange(data){
//        this.inputData.companyId = data;
//      },
      remoteMethod(data){
        if (data == '') {
          data = null;
        }
        ;
        this.company = data;
        this.getParentId(data);
      },
      addDepartment(){
        this.clickCompany();
        if (this.inputData.companyId == null || this.inputData.companyId == "") {
          this.$alert('归属公司不能为空', '提示', {
            confirmButtonText: '确定',
          })
          return false;
        }
        if (this.inputData.code == null || this.inputData.companyId == "") {
          this.$alert('角色编号不能为空', '提示', {
            confirmButtonText: '确定',
          })
          return false;
        }
        if (this.inputData.name == null || this.inputData.companyId == "") {
          this.$alert('角色名称不能为空', '提示', {
            confirmButtonText: '确定',
          })
          return false;
        }
        var vm = this;
        var departmentAdd = new RemoteCall();
        departmentAdd.init({
          router: '/base/role/add',
          session: vm.session,
          data: vm.inputData,
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              vm.$alert('角色添加成功,请前往角色管理页面为角色添加权限', '提示', {
                confirmButtonText: '确定',
                callback: function () {
                  vm.inputData.name = null;
                  vm.inputData.code = null;
                  vm.inputData.description = null;
                }
              });
            } else {
              vm.$alert('角色添加失败' + data.ret.errorMessage, '提示', {
                confirmButtonText: '确定',
              })
            }
          }
        })
      },
      clickCompany(){//点击获取公司id
        console.log(this.company);
        var vm = this;
        var dataVal = {
          pageInfo: {
            "pageSize": "50",
            "pageNum": "1"
          }
        };
        dataVal.name = vm.company;
        var getParent = new RemoteCall();
        getParent.init({
          router: "/company/get",
          session: this.session,
          data: dataVal,
          async: false,
          callback: function (str) {
            if (str.ret.errorCode === 0) {
//                  console.log(str.rows);
              if (str.rows.length > 0) {
                if (str.rows[0].name == vm.company) {
                  vm.inputData.companyId = str.rows[0].id;
                } else {
                  vm.$alert('查无该公司', '提示', {
                    confirmButtonText: '确定',
                  })
                }

              } else {
                vm.$alert('查无数据', '提示', {
                  confirmButtonText: '确定',
                })
              }

            } else {
              vm.$alert(str.ret.errorMessage, '提示', {
                confirmButtonText: '确定',
              })
            }
          },
        })
      },
    },
    mounted: function () {
      this.getParentId();
    }
  }
</script>
<style lang="scss" scoped>
  #RoleAdd {
    margin: 15px;
    padding: 20px;
    background: #fff;
    min-height: 800px;
  }

  .el-col {
    margin-bottom: 20px;
    label {
      display: block;
      width: 100%;
      text-align: right;
      line-height: 30px;
    }
    input {
      width: 100%;
      height: 30px;
      border-radius: 3px;
      border: 1px solid #aaa;
    }
    select {
      width: 100%;
      height: 36px;
      border-radius: 3px;
      border: 1px solid #aaa;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-timer, .area .el-col {
      margin: 0;
    }
  }

  .must {
    color: red;
    vertical-align: middle;
  }
  .el-button {
    width: 100%;
    background: #32BC6F;
    border: 0;
    color: #fff;
  }

  a {
    line-height: 30px;
  }

  @media screen and (max-width: 1760px) {
    label {
      font-size: 14px;
      min-width: 6em;
    }
  }

  @media screen and (max-width: 1700px) {
    .el-col-2 {
      width: 10%;
    }
    .el-col-6 {
      width: 23.333333%;
    }
    .el-col-3 {
      width: 15.5%;
    }
    .el-col-offset-22 {
      margin-left: 90%;
    }
  }

  @media screen and (max-width: 1450px) {
    .el-col-2 {
      width: 12%;
    }
    .el-col-6 {
      width: 21.333333%;
    }
    .el-col-3 {
      width: 17.5%;
    }
    .el-col-offset-22 {
      margin-left: 88%;
    }
  }

  .el-col-6 {
    position: relative;
  }

  .el-input {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }
</style>
