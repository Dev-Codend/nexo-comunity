<template>
  <div class="formalitie">
    <div class="formalitie__header" @click="showInfoFormalitie">
      <p style="font-size: 13px">{{ formalitie.Fecha }}</p>
      <div>
        <p
          style="font-size: 13px; font-weight: 600"
          v-html="formalitie.TramiteNombre"
        ></p>
        <p
          style="margin: 0px; font-size: 10px"
          v-html="formalitie.FechaEstadoTexto"
        ></p>
      </div>

      <p>{{ formalitie.status }}</p>
      <span class="triangle" v-if="showInfo">▲</span>
      <span class="triangle" v-if="showInfo == false">▼</span>
    </div>
    <div class="formalitie__info" v-if="showInfo">
      <div class="formalitie__info-text">
        <p>Proceso: {{ formalitie.TituloNodoProceso }}</p>
        <p>Sede: {{ formalitie.SedeNombre }}</p>
        <p>Nombre: {{ formalitie.NombreCompleto }}</p>
        <p>Motivo: {{ formalitie.Motivo }}</p>
        <p>Fecha de envio: {{ formalitie.DiferenciaFechaTexto }}</p>
        <p>Id de solicitud: {{ formalitie.IdTramiteSolicitud }}</p>

        <div
          style="display: flex; flex-direction: column"
          v-if="formalitie.IdTramite == 2"
        >
          <input
            class="formalitiesNote"
            type="number"
            placeholder="Ingrese Nota"
          />
          <textarea
            class="formalitiesNote-Text"
            placeholder="Ingrese Comentario"
          >
          </textarea>
        </div>

        <div
          v-if="formalitie.TituloNodoProceso != 'Procesado'"
          class="formalities-section"
        >
          <input class="buttonFormalities" type="button" value="Procede" />
          <input
            style="background: #e45258"
            class="buttonFormalities"
            type="button"
            value="No Procede"
          />
          <input
            style="
              background: var(--ocean-gradient-yellow);
              color: var(--ocean-onAccent, var(--ocean-navy));
            "
            class="buttonFormalities"
            type="button"
            value="En Espera"
          />
        </div>
      </div>

      <hr style="division" />

      <div class="formalitie__info-text">
        <p style="font-weight: bold; font-size: 15px">Cursos</p>
        <p>{{ formalitie.TramiteSolicitudDisponible1 }}</p>
        <p>{{ formalitie.TramiteSolicitudDisponible2 }}</p>
        <p>{{ formalitie.TramiteSolicitudDisponible3 }}</p>
        <p>{{ formalitie.TramiteSolicitudDisponible4 }}</p>
        <p>{{ formalitie.TramiteSolicitudDisponible5 }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tramites",

  props: {
    formalitie: { required: true, type: Object },
  },
  data() {
    return {
      showInfo: false,
    };
  },
  computed: {},
  methods: {
    showInfoFormalitie() {
      this.showInfo = !this.showInfo;
    },
  },
};
</script>

<style>
.formalitie__info {
  display: flex;
  justify-content: space-around;
}
.formalitie__info-text p {
  font-size: 13px;
}
.triangle {
  position: absolute;
  right: 15px;
  font-size: 10px;
}

.buttonFormalities {
  background: var(--ocean-deep);
  border-radius: 8px;
  padding: 5px;
  width: 101px;
  color: white;
  height: 33px;
  outline: none;
  font-weight: 500;
  font-size: 14px;
}

.formalities-section {
  display: flex;
  justify-content: space-between;
  width: 330px;
  padding-bottom: 13px;
}

.formalitiesNote {
  border: 2px solid var(--ocean-border);
  width: 39% !important;
  border-radius: 7px;
  height: 36px;
  padding-left: 10px;
  font-size: 13px;
  outline: none;
  margin-bottom: 12px;
}
.formalitiesNote-Text {
  border: 2px solid var(--ocean-border);
  width: 66% !important;
  border-radius: 8px;
  height: 86px;
  padding-left: 10px;
  font-size: 13px;
  outline: none;
  margin-bottom: 12px;
  resize: none;
  padding-top: 7px;
}
.division {
  display: none;
}
@media (max-width: 730px) {
}
@media (max-width: 570px) {
}
@media (max-width: 420px) {
  .formalitie__info {
    flex-direction: column-reverse;
  }
  .buttonFormalities {
    margin: 2px;
    width: 87px;
    color: white;
    height: 33px;
  }
  .formalities-section {
    width: auto;
  }
  .formalitiesNote,
  .formalitiesNote-Text {
    width: 100% !important;
  }
  .division {
    display: block;
  }
}
</style>
