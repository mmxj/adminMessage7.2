<template>
  <div id="DepartmentAdd">
    <div class="breadcrumb">
      <span class="location">位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
      <el-form ref="formData" :model="formData" label-width="100px">
        <label class="el-form-item__label" style="width:100px">角色编号：</label>
        <el-form-item>
          <el-input size="small" v-model="formData.code" type="text"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：">
          <el-input size="small" v-model="formData.name"  type="text"></el-input>
        </el-form-item>
        <el-form-item label="归属部门：">
          <!--<el-input size="small"></el-input>-->
          <GetDepartment :data.sync="department" @valueChange="valueChange" :disabled="disabled" ></GetDepartment>
        </el-form-item>
        <el-form-item label="角色权限：">
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
        <el-form-item label="管辖区域：">
          <div class="address">
            <Province :propdata="formData"  :disabled="disabled" :startAreaData.sync="startAreaData"></Province>
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
  import Province from '@/common/Province';
  import GetDepartment from '@/common/GetDepartment';
  import unit from '@/unit/unit.js'
  export default{
    components:{
      Province,
      GetDepartment
    },
    data(){
      return{
        startArea:null,
        department:{},
        formData:{
          companyId:sessionStorage.getItem('companyId'),
        },
        formDataStart:{
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
        departmentId:sessionStorage.getItem('departmentId'),
        startAreaData:null,
      }
    },
    methods:{
      submit(){
        var vm=this;
        this.getCheck();
        var set=new RemoteCall();
        set.init({
          router:'/base/role/update',
          session:vm.session,
          data:vm.formData,
          callback:function(data){
            if (data.ret.errorCode === 0) {
              vm.setResource(vm.formData.id);
//              vm.$alert('修改成功', '提示', {
//                confirmButtonText: '确定',
//                callback: () => {
//                  vm.$router.push('/role')
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
          router:'/base/roleresource/add',
          session:vm.session,
          data:{
            roleId:id,
            resourceRows:vm.checkBox,
          },
          callback:function(data){
            if (data.ret.errorCode === 0) {
              vm.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  vm.$router.push('/role')
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
//              vm.setCheckBoxData(data.rows)
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
        });
        this.getRoleResource()
      },
      getRoleResource(){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/roleresource/get',
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
      },
      getDepartmentResource(id){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/departmentresource/get',
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
            vm.formData.departmentId=vm.department.id;
            if(vm.formData.departmentId){
              vm.getDepartmentResource(vm.formData.departmentId);
            }
          })
        },200)

      }
    },
    mounted:function(){
        var vm=this;
      if(!this.$route.params.data){
        this.$router.push('/Department')
        return
      }
      this.$set(this.formData,'code',this.$route.params.data.code);
      this.$set(this.formData,'name',this.$route.params.data.name);
      this.$set(this.formData,'provinceId',this.$route.params.data.provinceId);
      this.$set(this.formData,'cityId',this.$route.params.data.cityId);
      this.$set(this.formData,'areaId',this.$route.params.data.areaId);
      this.$set(this.formData,'id',this.$route.params.data.id);
      this.$set(this.department,'id',this.$route.params.data.departmentId);
      this.$set(this.department,'name',this.$route.params.data.departmentName);
      if(this.$route.params.data.provinceId==null){
        var get=new RemoteCall();
        get.init({
          router:'/company/department/get',
          session:vm.session,
          data:{
            id:vm.department.id,
            pageInfo:{
              pageSize:10,
              pageNum:1
            }
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
//        this.startArea=this.$route.params.data.areaId;
        if(vm.formData.provinceId) {
          vm.startAreaData = {};
          vm.startAreaData.provinceId = vm.formData.provinceId;
          vm.startAreaData.cityId = vm.formData.cityId;
          vm.startAreaData.areaId = vm.formData.areaId;
        }
      }

      this.valueChange();
      this.getResource();
      if(this.departmentId!="214953758759583744"){
        this.disabled=true;
      }
    }
  }
</script>
<style lang="scss">
  #DepartmentAdd{
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
