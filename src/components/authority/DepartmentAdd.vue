<template>
  <div id="DepartmentAdd">
    <div class="breadcrumb">
      <span class="location">位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/department' }">部门管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建部门</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrap">
        <el-form ref="formData" :model="formData" label-width="100px" :rules="rules">
          <el-form-item label="部门编号："  prop="code">
            <el-input size="small" v-model="formData.code" type="text"></el-input>
          </el-form-item>
          <el-form-item label="部门名称：" prop="name">
            <el-input size="small" v-model="formData.name"  type="text"></el-input>
          </el-form-item>
          <el-form-item label="部门权限：">
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
          <el-form-item label="部门区域：">
            <div class="address">
              <Province :propdata="formData"></Province>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="submit">保存</el-button>
            <el-button size="small" class="other-button" @click="$router.push('/department')">关闭</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
  import Province from '@/common/Province'
  import unit from '@/unit/unit.js'
  export default{
      components:{
        Province
      },
      data(){
          return{

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
            rules:{
                code:[
                  {required:true,message:'请输入部门编号',trigger:'blur'},
                ],
                name:[
                  {required:true,message:'请输入部门名称',trigger:'blur'},
                ],
              },
            defaultProps: {
              children: 'children',
              label: 'label'
            },
            checkoutoff:true,
            checkBox:[],
            resourceData:null
          }
    },
    methods:{
      getCheck(){
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
//              if(item4.sfsResourceId==item.id){
//                push=false;
//              }
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

       submit(){
           var vm=this;
          vm.formData=unit.removeEmptyString(vm.formData);
            this.getCheck();
            this.checkout();
            console.log(vm.checkBox)
           if(this.checkoutoff){
             var set=new RemoteCall();
             set.init({
               router:'/company/department/add',
               session:vm.session,
               data:vm.formData,
               callback:function(data){
                   if (data.ret.errorCode === 0&&data.ret.errorMessage!='name重复') {
                     vm.$nextTick(function(){
                       var get=new RemoteCall();
                       get.init({
                         router:'/company/department/get',
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
                             vm.$nextTick(function(){
                                 console.log(datas.rows[0]);
                               vm.setResource(datas.rows[0].id);
                             })
                           }
                         }
                       })
                     })
                   }else{
                     if(data.ret.errorMessage=='name重复'){
                       vm.$alert('部门已存在');
                     }else{
                       vm.$alert(data.ret.errorMessage);
                     }
                   }
               }
             })
           }
       },
        setResource(id){
           var vm=this;
           console.log(Number(id))
           var set=new RemoteCall();
           set.init({
             router:'/base/departmentresource/add',
             session:vm.session,
             data:{
               departmentId:id,
               resourceRows:vm.checkBox,
             },
             callback:function(data){
               if (data.ret.errorCode === 0) {
                   vm.$alert('添加成功', '提示', {
                     confirmButtonText: '确定',
                     callback: () => {
                       vm.formData=vm.formDataStart;
                       vm.checkBox=[];
                       vm.resetChecked()
                     }
                   })
                 }
             }
           })
        },
        checkout(){
             if(this.formData.code==null){
               this.$alert('部门编号不能为空');
               this.checkoutoff=false;
             }else if(this.formData.name==null){
                this.$alert('部门名称不能为空');
                this.checkoutoff=false;
             }else{
                 this.checkoutoff=true;
             }
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
                  vm.setCheckBoxData(data.rows)
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
          data.forEach(function(item){
             item.code=item.code.split("-");
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
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },

    },
    mounted:function(){
          this.getResource();
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
