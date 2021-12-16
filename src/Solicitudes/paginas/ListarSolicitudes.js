import {
  Container,
  Col,
  Row,
  Form,
  Button,
  Modal,
  FormControl,
} from "react-bootstrap";

import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const ListarSolicitudes = () => {
  const history = useHistory();

  //hooks para actualizar lista de solicitudes, proyecto seleccionado
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSel, setSolicitudSel] = useState({
    estado: "",
    fechaIngreso: "",
    fechaEgreso: "",
    proyecto: { nombre: "" },
    estudiante: { nombre: "", apellido: "" },
  });

  //hook para contener la lista de proyectos disponibles
  const [proyectos, setProyectos] = useState([]);

  // funciones visibilidad de las pantallas modales
  const [showActualizar, setShowActualizar] = useState(false);
  const [showVisualizar, setShowVisualizar] = useState(false);

  const handleShowActualizar = () => {
    setShowActualizar(true);
  };
  const handleCloseActualizar = () => {
    setShowActualizar(false);
  };
  const handleShowVisualizar = () => {
    setShowVisualizar(true);
  };
  const handleCloseVisualizar = () => {
    setShowVisualizar(false);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////

  const queryListaProyectos = () => {
    return JSON.stringify({
      query: `
      query listarProyectos {
        listarProyectos {
          _id
          nombre
          presupuesto
          fechaInicio
          fechaFin
          estado
          fase
          objetivosGenerales
          objetivosEspecificos
          apruebaCreacion
          lider {
            nombre
            apellido
          }
        }
      }
    `,
    });
  };

  const queryListaSolicitudes = () => {
    return JSON.stringify({
      query: `
      query ConsultarSolicitudes {
        consultarSolicitudes {
          _id
          estado
          fechaIngreso
          fechaEgreso
          proyecto {
            nombre
          }
          estudiante {
            nombre
            apellido
            rol
          }
        }
      }
    `,
    });
  };

  const querySolicitudSel = (id) => {
    return JSON.stringify({
      query: `
      query ConsultarSolicitud($consultarSolicitudId: ID!) {
        consultarSolicitud(id: $consultarSolicitudId) {
          _id
          estado
          fechaIngreso
          fechaEgreso
          proyecto {
            nombre
          }
          estudiante {
            nombre
            apellido
          }
        }
      }
      `,
      variables: `
        {
          "consultarSolicitudId": "${id}"
        }
        `,
    });
  };

  const mutacionActualizarSolicitud = (id, estado) => {
    return JSON.stringify({
      query: `
      mutation ActualizarEstadoSolicitud($id: String!, $estado: String!) {
        actualizarEstadoSolicitud(_id: $id, estado: $estado) {
          _id
          estado
          fechaIngreso
          fechaEgreso
          proyecto {
            nombre
          }
          estudiante {
            nombre
            apellido
          }
        }
      }
      `,
      variables: `
      {
        "id": "${id}",
        "estado": "${estado}"
      }
      `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Evento Hook que permite el cargue inicial de las solicitudes en pantalla
  useEffect(() => {
    async function fetchData() {
      var consulta = queryListaSolicitudes();

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
      if (data.data.consultarSolicitudes) {
        setSolicitudes(data.data.consultarSolicitudes);
      } else {
        alert("Sin resultados");
      }
    }
    if (solicitudes.length === 0) fetchData();
    if (proyectos.length === 0) listarProyectosActivos();
  });

  //Función para listar proyectos activos
  const listarProyectosActivos = () => {
    var consulta = queryListaProyectos();
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
      if (data.data.listarProyectos) {
        setProyectos(data.data.listarProyectos);
      } else {
        popupFallido("Sin resultados consulta proyectos");
      }
    }
    fetchData();
  };

  //Función para consultar la solicitud a partir de la selección del registro desde la tabla
  const solicitudSeleccion = (id, operacion) => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: querySolicitudSel(id),
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data.data.consultarSolicitud) {
        setSolicitudSel(data.data.consultarSolicitud);
        if (operacion === "ACTUALIZAR") handleShowActualizar();
        if (operacion === "VISUALIZAR") handleShowVisualizar();
      } else {
        alert("Sin resultados");
      }
    }
    fetchData();
  };

  //Función para actualizar la solicitud seleccionada desde la pantalla modal
  const solicitudActualizar = () => {
    var consulta = "";
    // var dateParts = new Date().toLocaleDateString().split("/");
    // var fechaActual = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

    consulta = mutacionActualizarSolicitud(
      solicitudSel._id,
      solicitudSel.estado
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
      if (data.data.actualizarEstadoSolicitud) {
        setSolicitudes([]);
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
    if (solicitudSel.estado === "") {
      popupFallido("El campo estado es requerido");
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
    setSolicitudSel({
      ...solicitudSel,
      [event.target.name]: event.target.value,
    });
  };
  //Función para registrar cambio en la lista de proyectos del formulario
  const handleChangeProyecto = (event) => {
    const index = event.target.selectedIndex;
    const optionElement = event.target.childNodes[index];
    const optionElementId = optionElement.getAttribute("id");
    setSolicitudSel({ ...solicitudSel, proyecto: optionElementId });
  };

  //Función para pintar la alerta color del estado de activación usuario
  const colorAlertaEstado = (estado) => {
    if (estado === "ACEPTADA") {
      return "bg-success text-white";
    } else if (estado === "RECHAZADA") {
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
              <h2>Lista de solicitudes</h2>

              <Container className="mt-4">
                <Form>
                  <Col xs={2}>
                    <Button
                      className={
                        localStorage.getItem("rol") === "ESTUDIANTE"
                          ? "visible btn btn-primary"
                          : "invisible btn btn-primary"
                      }
                      type="button"
                      onClick={() => {
                        history.push("/solicitudRegistro");
                      }}
                    >
                      Crear Solicitud
                    </Button>
                  </Col>
                  <Form.Group className="mb-3">
                    <table
                      id="tbProyecto"
                      className="table table-striped col-5 col-s-12"
                    >
                      <thead>
                        <tr>
                          <th scope="col">No.</th>
                          <th scope="col">Estudiante</th>
                          <th scope="col">Nombre Proyecto</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Fecha ingreso</th>
                          <th scope="col">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solicitudes.map((solicitud, index) => {
                          return (
                            <tr key={index + 1}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                {solicitud.estudiante
                                  ? solicitud.estudiante.nombre +
                                    " " +
                                    solicitud.estudiante.apellido
                                  : ""}
                              </td>
                              <td>{solicitud.proyecto.nombre}</td>
                              <td
                                className={colorAlertaEstado(solicitud.estado)}
                              >
                                {solicitud.estado}
                              </td>
                              <td>{solicitud.fechaIngreso}</td>
                              <td>
                                <table className="table col-5 col-s-12">
                                  <thead></thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Button
                                          type="button"
                                          className={
                                            localStorage.getItem("rol") ===
                                            "LIDER"
                                              ? "visible btn btn-primary"
                                              : "invisible btn btn-primary"
                                          }
                                          onClick={() =>
                                            solicitudSeleccion(
                                              solicitud._id,
                                              "ACTUALIZAR"
                                            )
                                          }
                                        >
                                          <Image src={editar} rounded />
                                        </Button>
                                      </td>

                                      <td>
                                        <Button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            solicitudSeleccion(
                                              solicitud._id,
                                              "VISUALIZAR"
                                            )
                                          }
                                        >
                                          <Image src={info} rounded />
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
        className="modal-dialog-scrollable"
        show={showActualizar}
        onHide={handleCloseActualizar}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid className="mt-3">
            <Form>
              <Form.Group className="mb-2">
                <Form.Label className="d-flex justify-content-start">
                  Proyecto
                </Form.Label>
                <Form.Select
                  value={solicitudSel.proyecto.nombre}
                  size="lg"
                  name="proyecto"
                  onChange={handleChangeProyecto}
                  disabled
                >
                  <option></option>
                  {proyectos.map((proy, index) => {
                    return (
                      <option key={index} id={proy._id}>
                        {proy.nombre}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="d-flex justify-content-start">
                  Estudiante
                </Form.Label>
                <FormControl
                  type="text"
                  value={
                    solicitudSel.estudiante.nombre +
                    " " +
                    solicitudSel.estudiante.apellido
                  }
                  placeholder={
                    solicitudSel.estudiante.nombre +
                      " " +
                      solicitudSel.estudiante.apellido || ""
                  }
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="d-flex justify-content-start">
                  Estado
                </Form.Label>
                <Form.Select
                  size="lg"
                  name="estado"
                  value={solicitudSel.estado || ""}
                  onChange={handleChange}
                >
                  <option>PENDIENTE</option>
                  <option>RECHAZADA</option>
                  <option>ACEPTADA</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={solicitudActualizar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        name="ModalVisualizar"
        show={showVisualizar}
        onHide={handleCloseVisualizar}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualizar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label className="d-flex justify-content-start">
                Proyecto
              </Form.Label>
              <FormControl
                type="text"
                placeholder={solicitudSel.proyecto.nombre}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="d-flex justify-content-start">
                Estudiante
              </Form.Label>
              <FormControl
                type="text"
                placeholder={
                  solicitudSel.estudiante.nombre +
                    " " +
                    solicitudSel.estudiante.apellido || ""
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="d-flex justify-content-start">
                Estado
              </Form.Label>
              <FormControl
                type="text"
                placeholder={solicitudSel.estado}
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

export default ListarSolicitudes;

//test...