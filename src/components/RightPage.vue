<template>
  <div id="RightPage">
    <!--<div class="menu" @click="menuToggl">-->
      <!--<i :class="[menu?'el-icon-arrow-left':'el-icon-arrow-right']" id="iconLeft"></i>-->
    <!--</div>-->
    <!--<NavBar></NavBar>-->
    <el-header class="myheader clearfix" height="64px">
      <span class="shrink">
        <i class="icon iconfont" @click="$emit('changeStatus')" :class="listStatus?'icon-zhankaicaidan':'icon-shouqicaidan'"></i>
      </span>
      <div class="center-content">
        <span>今天是{{time}}</span><span>{{companyName}}</span>
      </div>
      <div class="rightTool">
        <div class="username">
          <el-dropdown @command="handleCommand">
            <span><img :src="img" alt="">你好,{{userName}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled><i class="iconmenu iconfont icon-iconfonticon5"></i>个人中心</el-dropdown-item>
              <el-dropdown-item disabled><i class="iconmenu iconfont icon-shezhi"></i>设置</el-dropdown-item>
              <el-dropdown-item divided  command="3"><i class="iconmenu iconfont icon-tuichu1" ></i>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="bell">
          <i class="el-icon-bell"></i>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view>
      </router-view>
    </el-main>
  </div>
</template>
<script type="text/javascript">
  import NavBar from './oldPage/NavBar.vue'
  import {mapState, mapActions} from 'vuex'
  export default{
    props:['listStatus'],
    data(){
      return {
        userName: sessionStorage.getItem('userName'),
        bodyWidth: document.body.clientWidth,
        time:null,
        companyName: sessionStorage.getItem('companyName'),
        img:require('@/assets/img/userlogo.png')
      }
    },
    components: {
      NavBar,

    },
    computed: {
      ...mapState([
        'menu',
      ]),

    },
    methods: {
      ...mapActions(['changeMenu']),
      menuToggl(){
        this.changeMenu(!this.menu)
      },
      getWindowWidth(){
        var _this = this;
        window.onresize = () => {
          _this.bodyWidth = document.body.clientWidth;
          if (_this.bodyWidth <= 1200) {
            this.changeMenu(false)
          } else {
            this.changeMenu(true)
          }
        }
      },
      setTime(){
        var time = new Date();
        this.time = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日'
      },
      handleCommand(command){
          var vm = this;
          if(command==3){
            this.$confirm('是否要退出?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              sessionStorage.removeItem('saveList');
              sessionStorage.removeItem('urlArr')
              vm.$router.push('/login');
            }).catch(() => {
            });
          }
      }
    },
    mounted(){
        this.setTime();
      this.getWindowWidth()
//      var clientHeight = 0;
//      if (document.body.clientHeight && document.documentElement.clientHeight) {
//        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
//      }
//      else {
//        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
//      }
//      document.getElementById('RightPage').style.minHeight = (clientHeight - 10) + 'px';
    }
  }
</script>
<style type="text/scss" scopted>
  #RightPage {
    position: relative;
    width:100%;
    background: #F0F2F5;
  }

  #iconLeft {
    color: #b0b0b0;
    line-height: 26px;
    cursor: pointer;
    text-align: center;
  }
  .iconmenu{
    padding:0 5px 0 0;
  }
  .menu {
    position: absolute;
    width: 26px;
    height: 26px;
    left: 6px;
    border: 1px solid #e0e0e0;
    top: 0px;
    background: #fff;
    border-radius: 50px;
    z-index: 2000;
    text-align: center;
  }

  .menu .el-icon-arrow-right {
    background: #49df8b;
    width: 100%;
    color: #fff !important;
    border-radius: 50px;
  }
</style>
<style lang="scss">
  #RightPage {
    .el-table__empty-text {
      color: #fb695b;
    }
    .el-header{
      background: #fff;
      position: relative;
    }
    .icon{
      font-size:22px;
      cursor: pointer;
    }
    .shrink{
      padding-top:22px;
      display: inline-block;
    }
    .center-content{
      position: absolute;
      left:50%;
      top:50%;
      width:400px;
      text-align: center;
      margin-left:-200px;
      color: #555;
      margin-top:-6px;
      font-size:14px;
      span{
        padding:0 10px;
      }
    }
    .rightTool{
      float:right;
      margin-right:37px;

      div{
        float:right;
      }
      .username{
        float:right;
        font-size:14px;
        color:#555;
        height:64px;
        line-height: 64px;
        padding:0 12px;
        cursor: pointer;
        img{
          width:22px;
          height: 22px;
          vertical-align: middle;
          margin-right:8px;
        }
        .el-dropdown{
          display: block;
        }
        .el-dropdown-selfdefine{
          display: block;
          height:64px;
        }

      }
      .username:hover{
        background:#e5f7ff
      }
      .bell{
        height:64px;
        line-height: 66px;
        font-size:20px;
        padding:0 12px;
        cursor: pointer;
        color: #999;
      }
    }
  }
  .el-dropdown-menu__item{
    line-height:30px;
  }
  #dropdown-menu-6522{
    width: 140px;
    /*text-align: center;*/
  }
</style>

