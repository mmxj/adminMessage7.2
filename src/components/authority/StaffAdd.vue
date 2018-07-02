<template>
  <div id="StaffAdd">
    <div class="breadcrumb">
      <span class="location">位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/staff' }">员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增员工</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <el-form ref="formData" :model="formData" label-width="100px"  :rules="rules">
        <el-form-item label="账号名称：" prop="loginName">
          <el-input size="small" v-model="formData.loginName" type="text"></el-input>
        </el-form-item>
        <el-form-item label="账号密码：" class="is-required">
          <el-input  size="small"  v-model="password"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名：">
          <el-input  size="small"  v-model="formData.name"  type="text"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input size="small" v-model="formData.idCardNo" type="text"></el-input>
        </el-form-item>
        <el-form-item label="归属部门：" class="is-required">
          <GetDepartment :data="department" :start="startdepartment" :disabled="disabled"></GetDepartment>
        </el-form-item>
        <el-form-item label="归属角色："  class="is-required">
          <GetRole :data="role" @valueChange="valueChange" :start="startRole"  :departmentId.sync="departmentId" :father="true" :holder="'先选择部门再选角色'" :disabled="disabled"></GetRole>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input size="small" v-model="formData.mobile" type="text"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-model="formData.sex">
            <el-option v-for="item in sexOption" :value="item.value" :key="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色权限："  class="is-required">
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
            <Province :propdata="formData" :startArea.sync="area"  :disabled="disabled" :startAreaData.sync="startAreaData"></Province>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="submit">确定</el-button>
          <el-button size="small" class="other-button" @click="$router.push('/role')">关闭</el-button>
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
    computed:{
    },
    data(){
      return{
        department:{
        },
        departmentId:null,
        role:{

        },
        rules:{
          loginName:[
            {required:true,message:'账号名称不能为空',trigger:'blur'}
          ],
          password:[
            {required:true,message:'账号密码不能为空',trigger:'blur'}
          ],

        },
        password:null,
        sexOption:[
          {
              value:'1',
              label:'男'
          },{
            value:'2',
            label:'女'
          }
        ],
        formData:{
          idCardType:1,
          staffType:0,
          companyId:sessionStorage.getItem('companyId'),
        },
        formDataStart:{
          idCardType:1,
          staffType:0,
          companyId:sessionStorage.getItem('companyId'),
        },
        session:sessionStorage.getItem('session'),
        checkBoxData:[
//              {
//                  id:1,
//                  label:'首页',
//                  children:[
//                    {
//                        id:2,
//                        label:'二级菜单'
//                    }
//                  ]
//              },
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
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
        area:null,
        startAreaData:null,
        checkoutoff:false
      }
    },
    methods:{
      submit(){
        var vm=this;
        this.getCheck();
        var set=new RemoteCall();
        this.checkout();
        vm.formData.departmentId=vm.department.id;
        vm.formData.roleId=vm.role.id;
        if(this.checkoutoff){
          vm.formData.password = $.md5(vm.password).toUpperCase();

          if(vm.checkBox.length<1){
            this.$alert('请选择角色权限');
            return
          }
          set.init({
            router:'/company/staff/add',
            session:vm.session,
            data:vm.formData,
            callback:function(data){

              if (data.ret.errorCode === 0) {
                vm.$nextTick(function(){
                  var get=new RemoteCall();
                  get.init({
                    router:'/company/staff/get',
                    session:vm.session,
                    data:{
                      name:vm.formData.name,
                      companyId:sessionStorage.getItem('companyId'),
                      pageInfo:{
                        pageSize:100,
                        pageNum:1
                      }
                    },
                    callback:function(datas){
                      if(datas.ret.errorCode===0){
                        vm.setResource(datas.rows[0].id);
                      }
                    }
                  })
                })
              }else{
                vm.$alert(data.ret.errorMessage)
              }
//              vm.$alert('添加成功', '提示', {
//                confirmButtonText: '确定',
//                callback: () => {
//                  vm.formData=vm.formDataStart;
//                  vm.department={};
//                  vm.role={};
//                }
//              })
            }

          })
        }

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
              vm.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.formData=vm.formDataStart;
                  vm.checkBox=[];
                  vm.password=null;
                  vm.resetChecked()
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
      },
      checkout(){
        if(this.formData.loginName==null){
          this.$alert('请填写账号名称');
          this.checkoutoff=false;
        }else if(this.password==null){
          this.$alert('请填写账号密码');
          this.checkoutoff=false;
        }else if(this.department.id==null){
          this.$alert('请选择部门');
          this.checkoutoff=false;
        }else if(this.formData.provinceId==null){
          this.$alert('请选择区域');
          this.checkoutoff=false;
        }else{
          this.checkoutoff=true;
        }
      },
      getRoleResource(id){
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
              vm.setCheckBoxData(vm.resourceDataArr)
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
              vm.getRoleResource(vm.formData.roleId);
            }
          })
        },200)
      },
      getRoleName(){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/role/get',
          session:vm.session,
          async:false,
          data:{
              id:vm.roleId,
          },
          callback:function(data){
              if(data.ret.errorCode===0){
//                  vm.roleName=data.rows[0].name;
                  vm.$set(vm,'roleName',data.rows[0].name)
                if(data.rows[0].areaId==0){

                }else{
                  vm.area=data.rows[0].areaId;
                  vm.startAreaData={};
                  vm.startAreaData.provinceId=data.rows[0].provinceId;
                  vm.startAreaData.cityId=data.rows[0].cityId;
                  vm.startAreaData.areaId=data.rows[0].areaId;
                }
              }
          }
        })
      }
    },
    mounted:function(){
      this.getResource();
      this.getRoleName();

      this.$set(this,'startdepartment',this.departmentName);
      this.$set(this,'startRole',this.roleName);
      this.department.id=this.departmentId;
      this.role.id=this.roleId;
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
  #StaffAdd{
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
