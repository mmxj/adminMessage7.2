
<template>
  <div id="MAmap">
    <div class="amap-wrapper">
      <el-amap-search-box class="search-box"  :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap vid="amapDemo"  :center="center" :zoom="12" :events="events" class="amap-demo">
        <el-amap-marker v-if="markers.position.length>0" vid="component-marker" :position="markers.position"  :title="address"></el-amap-marker>
      </el-amap>
      <div class="location"> 经纬度: [{{ lng }}, {{ lat }}] 地址: {{ address }}</div>
    </div>
  </div>
</template>
<script>
  import {AMapManager} from 'vue-amap'
  export default {
    props:['position'],
    data () {
      let self = this;
      return {
        center: [113.243804, 23.141207],
        address:null,
        events: {
          click(e){
              let {lng, lat} = e.lnglat;
              self.lng=lng;
              self.lat= lat;
              //这里通过高德地图SDK完成；
            var geocoder = new AMap.Geocoder({
              radius:1000,
              extensions:'all'
            });
            geocoder.getAddress([lng ,lat], function(status, result) {

              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.address = result.regeocode.formattedAddress;
                  let locationarr=[self.lng,self.lat];
                  self.center=locationarr;
                  self.markers.position=locationarr;
                  self.$nextTick();
                }
              }
            });
            self.position.lng= self.lng;
            self.position.lat=self.lat;
          },

        },
        lng:0,
        lat:0,
        markers:{
          position:[]
        },
        searchOption: {
          city: '',
          citylimit: true
        },
      }
    },
    methods: {
      addMarker: function() {
        let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
        let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
        this.markers.position=[lng, lat];
      },
      onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            this.markers.position=[lng, lat];
            this.address=poi.address;
            this.lng=lng;
            this.lat= lat;
          });
          let centers = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.center = [centers.lng, centers.lat];
          this.position.lng= this.lng;
          this.position.lat=this.lat;
        }

      }
    }
  }
</script>
<style lang="scss">
  #MAmap{
    position: relative;
    .amap-wrapper {
      width: 800px;
      height: 500px;
    }
    .amapDemo{

    }
    .search-box {
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .location{
      position: absolute;
      bottom: -24px;
      font-size:12px;
      left: 0px;
      z-index:200;
    }
    .el-vue-search-box-container{
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }
</style>
