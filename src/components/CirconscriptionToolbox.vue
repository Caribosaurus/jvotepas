<template>
  <div id="widget">
    <vc-donut :sections="sections" :total="total" :size="200" has-legend>{{
      circonscription.nomCirconscription
    }}</vc-donut>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {};
  },
  computed: {
    sections(): Array<any> {
      return (this as any).circonscription.candidats
        .map((candidat: any) => {
          return {
            label: `${candidat.abreviationPartiPolitique}, ${candidat.prenom} ${
              candidat.nom
            }: ${Number(candidat.nbVoteTotal).toLocaleString()} (${
              candidat.tauxVote
            }%)`,
            value: candidat.nbVoteTotal,
            color: (this as any).colors[candidat.abreviationPartiPolitique],
          };
        })
        .slice(0, 5);
    },
    total(): number {
      return (this as any).circonscription.candidats.reduce(
        (previousValue: any, currentValue: any) =>
          previousValue + currentValue.nbVoteTotal,
        0
      );
    },
  },
  props: ["circonscription", "colors"],
  methods: {
    listItemStyle: function (candidat: any) {
      return {
        "background-color": (this as any).colors[
          candidat.abreviationPartiPolitique
        ],
      };
    },
  },
  setup(props: any) {},
};
</script>
<style scoped>
#widget {
  width: 250px;
}
h2 {
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
