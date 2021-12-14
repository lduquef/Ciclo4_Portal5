import { Container, Col, Row, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import Swal from "sweetalert2";

const UsuarioRegistro = () => {
  const history = useHistory();

  //hook para contener el usuario a crear
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    correo: "",
    contrasena: "",
    rol: "",
  });

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////
  const mutacionCrearUsuario = (
    nombre,
    apellido,
    identificacion,
    correo,
    contrasena,
    rol
  ) => {
    return JSON.stringify({
      query: `
      mutation CrearUsuario($nombre: String!, $apellido: String!, $identificacion: String!, $correo: String!, $contrasena: String!, $rol: Enum_Rol!) {
        crearUsuario(nombre: $nombre, apellido: $apellido, identificacion: $identificacion, correo: $correo, contrasena: $contrasena, rol: $rol) {
          _id
          nombre
          apellido
          identificacion
          correo
          estado
          rol
        }
      }
    `,
      variables: `{  
          "nombre": "${nombre}",
          "apellido": "${apellido}",  
          "identificacion": "${identificacion}",
          "correo": "${correo}",  
          "contrasena": "${contrasena}",
          "rol": "${rol}"
        }
    `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Función registro nuevo proyecto
  const registrarUsuario = () => {
    var consulta = mutacionCrearUsuario(
      usuario.nombre,
      usuario.apellido,
      usuario.identificacion,
      usuario.correo,
      usuario.contrasena,
      usuario.rol
    );

    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: consulta,
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data.data.crearUsuario) {
        popupExitoso(
          "Registro exitoso, intente autenticarse más tarde cuando el administrador autorice su acceso"
        );
        setTimeout(function () {
          history.push("/");
        }, 5000);
      }
    }
    validarCamposRequeridos();
    if (validado) {
      fetchData();
    }
  };

  //Función para validar los campos obligatorios del formulario
  var validado = false;
  const validarCamposRequeridos = () => {
    validado = true;
    if (usuario.nombre === "") {
      popupFallido("El campo nombre de usuario es requerido");
      validado = false;
    }
    if (usuario.apellido === "") {
      popupFallido("El campo apellido es requerido");
      validado = false;
    }
    if (usuario.identificacion === "") {
      popupFallido("Es necesario indicar la identificación del usuario");
      validado = false;
    }
    if (usuario.correo === "") {
      popupFallido("El campo correo electrónico es requerido");
      validado = false;
    }
    if (usuario.rol === "") {
      popupFallido("El rol con el que se identifica el usuario es requerido");
      validado = false;
    }
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

  //Función para registrar cambio en los campos del formulario
  const handleChange = (event) => {
    setUsuario({ ...usuario, [event.target.name]: event.target.value });
  };

  // Return de componente formulario a renderizar
  return (
    <div>
      <Container className="justify-content-center">
        <Row>
          <Col xs={3} />
          <Col xs={5}>
            <div className="row justify-content-center">
              <h2>Registro de usuario</h2>
              <Container>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Nombres
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={usuario.nombre || ""}
                      placeholder="Digite su nombres"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Apellidos
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={usuario.apellido || ""}
                      name="apellido"
                      placeholder="Digite su apellidos"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      No. identificación
                    </Form.Label>
                    <Form.Control
                      type="Number"
                      value={usuario.identificacion || ""}
                      name="identificacion"
                      placeholder="Digite su número de identificación (solo numeros)"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Correo Electrónico
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={usuario.correo || ""}
                      name="correo"
                      placeholder="Digite su correo electrónico"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Constraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={usuario.constrasena}
                      name="contrasena"
                      placeholder="Digite su contraseña"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Teléfono contacto
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="telefono"
                      value={usuario.telefono || ""}
                      placeholder="Digite un número telefónico de contacto"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Rol
                    </Form.Label>
                    <Form.Select
                      size="lg"
                      name="rol"
                      value={usuario.rol || ""}
                      onChange={handleChange}
                    >
                      <option></option>
                      <option>ESTUDIANTE</option>
                      <option>LIDER</option>
                      <option>ADMINISTRADOR</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="form-group mt-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={registrarUsuario}
                    >
                      Guardar
                    </button>
                  </div>
                </Form>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UsuarioRegistro;
