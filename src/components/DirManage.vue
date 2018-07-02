<template>
  <div id="DirManage">
    <div>
      <el-row :gutter="20">
        <el-col :span="2">
          <label for="">使用范围：</label>
        </el-col>
        <el-col :span="6">
          <Province :propdata="sendData"></Province>
        </el-col>
        <el-col :span="2">
          <label for="">药品名称：</label>
        </el-col>
        <el-col :span="6">
          <input type="text" v-model="sendData.itemNameCh">
        </el-col>
        <el-col :span="2">
          <el-button class="find" @click="getCatalog">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="dirTable">
      <div class="dirTable">
        <el-table :data="tableData" border width="100%" align="center">
          <el-table-column prop="itemNo" label="项目编码" width="120"></el-table-column>
          <el-table-column prop="itemNameCh" label="药品名称" width="300"></el-table-column>
          <el-table-column prop="companyName" label="归属医院" min-width="100"></el-table-column>
          <el-table-column prop="companyId" label="归属医院" min-width="100"></el-table-column>
          <el-table-column prop="areaName" label="归属地区" min-width="100"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteCharging(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Province from '@/common/Province'
  export default{
    components: {
      Province
    },
    data(){
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        session: sessionStorage.getItem('session'),
        tableData: [],
        sendData: {},
        pageInfo: {}
      }
    },
    methods: {
      handleSizeChange(val) {

        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getCatalog();
      },
      getCatalog(){//获取目录数据
        var vm = this;
        if (vm.sendData.itemNameCh == '') {
          vm.sendData.itemNameCh = null;
        }
        this.pageInfo.pageSize = this.pageSize;
        this.pageInfo.pageNum = this.currentPage;
        this.sendData.pageInfo = this.pageInfo;
        var getCatalog = new RemoteCall();
        getCatalog.init({
          router: "/base/hospital_charging_item_detail/get",
          session: this.session,
          data: vm.sendData,
          callback: this.getCallback,
          errorCallback: function (data) {
            if (data) {
              vm.$router.push('/login')
            }
          }
        })
      },
      getCallback(data){
        if (data.pageInfo.total) {
          this.total = data.pageInfo.total;
        }
        console.log(data);
        this.tableData = data.rows;
      },
      deleteCharging(data){//删除目标
        var vm = this;
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var listId = vm.tableData[data.$index].id;

          var del = new RemoteCall();
          del.init({
            router: '/base/hospital_charging_item_detail/delete',
              session: vm.session,
              data: {
                id: listId
              },
              callback: function (data) {
                if (data.ret.errorCode == 0) {
                  vm.$alert('删除成功', '提示', {
                    confirmButtonText: '确定',
                    callback: function () {
                      vm.getCatalog();
                    }
                  });
                } else {
                  vm.$alert('删除失败', '提示', {
                    confirmButtonText: '确定'
                  });
                }
              },
            errorCallback: function (data) {
              vm.$alert('删除失败' + data.responseText, '提示', {
                confirmButtonText: '确定',
              })
              }
            })
        }).catch(() => {

        });
      }
    },
    mounted: function () {
    }
  }
</script>
<style lang="scss" scoped>
  #DirManage {
    margin: 15px;
    padding: 15px;
    padding-top: 40px;
    background: #fff;
  }

  label {
    display: block;
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: right;
  }

  .el-col {
    input {
      height: 30px;
      width: 100%;
      border: 1px solid #aaa;
      border-radius: 4px;
    }
    .find {
      color: #fff;
      background: #32BC6F;
      border: 0;
    }
  }

  .dirTable {
    margin-top: 30px;
  }

  @media screen and (max-width: 1510px) {
    .el-col-2 {
      width: 12%;
    }
  }

  .dirTable {
    min-height: 600px;
  }
</style>
<style type="text/css" lang="scss">
  #DirManage {
    .distpicker select {
      width: 32% !important;
      height: 36px;
      line-height: 36px;
      padding: 0.25rem;
      outline: none;
      border: 1px solid #aaa
    }

  }

</style>
