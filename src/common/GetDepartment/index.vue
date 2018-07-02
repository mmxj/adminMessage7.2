<template>
  <div id="GetCompany">
    <el-autocomplete
      v-model="data.name"
      :fetch-suggestions="querySearchAsync"
      :placeholder="holder?holder:'请输入内容'"
      @select="handleSelect"
      select-when-unmatched
      :disabled="disabled"
      size="small"
      @blur="blurInput"
    ></el-autocomplete>
  </div>
</template>

<script>
  export default {
    props: ['data', 'holder', 'start' ,'disabled'],//data接受的存储数据的对象，type请求的公司类型，holder为空时的提示语，start初始的公司名称
    data() {
      return {
        session: sessionStorage.getItem('session'),
        restaurants: [],
        timeout: null,
        companyId:sessionStorage.getItem('companyId'),
        arr:[]
      };
    },
    methods: {
      loadAll(departmentName) {//查询公司信息
        let array = [];
        let vm = this;
        let getProvince = new RemoteCall();
        getProvince.init({
          router: '/company/department/get',
//          async: false,
          session: this.session,
          data: {
            name: departmentName,

            pageInfo: {
              pageSize: 100,
              pageNum: 1
            },
            companyId:vm.companyId
          },
          callback: function (data) {
            if (data.ret.errorCode === 0) {
              data.rows.forEach(function (item) {
                var options = {};
                options.value = item.name;
                options.id = item.id;
                array.push(options)
              });
            }
          }
        })
        return array
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        if (queryString == '') {
          this.data.name = null;
          this.data.id = null;
        }
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        if (results.length == 0) {
          restaurants = this.loadAll(queryString);
          results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        }
        this.$nextTick(function () {
          if (results.length > 0) {
            if (queryString == results[0].name) {
              this.data.id = results[0].id
            } else {
              this.data.id = null;
            }
          }
          this.arr=results;
          cb(results);
        })
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.data.id = item.id;
      },
      blurInput(){
        var vm=this;
         if(vm.arr){
           if( vm.arr.length){
             if (this.data.name == vm.arr[0].value) {
               this.data.id = vm.arr[0].id
             } else {
               this.data.id = null;
             }
           }
         }
        this.$emit('valueChange');

      }
    },
    mounted() {
      var vm = this;
      vm.restaurants = vm.loadAll();
      if (vm.start) {
        vm.$set(vm.data, 'name', vm.start);
      }
    },
    watch: {
      start(){
        var vm = this;
        vm.$set(vm.data, 'name', vm.start);
        if (vm.start == '' || vm.start == null) {
          vm.restaurants = vm.loadAll();
        }
//        vm.restaurants = vm.loadAll(vm.start);
////        vm.data.name=vm.start;
      },
    }
  };
</script>
<style lang="scss">
  #GetCompany {
    width: 100%;
    .el-autocomplete{
      width:100%;
    }
  }
</style>
