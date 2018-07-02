/**
 * Created by 银信数据科技 on 2017/9/27.
 */
import {
  INCREMENT,
  SAVEDATA,
  SESSION,
  USER,
  USERNAME,
  HEALTH,
  LIST,
  URL,
  COLL,
  TERMINAL,
  RESOURCE,
  CHANGERESOURCE,
  ROLE,
  MENU
} from './types'
import getters from './getters'
const state={
  show:false,
  getData:null,
  saveSession: null,
  userData: null,
  loginData: null,
  saveHealthData: null,
  addList: null,
  urlArr: null,
  saveCollaborate: null,
  saveTerminal: null,
  saveFatherResource: null,
  saveChangeResource: null,
  saveRole: null,
  menu: true
}
const mutations = {
  [INCREMENT](state){
    state.show=true
  },
  [SAVEDATA](state,saveData){//处理数据的方法
    state.getData=saveData
  },
  [SESSION](state,saveSession){
    state.saveSession=saveSession
  },
  [USER](state, userData){
    state.userData = userData
  },
  [USERNAME](state, loginData){
    state.loginData = loginData
  },
  [HEALTH](state, saveHealthData){
    state.saveHealthData = saveHealthData
  },
  [LIST](state, addList){
    state.addList = addList
  },
  [URL](state, urlArr){
    state.urlArr = urlArr
  },
  [COLL](state, saveCollaborate){
    state.saveCollaborate = saveCollaborate
  },
  [TERMINAL](state, saveTerminal){
    state.saveTerminal = saveTerminal
  },
  [RESOURCE](state, saveFatherResource){
    state.saveFatherResource = saveFatherResource
  },
  [CHANGERESOURCE](state, saveChangeResource){
    state.saveChangeResource = saveChangeResource
  },
  [ROLE](state, saveRole){
    state.saveRole = saveRole
  },
  [MENU](state, changeMenu){
    state.menu = changeMenu
  }
}
export default {
  state,
  mutations,
  getters
}

