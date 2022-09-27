<template>
  <div id="mapContainer"></div>
  <div id="info" v-if="info">
    <h2>{{ info?.nomCirconscription }}</h2>
    <ul class="no-bullets">
      <li v-for="candidat in info.candidats" v-bind:key="candidat">
        ({{ candidat.abreviationPartiPolitique }}) {{ candidat.prenom }}
        {{ candidat.nom }} {{ candidat.tauxVote }}%
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { resultats } from "../fixturesResultats";
import L from "leaflet";
import omnivore from "@mapbox/leaflet-omnivore";

export default {
  map: null as any,
  circonscriptionMap: null as unknown as Map<string, any>,
  info: null as any,
  colors: {} as Record<string, string>,
  name: "LeafletMap",
  props: {},
  data(): {
    colors: Record<string, string>;
  } {
    return {
      colors: {
        CAQ: "#01A8E7",
        PQ: "#1E2A5C",
        QS: "#FF5505",
        PLQ: "#EC232D",
        NVP: "#000000",
      }
    };
  },
  methods: {},
  mounted() {
    this.map = L.map("mapContainer").setView([45.472, -73.685], 5);
    const url =
      "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
    L.tileLayer(url).addTo(this.map);
    //use a mix of renderers
    const customPane = this.map.createPane("customPane");
    customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400

    const circonLayer = omnivore
      .kml("src/assets/file.kml")
      .addTo(this.map)
      .on("ready", () => {
        circonLayer.eachLayer((layer: any) => {
          const circon = this.circonscriptionMap.get(
            layer.feature.properties.name.trim()
          );
          layer.setStyle({
            color:
              this.colors[circon.candidats[0].abreviationPartiPolitique ?? ""], // More red than green and blue => redish color
            weight: 4,
          });
          layer.on({
            mouseover: (e: any) => {
              this.info = this.circonscriptionMap.get(
                e.target.feature.properties.name.trim()
              );
            },
            mouseout: (e: any) => {
              this.info = null;
            },
          });
        });
      });
  },
  computed: {
    // need annotation
    circonscriptionMap(): Map<string, unknown> {
      const circonscriptionMap = new Map<string, unknown>();
      for (let circonscription of resultats.circonscriptions) {
        circonscription = {
          ...circonscription,
          candidats: [...circonscription.candidats],
        };
        const abstentions =
          circonscription.nbElecteurInscrit - circonscription.nbVoteExerce;
        circonscription.candidats.push({
          numeroCandidat: 0,
          numeroPartiPolitique: 0,
          nom: "Pas",
          prenom: "Ne Vote",
          abreviationPartiPolitique: "NVP",
          nbVoteAvance: 0,
          nbVoteTotal: abstentions,
          tauxVote: 0,
        });
        circonscription.candidats.sort((a, b) => b.nbVoteTotal - a.nbVoteTotal);
        circonscription.candidats = circonscription.candidats.map(
          (candidat) => {
            return {
              ...candidat,
              abreviationPartiPolitique: candidat.abreviationPartiPolitique
                .substring(0, 6)
                .replaceAll(".", ""),
              tauxVote:
                Math.round(
                  (candidat.nbVoteTotal / circonscription.nbElecteurInscrit) *
                    100 *
                    100
                ) / 100,
            };
          }
        );
        circonscriptionMap.set(
          circonscription.numeroCirconscription.toString(),
          circonscription
        );
      }
      return circonscriptionMap;
    },
  },
  onBeforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100vw;
  height: 100vh;
}

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
  margin: 0;
  /* Remove margins */
}
</style>
