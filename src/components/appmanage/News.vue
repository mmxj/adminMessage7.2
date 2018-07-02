<template>
  <div id="News">
    <div class="search">
      <!--<img src="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do?download_type=2&file_name=1528782858296-banner2.png" alt="">-->
      <el-form
        :inline="true"
        :model="formSearch"
        class="form-search"
      >
        <el-form-item>
          <el-input size="small" v-model="keyword" placeholder="请输入标题信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!--新增按钮-->
      <div class="addNews">
        <el-button size="small" type="primary" @click="$router.push('/newsadd')"><i class="el-icon-plus"></i>新增</el-button>
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

        <el-table-column align="center" label="标题" prop="title" min-width="190">
          <template slot-scope="scope">
            <div class="newTitle">
              <img v-if="scope.row.topFlag==1" :src="topImg" alt="">
              {{scope.row.title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片" prop="" min-width="150">
          <template slot-scope="scope">
            <img :src="checkImg(scope.row.thumbImage)" class="image" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="seq" min-width="50"></el-table-column>
        <el-table-column align="center" label="状态" prop="enableFlag" min-width="80"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="sfsCreate" min-width="90"></el-table-column>
        <el-table-column align="center" label="发布时间" prop="publishDate" min-width="90"></el-table-column>
        <el-table-column align="center" label="置顶" prop="top" min-width="96">
          <template slot-scope="scope">
            <el-button class="top" size="mini" @click="chageTop(scope.row,0)" v-if="scope.row.topFlag==1">取消置顶</el-button>
            <el-button class="top" size="mini" @click="chageTop(scope.row,1)" v-else>置顶</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="" min-width="160">
          <template slot-scope="scope">
            <span class="button" @click="$router.push({name:'AppNewsUpdate',params:{data:scope.row}})">修改</span>
            <span class="button" @click="deleteNew(scope.row.id)">删除</span>
            <span class="button" @click="issue(scope.row)">{{scope.row.enableFlag == '已发布' ? '取消发布' : '发布'}}</span>
          </template>
        </el-table-column>
      </el-table>
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

  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default{
    data(){
      return {
        formSearch: {},
        topImg:require("@/assets/img/pic_uptop.png"),
        tableData: [{
          title: 1111,
          pictrue: 1111,
          index: 1111,
          src: 222222,
          status: 0,
          area: '11212',
          currentPage: 1,//初始化分页
          total: 20,
        }],
        keyword:null,
        session: sessionStorage.getItem('session'),
        currentPage: 1,//初始化分页
        total: 20,
        pageNum: 1,
        nofind:require('@/assets/img/nofind.png'),
        loading:true
      }
    },
    methods: {
      search(){
        var vm = this;
        vm.keyword=unit.removeEmptyString(vm.keyword);
        var getCarousel2 = new RemoteCall();
        getCarousel2.init({
          router: '/ips/article/get',
          session: vm.session,
          data: {
            pageInfo: {
              pageSize: 10,
              pageNum: vm.pageNum
            },
            title: vm.keyword
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
              data.rows.forEach(function (item) {
                item.enableFlag = vm.newsFlag(item.enableFlag)
              })
              vm.tableData = data.rows;
            }
          }
        })
      },
      handleCurrentChange(val){//页面跳转事件
        this.pageNum = val;
        this.getCarousel();
      },
      getCarousel(){
        var vm = this;
        var getCarousel2 = new RemoteCall();
        getCarousel2.init({
          router: '/ips/article/get',
          session: vm.session,
          data: {
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
              data.rows.forEach(function (item) {
                item.enableFlag = vm.newsFlag(item.enableFlag)
              })
              vm.tableData = data.rows;
              vm.loading=false;
            }
          }
        })
      },
      newsFlag(status){//状态转换 0|null = 未发布 1=发布
        if (status == 1) {
          return '已发布'
        } else {
          return '未发布'
        }
      },
      issue(data){
        var vm = this;
        var text = null;
        var flag = null;
        if (data.enableFlag == '未发布') {
          text = '发布';
          flag = 1;
        } else {
          text = '取消发布';
          flag = 0
        }
        vm.$confirm('确定' + text + '此条新闻', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var remote = new RemoteCall();
          remote.init({
            router: '/ips/article/update',
            session: vm.session,
            data: {
              id:data.id,
              enableFlag: flag
            },
            callback: function (data) {
              if (data.ret.errorCode === 0) {
                vm.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                vm.getCarousel();
              }
            }
          })
        })
      },
      deleteNew(id){
          var vm=this;
          this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var remote = new RemoteCall();
          remote.init({
            router: '/ips/article/delete',
            session: vm.session,
            data: {
              id: id
            },
            callback: function (data) {
              if (data.ret.errorCode === 0) {
                vm.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                vm.getCarousel();
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      chageTop(data,flag){//切换置顶
          var vm=this;
          var change=new RemoteCall();
          change.init({
            router:'/ips/article/update',
            session:vm.session,
            data:{
                id:data.id,
                topFlag:flag
            },
            callback:function(data){
              vm.getCarousel()
            }
          })
      },
      checkImg(url){
        var src=null;
        var vm=this;
        if(url){
          if(url.split('/').length>1){
            src=url
          }else{
            src="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do?download_type=2&file_name="+url;
          }
        }else{
          src= this.nofind;
        }
        return src
      }
    },
    mounted: function () {
        this.$nextTick(function(){
          this.getCarousel()
        })

    }
  }
</script>
<style lang="scss">
  #News {
    background: #fff;
    padding: 24px 0;
    .form-search {
      padding-bottom:10px;
      text-align: center;
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
        padding-right: 35px;
        padding-left: 15px;
        background: #1890ff;
      }
    }
    .table-warp {
      padding: 0 32px;
      margin-top:20px;
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
    .image {
      width: 100%;
      margin:10px;
      min-height:80px;
      border:1px solid #eee;
      box-sizing: border-box;
      display: block;
    }
    .top{
      padding:10px 16px;
    }
    .newTitle{
      img{
        position: absolute;
        top:0;
        left:0;
        width:60px;
      }
    }
  }
</style>
