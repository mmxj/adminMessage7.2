<template>
  <div id="Staff">
    <div class="search">
      <el-form
        :inline="true"
        class="form-search"
      >
        <el-form-item>
          <el-input size="small" v-model="keyword" @keyup.enter.native="search" placeholder="请输入员工名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="search" >查询</el-button>
        </el-form-item>
      </el-form>
      <!--新增按钮-->
      <div class="addNews">
        <el-button size="small" type="primary" @click="$router.push('/staffadd')"><i class="el-icon-plus"></i>新增员工</el-button>
      </div>
    </div>


    <!--表格-->
    <div class="table-warp">
      <el-table
        :data="tableData"
        size="mini"
        style="width:100%"
        v-loading="loading"
      >
        <el-table-column align="center" label="序号" prop="index" min-width="50"></el-table-column>
        <el-table-column align="center" label="账号名称" prop="name" min-width="100"></el-table-column>
        <el-table-column align="center" label="登录账号" prop="loginName" min-width="60"></el-table-column>
        <el-table-column align="center" label="员工编号" prop="id" min-width="100"></el-table-column>
        <el-table-column align="center" label="所属部门" prop="departmentName" min-width="100"></el-table-column>
        <el-table-column align="center" label="所属角色" prop="roleName" min-width="100"></el-table-column>
        <el-table-column align="center" label="所属权限" min-width="60" >
          <template slot-scope="scope">
            <span class="button" @click="hasResourceData(scope.row.id)">查看</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="所属区域" prop="address">
          <template slot-scope="scope">
            <ReadArea :startAreaData="{areaId:scope.row.areaId,cityId:scope.row.cityId,provinceId:scope.row.provinceId}"></ReadArea>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="" min-width="100">
          <template slot-scope="scope">
            <span class="button" @click="$router.push({name:'StaffUpdate',params:{data:scope.row}})">编辑</span>
            <span class="button" @click="deleteFaq(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pagination clearfix">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="权限"
      width="30%"
      :visible.sync="dialogVisible"
    >
      <el-tree
        class="filter-tree"
        :data="checkBoxData"
        default-expand-all
        ref="tree2">
      </el-tree>
    </el-dialog>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  import ReadArea from '@/common/ReadArea'
  export default{
    components:{
      ReadArea
    },
    data(){
      return {
        tableData: [],
        currentPage: 1,//初始化分页
        total: 20,
        pageNum: 1,
        session: sessionStorage.getItem('session'),
        companyId: sessionStorage.getItem('companyId'),
        keyword:null,
        dialogVisible: false,
        checkBoxData:[],
        resourceData:null,
        departmentId:sessionStorage.getItem('departmentId'),
        roleId:sessionStorage.getItem('roleId'),
        staffId:sessionStorage.getItem('staffId'),
        staffAreaId:sessionStorage.getItem("areaId"),
        staffCityId:sessionStorage.getItem("cityId"),
        staffProvinceId:sessionStorage.getItem("provinceId"),
        loading:false
      }
    },
    methods: {
      handleCurrentChange(val){//页面跳转事件
        this.pageNum = val;
        this.keyword=unit.removeEmptyString(this.keyword);
        this.getDepartment(this.keyword);
      },
      getDepartment(keyword){//
        var vm = this;
        vm.loading=true;
        var get = new RemoteCall();
        if(keyword){
           var  name=keyword;
        }else{
            var name =null;
        }

        if(this.departmentId=='214953758759583744'){
          var departmentId=null;
          var roleId=null
        }else{
          var departmentId=this.departmentId;
          var roleId=this.roleId
        }
        get.init({
          router: '/company/staff/get',
          session: vm.session,
          data: {
            pageInfo: {
              pageSize: 10,
              pageNum: vm.pageNum
            },
            companyId:vm.companyId,
            name:name,
            departmentId:departmentId,
            roleId:roleId,
            areaId:unit.removeEmptyString(vm.staffAreaId),
            cityId:unit.removeEmptyString(vm.staffCityId),
//            provinceId:unit.removeEmptyString(vm.staffProvinceId),
          },
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              if (data.pageInfo.total) {
                if (data.pageInfo.total > 0) {
                  vm.total = data.pageInfo.total
                }
              } else if (data.pageInfo.total === 0) {
                vm.total = 0
              };
              vm.tableData = [];
              data.rows.forEach(function (item, i) {
                item.index=(i+1)+((vm.pageNum-1)*10)
                vm.$set(vm.tableData, i, item)
              })
            }
            setTimeout(function(){
                vm.loading=false;
            },200)
          }
        })
      },
      deleteFaq(id){
        var vm=this;
        if(vm.staffId==id){
          vm.$confirm('不能删除自己的账号', '提示')
        }else{
          vm.$confirm('确定删除该员工', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var remote = new RemoteCall();
            remote.init({
              router: '/company/staff/delete',
              session: vm.session,
              data: {
                id:id
              },
              callback: function (data) {
                if (data.ret.errorCode === 0) {
                  vm.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                  vm.getDepartment();
                }
              }
            })
          })
        }

      },
      search(){
        this.pageNum=1;
        this.keyword=unit.removeEmptyString(this.keyword);
        this.getDepartment(this.keyword);
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
      hasResourceData(id){
        var vm=this;
        this.dialogVisible=true;
        vm.checkBoxData=[];
        vm.getDepartmentResource(id);
      },
      getDepartmentResource(id){
        var vm=this;
        var get=new RemoteCall();
        get.init({
          router:'/base/staffresource/get',
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
      },
    },
    mounted: function () {
        this.getDepartment();
      this.getResource();
    }
  }
</script>
<style lang="scss">
  #Staff {
    background: #fff;
    padding: 24px 0;
    .form-search {
      text-align: center;
      padding-bottom:10px;
      border-bottom: 1px solid #e8e8e8;
      .el-input {
        width: 280px;
      }
      .el-button {
        width: 100px;
      }
    }
    .search{
      position: relative;
    }
    .addNews {
      position: absolute;
      top: 4px;
      left:32px;
      .el-icon-plus {
        font-size: 12px;
        margin-right: 23px;
        line-height: 14px;
        vertical-align: center;
      }
      .el-button {
        vertical-align: center;
        padding-right: 30px;
        padding-left: 10px;
        /*background: #1890ff;*/
      }
    }
    /*.addNews {*/
      /*padding: 0 32px;*/
      /*.el-icon-plus {*/
        /*font-size: 12px;*/
        /*margin-right: 23px;*/
        /*line-height: 14px;*/
        /*vertical-align: center;*/
      /*}*/
      /*.el-button {*/
        /*vertical-align: center;*/
        /*padding-right: 35px;*/
        /*padding-left: 15px;*/
        /*background: #1890ff;*/
      /*}*/
    /*}*/
    .table-warp {
      padding: 0 32px;
      margin-top: 20px;
      .button {
        color: #1890ff;
        padding: 0 5px;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .el-pagination {
      float: right;
      margin-right: 30px;
      font-weight: normal;
      margin-top: 10px;
    }
    .el-dialog__body{
      padding:10px 20px;


    }
    .el-tree{
      border:0;
      margin-bottom: 20px;
    }
    .filter-tree{
      background: #fafafa;
      height:300px;
      padding:10px;
      overflow: auto;
      .el-icon-caret-right:before {
        content: "";
      }
    }
  }
</style>
