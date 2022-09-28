<template>
  <div>
    <h2>{{ info.nomCirconscription }}</h2>
    <ul class="no-bullets">
      <li v-for="candidat in info.candidats" v-bind:key="candidat">
        <span class="dot" :style="listItemStyle(candidat)"></span>
        ({{ candidat.abreviationPartiPolitique }}) {{ candidat.prenom }}
        {{ candidat.nom }} {{ candidat.tauxVote }}%
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {};
  },
  props: ["info", "colors"],
  methods: {
    listItemStyle: function (candidat: any) {
      return {
        "background-color": (this as any).colors[
          candidat.abreviationPartiPolitique
        ],
      };
    },
  },
  setup(props: any) {
    console.log(props.title);
  },
};
</script>
<style scoped>
#info {
  position: fixed;
  right: 1em;
  top: 1em;
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 0 5px;
  z-index: 1000000000000;
  color: #888;
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
