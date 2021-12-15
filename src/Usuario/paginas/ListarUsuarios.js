import { Container, Col, Row, Form, Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";
import Swal from "sweetalert2";
const ListarUsuarios = () => {
  //hooks para actualizar lista de usuarios, usuario seleccionado
  const [Usuarios, setUsuario] = useState([]);
  const [UsuarioConsul, setUsuarioConsul] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////

  const queryListaUsuarios = () => {
    return JSON.stringify({
      query: `
      query ListarUsuarios {
        listarUsuarios {
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
    });
  };

  const queryListaUsuariosEstudiantes = () => {
    return JSON.stringify({
      query: `
      query ListarUsuariosEstudiantes {
        listarUsuariosEstudiantes {
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

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    async function fetchData() {
      var consulta = "";
      if (localStorage.getItem("rol") === "LIDER") {
        consulta = queryListaUsuariosEstudiantes();
      } else {
        consulta = queryListaUsuarios();
      }
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
      if (data.data.listarUsuarios) {
        setUsuario(data.data.listarUsuarios);
      } else if (data.data.listarUsuariosEstudiantes) {
        setUsuario(data.data.listarUsuariosEstudiantes);
      } else {
        alert("Sin resultados");
      }
    }
    if (Usuarios.length === 0) fetchData();
  });

  const actualizarUsuario = () => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: mutacionActualizarUsuarioConsul(
          UsuarioConsul._id,
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
        setUsuario([]);
        popupExitoso("Actualización exitosa");
      }
    }
    validarCamposRequeridos();
    if (validado) {
      fetchData();
      handleCloseActualizar();
    }
  };

  //Función para validar los campos obligatorios del formulario
  var validado = false;
  const validarCamposRequeridos = () => {
    validado = true;
    if (UsuarioConsul.nombre === "") {
      popupFallido("El campo nombre de usuario es requerido");
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
    if (UsuarioConsul.estado === "") {
      popupFallido("El estado es requerido");
      validado = false;
    }
  };

  // funciones visibilidad de las pantallas modales
  const [showActualizar, setShowActualizar] = useState(false);
  const [showVisualizar, setShowVisualizar] = useState(false);
  const handleShowActualizar = (user) => {
    setUsuarioConsul(user);
    setShowActualizar(true);
  };
  const handleCloseActualizar = () => {
    setShowActualizar(false);
  };
  // const handleShowVisualizar = () => {
  //   setShowVisualizar(true);
  // };
  const handleCloseVisualizar = () => {
    setShowVisualizar(false);
  };
  const visualizarUsuario = (user) => {
    setShowVisualizar(true);
    setUsuarioConsul(user);
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
    setUsuarioConsul({
      ...UsuarioConsul,
      [event.target.name]: event.target.value,
      [event.target.apellido]: event.target.value,
      [event.target.correo]: event.target.value,
    });
  };

  //Función para pintar la alerta color del estado de activación usuario
  const colorAlertaEstado = (estado) => {
    if (estado === "AUTORIZADO") {
      return "bg-success text-white";
    } else if (estado === "NO_AUTORIZADO") {
      return "bg-danger text-white";
    } else if (estado === "PENDIENTE") {
      return "bg-warning text-white";
    }
  };

  // Return de componente a renderizar
  return (
    <div>
      <Container>
        <Row>
          <Col xs={12}>
            <div className="row justify-content-center mt-4">
              <h2>Lista de usuarios del sistema</h2>
              <Container className="mt-3">
                <Form>
                  <Form.Group className="mb-3">
                    <table
                      id="tbUsuario"
                      className="table table-striped col-5 col-s-12"
                    >
                      <thead>
                        <tr>
                          <th scope="col">No.</th>
                          <th scope="col">Nombres</th>
                          <th scope="col">Apellidos</th>
                          <th scope="col">Email</th>
                          <th scope="col">Identificación</th>
                          <th scope="col">Rol</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Usuarios.map((usuario, index) => {
                          return (
                            <tr key={index + 1}>
                              <th scope="row">{index + 1}</th>
                              <td>{usuario.nombre}</td>
                              <td>{usuario.apellido}</td>
                              <td>{usuario.correo}</td>
                              <td>{usuario.identificacion}</td>
                              <td>{usuario.rol}</td>
                              <td className={colorAlertaEstado(usuario.estado)}>
                                {usuario.estado}
                              </td>
                              <td>
                                <table className="table col-5 col-s-12">
                                  <thead></thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Button
                                          id={usuario._id}
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() => {
                                            handleShowActualizar(usuario);
                                          }}
                                        >
                                          <Image
                                            src={editar}
                                            rounded
                                            id={usuario._id}
                                          />
                                        </Button>
                                      </td>

                                      <td>
                                        <Button
                                          id={usuario._id}
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() => {
                                            visualizarUsuario(usuario);
                                          }}
                                        >
                                          <Image
                                            src={info}
                                            rounded
                                            id={usuario._id}
                                          />
                                        </Button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Form.Group>
                </Form>

                <Row>
                  <Col xs={1}></Col>
                </Row>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal
        name="ModalActualizar"
        show={showActualizar}
        onHide={handleCloseActualizar}
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              >
                <option>PENDIENTE</option>
                <option>AUTORIZADO</option>
                <option>NO_AUTORIZADO</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={actualizarUsuario}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        name="ModalVisualizar"
        show={showVisualizar}
        onHide={handleCloseVisualizar}
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualizar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre </Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.nombre || ""}
                name="nombre"
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>apellido</Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.apellido || ""}
                name="apellido"
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>correo</Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.correo || ""}
                name="correo"
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Identficación</Form.Label>
              <Form.Control
                type="number"
                value={UsuarioConsul.identificacion || ""}
                name="identificacion"
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.rol || ""}
                name="rol"
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.estado || ""}
                name="estado"
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVisualizar}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListarUsuarios;
