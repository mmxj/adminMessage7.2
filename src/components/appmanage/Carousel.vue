<template>
  <div id="Carousel">
    <div class="search">
      <el-form
        :inline="true"
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
        <el-button type="primary" size="small" @click="$router.push('/carouseladd')"><i class="el-icon-plus"></i>新增</el-button>
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
        <el-table-column align="center" label="标题" prop="name" min-width="100"></el-table-column>
        <el-table-column align="center" label="图片" prop="" min-width="100">
          <template slot-scope="scope">
            <img :src="checkImg(scope.row.imageDownloadUrl)" class="image" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="seq" min-width="100"></el-table-column>
        <el-table-column align="center" label="链接" prop="jumpUrl" min-width="100"></el-table-column>
        <el-table-column align="center" label="状态" prop="enableFlag" min-width="100"></el-table-column>
        <el-table-column align="center" label="发布区域" min-width="100">
          <template slot-scope="scope">
            {{cityCh(scope.row.areaIds)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="" min-width="160">
          <template slot-scope="scope">
            <span class="button" @click="$router.push({name:'AppCarouselUpdate',params:{data:scope.row}})">修改</span>
            <span class="button" @click="deleteCarousel(scope.row.id)">删除</span>
            <span class="button" @click="issue(scope.row)">{{scope.row.enableFlag == '已发布' ? '取消发布' : '发布'}}</span>
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
  import unit from '@/unit/unit.js'
  export default{
    data(){
      return {
        formSearch: {},
        tableData: [{}],
        currentPage: 1,//初始化分页
        total: 20,
        pageNum: 1,
        keyword: null,
        session: sessionStorage.getItem('session'),
        nofind:require('@/assets/img/nofind.png'),
        loading:false
      }
    },
    computed:{

    },
    methods: {
      cityCh(areaIds){

        if(areaIds!=null&&areaIds!='undefined'){
          var arr=areaIds.split(',');
          for(var j=0;j<arr.length;j++){
            arr[j]=unit.findCity(arr[j])
          }
          areaIds=arr.join(',');
        }
        return areaIds
      },
      search(){
        var vm = this;
        vm.loading=true;
        vm.keyword=unit.removeEmptyString(vm.keyword);
        var getCarousel2 = new RemoteCall();
        getCarousel2.init({
          router: '/ips/slider/get',
          session: vm.session,
          data: {
            pageInfo: {
              pageSize: 10,
              pageNum: vm.pageNum
            },
            name: vm.keyword
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
            setTimeout(function(){
              vm.loading=false;
            },200)
          }
        })
      },
      handleCurrentChange(val){//页面跳转事件
        this.pageNum = val;
        this.getCarousel()
      },
      getCarousel(){
        var vm = this;
        vm.loading=true;
        var getCarousel2 = new RemoteCall();
        getCarousel2.init({
          router: '/ips/slider/get',
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
              vm.tableData=[];
              data.rows.forEach(function (item,i) {
                item.enableFlag = vm.newsFlag(item.enableFlag);

                vm.$set(vm.tableData,i,item)
              })
//              vm.tableData = data.rows;
            }
            setTimeout(function(){
              vm.loading=false;
            },200)
          }
        })
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
        vm.$confirm('确定' + text + '此条广告', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var remote = new RemoteCall();
          remote.init({
            router: '/ips/slider/update',
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
      newsFlag(status){//状态转换 0|null = 未发布 1=发布
        if (status == 1) {
          return '已发布'
        } else {
          return '未发布'
        }
      },
      deleteCarousel(id){
        var vm=this;
        vm.$confirm('确定删除改广告', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var remote = new RemoteCall();
          remote.init({
            router: '/ips/slider/delete',
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
                vm.getCarousel();
              }
            }
          })
        })
      },
      checkImg(url){
          var src=null;
          var vm=this;
         if(url){
           if(url.split('/').length>1){
              src=url
           }else{
//              $.ajax({
//                url:'http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do',
//                type: 'post',
//                async:false,
//                data: {
//                  'download_type': '1',
//                  'file_name':url,
//                },
//                success:function(res){
//                  if(res){
//                    src='data:image/png;base64,' +JSON.parse(res).data;
//                  }else{
//                    src= vm.nofind;
//                  }
////
//                }
//              })
             src="http://www.yxunionpay.com:8087/yxsj-openapi-web/openapi/download/download.do?download_type=1&file_name="+url;
           }
         }else{
           src= this.nofind;
         }
        return src
      }
    },
    mounted: function () {
      this.getCarousel();
    }
  }
</script>
<style lang="scss">
  #Carousel {
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
        padding-right: 35px;
        padding-left: 15px;
        /*background: #1890ff;*/
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
  }
</style>
