<template>
  <div id="TerminalMessage">
    <div class="form-wrap">
      <el-form :inline="true">
        <el-form-item label="商户名称" label-width="100px">
          <el-input size="small" v-model="form.merchantName" placeholder="请输入商户名称"></el-input>
          <!--<GetCompany :data="company" :holder="'请输入商户名称'"></GetCompany>-->
        </el-form-item>
        <el-form-item label="终端号" label-width="100px">
          <el-input size="small" v-model="form.terminalNo" placeholder="请输入终端编号"></el-input>
        </el-form-item>
        <el-form-item label="安装地址" label-width="100px">
          <el-input size="small" v-model="form.address" placeholder="请输入安装地址"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-wrap">
            <el-button @click="sreachget">查询</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--<div class="apply">-->
    <!--<el-button class="apply-button" @click="goRoute">终端申请</el-button>-->
    <!--</div>-->
    <div class="table-wrap">
      <el-table
        :data="tableData"
        size="mini"
        style="width:100%"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="loading"
      >
        <el-table-column align="center" label="归属商户" prop="merchantName" min-width="100"></el-table-column>
        <el-table-column align="center" label="商户号" prop="merchantNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="终端编号" prop="terminalNo" min-width="100"></el-table-column>
        <el-table-column align="center" label="终端密钥索引" prop="mainKeyId" min-width="130"></el-table-column>
        <el-table-column align="center" label="PSAM卡号" prop="pSimNo" min-width="120"></el-table-column>
        <el-table-column align="center" label="安装地址" prop="address" min-width="100"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="收单机构" prop="acquirerName" min-width="100"></el-table-column>
        <el-table-column align="center" label="详情" min-width="100">
          <template  slot-scope="props">
            <span class="button" @click="show(props.$index)">{{props.$index == expands[0] ? '收起' : '展开'}}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand" v-if="off">
          <template slot-scope="props">
            <el-form label-position="left" inline class="expand-wrap">
              <el-form-item label="维护公司：" label-width="110px">
                <span>{{props.row.maintainCompany}}</span>
              </el-form-item>
              <el-form-item label="终端经纬度：" label-width="110px">
                <span>{{props.row.position}}</span>
              </el-form-item>
              <el-form-item label="代理申请主体：" label-width="110px">
                <span>{{props.row.agency}}</span>
              </el-form-item>
              <el-form-item label="开通日期：" label-width="110px">
                <span>{{props.row.sfsCreate}}</span>
              </el-form-item>
              <el-form-item label="终端型号：" label-width="110px">
                <span>{{props.row.model}}</span>
              </el-form-item>
              <el-form-item label="终端厂家：" label-width="110px">
                <span>{{props.row.terminalCompany}}</span>
              </el-form-item>
              <el-form-item label="终端状态：" label-width="110px">
                <span>{{props.row.enableFlag}}</span>
              </el-form-item>
              <el-form-item label="明文密钥：" label-width="110px">
                <span>{{props.row.mainKey}}</span>
              </el-form-item>
              <el-form-item label="归属地区：">
                <!--<span>{{props.row.areaId}}</span>-->
                <!--<ReadArea></ReadArea>-->
                <ReadArea :areaId="props.row.areaId"></ReadArea>
              </el-form-item>
              <el-form-item label="详细安装地址：" label-width="110px" style="width:100%">
                <span>{{props.row.address}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  import GetCompany from '@/common/GetCompany';
  import ReadArea from '@/common/ReadArea';
  export default{
    components: {
      GetCompany,
      ReadArea
    },
    data(){
      return {
          off:true,
        form: {},
        company: {},
        currentPage: 1,
        tableData: [],
        session: sessionStorage.getItem('session'),
        getRowKeys(row) {
          return row.index
        },
        expands: [],
        total: 0,//总条数
        pageNum: 1,//单前页码,
        staffAreaId:sessionStorage.getItem("areaId"),
        staffCityId:sessionStorage.getItem("cityId"),
        staffProvinceId:sessionStorage.getItem("provinceId"),
        loading:false
      }
    },
    methods: {
      handleCurrentChange(val){
        this.pageNum = val;
        this.sreach()
      },
      show(data){
        if (this.expands[0] !== data) {
          this.expands = [];
          this.expands.push(data);
        } else {
          this.expands = [];
        }
      },
      goRoute(){
        this.$router.push('/terminaladd')
      },
      getTerminal(){ //获取终端信息
        this.loading=true;
        var vm = this;
        vm.tableData = [];
        var getterminal = new RemoteCall();
        getterminal.init({
          router: '/base/terminal/get',
          session: vm.session,
          data: {
            areaId:vm.staffAreaId,
            cityId:vm.staffCityId,
            provinceId:vm.staffProvinceId,
            pageInfo: {
              pageSize: 10,
              pageNum: vm.pageNum
            }
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
                item.index = i
                item.enableFlag = unit.enableFlag(item.enableFlag);
                vm.$set(vm.tableData, i, item)
              })
            }
            setTimeout(function(){
              vm.loading=false;
            },200)
          }
        })
      },//获取终端信息
      sreachget(){
          this.pageNum=1;
          console.log(this.form)
          this.sreach();
      },
      sreach(){//根据条件查询终端信息 缺少地址查询的功能
//        this.form.companyId=this.company.id;
        this.loading=true;
        var vm = this;
        this.form.pageInfo = {
          pageSize: 10,
          pageNum: vm.pageNum
        };
        this.form.areaId=vm.staffAreaId;
        this.form.cityId=vm.staffCityId,
        this.form.provinceId=vm.staffProvinceId,
        this.form=unit.removeEmptyString(this.form);

        var searchCompany = new RemoteCall();
        searchCompany.init({
          router: '/base/terminal/get',
          session: vm.session,
          data: vm.form,
          callback: function (data) {
            vm.loading=false;
            if (data.pageInfo.total) {
              if (data.pageInfo.total > 0) {
                vm.total = data.pageInfo.total
              }
            } else if (data.pageInfo.total === 0) {
              vm.total = 0
            }
            vm.tableData = [];
            data.rows.forEach(function (item, i) {
              item.index = i;
              item.enableFlag = unit.enableFlag(item.enableFlag);
              vm.$set(vm.tableData, i, item)
            })
          }
        })
      },//根据条件查询
    },
    mounted: function () {
      this.getTerminal();
      this.off=false;
    }
  }
