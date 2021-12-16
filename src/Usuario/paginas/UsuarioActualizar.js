import { useEffect, useState } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const UsuarioActualizar = () => {
  const history = useHistory();

  const [Usuario, setUsuario] = useState([]);
  const [UsuarioConsul, setUsuarioConsul] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////

  const queryUsuario = (id) => {
    return JSON.stringify({
      query: `
      query ConsultarUsuario($id: String!) {
        consultarUsuario(_id: $id) {
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
      variables: `
        {
            "id": "${id}"
        }
        `,
    });
  };
  const mutacionActualizarUsuarioConsul = (
    id,
    nombre,
    apellido,
    correo,
    identificacion,
    estado,
    rol
  ) => {
    return JSON.stringify({
      query: `
      mutation ActualizarUsuario($id: ID!, $nombre: String!, $apellido: String!, $identificacion: String!, $correo: String!, $estado: Enum_EstadoUsuario!, $rol: Enum_Rol!) {
        actualizarUsuario(_id: $id, nombre: $nombre, apellido: $apellido, identificacion: $identificacion, correo: $correo, estado: $estado, rol: $rol) {
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
      variables: `
      {
        "id": "${id}",
        "nombre": "${nombre}",
        "apellido": "${apellido}",
        "identificacion": "${identificacion}",
        "correo": "${correo}",
        "estado": "${estado}",
        "rol":"${rol}"
      }  
        `,
    });
  };
  let idUsuario = localStorage.getItem("idUsuario");

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryUsuario(idUsuario),
      };
      const response = await fetch("http://localhost:4000/graphql", config);

      const data = await response.json();
      if (data.data.consultarUsuario) {
        setUsuario(data.data.consultarUsuario);
        setUsuarioConsul(Usuario);
      } else {
        alert("Sin resultados");
      }
    }
    if (UsuarioConsul.length === 0) fetchData();
  });

  const ActualizarUsuario = () => {
    let idUsuario = localStorage.getItem("idUsuario");
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: mutacionActualizarUsuarioConsul(
          idUsuario,
          UsuarioConsul.nombre,
          UsuarioConsul.apellido,
          UsuarioConsul.correo,
          UsuarioConsul.identificacion,
          UsuarioConsul.estado,
          UsuarioConsul.rol
        ),
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data.data.actualizarUsuario) {
        popupExitoso("Actualización exitosa");
        setTimeout(function () {
          history.push("/home");
        }, 3000);
      } else {
        alert("Sin resultados");
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
    if (UsuarioConsul.nombre === "") {
      popupFallido("El campo nombre de UsuarioConsul es requerido");
      validado = false;
    }
    if (UsuarioConsul.apellido === "") {
      popupFallido("El campo apellido es requerido");
      validado = false;
    }
    if (UsuarioConsul.identificacion === "") {
      popupFallido("Es necesario indicar la identificación del usuario");
      validado = false;
    }
    if (UsuarioConsul.correo === "") {
      popupFallido("El campo correo electrónico es requerido");
      validado = false;
    }
    if (UsuarioConsul.rol === "") {
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
    // setUsuarioConsul({
    //   ...UsuarioConsul,
    //   [event.target.nombre]: event.target.value,
    //   [event.target.apellido]: event.target.value,
    //   [event.target.correo]: event.target.value,
    // });

    setUsuarioConsul({
      ...UsuarioConsul,
      [event.target.name]: event.target.value,
    });
  };

  // const habilitarCampo= () =>{
  //   const rol = localStorage.getItem("rol");
  //   if (rol === "LIDER") {
  //     return("true" )

  //   }else {
  //     return "false"
  //   }
  // }
  // Return de componente formulario a renderizar
  return (
    <div>
      <Container className="justify-content-center">
        <Row>
          <Col xs={3} />
          <Col xs={5}>
            <div className="row justify-content-center">
              <h2>Perfil del usuario</h2>
              <Container>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Nombre </Form.Label>
                    <Form.Control
                      type="text"
                      value={UsuarioConsul.nombre || ""}
                      name="nombre"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>apelido</Form.Label>
                    <Form.Control
                      type="text"
                      value={UsuarioConsul.apellido || ""}
                      name="apellido"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>correo</Form.Label>
                    <Form.Control
                      type="text"
                      value={UsuarioConsul.correo || ""}
                      name="correo"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Identficación</Form.Label>
                    <Form.Control
                      type="number"
                      value={UsuarioConsul.identificacion || ""}
                      name="identificacion"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                      size="lg"
                      name="rol"
                      value={UsuarioConsul.rol || ""}
                      onChange={handleChange}
                      disabled
                    >
                      <option>LIDER</option>
                      <option>ADMINISTRADOR</option>
                      <option>ESTUDIANTE</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      size="lg"
                      name="estado"
                      value={UsuarioConsul.estado || ""}
                      onChange={handleChange}
                      disabled
                    >
                      <option>PENDIENTE</option>
                      <option>AUTORIZADO</option>
                      <option>NO_AUTORIZADO</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="form-group mt-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={ActualizarUsuario}
                    >
                      Actualizar Cambios
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

export default UsuarioActualizar;
