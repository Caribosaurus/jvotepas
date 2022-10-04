<script lang="ts">
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import omnivore from "@mapbox/leaflet-omnivore";
import CirconscriptionToolbox from "../components/CirconscriptionToolbox.vue";
import { resultats as resultats2018 } from "../resultats2018";
import { resultats as resultats2022 } from "../resultats2022";
export default {
  map: null as any,
  circonscriptionMap: null as unknown as Map<string, any>,
  info: null as any,
  colors: {} as Record<string, string>,
  name: "LeafletMap",
  props: ["annee", "abstention", "colors", "distribution"],
  components: {
    CirconscriptionToolbox,
  },
  data(): {
    info: any;
  } {
    return {
      info: this.info,
    };
  },
  methods: {
    redraw() {
      (this as any).circonLayer?.eachLayer((layer: any) => {
        const circon = (this as any).circonscriptionMap.get(
          layer.feature.properties.name.trim()
        );
        layer.setStyle({
          fillColor: (this as any).colors[circon.candidats[0].abreviationPartiPolitique],
          color: "black",
          weight: 1,
        });
        layer.on({
          mouseover: (e: any) => {
            layer.setStyle({
              fillOpacity: 0.5,
            });
          },
          mouseout: (e: any) => {
            layer.setStyle({
              fillOpacity: 0.2,
            });
          },
          click: (e: any) => {
            (this as any).info = circon;
            (this as any).map.fitBounds(layer.getBounds());
          },
        });
      });
    },
  },
  watch: {
    // It listens to the change in prop name
    annee: function () {
      // print out when the name changes
      (this as any).redraw();
    },
    abstention: function () {
      // print out when the name changes
      (this as any).redraw();
    },
  },
  mounted() {
    this.map = L.map("mapContainer", { zoomControl: false }).setView(
      [48.540167, -73.931064],
      6
    );
    const url =
      "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
    L.tileLayer(url).addTo(this.map);
    //use a mix of renderers
    const customPane = this.map.createPane("customPane");
    customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400

    (this as any).circonLayer = omnivore
      .kml("/file.kml")
      .addTo(this.map)
      .on("ready", () => {
        (this as any).redraw();
      });
  },
  computed: {
    circonscriptionMap(): Map<string, unknown> {
      const resultMapper: Record<string, unknown> = {
        2018: resultats2018,
        2022: resultats2022,
      };
      const circonscriptionMap = new Map<string, unknown>();
      for (let circonscription of (
        resultMapper[(this as any).annee as string] as any
      ).circonscriptions) {
        circonscription = {
          ...circonscription,
          candidats: [...circonscription.candidats],
        };
        const abstentions =
          circonscription.nbElecteurInscrit - circonscription.nbVoteExerce;
        if ((this as any).abstention) {
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
        }
        circonscription.candidats = circonscription.candidats.map(
          (candidat: any) => {
            const abreviationPartiPolitique = candidat.abreviationPartiPolitique
              .substring(0, 6)
              .replaceAll(".", "")
              .replaceAll("-", "");
            const nbVoteTotal = !(this as any).abstention
              ? candidat.nbVoteTotal +
                abstentions * (this as any).distribution[abreviationPartiPolitique]
              : candidat.nbVoteTotal;
            return {
              ...candidat,
              abreviationPartiPolitique,
              nbVoteTotal,
              tauxVote:
                Math.round(
                  (nbVoteTotal /
                    ((this as any).abstention
                      ? circonscription.nbElecteurInscrit
                      : circonscription.nbVoteExerce)) *
                    100 *
                    100
                ) / 100,
            };
          }
        );
        circonscription.candidats.sort(
          (a: any, b: any) => b.nbVoteTotal - a.nbVoteTotal
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

<template>
  <div id="mapContainer"></div>
  <div id="info" v-if="info">
    <CirconscriptionToolbox :circonscription="info" :colors="colors" />
  </div>
</template>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}
#info {
  position: absolute;
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
  color: rgb(113, 113, 113);
}
</style>
