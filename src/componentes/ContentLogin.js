import { Form, Button } from "react-bootstrap";
import logo from "../img/proLogo.jpg";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const Content = () => {
  const history = useHistory();

  //Hook para contener los datos del login
  const [usuario, setUsuario] = useState({
    correo: "",
    pass: "",
  });

  //Función para registrar cambio en los campos del formulario
  const handleChange = (event) => {
    setUsuario({ ...usuario, [event.target.name]: event.target.value });
  };

  const registro = () => {
    history.push("/usuarioRegistro");
  };

  localStorage.removeItem("user"); //retira cualquier variable de autenticación de usuario que exista

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////

  const queryValidarUsuario = (email, pass) => {
    return JSON.stringify({
      query: `
      query ValidarUsuario($correo: String!, $contrasena: String!) {
        validarUsuario(correo: $correo, contrasena: $contrasena) {
        _id
        nombre
        apellido
        identificacion
        correo
        rol
        estado  
        }
      }
    `,
      variables:
        `
        {  "correo": "` +
        email +
        `",
        "contrasena": "` +
        pass +
        `"
      }
    `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////
  const autenticar = () => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryValidarUsuario(usuario.correo, usuario.pass),
      };

      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data.data.validarUsuario) {
        localStorage.setItem("estado", data.data.validarUsuario.estado);
        localStorage.setItem("rol", data.data.validarUsuario.rol);
        localStorage.setItem("nombreUsuario", data.data.validarUsuario.nombre);
        localStorage.setItem(
          "apellidoUsuario",
          data.data.validarUsuario.apellido
        );
        localStorage.setItem("idUsuario", data.data.validarUsuario._id);

        popupExitoso("Bienvenido");
        setTimeout(function () {
          history.push("/home");
        }, 3000);
      } else {
        popupFallido("correo o contraseña incorrectos");
      }
    }
    fetchData();
  };

  //Funciones para generar popup confirmación de exito o falla de operación
  const popupExitoso = (msg) => {
    Swal.fire({
      title: "Operación Exitosa",
      text: msg,
      type: "success",
    });
  };

  const popupFallido = (msg) => {
    Swal.fire({
      title: "Operación fallida",
      text: msg,
      type: "warning",
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-center mt-5">
        <Form>
          <div className="d-flex justify-content-center mt-5 mb-0">
            <img src={logo} alt="" width="400" height="200" />
          </div>

          <h3>Autenticación Portal5</h3>

          <div className="form-group mt-3">
            <label>Correo electrónico</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su email"
              name="correo"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese contraseña"
              name="pass"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mt-5" />

          <div className="form-group mt-2">
            <Button
              type="button"
              className="btn btn-primary"
              onClick={autenticar}
            >
              Iniciar sesión
            </Button>
          </div>

          <div className="form-group mt-2">
            <Button
              type="button"
              className="btn btn-primary"
              onClick={registro}
            >
              Registro
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Content;
