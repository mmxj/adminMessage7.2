<template>
  <div id="Message">
    <img class="logo" :src="urlImg" alt="">
  </div>
</template>
<script type="text/javascript">
  import {mapGetters, mapActions} from 'vuex'
  export default{
    data(){
      return {
        urlImg: require("@/assets/img/297193900997488950.png"),
      }
    }
  }
</script>
<style lang="scss" scoped>
  #Message {
    background: #fff;
    img {
      width: 100%;
      /*border: 1px solid #aaa;*/
    }
  }

</style>
