import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Message from '../components/Message'
// 用户
import User from '../components/user/User' //用户信息
import UserList from '../components/user/UserList' //用户信息列表
// import UserDetails from '../components/UserDetails' //用户详情

// import Merchant from '../components/Merchant' //商户信息
import Merchant from '../components/merchant/MerchantMessage.vue' //商户管理
// import MerchantAdd from '../components/MerchantAdd' //添加新商户
import MerchantAdd from '../components/merchant/MerchantAdd.vue' //添加新商户
import MerchantCheck from '../components/oldPage/MerchantCheck' //查阅商户证件
import MerchantChannel from '../components/oldPage/MerchantChannel' //导入商户信息
import MerchantUpData from '../components/oldPage/MerchantUpData' //商户编辑
import MerchantList from '../components/merchant/MerchantList.vue' //商户申请列表
import MerchantUpdate from '../components/merchant/MerchantUpdate.vue' //商户申请列表
import MerchantAudit from '../components/merchant/MerchantAudit.vue' //商户申请列表

//支付渠道配置
import PayChannel from "../components/payChannel/PayChannel.vue" //支付渠道配置
import MerchantChannelOne from "../components/payChannel/MerchantChannelOne.vue" //商户支付渠道配置第一步
import MerchantChannelList from "../components/payChannel/MerchantChannelList.vue" //商户支付渠道配置列表
import MerchantChannelUpdate from "../components/payChannel/MerchantChannelUpdate.vue" //商户支付渠道配置修改

import MerchantGroup from "../components/merchantGroup/merchantGroup.vue" //商户分组

// 终端管理
import TerminalPassword from '../components/terminal/TerminalPassword' //终端密钥管理
import TerminalAudit from '../components/terminal/TerminalAudit' //终端审核管理
import TerminalError from '../components/terminal/TerminalError' //终端异常管理
import TerminalAdd from '../components/terminal/TerminalAdd' //终端申请
import TerminalManage from '../components/terminal/TerminalManage' //终端管理
import TerminalUpData from '../components/terminal/TerminalUpData' //修改终端


// 数据管理系统
import PayData from '../components/dataMessage/PayData'//支付流水数据
import DataAdministration from '../components/dataMessage/DataAdministration'//绑卡数据管理
import DataReport from '../components/dataMessage/DataReport' //数据报表
import DataMerchantSocial from '../components/dataMessage/DataMerchantSocial' //数据报表
import DataSocial from '../components/dataMessage/DataSocial' //数据报表



import Order from '../components/order/Order' //订单管理


//app管理
import AppCarousel from '../components/appmanage/Carousel.vue'//轮播广告管理
import AppCarouselAdd from '../components/appmanage/CarouselAdd.vue' //新增轮播广告
import AppCarouselUpdate from '../components/appmanage/CarouselUpdate.vue' //新增轮播广告
import AppNews from '../components/appmanage/News.vue' //新闻资讯管理
import AppNewsAdd from '../components/appmanage/NewsAdd.vue' //新增新闻资讯
import AppNewsUpdate from '../components/appmanage/NewsUpdate.vue' //新增新闻资讯
import AppFaq from '../components/appmanage/Faq.vue' //常见问题管理
import AppFaqAdd from '../components/appmanage/FaqAdd.vue' //常见问题管理
import AppFaqUpdate from '../components/appmanage/FaqUpdate.vue' //常见问题管理
import AppUpdate from '../components/appmanage/AppUpdate.vue' //app自动更新管理
import AppUpdateNew from '../components/appmanage/AppUpdateNew.vue' //app自动更新管理


