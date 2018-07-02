<template>
  <el-menu-item :class="item1.classname" v-if="item1.url!=null&&item1.show==true" :key="item1.id" :index="item1.url" class="el-t menu-border-bottom">
  <i :class="item1.icon"></i>
  <span slot="title" class="lv1-title">{{item1.title}}</span>
  </el-menu-item>
  <el-submenu class="listmenu" :key="item1.id"   v-else-if="item1.show==true"  :index="item1.index">
    <template slot="title">
      <i :class="item1.icon"></i>
      <span slot="title" class="lv1-title">{{item1.title}}</span>
    </template>

    <el-menu-item-group v-for="item2 in item1.children" :key="item2.id">
      <el-menu-item v-if="item2.url!=null&&item1.show==true" :index="item2.url"  class="menu-border-bottom el-lvtwo">
        <span slot="title">{{item2.title}}</span>
      </el-menu-item>
      <el-submenu  class="lv-two" v-if="item2.url==null&&item1.show==true"  :index="item2.index">
        <template slot="title">
          <span slot="title">{{item2.title}}</span>
        </template>

        <el-menu-item-group v-for="item3 in item2.children" :key="item3.id">
          <el-menu-item v-if="item3.url!=null&&item1.show==true"  :key="item3.id" :index="item3.url" class="menu-border-bottom el-lvthree">
            <span slot="title" class="lv3-title">{{item3.title}}</span>
          </el-menu-item>
          <el-submenu v-if="item3.url==null&&item1.show==true" :key="item3.id" :index="item3.index">
            <template slot="title">
              <span slot="title" class="lv3-title">{{item3.title}}</span>
            </template>
          </el-submenu>
        </el-menu-item-group>

      </el-submenu>
    </el-menu-item-group>

  </el-submenu>
</template>
<script>
  export default{
      props:['item1'],
      data(){
          return{

          }
      }
  }
</script>
<style lang="scss">
  .listmenu{
    .el-menu--dark{
      background:#fff;
    }
    .el-menu--dark .el-menu-item, .el-menu--dark .el-submenu__title{
      color: #333;
    }
    .el-t:hover{
      background:#1890ff;
    }
    .lv-two .el-submenu__title:hover{
      background:#1890ff;
    }
    .el-lvthree:hover{
      background: #1890ff;
    }
    .el-submenu__title:hover{
      background:#1890ff;
    }
    .el-lvtwo:hover{
      background:#1890ff;
    }
    .el-lvone{
      font-size:14px;
      font-weight: 700;
    }
    .el-menu--dark .el-submenu .el-menu{
      background: #eee;
    }
    .el-lvthree{
      font-size:12px;
      color: #fff;
      background: #000;
      border-color:#f8f8f8;
    }
    .el-lvthree:active{
      background: #1890ff;
      color: #fff;
    }
    .lv3-title{
      color:#fff
    }
    .el-lvtwo{
      font-size:13px;
    }
    .lv-two .el-submenu__title{
      background: #000c17;
      font-size:13px;
    }
    .el-lvtwo{
      background: #000c17;
    }
    .lv2-title{
      padding-left:20px;
    }
    .lv1-title{
      font-weight: 600;
    }
    .el-menu-item, .el-submenu__title{
      height:40px;
      line-height:40px;
    }
    .el-submenu .el-menu-item{
      height:40px;
      line-height:40px;
    }
    .logo-title{
      font-size: 14px;
      background: #002140;
      height: 64px;
      line-height:64px;
      font-weight:bold;
    }
    .icon{
      color: #fff;
      position: relative;
      left:-6px;
      font-size:36px;
      font-weight: normal;
    }
    .el-menu-item-group__title{
      padding:0;
    }

  }
  .el-menu-item-group__title{
    padding-top:0;
  }
</style>
