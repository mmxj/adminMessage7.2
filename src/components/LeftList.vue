<template>
  <div id="LeftList" :style="{width:leftWidth}">
    <el-menu default-active="2" router class="el-menu-vertical-demo"
             :unique-opened="opened" :collapse="leftWidth" >
      <Listmenu v-for="item1 in checkBoxData" :item1="item1" :key="item1.id"></Listmenu>
    </el-menu>
  </div>
</template>
<script type="text/javascript">
  import {mapActions} from 'vuex'
  import ElMenuItemGroup from "../../node_modules/element-ui/packages/menu/src/menu-item-group";
  import Listmenu from '@/common/Listmenu'
  export default {
    components: {ElMenuItemGroup,Listmenu},
    props: ['leftWidth'],
    data(){
      return {
        isCollapse:true,
        windowWidth:document.body.clientWidth,
        list:[
          {
              title:'社保金融服务应用平台',
              index:'100',
              url:'/homepage2',
              show:true,
              icon:'icon iconfont icon-logo',
              classname:'logo-title'
          },
          {
            title:'首页',
            index:'101',
            url:'/homepage',
            show:true,
            icon:'homeicon iconfont icon-shouye'
          },
          {//菜单栏数据
          title:'基础信息管理',
          index:'1',
          url:null,
          show:true,
          icon:'el-icon-edit',
          children:[
            {
              title:'社保受理终端管理平台',
              index:'1-4',
              url:null,
              show:true,
              children:[
                {
                  title:'终端管理',
                  index:'1-4-1',
                  url:'/terminalmanage',
                  show:true
                },{
                  title:'终端申请管理',
                  index:'1-4-2',
                  url:'/terminaladd',
                  show:true
                },{
                  title:'终端申请审核管理',
                  index:'1-4-3',
                  url:'/terminalaudit',
                  show:true
                },{
                  title:'终端异常管理',
                  index:'1-4-4',
                  url:'/terminalerror',
                  show:true
                },{
                  title:'终端密钥管理',
                  index:'1-4-5',
                  url:'/terminalpassword',
                  show:true
                }
              ]
            },
              {
                title:'用户信息',
                index:'1-1',
                url:null,
                show:true,
                children:[
                    {
                        title:'用户管理',
                        index:'1-1-1',
                        url:'/user',
                        show:true,
                    },
                    {
                        title:'用户导入',
                        index:'1-1-2',
                        url:'/userchannel',
                        show:true,
                    }
                ]
              },
            {
                title:'商户信息',
                index:'1-2',
                url:null,
                show:true,
                children:[
                  {
                      title:'商户管理',
                      index:'1-2-1',
                      url:'/merchant',
                      show:true,
                  },{
                    title:'商户申请列表',
                    index:'1-2-6',
                    url:'/merchantlist',
                    show:true
                  },{
                    title:'商户审核管理',
                    index:'1-2-7',
                    url:'/merchantaudit',
                    show:true
                  }
//                  {
//                      title:'添加新商户',
//                      index:'1-2-2',
//                      url:'/merchantadd',
//                      show:true
//                  },
//                  {
//                    title:'查询商户证件',
//                    index:'1-2-3',
//                    url:'/merchantcheck',
//                    show:true
//                  },{
//                    title:'导入商户信息',
//                    index:'1-2-4',
//                    url:'/merchantchannel',
//                    show:true
//                  },{
//                    title:'导入银联证书',
//                    index:'1-2-5',
//                    url:'/importbankpfx',
//                    show:true
//                  }
                ]
            },
            {
              title:'支付渠道管理',
              index:'1-5',
              url:'/payChannel',
              show:true
            },
            //部门管理
//            {
//              title:'部门管理',
//              index:'1-3',
//              url:null,
//              show:true,
//              children:[
//                {
//                    title:'添加部门',
//                    index:'1-3-1',
//                    url:'/department',
//                    show:true
//                },{
//                  title:'管理部门',
//                  index:'1-3-2',
//                  url:'/departmentmanage',
//                  show:true
//                },{
//                  title:'添加角色',
//                  index:'1-3-3',
//                  url:'/roleadd',
//                  show:true
//                },{
//                  title:'管理角色',
//                  index:'1-3-4',
//                  url:'/rolemanage',
//                  show:true
//                },{
//                  title:'添加员工',
//                  index:'1-3-5',
//                  url:'/staffadd',
//                  show:true,
//                },{
//                  title:'管理员工',
//                  index:'1-3-6',
//                  url:'/staffmanage',
//                  show:true,
//                }
//              ]
//            },
          ]
         },
          {
            title:"订单管理",
            index:"2",
            url:'/order',
            icon:'el-icon-tickets',
            show:true,
          },
          {
            title:"医疗后台管理",
            index:"3",
            url:null,
            show:true,
            icon:'el-icon-menu',
            children:[
              {
                 title:"三大目录管理",
                  index:"3-1",
                  url:null,
                  show:true,
                  children:[
                    {
                      title:"三大目录上传",
                      index:"3-1-1",
                      url:"/uploaddir",
                      show:true,
                    },{
                      title:"三大目录列表",
                      index:"3-1-2",
                      url:"/dirlist",
                      show:true,
                    },{
                      title:"三大目录管理",
                      index:"3-1-3",
                      url:"/dirmanage",
                      show:true,
                    }
                  ]
              },{
                title:"卫生站管理",
                index:"3-2",
                url:null,
                show:true,
                children:[
                  {
                    title:"添加卫生站",
                    index:"3-2-1",
                    url:"/healthstationadd",
                    show:true,
                  },{
                    title:"管理卫生站",
                    index:"3-2-2",
                    url:"/healthstation",
                    show:true,
                  },
                  {
                    title:"添加村医",
                    index:"3-2-3",
                    url:"/doctoradd",
                    show:true,
                  },{
                    title:"管理村医",
                    index:"3-2-4",
                    url:"/doctormanage",
                    show:true,
                  }
                ]
              },{
                title:"医疗后台信息发布",
                index:"3-3",
                url:null,
                show:true,
                children:[
                  {
                    title:"业务专区发布",
                    index:"3-3-1",
                    url:'/businessissue',
                    show:true,
                  },{
                    title:"信息专区发布",
                    index:"3-3-2",
                    url:'/informationup',
                    show:true,
                  }
                ]
              }
            ]
          },
          {
            title:"APP客户端管理",
            index:"4",
            url:null,
            show:true,
            icon:'el-icon-mobile-phone',
            children:[
              {
                title:"轮播广告管理",
                index:"4-1",
                url:"/carousel",
                show:true,
              },{
                title:"新闻资讯管理",
                index:"4-2",
                url:"/news",
                show:true,
              },{
                title:"常见问题管理",
                index:"4-3",
                url:"/faq",
                show:true,
              },
              {
                  title:"自动更新管理",
                  index:'4-4',
                  url:'/appupdate',
                  show:true
              }
            ]
          },
          {
            title:"数据管理系统",
            index:"5",
            url:null,
            show:true,
            icon:'el-icon-sort',
            children:[
              {
                title:"流水支付数据",
                index:"5-1",
                url:'/paydata',
                show:true,
              },
              {
                title:"绑卡数据管理",
                index:"5-2",
                url:'/dataadministration',
                show:true,
              },
//              {
//                title:"数据报表",
//                index:"5-3",
//                url:'/datareport',
//                show:true,
//              },
              {
                title:"社保对账数据管理",
                index:"5-4",
                url:null,
                show:true,
                children:[
                  {
                      title:"社保对账交易信息",
                      index:"5-4-1",
                      url:'/datasocial',
                      show:true,
                  },
                  {
                    title:"商户社保交易信息",
                    index:'5-4-2',
                    url:'/datamerchantsocial',
                    show:true
                  }
                ]
              }
            ]
          },
          {
            title:"系统管理",
            index:"6",
            url:null,
            show:true,
            icon:'el-icon-setting',
            children:[
              {
                title:"系统用户管理",
                index:"6-1",
                url:'/systemmange',
                show:true,
              },{
                title:"系统资源管理",
                index:"6-2",
                url:'/resourceadd',
                show:true,
              },
              {
                title:"系统维护",
                index:"6-3",
                url:'/systemmaintenance',
                show:true,
              }
            ]
          },
          {
              title:'系统权限管理',
              index:'7',
              url:null,
              icon:'homeicon iconfont icon-renyuanquanxian',
              children:[
                {
                    title:'部门管理',
                    index:'7-1',
                    url:'/department',
                    show:true
                },
                {
                  title:'角色管理',
                  index:'7-2',
                  url:'/role',
                  show:true
                },
                {
                  title:'员工管理',
                  index:'7-3',
                  url:'/staff',
                  show:true
                },
              ]
          },
          {
            title:"对外接口测试",
            index:"8",
            show:true,
            icon:'el-icon-share',
            url:'/openapiexpense'
          }
        ],
        opened: true,
        saveList: [],
        saveUrl: [],
        session: sessionStorage.getItem('session'),
        showArrName: [],
        resourceData:null,
        checkBoxData:[],
        staffId:sessionStorage.getItem('staffId')
      }
    },
    methods: {
      ...mapActions(['addList', 'urlArr']),
      getIndex(index){
//        console.log(this.listArr[index]) //将这个用数组储存起来用vuex传递
        for (var i = 0; i < this.saveList.length; i++) {
          if (this.saveList[i] == this.listArr[index]) {
            return;
          }
        }
        this.saveList.push(this.listArr[index]);
        this.saveUrl.push(this.listUrl[index])
        this.addList(this.saveList);
        this.urlArr(this.saveUrl);
        sessionStorage.setItem('saveList', this.saveList);
        sessionStorage.setItem('urlArr', this.saveUrl);
      },
      getStart(){
        this.addList(this.saveList);
        this.urlArr(this.saveUrl);
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
              vm.getStaffresource();
//              vm.setCheckBoxData(data.rows);
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
          vm.checkBoxData=[
            {
              title:'社保金融服务应用平台',
              index:'100',
              code:'100',
              url:'/homepage2',
              show:true,
              icon:'icon iconfont icon-logo',
              classname:'logo-title',
              children:[]
            },
          ];
          data.forEach(function(item){
            if(typeof(item.code)=='string'){
              item.code=item.code.split("-");
            };
            if(item.webUrl=="null"){
                item.webUrl=null;
            }
            if(item.code.length==1) {
              var obj = {};
              obj.id = item.id;
              if(typeof(item.code)=='string'){
                item.code=item.code.split("-");
              };
              obj.code=item.code;
              obj.index = item.code;
              if (typeof(obj.index) != 'string') {
                obj.index = obj.index.join("-")
              }
              obj.show = true;
              obj.url = item.webUrl;
              obj.title = item.name;
              vm.list.forEach(function (items) {
                if (items.title == obj.title) {
                  obj.icon = items.icon;
                  if (items.classname) {
                    obj.classname = items.classname;
                  }
                }
              });
              obj.children=[];
              vm.checkBoxData.push(obj);
            }
            });
                vm.checkBoxData.forEach(function(item1){
                    for(var i=0;i<data.length;i++){
                        if(data[i].code.length==2&&data[i].code[0]==item1.code){
                            let obj={}
                            obj.id=data[i].id;
                            if(typeof(data[i].code)=='string'){
                              data[i].code=data[i].code.split("-");
                            };
                            obj.code=data[i].code;
                            obj.index= data[i].code;
                            if(typeof(obj.index)!='string'){
                              obj.index=obj.index.join("-")
                            }
                            obj.show=true;
                            obj.url=data[i].webUrl;
                            obj.title=data[i].name;
                            obj.children=[];
                            obj.parentId=data[i].parenyId;
                            item1.children.push(obj)
                        }
                    }
                  item1.children.forEach(function(item2){
                    for(var j=0;j<data.length;j++){
                      if(data[j].code.length==3&&data[j].code[0]==item2.code[0]&&data[j].code[1]==item2.code[1]){
                        let obj={};
                        obj.id=data[j].id;
                        if(typeof(data[j].code)=='string'){
                          data[j].code=data[j].code.split("-");
                        };
                        obj.code=data[j].code;
                        obj.index= data[j].code;
                        if(typeof(obj.index)!='string'){
                          obj.index=obj.index.join("-")
                        }
                        obj.show=true;
                        obj.url=data[j].webUrl;
                        obj.title=data[j].name;
                        obj.parentId=data[j].parenyId;
                        item2.children.push(obj);
                      }
                    }
                  })
                });
        },
        getStaffresource(){
          var vm=this;
          var get=new RemoteCall();
          get.init({
            router:'/base/staffresource/get',
            session:vm.session,
            data:{
              id:vm.staffId,
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
        }
    },
    mounted: function () {
      var vm = this;
      if (sessionStorage.getItem('urlArr')) {
        sessionStorage.getItem('urlArr').split(',').forEach(function (item, i) {
          vm.saveUrl[i] = item
        });
        sessionStorage.getItem('saveList').split(',').forEach(function (item, i) {
          vm.saveList[i] = item
        });
        vm.getStart();
      } else {
        vm.getStart();
      };
      vm.getResource();
    },
    watch: {

    }
  }
</script>
<style type="text/css" lang="scss">
  #LeftList{
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
    .homeicon{
      color: #fff;
      /*position: relative;*/
      vertical-align: middle;
      margin-right: 5px;
      padding-left: 3px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
    .el-menu-item-group__title{
      padding:0;
    }
  }
</style>
