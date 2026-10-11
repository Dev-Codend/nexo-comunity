import { palette } from "../theme/palette.js";

// Adapter isolated to `npm run demo`. Data lives in memory and resets on reload.
export function installMockApi(axios) {
  const user = { id: 1, name: "Docente Demo", photo: null, id_type_user: 2 };
  const companies = [
    { id: 1, name: "Comunidad académica" },
    { id: 2, name: "Bienestar estudiantil" },
  ];
  let nextId = 100;
  const makeComment = (text) => ({
    id: nextId++,
    text,
    user,
    is_mine: true,
    sub_comment: [],
  });
  let posts = [
    {
      id: 1,
      id_company: 1,
      text: "Bienvenidos a AdminZoom. Puedes publicar, editar y comentar sin conectar un backend.",
      user,
      is_mine: true,
      image_url: "",
      likes_count: 3,
      comment: [makeComment("Este es un comentario de ejemplo.")],
    },
    {
      id: 2,
      id_company: 2,
      text: "Revisa los horarios en Cursos y las solicitudes en Documentos.",
      user,
      is_mine: true,
      image_url: "",
      likes_count: 1,
      comment: [],
    },
  ];
  posts[0].comment[0].sub_comment.push(
    makeComment("También puedes responder comentarios."),
  );
  const schedules = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(
    (day, index) => ({
      day,
      number: index + 12,
      today: index === 0,
      courses: [
        {
          courseName: [
            "Inteligencia de negocios",
            "Programación web",
            "Inglés",
            "Base de datos",
            "Gestión de proyectos",
          ][index],
          startClass: "10:20",
          endClass: "13:35",
          classroom: "Aula 205-A",
          sede: "Lima - Pueblo Libre",
          color: [
            palette.yellow,
            palette.blue,
            palette.cyan,
            palette.deep,
            palette.blue,
          ][index],
        },
      ],
    }),
  );
  const formalities = ["Revisión de nota", "Constancia de estudios"].map(
    (name, index) => ({
      IdTramiteSolicitud: index + 1,
      IdTramite: index + 2,
      Fecha: "11/10/2026",
      TramiteNombre: name,
      FechaEstadoTexto: "Solicitud de demostración",
      status: "En espera",
      TituloNodoProceso: "Procesado",
      SedeNombre: "Pueblo Libre",
      NombreCompleto: "Estudiante Demo",
      Motivo: "Solicitud de ejemplo",
      DiferenciaFechaTexto: "Hoy",
      TramiteSolicitudDisponible1: "Programación web",
    }),
  );
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const findPost = (id) => posts.find((post) => post.id === Number(id));
  const comments = () =>
    posts.reduce((all, post) => all.concat(post.comment), []);
  const findComment = (id) =>
    comments().find((comment) => comment.id === Number(id));
  const findReply = (id) =>
    comments()
      .reduce((all, comment) => all.concat(comment.sub_comment), [])
      .find((reply) => reply.id === Number(id));
  const readBody = (body) => {
    if (body instanceof FormData) {
      const result = {};
      body.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    return typeof body === "string" ? JSON.parse(body) : body || {};
  };
  const requireItem = (item) => {
    if (!item) throw new Error("No se encontró el registro demo solicitado.");
    return item;
  };

  axios.defaults.adapter = async (config) => {
    const url = new URL(config.url, "http://demo.local");
    const path = url.pathname;
    const body = readBody(config.data);
    const params = config.params || {};
    let data;
    if (config.method === "get") {
      switch (path) {
        case "/api/posts": {
          const filtered = params.company
            ? posts.filter((post) => post.id_company === Number(params.company))
            : posts;
          const page = Math.max(1, Number(params.page) || 1);
          data = { data: filtered.slice((page - 1) * 5, page * 5) };
          break;
        }
        case "/api/companies":
          data = companies;
          break;
        case "/api/profile":
          data = user;
          break;
        case "/api/classroom/schedule":
          data = { data: schedules };
          break;
        case "/api/classroom/info_course":
          data = { data: schedules[0].courses };
          break;
        case "/api/formalities":
          data = { data: { formalities } };
          break;
        // All comments are included in the initial demo response.
        case "/api/comments":
          data = { data: [] };
          break;
        default:
          throw new Error("GET demo no implementado: " + path);
      }
    } else if (config.method === "post") {
      data = { success: true, message: "Operación demo completada" };
      switch (path) {
        case "/api/login":
          if (!body.studentCode || !body.password)
            throw new Error("Ingresa usuario y contraseña.");
          data.data = { token: "adminzoom-demo-token", user };
          break;
        case "/api/logout":
          break;
        case "/api/post/create":
          posts.unshift({
            id: nextId++,
            id_company: Number(body.id_company) || 1,
            text: body.text_post,
            user,
            is_mine: true,
            image_url: body.image_post
              ? URL.createObjectURL(body.image_post)
              : "",
            likes_count: 0,
            comment: [],
          });
          break;
        case "/api/post/edit": {
          const post = requireItem(findPost(body.id_post));
          post.text = body.text_post;
          post.id_company = Number(body.id_company) || 1;
          if (body.image_post)
            post.image_url = URL.createObjectURL(body.image_post);
          break;
        }
        case "/api/post/delete":
          posts = posts.filter((post) => post.id !== Number(body.id_post));
          break;
        case "/api/comment/create":
          requireItem(findPost(body.id_post)).comment.push(
            makeComment(body.text_comment),
          );
          break;
        case "/api/comment/edit":
          requireItem(findComment(body.id_comment)).text = body.text_comment;
          break;
        case "/api/comment/delete":
          posts.forEach((post) => {
            post.comment = post.comment.filter(
              (comment) => comment.id !== Number(body.id_comment),
            );
          });
          break;
        case "/api/post_comment/create":
          requireItem(findComment(body.id_comment)).sub_comment.push(
            makeComment(body.text_sub_comment),
          );
          break;
        case "/api/post_comment/edit":
          requireItem(findReply(body.id_subcomment)).text = body.text_comment;
          break;
        case "/api/post_comment/delete":
          comments().forEach((comment) => {
            comment.sub_comment = comment.sub_comment.filter(
              (reply) => reply.id !== Number(body.id_subcomment),
            );
          });
          break;
        default:
          throw new Error("POST demo no implementado: " + path);
      }
    } else {
      throw new Error("Método demo no implementado: " + config.method);
    }
    return {
      data: clone(data),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
}
