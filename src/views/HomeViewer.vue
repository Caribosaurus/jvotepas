<template>
  <div class="row" id="header">
    <div id="selectors" class="row-6">
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
          { label: 'Élection 2018', value: '2018' },
          { label: 'Élection 2022', value: '2022' },
        ]"
      />
      <p>Quoi faire avec les abstentions?</p>
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
          { label: 'Compter comme un parti', value: true },
          { label: 'Distribuer les votes', value: false },
        ]"
      />
      <div v-if="!abstention">
        <q-badge color="light-blue"> CAQ: {{ distribCAQ }}% </q-badge>
        <q-slider
          v-model="distribCAQ"
          :min="0"
          :max="100"
          :step="0.1"
          color="light-blue"
        />
        <q-badge color="orange"> QS: {{ distribQS }}% </q-badge>
        <q-slider
          v-model="distribQS"
          :min="0"
          :max="100"
          :step="0.1"
          color="orange"
        />
        <q-badge color="dark-blue"> PQ: {{ distribPQ }}% </q-badge>
        <q-slider
          v-model="distribPQ"
          :min="0"
          :max="100"
          :step="0.1"
          color="dark-blue"
        />
        <q-badge color="red"> PLQ: {{ distribPLQ }}% </q-badge>
        <q-slider
          v-model="distribPLQ"
          :min="0"
          :max="100"
          :step="0.1"
          color="red"
        />
        <q-badge color="purple"> PCQ: {{ distribPCQ }}% </q-badge>
        <q-slider
          v-model="distribPCQ"
          :min="0"
          :max="100"
          :step="0.1"
          color="purple"
        />
      </div>
    </div>
    <div id="resultats" class="row-6">
      <ResultViewer :colors="colors" :resultsMap="resultsMap" />
    </div>
  </div>
  <div class="row" id="MapViewer">
    <MapViewer :circonscriptionMap="circonscriptionMap" :colors="colors" />
  </div>
</template>
<script lang="ts">
import MapViewer from "./MapViewer.vue";
import ResultViewer from "../components/ResultViewer.vue";
import { resultats as resultats2018 } from "../resultats2018";
import { resultats as resultats2022 } from "../resultats2022";
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
      distribCAQ: 0,
      distribQS: 0,
      distribPQ: 0,
      distribPLQ: 0,
      distribPCQ: 0,
    };
  },
  computed: {
    distribution(): Record<string, number> {
      return {
        CAQ: (this as any).distribCAQ / 100,
        PQ: (this as any).distribPQ / 100,
        PCQ: (this as any).distribPCQ / 100,
        QS: (this as any).distribQS / 100,
        PLQ: (this as any).distribPLQ / 100,
      };
    },
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
                abstentions *
                  (this as any).distribution[abreviationPartiPolitique]
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
    resultsMap(): Map<string, number> {
      const results = new Map<string, number>();
      for (const circonscription of (
        this.circonscriptionMap as unknown as Map<string, any>
      ).values()) {
        const candidats = circonscription.candidats.slice(0, 5);
        const gagnant = candidats[0];

        results.set(
          gagnant.abreviationPartiPolitique,
          (results.get(gagnant.abreviationPartiPolitique) || 0) + 1
        );
      }
      return results;
    },
  },
  components: {
    MapViewer,
    ResultViewer,
  },
};
</script>
<style lang="sass" scoped>
#MapViewer
  align-items: stretch
  height: 65vh
.my-custom-toggle
  border: 1px solid #027be3
#selectors
  padding: 0.5em
#header
  align-items: center
  justify-content: center
</style>
