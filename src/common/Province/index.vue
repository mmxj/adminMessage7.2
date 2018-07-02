<template>
  <div id="Provice">
    <el-select :disabled="disabled" size="small" v-model="propdata.provinceId" @change="provinceChange"
               @clear="clearData('province')"
               clearable placeholder="请选择">
      <el-option v-for="item in data.provinceData" :key="item.value" :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
    <el-select :disabled="(startData.provinceId!=null&&startData.cityId==null)?false:disabled" size="small" v-model="propdata.cityId" @change="cityChange"
               @clear="clearData('city')" clearable
               placeholder="请选择">
      <el-option v-for="item in data.cityData" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select :disabled="(startData.provinceId!=null&&startData.areaId==null)?false:disabled" size="small" v-model="propdata.areaId" @clear="clearData('area')" clearable
               placeholder="请选择">
      <el-option v-for="item in data.areaData" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>
<script>
  import unit from '@/unit/unit.js'
  export default{
    data(){
      return {
        session: sessionStorage.getItem('session'),
        data: {
          provinceData: [],
          cityData: [],
          areaData: [],
          start: null,

        },
        startData:{}
      }
    },
    props: ['propdata', 'startArea', 'disabled' ,'startAreaData','noall'],//propdata数据对象 startarea 初始地区id 接受的是一个静态的值不能修改  disabled是否禁用
    methods: {
      getProvince(){
        var vm = this;
        var getProvince = new RemoteCall();
        getProvince.init({
          router: '/base/area/get',
          session: this.session,
//          async: false,
          data: {
            parentAreaId: 0
          },
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              data.rows.forEach(function (item, i) {
                var option = {}
                option.key = item.id;
                option.label = item.name;
                option.value = item.id;
                //                vm.data.provinceData[i]=option;
                vm.$set(vm.data.provinceData, i, option);
              })
            }
          }
        })
      },
      getStartId(id, fn){//有初始值的时候获取他的所有id
        var getStartProvince = new RemoteCall();
        getStartProvince.init({
          router: '/base/area/get',
          session: this.session,
//          async: false,
          data: {
            id: id
          },
          callback: fn,
        })
      },
      clearData(data){
        this.propdata[data] = null;
      },
      provinceChange(){//省选项发生改变时
        var vm = this;
        if(this.noall){
          vm.data.cityData = [];
        }else{
          vm.data.cityData = [{
            key:  new Date(),
            label:'全部城市',
            value:null
          }];
        }

        if(this.propdata.cityId !=this.propdata.provinceId ){
          vm.$set(this.propdata, 'cityId', null);
          vm.$set(this.propdata, 'areaId', null);
          if (this.propdata.provinceId != '' && this.propdata.provinceId != null &&this.propdata.provinceId != 'null'&& this.propdata.provinceId != 'undefined') {
            var getProvince = new RemoteCall();
            getProvince.init({
              router: '/base/area/get',
              session: this.session,
              data: {
                parentAreaId: this.propdata.provinceId
              },
              callback: function (data) {
                if (data.ret.errorCode === 0) {
                  data.rows.forEach(function (item, i) {
                    var option = {}
                    option.key = item.id;
                    option.label = item.name;
                    option.value = item.id;
                    vm.data.cityData.push(option);
                  })
                }
              }
            })
          }
        }
        this.cityChange();
      },
      cityChange(){//城市选项发生改变时
        var vm = this;
        if(this.noall){
          vm.data.areaData = [];
        }else{
          vm.data.areaData = [{
            key:  new Date(),
            label:'全部区县',
            value: null
          }];
        }
        vm.$set(this.propdata, 'areaId', null);
          if (this.propdata.cityId != '' && this.propdata.cityId != null&&this.propdata.cityId != 'null' && this.propdata.cityId != 'undefined') {
            var getProvince = new RemoteCall();
            getProvince.init({
              router: '/base/area/get',
              session: this.session,
              data: {
                parentAreaId: this.propdata.cityId
              },
              callback: function (data) {
                if (data.ret.errorCode === 0) {
                  data.rows.forEach(function (item, i) {
                    var option = {}
                    option.key = item.id;
                    option.label = item.name;
                    option.value = item.id;
//                vm.data.provinceData[i]=option;
                    vm.data.areaData.push(option);
//                    vm.$set(vm.data.areaData, i, option)
                  })
                }
              }
            })
          }


      },

    },
    computed: {
      start: function () {
        return this.startArea
      }
    },
    mounted: function () {
      var vm = this;
      this.$nextTick(() => {
        this.getProvince();
        if(!vm.startArea&&!vm.startAreaData){
          this.propdata.provinceId="440000";//设置默认为广东省
          vm.provinceChange();
        }
        if(this.startAreaData){

//          this.startData=this.startAreaData;
        }
      })
    },
    watch: {
      startArea: {
        handler: function (val, oldVal) {
          var vm = this;
          //处理有初始值areaid的情况
          if (this.startArea&&this.startArea!='null') {
              console.log(this.startArea)
            this.$nextTick(function () {
              vm.getStartId(vm.startArea, function (data) {
                if (data.ret.errorCode === 0) {
//                  第一种情况全市区 parentId=0
                  if(Number(data.rows[0].parentAreaId)===0){
                    vm.$set(vm.propdata, 'provinceId', vm.startArea);
                    vm.provinceChange();
                    vm.$nextTick(function () {
                      vm.$set(vm.propdata, 'cityId', vm.startArea);
                      vm.cityChange();
                      vm.$nextTick(function(){
                        vm.$set(vm.propdata, 'areaId', vm.startArea);
                      })
                    })
                  }

                  else{

                    if(data.rows[0].parentAreaId){
                      vm.getStartId(data.rows[0].parentAreaId, function (datas) {
                        if (data.ret.errorCode === 0) {
                          if(Number(datas.rows[0].parentAreaId)===0){
                            vm.$set(vm.propdata, 'provinceId', datas.rows[0].id);
                            vm.provinceChange();
                            vm.$nextTick(function () {
                              vm.$set(vm.propdata, 'cityId', vm.startArea);
                              vm.cityChange();
                              vm.$nextTick(function(){
                                vm.$set(vm.propdata, 'areaId', vm.startArea);
                              })
                            })
                          }else{
                            vm.$set(vm.propdata, 'provinceId', datas.rows[0].parentAreaId);
                            vm.provinceChange();
                            vm.$nextTick(function () {
                            vm.$set(vm.propdata, 'cityId', data.rows[0].parentAreaId);
                            vm.cityChange();
                            vm.$nextTick(function () {
                              vm.$set(vm.propdata, 'areaId', vm.startArea);
                            })
                          })
                          }
                        }
                      })
                    }
                  }
                }
              })
            })
          } else {
            vm.$set(vm.propdata, 'provinceId', null);
          }
        },
        deep: true

      },
      startAreaData:{
        handler:function(newVal,oldVal){
            var vm=this;
            this.startData=newVal;
            vm.$set(vm.propdata, 'provinceId', newVal.provinceId);
            vm.provinceChange()
            vm.$set(vm.propdata, 'cityId', newVal.cityId);
            vm.cityChange()

             vm.$set(vm.propdata, 'areaId', newVal.areaId);
        },
        deep:true
      }
    }

  }
</script>
<style lang="scss">
  #Provice {
    width: 100%;
    box-sizing: border-box;
    .el-select {
      width: 31% !important;
      .el-input {
        width: 100%;
      }
    }
    .el-select .el-input .el-select__caret{
      top:0;
    }

    .el-select .el-input .el-icon-circle-close{
      top:9px;
    }
  }
  @media screen and (max-width:1500px ) {
    #Provice {
      .el-select {
        width: 31.5% !important;

      }
    }
  }
</style>
