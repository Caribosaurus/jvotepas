<template>
  <div id="container">
    <div id="selectors">
      <q-btn-toggle
        v-model="annee"
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          { label: '2018', value: '2018' },
          { label: '2022', value: '2022' },
        ]"
      />
      <q-btn-toggle
        v-model="abstention"
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          { label: 'Parti', value: true },
          { label: 'Distribuer', value: false },
        ]"
      />
      <div>
        <q-slider v-model="distribPq" :min="0" :max="100" :step="0.1" />
      </div>
    </div>
    <div id="MapViewer">
      <MapViewer
        :annee="annee"
        :abstention="abstention"
        :colors="colors"
        :distribution="distribution"
      />
    </div>
  </div>
</template>
<script lang="ts">
import MapViewer from "../views/MapViewer.vue";
export default {
  data(): any {
    return {
      annee: "2022",
      abstention: true,
      colors: {
        CAQ: "#01A8E7",
        PQ: "#1E2A5C",
        PCQ: "#630FD1",
        QS: "#FF5505",
        PLQ: "#EC232D",
        NVP: "#000000",
      },
      distribPq: 0,
    };
  },
  computed: {
    distribution(): Record<string,number> {
      return {
        CAQ: 0,
        PQ: (this as any).distribPq / 100,
        PCQ: 0,
        QS: 0,
        PLQ: 0,
      };
    },
  },
  components: {
    MapViewer,
  },
};
</script>
<style lang="sass" scoped>
#MapViewer
  position: relative
  width: 90vw
  height: 90vh
#container
  width: 100%
  height: 100%
  padding: 5%
.my-custom-toggle
  border: 1px solid #027be3
</style>
