<template>
  <div id="StaffUpdate">
    <div class="breadcrumb">
      <span class="location">位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/staff' }">员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑员工</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <el-form ref="formData" :model="formData" label-width="100px"  :rules="rules">
        <el-form-item label="账号名称：" prop="loginName">
          <el-input size="small" v-model="formData.loginName" type="text"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名：">
          <el-input  size="small"  v-model="formData.name"  type="text"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input size="small" v-model="formData.idCardNo" type="text"></el-input>
        </el-form-item>
        <el-form-item label="归属部门：">
          <GetDepartment :data="department" :start="startdepartment" :disabled="disabled"></GetDepartment>
        </el-form-item>
        <el-form-item label="归属角色：">
          <GetRole :data="role"  @valueChange="valueChange" :departmentId.sync="departmentId" :father="true" :holder="'先选择部门再选角色'" :disabled="disabled"></GetRole>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input size="small" v-model="formData.mobile" type="text"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-model="formData.sex">
            <el-option v-for="item in sexOption" :value="item.value" :key="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色权限：" class="is-required">
          <template slot-scope="props">
            <div class="menu-box">
              <el-tree
                :data="checkBoxData"
                show-checkbox
                node-key="id"
                ref="tree"
                default-expand-all
                :props="defaultProps"
              >
              </el-tree>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="管辖区域："  class="is-required">
          <div class="address">
            <Province :propdata="formData" :startArea="startArea" :disabled="disabled" :startAreaData.sync="startAreaData"></Province>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="submit">确定</el-button>
          <el-button size="small" class="other-button" @click="$router.push('/staff')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Province from '@/common/Province'
  import GetDepartment from '@/common/GetDepartment'
  import GetRole from '@/common/GetRole'
  export default{
    components:{
      Province,
      GetDepartment,
      GetRole
    },
    data(){
      return{
        startArea:null,
        department:{
        },
        departmentId:null,
        role:{

        },
        sexOption:[
          {
            value:1,
            label:'男'
          },{
            value:2,
            label:'女'
          }
        ],
        formData:{
          idCardType:1,
          staffType:0,
          companyId:sessionStorage.getItem('companyId'),
          birthday:'1990-10-10',
        },
        formDataStart:{
          idCardType:1,
          staffType:0,
          companyId:sessionStorage.getItem('companyId'),
          birthday:'1990-10-10',
        },
        session:sessionStorage.getItem('session'),
        checkBoxData:[
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rules:{
          loginName:[
            {required:true,message:'账号名称不能为空',trigger:'blur'}
          ],
          password:[
            {required:true,message:'账号密码不能为空',trigger:'blur'}
          ],

        },
        checkBox:[],
        resourceData:null,
        disabled:false,
        departmentId:sessionStorage.getItem('departmentId'),//214953758759583744==全部权限
        departmentName:sessionStorage.getItem('departmentName'),
        roleId:sessionStorage.getItem('roleId'),
        roleName:null,
        startdepartment:null,
        startRole:null,
        startAreaData:null
      }
    },
    methods:{
      submit(){
        var vm=this;
        this.getCheck();
        var set=new RemoteCall();
        vm.formData.departmentId=vm.department.id;
        vm.formData.departmentName=vm.department.name;
        vm.formData.roleId=vm.role.id;
        vm.formData.roleName=vm.role.name;
        if(vm.checkBox.length<1){
          this.$alert('请选择角色权限');
          return
        }
        set.init({
          router:'/company/staff/update',
          session:vm.session,
          data:vm.formData,
          callback:function(data){
            if (data.ret.errorCode === 0) {
                vm.setResource(vm.formData.id);
//              vm.$alert('修改成功', '提示', {
//                confirmButtonText: '确定',
//                callback: () => {
//                    vm.$router.push('/staff')
////                  vm.formData=vm.formDataStart;
////                  vm.department={};
////                  vm.role={};
//                }
//              })
            }
          }
        })
      },
      setResource(id){
        var vm=this;
        var set=new RemoteCall();
        set.init({
          router:'/base/staffresource/add',
          session:vm.session,
          data:{
            staffId:id,
            resourceRows:vm.checkBox,
          },
          callback:function(data){
            if (data.ret.errorCode === 0) {
              vm.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.$router.push('/staff')
                }
              })
            }
          }
        })
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      getResource(){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/resource/get',
          session:vm.session,
          data:{
            pageInfo:{
              pageSize:100,
              pageNum:1
            }
          },
          callback:function(data){
            if(data.ret.errorCode===0){
              vm.resourceData=data.rows;
            }

          }
        })
      },
      setCheckBoxData(data){
        data.sort((obj1,obj2)=>{
          var  val1=obj1.showOrders;
          var  val2=obj2.showOrders;
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        });
        var vm=this;
        vm.checkBoxData=[];
        data.forEach(function(item){
          if(typeof(item.code)=='string'){
            item.code=item.code.split("-");
          }
          if(item.code.length==1){
            var obj={};
            obj.id=item.id;
            obj.code=item.code;
            obj.label=item.name;
            obj.children=[];
            vm.checkBoxData.push(obj);
          }
        })
        vm.checkBoxData.forEach(function(item){
          for(var i=0;i<data.length;i++){
            if(data[i].code.length==2&&data[i].code[0]==item.code){
              var obj={};
              obj.id=data[i].id;
              obj.label=data[i].name;
              obj.code=data[i].code;
              obj.parentId=data[i].parenyId;
              obj.children=[];
              item.children.push(obj)
            }
          }
          item.children.forEach(function(item2){
            for(var j=0;j<data.length;j++){
              if(data[j].code.length==3&&data[j].code[0]==item2.code[0]&&data[j].code[1]==item2.code[1]){
                var obj={};
                obj.id=data[j].id;
                obj.label=data[j].name;
                obj.parentId=data[j].parenyId;

                item2.children.push(obj)

              }
            }
          })
        })
        this.getRoleResource();
      },
      getRoleResource(){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/staffresource/get',
          session:vm.session,
          data:{
            id:this.formData.id,
            pageInfo:{
              pageSize:100,
              pageNum:1
            }
          },
          callback:function(data){
            if(data.ret.errorCode===0){
              var arr=[];
              data.resourceRows.forEach(function(item){
                arr.push(item.sfsResourceId)
              })
              vm.$refs.tree.setCheckedKeys(arr);
            }
          }
        })
      },
      getCheck(){//获取选中的权限
        var vm=this;
        vm.checkBox=[];
        var arr =this.$refs.tree.getCheckedNodes();
        arr.forEach(function(item){
          var obj={};
          obj.sfsResourceId=item.id;
          vm.checkBox.push(obj);
        })
//        arr.forEach(function(item){
//          var obj={};
//          obj.sfsResourceId=item.id;
//          var push=true;
//          vm.checkBox.forEach(function(item4){
//            if(item4.sfsResourceId==item.id){
//              push=false;
//            }
//          })
//          if(push){
//            vm.checkBox.push(obj);
//          }
//          if(item.parentId!=null){
//            vm.resourceData.forEach(function(item2){
//              if(item.parentId==item2.id){
//
//                var obj={};
//                obj.sfsResourceId=item.parentId;
//
//                vm.checkBox.forEach(function(item4){
//                  if(item4.sfsResourceId==item.parentId){
//                    push=false;
//                  }
//                })
//                if(push){
//                  vm.checkBox.push(obj);
//                }
//
//                if(item2.parenyId!=null){
//                  vm.resourceData.forEach(function(item3){
//                    if(item2.parenyId==item3.id){
//                      var obj={};
//                      obj.sfsResourceId=item2.parenyId;
//                      vm.checkBox.forEach(function(item4){
//                        if(item4.sfsResourceId==item2.parenyId){
//                          push=false;
//                        }
//                      })
//                      if(push){
//                        vm.checkBox.push(obj);
//                      }
//                    }
//                  })
//                }
//              }
//            })
//          }
//
//        })
      },
      getDepartmentResource(id){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/roleresource/get',
          session:vm.session,
          data:{
            id:id,
            pageInfo:{
              pageSize:100,
              pageNum:1
            }
          },
          callback:function(data){
            if(data.ret.errorCode===0){
              vm.resourceDataArr=[];
              vm.resourceData.forEach(function(item){
                var off=false;

                for(var i=0;i<data.resourceRows.length;i++){
                  if(item.id== data.resourceRows[i].sfsResourceId){
                    off=true;

                    //处理父级别菜单

                    if(item.parenyId){
                      var  off2=true;
                      vm.resourceDataArr.forEach(function(items){
                        if(items.id==item.parenyId){
                          off2=false;
                        }
                      })
                      if(off2){
                        for(var j=0;j<vm.resourceData.length;j++){

                          if(vm.resourceData[j].id==item.parenyId){

                            vm.resourceDataArr.push(vm.resourceData[j]);

                            if(vm.resourceData[j].parenyId){
                              var  off3=true;
                              vm.resourceDataArr.forEach(function(item2){
                                if(item2.id==vm.resourceData[j].parenyId){
                                  off3=false;
                                }
                              })
                              if(off3){
                                for(var k=0;k<vm.resourceData.length;k++){
                                  if(vm.resourceData[j].parenyId==vm.resourceData[k].id){
                                    vm.resourceDataArr.push(vm.resourceData[k]);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    //处理父级别菜单结束

                  }
                }
                if(off){
                  vm.resourceDataArr.push(item)
                }

              });
              vm.setCheckBoxData(vm.resourceDataArr);
            }
          }
        })
      },
      valueChange(){

        var vm=this;
        clearTimeout(vm.tiemr);
        vm.tiemr=setTimeout(function(){
          vm.$nextTick(function(){
            vm.formData.roleId=vm.role.id;
            if(vm.formData.roleId){
              vm.getDepartmentResource(vm.formData.roleId);
            }else{
              vm.getDepartmentResource('123');
            }
          })
        },200)

      }
    },
    mounted:function(){
      if(!this.$route.params.data){
        this.$router.push('/staff')
        return
      }
      var vm=this;
//      this.$set(this.formData,'code',this.$route.params.data.code);
      this.$set(this.formData,'loginName',this.$route.params.data.loginName);
      this.$set(this.formData,'name',this.$route.params.data.name);
      this.$set(this.formData,'idCardNo',this.$route.params.data.idCardNo);
      this.$set(this.formData,'departmentId',this.$route.params.data.departmentId);
      this.$set(this.formData,'departmentName',this.$route.params.data.departmentName);
      this.$set(this.department,'name',this.$route.params.data.departmentName);
      this.$set(this.department,'id',this.$route.params.data.departmentId);
      this.$set(this.role,'id',this.$route.params.data.roleId);
      this.$set(this.role,'name',this.$route.params.data.roleName);
      this.$set(this.formData,'roleId',this.$route.params.data.roleId);
      this.$set(this.formData,'roleName',this.$route.params.data.roleName);
      this.$set(this.formData,'mobile',this.$route.params.data.mobile);
      this.$set(this.formData,'id',this.$route.params.data.id);
      this.$set(this.formData,'sex',this.$route.params.data.sex);
      this.$set(this.formData,'provinceId',this.$route.params.data.provinceId);
      this.$set(this.formData,'cityId',this.$route.params.data.cityId);
      this.$set(this.formData,'areaId',this.$route.params.data.areaId);
      if(this.$route.params.data.provinceId==null){
        var get=new RemoteCall();
        get.init({
          router:'/base/role/get',
          session:vm.session,
          async:false,
          data:{
            id:vm.role.id,
          },
          callback:function(data){
            if(data.ret.errorCode===0){
                vm.startArea=data.rows[0].areaId;
                if(vm.formData.provinceId){
                  vm.startAreaData={};
                  vm.startAreaData.provinceId=vm.formData.provinceId;
                  vm.startAreaData.cityId=vm.formData.cityId;
                  vm.startAreaData.areaId=vm.formData.areaId;
                }
            }
          }
        })
      }else{
        if(vm.formData.provinceId){
          vm.startAreaData={};
          vm.startAreaData.provinceId=vm.formData.provinceId;
          vm.startAreaData.cityId=vm.formData.cityId;
          vm.startAreaData.areaId=vm.formData.areaId;
        }
      }
      this.getResource();
      this.valueChange();
      if(this.departmentId!="214953758759583744"){
        this.disabled=true;
      }else{
        this.disabled=false;
      }
    },
    watch:{
      department:{
        handler:function(newVal,oldVal){
          this.departmentId=newVal.id;
        },
        deep:true
      }
    }
  }
</script>
<style lang="scss">
  #StaffUpdate{
    background: #fff;
    padding-bottom:40px;
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
      width: 720px;
      margin:60px auto;
      .el-form-item{
        margin-bottom:22px;
      }
      .menu-box{
        width: 410px;
        height:366px;
        margin-top:10px;
        overflow: auto;
        padding-left:10px;
        padding-top:10px;
        border:1px solid #e8e8e8;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;

      }
      .address{
        width:430px;
      }
      .el-button{
        width:100px;
      }
      .el-icon-caret-right:before {
        content: "";
      }
      .el-tree{
        border:0;
      }
    }

  }
</style>
