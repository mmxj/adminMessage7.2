<template>
  <div id="app">
    <!--<Gheader></Gheader>-->
    <!--<el-row id="elRow">-->
      <!--<el-col :span="leftWidth" class="left" ref="leftList">-->
        <!---->
      <!--</el-col>-->
      <!--<el-col :span="rightWidth" id="rightPage" class="right">-->
        <!--<RightPage></RightPage>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <el-container :style="{'min-height':vHeight}">
      <el-aside class="left" :class="listStatus?'closeList':'openList'">
        <LeftList :leftWidth="listStatus"></LeftList>
      </el-aside>
      <el-container style="position:relative" class="right">
        <RightPage :listStatus="listStatus" @changeStatus="changeStatus"></RightPage>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Gheader from './oldPage/Gheader.vue'
  import LeftList from './LeftList.vue'
  import RightPage from './RightPage.vue'
  import {mapGetters, mapActions, mapState} from 'vuex'
  export default {
    name: 'app',
    data(){
      return {
        loading: true,
        loadingFn: null,
        roleId: sessionStorage.getItem('roleId'),
        roleArr: [],
        leftWidth: 4,
        rightWidth: 20,
        lw: null,
        sesison:sessionStorage.getItem('session'),
        vHeight:900,
        openImg:require('@/assets/img/list_open.png'),
        closeImg:require('@/assets/img/list_close.png'),
        imgSrc:null,
        listStatus:false,
        windowWidth:null
      }
    },
    components: {
      Gheader,
      LeftList,
      RightPage,
    },
    computed: {
      ...mapState([
        'menu'
      ])
    },
    methods: {
      ...mapActions(['saveSession']),
      openFullScreen2() {
        var vm = this;
        vm.loadingFn = this.$loading({
          lock: vm.loading,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      getRole(){
        var vm = this;
        var getRole = new RemoteCall();
        getRole.init({
          router: '/base/roleresource/get',
          session: vm.session,
          data: {
            pageInfo: {
              pageSize: 100,
              pageNum: 1
            },
            id: vm.roleId
          },
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              data.resourceRows.forEach(function (item) {
                vm.roleArr.push(item.sfsResourceName)
              })
            }
          }
        })

      },
      checkUrl(name){
        var vm = this;
        for (var i = 0; i < vm.roleArr.length; i++) {
          if (vm.roleArr[i] == name) {
            return true
          }
        }
        return false
      },
      changeStatus(){
        this.listStatus=!this.listStatus;
      }
    },
    mounted: function () {
      var vm = this;
      if (sessionStorage.getItem('session')) {
        this.saveSession(sessionStorage.getItem('session'));
      } else {
        this.$router.push('/login')
      }
      if(document.body.clientHeight<window.innerHeight){
        this.vHeight=(window.innerHeight)+'px';
      }
      if(document.body.clientWidth<1260){
        vm.listStatus=true;
      }else{
        vm.listStatus=false;
      }
      window.onresize=function(){
        vm.windowWidth=document.body.clientWidth;
        if(vm.windowWidth<1260){
          vm.listStatus=true;
          if(document.body.clientHeight<window.innerHeight){
            vm.vHeight=(window.innerHeight)+'px';
          }
        }else{
          vm.listStatus=false;
          if(document.body.clientHeight<window.innerHeight){
            vm.vHeight=(window.innerHeight)+'px';
          }
        }
      }
    },
    watch: {
      $route(){
        var vm = this;
        if (sessionStorage.getItem('session')) {
          this.saveSession(sessionStorage.getItem('session'));
        }
        if (this.$route.path != '/login') {
          document.body.scrollTop = 0;
          document.getElementsByTagName('body')[0].style.height = "";
          document.getElementsByTagName('body')[0].style.overflow = "";
        }
        this.$nextTick(function(){
          if(document.body.clientHeight<window.innerHeight){
            this.vHeight=(window.innerHeight)+'px';
          }
        })

      }

    }
  }
</script>
<style>
  body {
    min-width: 1200px;
    background: #EEEEEE;
    padding: 0;
  }

  [class^="el-icon-my"], [class*=" el-icon-my"] {
    /* 以下内容参照第三方图标库本身的规则 */
    font-size: inherit;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
<style scoped lang="scss">
  .right{
    background: #F0F2F5;
  }
  .shrink{
    position:absolute;
    left:0px;
    top:20px;
    img{
      opacity: 0.6;
      cursor: pointer;
      width:14px;
      height:44px;
      background: #fff;
      -webkit-border-radius:0 3px 3px 0;
      -moz-border-radius:0 3px 3px 0;
      border-radius:0 3px 3px 0;
    }
    img:hover{
      opacity:1;
    }
  }
</style>
<style lang="scss">
  #app{
    .closeList{
      width:64px !important;
      transition: all 0.3s;
    }
    .el-container{
      min-height: 700px;
    }
    .openList{
      width:256px !important;
      transition: all 0.3s;
    }
    .el-aside{
      background:#001529;
    }
  }
</style>