//系统权限管理
import DepartmentManage from '../components/oldPage/DepartmentManage' //部门管理
import RoleManage from '../components/oldPage/RoleManage' //部门管理
import StaffManage from '../components/oldPage/StaffManage' //员工管理
import StaffUpData from '../components/oldPage/StaffUpData' //员工编辑
// import StaffAdd from '../components/Staffadd' //员工新增
// import Department from '../components/Department' //部门新建
// import RoleAdd from '../components/RoleAdd' //角色新增
import SystemMange from '../components/system/SystemManage' //系统用户管理页
import SystemThrones from '../components/system/SystemThrones' //系统权限管理页
import ResourceAdd from '../components/ResourceAdd' //新建资源
import ResourceAlert from '../components/ResourceAlert' //新建资源弹窗
import ResourceUpData from '../components/ResourceUpData' //资源更新
import RoleAccredit from '../components/oldPage/RoleAccredit' //资源更新
//new
import Department from '../components/authority/Department.vue' //部门管理
import DepartmentAdd from '../components/authority/DepartmentAdd.vue' //部门添加
import DepartmentUpdate from '../components/authority/DepartmentUpdate.vue' //部门添加
import Role from '../components/authority/Role.vue' //角色管理
import RoleAdd from '../components/authority/RoleAdd.vue' //新建角色
import RoleUpdate from '../components/authority/RoleUpdate.vue' //编辑角色
import Staff from '../components/authority/Staff.vue' //员工管理
import StaffAdd from '../components/authority/StaffAdd.vue' //员工管理
import StaffUpdate from '../components/authority/StaffUpdate.vue' //编辑员工

//开发接口测试
import OpenapiExpense from '../components/openapi/OpenapiExpense.vue'



import UploadDir from '../components/UploadDir' //三大目录上传
import DirList from '../components/DirList' //三大目录列表
import DirManage from '../components/DirManage' //三大目录管理
// import HealthStation from '../components/oldPage/HealthStation' //卫生站管理
// import HealthStationAdd from '../components/oldPage/HealthStationAdd' //添加卫生站卫生站
// import HealthStationUpdata from '../components/oldPage/HealthStationUpdata' //添加卫生站卫生站

//卫生站管理
import HealthStation from '../components/healthStation/HealthStation' //卫生站管理
import HealthStationAdd from '../components/healthStation/HealthStationAdd' //添加卫生站卫生站
import HealthStationUpdate from '../components/healthStation/HealthStationUpdate' //添加卫生站卫生站
import HealthStationPayChannel from '../components/healthStation/HealthStationPayChannel.vue' //卫生站支付渠道配置
import HealthStationPayList from '../components/healthStation/HealthStationPayList.vue' //卫生站支付渠道配置

import DoctorAdd from '../components/DoctorAdd'//添加村医
import DoctorManage from '../components/DoctorManage'//添加村医
import DoctorUpData from '../components/DoctorUpData' //村医编辑

import BusinessIssue from '../components/medicalManagement/BusinessIssue' //业务专区发布
import InformationUp from '../components/medicalManagement/InformationUp'//信息专区发布

import UserInformation from '../components/oldPage/UserInformation' //基本信息
// import Social from '../components/Social'//社保卡信息
// import UserBank from '../components/UserBank' //银行卡信息
// import UserFamily from '../components/UserFamily' //家人关系
// import UserRecord from '../components/UserRecord' //使用记录
// import UserTownship from '../components/UserTownship'//用户乡银宝
import SystemMaintenance from '../components/system/SystemMaintenance' //系统维护界面
import HomePage from '../components/HomePage' //主页
import UserChannel from '../components/oldPage/UserChannel' //用户导入
import ImportBankPFX from '../components/ImportBankPFX' //用户导入