</script>
<style scoped>
  #TerminalMessage {
    background: #fff;
    padding: 20px 0;
  }
  .el-button {
    color: #fff;
    height: 30px;
    line-height: 0px;
    marign-top: 3px;
  }

  .button-wrap {
    width: 90px;
    text-align: right;
    display: inline;
  }

  .el-input {
    width: 280px;
  }

  .form-wrap {
    border-bottom: 1px solid #e8e8e8;
  }

  @media screen and (max-width: 1600px) {
    /*.el-input{*/
    /*width:240px;*/
    /*}*/
  }

  .demo-table-expand {
    font-size: 0;
  }

  .el-button {
    width: 100px;
    margin-left:28px;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .table-wrap {
    margin: 20px 0;
    padding: 0 32px;
  }

  .el-pagination {
    float: right;
    margin-right: 30px;
    font-weight: normal;
  }

  .demo-table-expand {
    text-align: left;
  }

  .apply {
    padding: 20px 32px 0 32px;
  }

  .button {
    color: #1890ff;
    padding: 0 10px;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
<style lang="scss">

  .el-table__expand-column .cell {
    width: 0;
    marign: 0;
    padding: 0;
    display: none;
  }

  .el-table__expand-column {
    width: 0 !important;
    marign: 0;
    padding: 0;
  }
  .expand-wrap{
    .el-form-item{
      margin:0;

      span{
        display: block;
        font-size:12px;
        width: 280px;
      }
      .el-form-item__label,.el-form-item__content{
        line-height: 26px;
        font-size:12px;
      }
    }
  }
</style>
