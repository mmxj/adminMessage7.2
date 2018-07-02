<template>
  <div id="User">
      <div class="form-wrap">
        <el-form inline :model="formData">
          <el-form-item label="姓名：" labelWidth="100px">
            <el-input size="small" v-model="formData.idCardName"></el-input>
          </el-form-item>
          <el-form-item label="身份证：" labelWidth="100px">
            <el-input size="small" v-model="formData.idCardNo"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" labelWidth="100px">
            <el-input size="small" v-model="formData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="注册日期"  labelWidth="100px">
            <el-date-picker
              v-model="timer"
              type="daterange"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item labelWidth="100px">
            <el-button size="small" @click="search" type="primary" >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          style="width:100%"
          max-height="900"
          v-loading="loading"
        >
          <el-table-column align="center" prop="ordinal" label="序号"  min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="idCardName" label="姓名"  min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="idCardNo" label="身份证号"  min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="moblie" label="手机号码"  min-width="100">
          </el-table-column>
          <el-table-column align="center" label="是否绑定社保卡"  min-width="100">
            <template  slot-scope="props">
              {{props.row.bindSecurityCardFlag==1?'是':'否'}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="bindBankCardFlag" label="是否绑定银行卡"  min-width="100">
            <template slot-scope="props">
              {{props.row.bindBankCardFlag==1?'是':'否'}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sfsCreate" label="绑卡日期"  min-width="100">
          </el-table-column>
          <el-table-column align="center" label="管理" min-width="80">
              <template slot-scope="props">
                <span class="button" @click="$router.push({name:'UserList',params:{data:props.row}})">用户详情</span>
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
  </div>
</template>
<script>
  import unit from '@/unit/unit.js';
  export default{
      data(){
          return {
            formData:{},
            tableData:[],
            pageNum:1,
            currentPage:1,
            total:0,
            session:sessionStorage.getItem('session'),
            timer:[],
            loading:false,
          }
      },
      methods:{
        search(){
          this.pageNum=1;
          this.getList();
        },
        getList(){
            var vm=this;
            vm.loading=true;
          if(this.timer){
            if(this.timer[0]){
              this.formData.beginCreate=this.timer[0]+ ' 00:00:00';
            }else{
              this.formData.beginCreate=null;
            }
            if(this.timer[1]){
              this.formData.endCreate=this.timer[1]+ ' 23:59:59'
            }else{
              this.formData.endCreate=null;
            }
          }else{
            this.formData.beginCreate=null;
            this.formData.endCreate=null;
          }
            this.formData.pageInfo={
                pageSize:10,
                pageNum:this.pageNum
            }
          this.formData=unit.removeEmptyString(this.formData);

          var get=new RemoteCall();
          get.init({
            session:vm.session,
            router:'/user/multi/get',
            data:this.formData,
            callback:function(data){

                  if(data.ret.errorCode===0){
                    if (data.pageInfo.total) {
                      if (data.pageInfo.total > 0) {
                        vm.total = data.pageInfo.total
                      }
                    } else if (data.pageInfo.total === 0) {
                      vm.total = 0
                    }
                    vm.tableData=data.rows;
                    vm.tableData.forEach(function(item,i){
                      item.ordinal = (i + 1) + 10 * (vm.pageNum - 1);
                    })
                }

                setTimeout(function(){
                  vm.loading=false;
                },200)

            }
          })
        },
        handleCurrentChange(val){
          this.pageNum=val;
          this.getList();
        },

      },
      mounted:function(){
        this.getList()
      }
  }
</script>
<style lang="scss">
  #User{
    background: #fff;
    .table-box{
      padding:10px 20px;
    }
    .form-wrap{
      padding:20px 20px 10px;
      border-bottom:1px solid #e8e8e8;
      .el-input{
        width: 280px;
      }
      .el-button{
        width:100px;
        margin-left:15px;
      }
      .el-date-editor {
        width:280px;
      }
    }
    .pagination{
      padding:10px 0;
      padding-bottom:20px;
      .el-pagination {
        float: right;
        margin-right: 30px;
        font-weight: normal;
        .el-input{
          width:60px;
        }
      }
    }
    .button {
      color: #1890ff;
      padding: 0 10px;
      cursor: pointer;
      text-decoration: underline;
    }

  }
</style>
