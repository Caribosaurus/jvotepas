<template>
  <div id="widget">
    <vc-donut :sections="sections" :total="total" :size="200" has-legend>
      <h5>
        {{ sections[0].parti }}
        {{ sections[0].value >= 63 ? "majoritaire" : "minorataire" }}
      </h5>
    </vc-donut>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      total: 125,
    };
  },
  computed: {
    sections(): Array<any> {
      const sections = [];
      for (const [parti, sieges] of (this as any).resultsMap) {
        sections.push({
          value: sieges,
          label: `${parti}: ${sieges}`,
          color: (this as any).colors[parti],
          parti,
        });
      }
      return sections;
    },
  },
  props: ["resultsMap", "colors"],
  methods: {
    listItemStyle: function (candidat: any) {
      return {
        "background-color": (this as any).colors[
          candidat.abreviationPartiPolitique
        ],
      };
    },
  },
};
</script>
<style scoped>
#widget {
  width: 250px;
}
h5 {
  color: black;
}
ul.no-bullets {
  list-style-type: none;
  /* Remove bullets */
  padding: 0;
  /* Remove padding */
  margin: 5px;
  /* Remove margins */
}
li {
  padding: auto;
}
.dot {
  height: 1em;
  width: 1em;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}
</style>