import MAmap from '../common/MAmap/MAmap.vue'


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/homepage',
      component: HomePage,
      children: [
        {
          path:'/homepage2',
          name:'homepage2',
          component: Message
        },
        {
          path: '',
          name: 'Message',
          component: Message
        },
        {
          path: '/user',
          name: 'User',
          component: User
        },
        {
          path: '/merchant',
          name: 'Merchant',
          component: Merchant
        },
        {
          path: '/merchantadd',
          name: 'MerchantAdd',
          component: MerchantAdd
        },
        {
          path:'/merchantlist',
          name:'MerchantList',
          component:MerchantList
        },
        {
          path:'/merchantupdate',
          name:'MerchantUpdate',
          component:MerchantUpdate
        },
        {
          path:'/merchantaudit',
          name:'MerchantAudit',
          component:MerchantAudit
        },
        {
          path: '/merchantcheck',
          name: 'MerchantCheck',
          component: MerchantCheck
        },
        {
          path: '/merchantgroup',
          name: 'MerchantGroup',
          component: MerchantGroup
        },
        {
          path:'/paychannel',
          name:'PayChannel',
          component:PayChannel
        },
        {
          path:'/merchantchannelone',
          name:'MerchantChannelOne',
          component:MerchantChannelOne
        },{
          path:'/merchantchannellist',
          name:'MerchantChannelList',
          component:MerchantChannelList
        },
        {
          path:'/merchantchannelupdatet',
          name:'MerchantChannelUpdate',
          component:MerchantChannelUpdate
        },
        {
          path: '/order',
          name: 'Order',
          component: Order
        },
        {
          path: '/uploaddir',
          name: 'UploadDir',
          component: UploadDir
        },
        {
          path: '/dirlist',
          name: 'DirList',
          component: DirList
        },
        {
          path: '/dirmanage',
          name: 'DirManage',
          component: DirManage
        },
        {
          path: '/healthstation',
          name: 'HealthStation',
          component: HealthStation
        },
        {
          path: '/healthstationadd',
          name: 'HealthStationAdd',
          component: HealthStationAdd
        },
        {
          path: '/healthstationupdate',
          name: 'HealthStationUpdate',
          component: HealthStationUpdate
        },
        {
          path: '/healthstationpaychannel',
          name: 'HealthStationPayChannel',
          component: HealthStationPayChannel,
        },
        {
          path:'/healthstationpaylist',
          name: 'HealthStationPayList',
          component:HealthStationPayList,
        },
        {
          path: '/doctoradd',
          name: 'DoctorAdd',
          component: DoctorAdd
        },
        {
          path: '/doctormanage',
          name: 'DoctorManage',
          component: DoctorManage
        },
        {
          path: '/merchantchannel',
          name: 'MerchantChannel',
          component: MerchantChannel
        },
        {
          path: '/businessissue',
          name: 'BusinessIssue',
          component: BusinessIssue
        },
        {
          path: '/informationup',
          name: 'InformationUp',
          component: InformationUp
        },
        {
          path: '/paydata',
          name: 'PayData',
          component: PayData
        },
        {
          path: '/dataadministration',
          name: 'DataAdministration',
          component: DataAdministration
        },
        {
          path:'/datamerchantsocial',
          name:'DataMerchantSocial',
          component:DataMerchantSocial
        },
        {
          path:'/datamerchantsocials',
          name:'DataMerchantSocials',
          component:DataMerchantSocial
        },{
          path:'/datasocial',
          name:'DataSocial',
          component:DataSocial
        },
        {
          path: '/terminalpassword',
          name: 'TerminalPassword',
          component: TerminalPassword
        },
        {
          path: '/datareport',
          name: 'DataReport',
          component: DataReport
        },
        {
          path:'/userlist',
          name:'UserList',
          component:UserList,
          children:[
            {
                  path: '',
                  name: 'UserInformation',
                  component: UserInformation
            },
          ]
        },
        // {
        //   path: '/userdetails',
        //   component: UserDetails,
        //   children: [
        //     {
        //       path: '',
        //       name: 'UserInformation',
        //       component: UserInformation
        //     },
        //     {
        //       path: '/userdetailssocial',
        //       name: 'Social',
        //       component: Social
        //     },
        //     {
        //       path: '/userdetailsbank',
        //       name: 'UserBank',
        //       component: UserBank
        //     },
        //     {
        //       path: '/userdetailsfamily',
        //       name: 'UserFamily',
        //       component: UserFamily
        //     },
        //     {
        //       path: '/userdetailsuserrecord',
        //       name: 'UserRecord',
        //       component: UserRecord
        //     },
        //     {
        //       path: '/userdetailsusertownship',
        //       name: 'UserTownship',
        //       component: UserTownship
        //     }
        //   ]
        // },
        {
          path: '/doctorupdata',
          name: 'DoctorUpData',
          component: DoctorUpData
        },

        {
          path: '/department',
          name: 'Department',
          component: Department
        },
        {
          path:'/departmentadd',
          name:'DepartmentAdd',
          component:DepartmentAdd
        },
        {
          path:'/departmentupdate',
          name:'DepartmentUpdate',
          component:DepartmentUpdate
        },
        {
          path:'/role',
          name:'Role',
          component:Role
        },
        {
          path:'/roleupdate',
          name:'RoleUpdate',
          component:RoleUpdate
        },
        {
          path: '/roleadd',
          name: 'RoleAdd',
          component: RoleAdd
        },
        {
          path:'/staff',
          name:Staff,
          component:Staff
        },
        {
          path: '/staffadd',
          name: 'StaffAdd',
          component: StaffAdd
        },
        {
          path:'/staffupdate',
          name:'StaffUpdate',
          component:StaffUpdate
        },
        {
          path: '/systemmange',
          name: 'SystemMange',
          component: SystemMange
        },
        {
          path: '/systemthrones',
          name: 'SystemThrones',
          component: SystemThrones
        },
        {
          path: '/systemmaintenance',
          name: 'SystemMaintenance',
          component: SystemMaintenance
        },
        {
          path: '/departmentmanage',
          name: 'DepartmentManage',
          component: DepartmentManage
        },
        {
          path: '/rolemanage',
          component: RoleManage,
          children: [
            {
              path: '/rolemanage/accredit',
              name: 'RoleAccredit',
              component: RoleAccredit
            }
          ]
        },
        {
          path: '/staffmanage',
          name: 'StaffManage',
          component: StaffManage
        },
        {
          path: '/staffupdata',
          name: 'StaffUpData',
          component: StaffUpData
        },
        {
          path: '/merchantupdata',
          name: 'MerchantUpData',
          component: MerchantUpData
        },
        {
          path: '/resourceadd',
          // name: 'ResourceAdd',
          component: ResourceAdd,
          children: [
            {
              path: '/resourceadd/add',
              name: 'ResourceAlert',
              component: ResourceAlert
            },
            {
              path: '/resourceadd/updata',
              name: 'ResourceUpData',
              component: ResourceUpData
            }
          ]
        }, {
          path: '/terminalmanage',
          name: 'TerminalManage',
          component: TerminalManage
        }, {
          path: '/terminalupdata',
          name: 'TerminalUpData',
          component: TerminalUpData
        }, {
          path: '/terminalaudit',
          name: 'TerminalAudit',
          component: TerminalAudit
        }, {
          path: '/terminalerror',
          name: 'TerminalError',
          component: TerminalError
        },
        {
          path: '/userchannel',
          name: 'UserChannel',
          component: UserChannel
        },
        {
          path: '/importbankpfx',
          name: 'ImportBankPFX',
          component: ImportBankPFX
        },
        {
          path: '/terminaladd',
          name: 'TerminalAdd',
          component: TerminalAdd
        }, {
          path: '/carousel',
          name: 'AppCarousel',
          component: AppCarousel
        }, {
          path: '/carouseladd',
          name: 'AppCarouselAdd',
          component: AppCarouselAdd
        }, {
          path: '/carouselupdate',
          name: 'AppCarouselUpdate',
          component: AppCarouselUpdate
        }, {
          path: '/news',
          name: 'AppNews',
          component: AppNews
        }, {
          path: '/newsadd',
          name: 'AppNewsAdd',
          component: AppNewsAdd
        }, {
          path: '/newsupdate',
          name: 'AppNewsUpdate',
          component: AppNewsUpdate
        }, {
          path: '/faq',
          name: 'AppFaq',
          component: AppFaq
        }, {
          path: '/faqadd',
          name: 'AppFaqAdd',
          component: AppFaqAdd
        }, {
          path: '/faqupdate',
          name: 'AppFaqUpdate',
          component: AppFaqUpdate
        },
        {
          path:'/appupdate',
          name:'AppUpdate',
          component:AppUpdate
        },
        {
          path:'/appupdatenew',
          name:'AppUpdateNew',
          component:AppUpdateNew
        },
        {
          path:'/openapiexpense',
          name:'OpenapiExpense',
          component:OpenapiExpense
        },
        {
          path:'/mamap',
          name:'MAmap',
          component:MAmap
        }
      ]
    }
  ]
})
