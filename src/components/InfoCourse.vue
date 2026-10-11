<template>
  <div class="info__course">
    <div class="close" @click.exact="$emit('onClose')">x</div>
    <div class="section__section">
      <div class="info__section">
        <div class="info__section__teacher">
          <div class="info__section__teacher--photo"></div>
          <div class="info__section__teacher--name">
            <p>RAMON ETHELWOLDO IPANAQUE MORENO</p>
          </div>
        </div>
        <div class="info__section__section">
          <p>AULA 205-A</p>
          <p>LUNES A VIERNES 10:20 A 13:35</p>
          <p>INTELIGENCIA DE NEGOCIOS</p>
          <p>Sección IV.01.2019-II</p>
          <p>LIMA - PUEBLO LIBRE</p>
        </div>
      </div>
      <!-- <div class="list__partner"></div> -->
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store";
export default {
  setup() {
    return { appStore: useAppStore() };
  },
  name: "InfoCourse",
  emits: ["onClose"],
  components: {},
  props: [],
  data() {
    return {};
  },
  mounted() {
    this.appStore.getInfoCourse();
  },
  computed: {
    ...mapState(useAppStore, ["infoCourses"]),
  },
  methods: {},
};
</script>

<style>
.info__course {
  width: 25%;
  min-height: 50%;
  height: auto;
  border-radius: 10px;
  background-color: var(--ocean-surface);
  position: fixed;
  left: 58%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 4px 4px 10px var(--ocean-border);
}
.close {
  width: 30px;
  height: 30px;

  margin: 13px 0 0 13px;
  padding: 2px;
  cursor: pointer;
  color: var(--ocean-ink);
}
.section__section {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  padding-top: 15px;
  text-align: left;
  padding-left: 20px;
}
.info__section,
.list__partner {
  width: 250px;
  height: 300px;
}
.info__section__teacher {
  width: 100%;
  height: 100px;
  display: flex;
}
.info__section__teacher--photo {
  width: 75px;
  height: 100px;
  background-color: var(--ocean-ink);
}
.info__section__teacher--name {
  width: 175px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info__section__teacher--name p,
.info__section__section p {
  color: var(--ocean-ink) !important;
}
.info__section__section {
  padding-top: 15px;
}
.info__section__teacher--name p {
  padding-left: 10px;
  margin-bottom: 0 !important;
}
.list__partner {
  border: 1px solid #333;
}

@media (max-width: 730px) {
  .info__course {
    width: 90%;
    left: 50%;
    z-index: 15;
  }
}
@media (max-width: 570px) {
}
@media (max-width: 400px) {
  .section__section {
    flex-direction: column;
  }
}
</style>
