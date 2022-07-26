//// DOM

//register
let reg_usuario = $(`.reg-usuario`);
let reg_contrasena = $(".reg-contrasena");
let reg_nombre = $(".reg-nombre");
let reg_apellido = $(".reg-apellido");
let reg_edad = $(".reg-edad");
let reg_sexo = $(".reg-sexo");
let reg_telefono = $(".reg-telefono");
let reg_mail = $(".reg-mail");
let reg_boton = $(".reg-boton");

//login
let log_usuario = $(".log-usuario");
let log_contrasena = $(".log-contrasena");
let log_boton = $(".log-boton");

//formulario
let form_nombre = $(".form-nombre");
let form_apellido = $(".form-apellido");
let form_edad = $(".form-edad");
let form_sexo = $(".form-sexo");
let form_telefono = $(".form-telefono");
let form_mail = $(".form-mail");
let form_fecha = $(".form-fecha");
let form_boton = $(".form-boton");

let boton_cerrar = $(".botonsesion");

let verificacion = false;

let x = (e) => {
  console.log("hide");
  $(".btn-log").hide();
  $(".btn-reg").hide();
};

// Verificar el token
let verificartoken = (e) => {
  console.log("verificartoken anda");
  if (JSON.parse(localStorage.getItem("token")) === true) {
    let usuarionombre2 = localStorage.getItem("usuarionombre");
    x();
    $(".btn-log").hide();
    $(".btn-reg").hide();
    $(".loginav").prepend(
      `<h3 class='nombreusuario' style='color: #dd4021' >${usuarionombre2}</h3>`
    );
    $(".botonsesion").show();
  } else if (JSON.parse(localStorage.getItem("token")) === false) {
    console.log("el token es falso");
    $(".botonsesion").hide();
    $(".btn-log").show();
    $(".btn-reg").show();
    $(".nombreusuario").remove();
  }
};

// Llenar datos del formulario
let llenarformulario = (e) => {
  form_nombre.val(localStorage.getItem("usuarionombre"));
  form_apellido.val(localStorage.getItem("usuarioapellido"));
  form_edad.val(localStorage.getItem("usuarioedad"));
  form_telefono.val(localStorage.getItem("usuariotelefono"));
  form_mail.val(localStorage.getItem("usuarioemail"));
};

// Funciones cuando inicia cada página
$(document).ready(function () {
  verificartoken();
  console.log("El DOM esta listo");
  llenarformulario();
});

// Botón para cerrar sesion
$(".botonsesion").click(function () {
  console.log("el boton anda");
  localStorage.setItem("usuario", "");
  localStorage.setItem("usuarionombre", "");
  localStorage.setItem("token", false);
  localStorage.setItem("usuarioapellido", "");
  localStorage.setItem("usuarioedad", "");
  localStorage.setItem("usuariotelefono", "");
  localStorage.setItem("usuarioemail", "");
  verificacion = false;
  $(".form-nombre").val("");
  form_apellido.val("");
  form_edad.val("");
  form_telefono.val("");
  form_mail.val("");
  verificartoken();
});

// Botón para iniciar sesión
let validacioncontador = 0;
$(".log-boton").click((e) => {
  $.get(
    "http://barberia-santini.herokuapp.com/findAll/Usuarios",
    (respuesta, estado) => {
      if (estado === "success") {
        console.log(respuesta.dbResult);
        for (const dato of respuesta.dbResult) {
          if (dato.usuario === log_usuario.val()) {
            verificacion = true;
            if (verificacion === true) {
              localStorage.setItem("usuario", dato.usuario);
              localStorage.setItem("usuarionombre", dato.nombre);
              localStorage.setItem("usuarioapellido", dato.apellido);
              localStorage.setItem("usuarioedad", dato.edad);
              localStorage.setItem("usuariotelefono", dato.telefono);
              localStorage.setItem("usuarioemail", dato.email);
              llenarformulario();
              alertavalidación = true;
              $.post(
                "http://barberia-santini.herokuapp.com/login/authenticate",
                {
                  usuario: log_usuario.val(),
                  contraseña: log_contrasena.val(),
                },
                (respuesta, estado) => {
                  if (estado === "success") {
                    console.log(respuesta);
                    console.log(estado);
                    localStorage.setItem("token", true);
                    verificartoken();
                  }
                }
              );
            }
          } else {
            console.log("False");
            validacioncontador++;
            console.log(validacioncontador);
          }
        }
      }
      if (validacioncontador === respuesta.dbResult.length) {
        alert("Usuario o contraseña incorrectos.");
        validacioncontador = 0;
      } else {
        validacioncontador = 0;
      }
    }
  );
});

// Botón para registrarse
$(".reg-boton").click((e) => {
  class cliente {
    constructor(usuario, contraseña, nombre, apellido, edad, telefono, email) {
      this.usuario = usuario;
      this.contraseña = contraseña;
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = parseFloat(edad);
      this.telefono = telefono;
      this.email = email;
    }
  }
  let infopost = new cliente(
    reg_usuario.val(),
    reg_contrasena.val(),
    reg_nombre.val(),
    reg_apellido.val(),
    reg_edad.val(),
    reg_telefono.val(),
    reg_mail.val()
  );
  $.post(
    "http://barberia-santini.herokuapp.com/login/signup",
    infopost,
    (respuesta, estado) => {
      if (estado === "success") {
        console.log(respuesta);
      }
    }
  );
});

// Botón para pedir turno
form_boton.click((e) => {
  class clienteturno {
    constructor(nombre, apellido, telefono, email, fecha) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.telefono = telefono;
      this.email = email;
      this.fecha = fecha;
    }
  }
  if (JSON.parse(localStorage.getItem("token")) === true) {
    $.post(
      "http://barberia-santini.herokuapp.com/turno/pedir",
      {
        usuario: localStorage.getItem("usuario"),
        fecha: form_fecha.val(),
      },
      (respuesta, estado) => {
        if (estado === "success") {
          console.log(respuesta);
          alert("El turno fue registrado.");
        }
      }
    );
  } else {
    let datosformulario = new clienteturno(
      form_nombre.val(),
      form_apellido.val(),
      form_telefono.val(),
      form_mail.val(),
      form_fecha.val()
    );
    console.log(datosformulario);
    $.post(
      "http://barberia-santini.herokuapp.com/turno/pedir",
      datosformulario,
      (respuesta, estado) => {
        if (estado === "success") {
          console.log(respuesta);
          alert("El turno fue registrado.");
        }
      }
    );
  }
});
