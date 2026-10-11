<template>
  <div>
    <Navigator />
    <Schedule />
    <!-- <Courses v-if="showCourses" /> -->
  </div>
</template>

<script>
import Navigator from "@/components/Navigator.vue";
// import Courses from "@/components/classRoom/Courses.vue";
import Schedule from "@/components/classRoom/Schedule.vue";

export default {
  name: "Cursos",
  components: {
    Navigator,
    // Courses,
    Schedule,
  },
  data() {
    return {
      showCourses: false,
      showSchedule: true,
    };
  },
};
</script>
