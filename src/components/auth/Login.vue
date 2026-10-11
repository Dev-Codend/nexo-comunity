<template>
  <div class="wrapper">
    <div class="container">
      <h1>Login</h1>
      <p v-if="demo" style="color: white">
        Modo demo: ingresa cualquier usuario y contraseña. Los cambios se
        reinician al recargar.
      </p>
      <div class="contLogin">
        <input type="text" placeholder="Nombre de Usuario" v-model="codigo" />
        <input type="password" placeholder="Contraseña" v-model="password" />
        <v-btn
          id="login-button"
          :loading="loading3"
          :disabled="loading3"
          @click="login"
          >Acceder</v-btn
        >

        <!-- <router-link :to="{ path: '/register' }">
          <div style="position:relative">
            <span class="butonRegister">Registrar</span>
          </div>
        </router-link> -->
      </div>
    </div>

    <ul class="bg-bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { isDemo } from "@/services/api";
import Swal from "sweetalert2";

export default {
  name: "Login",
  setup() {
    return { appStore: useAppStore() };
  },
  data() {
    return { demo: isDemo, codigo: "", password: "", loading3: false };
  },
  methods: {
    async login() {
      this.loading3 = true;
      try {
        await this.appStore.retrieveToken({
          studentCode: this.codigo,
          password: this.password,
        });
        const redirect = this.$route.query.redirect;
        await this.$router.push(
          typeof redirect === "string" &&
            redirect.startsWith("/") &&
            !redirect.startsWith("//")
            ? redirect
            : { name: "dashboard" },
        );
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo iniciar sesión",
          text: error.response?.data?.message || error.message,
        });
      } finally {
        this.loading3 = false;
      }
    },
  },
};
</script>
<style scoped>
::-webkit-input-placeholder {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}

.wrapper {
  background: var(--ocean-deep);
  background: linear-gradient(
    135deg,
    var(--ocean-navy) 0%,
    var(--ocean-deep) 48%,
    var(--ocean-blue) 82%,
    var(--ocean-cyan) 100%
  );
  position: absolute;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.wrapper.form-success .container h1 {
  transform: translateY(85px);
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 0;
  height: 400px;
  text-align: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 300;
}
.container h1 {
  font-size: 40px;
  transition-duration: 1s;
  transition-timing-function: ease-in-put;
  font-weight: 200;
  color: white;
}
.contLogin {
  padding: 20px 0;
  position: relative;
  z-index: 2;
}
.contLogin input {
  display: block;
  appearance: none;
  outline: 0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
  width: 250px;
  border-radius: 3px;
  padding: 10px 15px;
  margin: 0 auto 10px auto;
  text-align: center;
  font-size: 18px;
  color: white;
  transition-duration: 0.25s;
  font-weight: 300;
}
.contLogin input:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
.contLogin input:focus {
  background-color: var(--ocean-surface);
  width: 300px;
  color: var(--ocean-link, var(--ocean-deep));
}
.contLogin button {
  appearance: none;
  outline: 0;
  background: var(--ocean-gradient-yellow);
  box-shadow: 0 5px 18px color-mix(in srgb, var(--ocean-amber) 25%, transparent);
  border: 0;
  padding: 10px 15px;
  color: var(--ocean-onAccent, var(--ocean-deep));
  border-radius: 3px;
  width: 250px;
  cursor: pointer;
  font-size: 18px;
  transition-duration: 0.25s;
}
.contLogin button:hover {
  background: var(--ocean-gradient-yellow-hover);
}
.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -160px;
  -webkit-animation: square 25s infinite;
  animation: square 25s infinite;
  -webkit-transition-timing-function: linear;
  transition-timing-function: linear;
}
.bg-bubbles li:nth-child(1) {
  left: 10%;
}
.bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  animation-delay: 2s;
  animation-duration: 17s;
}
.bg-bubbles li:nth-child(3) {
  left: 25%;
  animation-delay: 4s;
}
.bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
.bg-bubbles li:nth-child(5) {
  left: 70%;
}
.bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 120px;
  height: 120px;
  animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
}
.bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  animation-delay: 7s;
}
.bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 20px;
  height: 20px;
  animation-delay: 15s;
  animation-duration: 40s;
}
.bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 10px;
  height: 10px;
  animation-delay: 2s;
  animation-duration: 40s;
  background-color: rgba(255, 255, 255, 0.3);
}
.bg-bubbles li:nth-child(10) {
  left: 90%;
  width: 160px;
  height: 160px;
  animation-delay: 11s;
}
@-webkit-keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 47px;
  min-width: 64px;
  padding: 0 16px;
  font-size: 14px;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.butonRegister {
  font-size: 15px;
  padding: 16px;
  position: absolute;
  right: 11em;
  display: flex;
  justify-content: flex-end;
  color: white;
}
</style>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
