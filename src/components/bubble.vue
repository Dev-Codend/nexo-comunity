<template>
  <div>
    <div @click="mostrar" class="course__info">
      <div
        v-bind:style="{ backgroundColor: item.color }"
        class="shudleCourses-CoursesStyle"
      ></div>

      <p v-html="item.courseName"></p>
      <p>{{ item.startClass }} - {{ item.endClass }}</p>
      <p v-html="item.classroom"></p>
      <p v-html="item.sede"></p>
    </div>
    <InfoCourse v-show="showInfo" @onClose="showInfo = false" />
  </div>
</template>
<script>
import InfoCourse from "@/components/InfoCourse.vue";

export default {
  name: "bubble",
  components: {
    InfoCourse,
  },
  props: ["item", "index"],
  data() {
    return {
      showInfo: false,
    };
  },
  mounted() {
    document.addEventListener("click", this.close);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },

  methods: {
    mostrar() {
      this.showInfo = true;
    },
    cerrar() {
      this.showInfo = false;
    },
    // eslint-disable-next-line no-unused-vars
    setActive(e) {
      this.showInfo = !this.showInfo;
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.showInfo = false;
      }
    },
  },
};
</script>
<style scoped>
.course__info {
  width: 100%;
  margin: 0;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
}
@media (max-width: 730px) {
  .shudleCourses-CoursesStyle {
    /* display: none; */
  }
  .shudleCourses-Courses {
    height: auto;
    margin: 10px 20px;
    padding: 0;
    padding-top: 15px;
    min-height: 0;
  }
  .course__info p {
    margin: 7px 0;
  }
}
@media (max-width: 570px) {
}
@media (max-width: 400px) {
}
</style>
