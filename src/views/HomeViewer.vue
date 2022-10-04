<template>
  <div id="container">
    <div id="MapViewer">
      <MapViewer />
    </div>
  </div>
</template>
<script lang="ts">
import MapViewer from "../views/MapViewer.vue";
export default {
  components: {
    MapViewer,
  },
};
</script>
<style>
#MapViewer {
  position: relative;
  width: 90vw;
  height: 90vh;
  margin: 5%;
}
#container{
  width: 100%;
  height: 100%;
}
</style>
