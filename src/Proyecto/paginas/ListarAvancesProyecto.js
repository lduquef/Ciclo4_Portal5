import { Container, Col, Row, Form, Button, Modal } from "react-bootstrap";

import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";
import obs from "../../img/obs.svg";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ListarAvances = () => {
  const location = useLocation();
  const history = useHistory();
  const [avances, setAvances] = useState([]);
  const [avanceSel, setAvanceSel] = useState([]);
  const idProyecto = location.state.detail;

  // funciones visibilidad de las pantallas modales
  const [showActualizarA, setShowActualizarA] = useState(false);
  const [showActualizarO, setShowActualizarO] = useState(false);
  const [showVisualizar, setShowVisualizar] = useState(false);

  const handleShowActualizarA = () => {
    setShowActualizarA(true);
  };
  const handleCloseActualizarA = () => {
    setShowActualizarA(false);
  };
  const handleShowActualizarO = () => {
    setShowActualizarO(true);
  };
  const handleCloseActualizarO = () => {
    setShowActualizarO(false);
  };
  const handleShowVisualizar = () => {
    setShowVisualizar(true);
  };
  const handleCloseVisualizar = () => {
    setShowVisualizar(false);
  };

  const queryListaAvances = () => {
    return JSON.stringify({
      query: `
      query ListarAvancesProyecto($idProyecto: String!) {
        listarAvancesProyecto(idProyecto: $idProyecto) {
            _id
            proyecto {
              nombre
            }
            estudiante {
              nombre
            }
            descripcion
            observaciones
            fechaAvance
            fechaObservacion
          }
        }
            `,
      variables: `
          {
            "idProyecto": "${idProyecto}"
          }
          `,
    });
  };

  const queryConsultarAvance = (id) => {
    return JSON.stringify({
      query: `
      query ConsultarAvanceProyecto($consultarAvanceProyectoId: ID!) {
        consultarAvanceProyecto(id: $consultarAvanceProyectoId) {
          _id
        proyecto {
            nombre
          }
          estudiante {
            nombre
            apellido
          }
          descripcion
          observaciones
          fechaAvance
          fechaObservacion  
        }
      }
            `,
      variables: `
          {
            "consultarAvanceProyectoId": "${id}"
          }
          `,
    });
  };

  const mutacionActualizarAvance = (id, descripcion, fechaAvance) => {
    return JSON.stringify({
      query: `
      mutation Mutation($idAvance: String!, $descripcion: String!, $fechaAvance: Date!) {
        actualizarAvanceProyecto(_idAvance: $idAvance, descripcion: $descripcion, fechaAvance: $fechaAvance) {
          _id
          proyecto {
              nombre
          }
          estudiante {
            nombre
            apellido
          }
          descripcion
          observaciones
          fechaAvance
          fechaObservacion   
        }
      }
      `,
      variables: `
      { "idAvance": "${id}",
        "descripcion": "${descripcion}",
        "fechaAvance": "${fechaAvance}"
      }
      `,
    });
  };

  const mutacionActualizarObservacion = (
    id,
    observaciones,
    fechaObservacion
  ) => {
    return JSON.stringify({
      query: `
      mutation ActualizarObservacionProyecto($idAvance: String!, $observaciones: String!, $fechaObservacion: Date!) {
        actualizarObservacionProyecto(_idAvance: $idAvance, observaciones: $observaciones, fechaObservacion: $fechaObservacion) {
          _id
          proyecto {
              nombre
          }
          estudiante {
            nombre
            apellido
          }
          descripcion
          observaciones
          fechaAvance
          fechaObservacion 
        }
      }
      `,
      variables: `
      { "idAvance": "${id}",
        "observaciones": "${observaciones}",
        "fechaObservacion": "${fechaObservacion}"
      }
      `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Evento Hook que permite el cargue inicial de los avance en pantalla
  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryListaAvances(),
      };
      const response = await fetch("http://localhost:4000/graphql", config);

      const data = await response.json();

      if (data.data.listarAvancesProyecto) {
        setAvances(data.data.listarAvancesProyecto);
      } else {
        alert("Sin resultados");
      }
    }
    if (avances.length === 0) fetchData();
  });

  //Función para consultar el proyecto a partir de la selección del registro desde la tabla
  const avanceSeleccion = (id, operacion) => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryConsultarAvance(id),
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();

      if (data.data.consultarAvanceProyecto) {
        setAvanceSel(data.data.consultarAvanceProyecto);
        if (operacion === "ACTUALIZAR_AVANCE") {
          handleShowActualizarA();
        } else if (operacion === "ACTUALIZAR_OBSERVACION") {
          handleShowActualizarO();
        } else if (operacion === "VISUALIZAR") {
          handleShowVisualizar();
        }
      } else {
        alert("Sin resultados");
      }
    }
    fetchData();
  };

  //Función para actualizar el avance seleccionado desde la pantalla modal
  const avanceActualizar = (tipoActualizacion) => {
    var consulta = "";
    var dateParts = new Date().toLocaleDateString().split("/");
    var fechaActual = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

    if (tipoActualizacion === "AVANCE") {
      consulta = mutacionActualizarAvance(
        avanceSel._id,
        avanceSel.descripcion,
        avanceSel.fechaAvance
      );
    }
    if (tipoActualizacion === "OBSERVACION") {
      consulta = mutacionActualizarObservacion(
        avanceSel._id,
        avanceSel.observaciones,
        fechaActual
      );
    }

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

      if (
        data.data.actualizarAvanceProyecto ||
        data.data.actualizarObservacionProyecto
      ) {
        setAvances([]);
        if (tipoActualizacion === "AVANCE")
          popupExitoso("Actualización exitosa");
        if (tipoActualizacion === "OBSERVACION")
          popupExitoso("Registro observación exitoso");
      }
    }
    validarCamposRequeridos();
    if (validado) {
      fetchData();
      if (tipoActualizacion === "AVANCE") handleCloseActualizarA();
      if (tipoActualizacion === "OBSERVACION") handleCloseActualizarO();
    }
  };

  //Función para validar los campos obligatorios del formulario
  var validado = false;
  const validarCamposRequeridos = () => {
    validado = true;
    if (avanceSel.descripcion === "") {
      popupFallido("La descripción del avance es requerida");
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
    setAvanceSel({ ...avanceSel, [event.target.name]: event.target.value });
  };

  // Return de componente a renderizar
  return (
    <div>
      <Container>
        <Row>
          <Col xs={12}>
            <div className="row justify-content-center mt-4">
              <h2>Lista de avances de proyecto</h2>
              <Container className="mt-4">
                <Form>
                  <Col xs={3}>
                    <Button
                      className={
                        localStorage.getItem("rol") === "ESTUDIANTE"
                          ? "visible btn btn-primary"
                          : "invisible btn btn-primary"
                      }
                      type="button"
                      onClick={() => {
                        history.push({
                          pathname: "/CrearAvance",
                          state: { detail: idProyecto },
                        });
                      }}
                    >
                      Crear Avance
                    </Button>
                  </Col>
                  <Form.Group className="mb-3">
                    <table
                      id="tbAvancesProyecto"
                      className="table table-striped col-5 col-s-12"
                    >
                      <thead>
                        <tr>
                          <th scope="col">No.</th>
                          <th scope="col">Proyecto</th>
                          <th scope="col">Estudiante</th>
                          <th scope="col">Descripción</th>
                          <th scope="col">Observaciones</th>
                          <th scope="col">Fecha Avance</th>
                          <th scope="col">Fecha Observaciones</th>
                          <th scope="col">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {avances.map((avance, index) => {
                          return (
                            <tr key={index + 1}>
                              <th scope="row">{index + 1}</th>
                              <td>{avance.proyecto.nombre}</td>
                              <td>
                                {avance.estudiante
                                  ? avance.estudiante.nombre +
                                    " " +
                                    avance.estudiante.apellido
                                  : ""}
                              </td>
                              <td>{avance.descripcion}</td>
                              <td>{avance.observaciones}</td>
                              <td>{avance.fechaAvance}</td>
                              <td>{avance.fechaObservacion}</td>

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
                                            "ESTUDIANTE"
                                              ? "visible btn btn-primary"
                                              : "invisible btn btn-primary"
                                          }
                                          onClick={() =>
                                            avanceSeleccion(
                                              avance._id,
                                              "ACTUALIZAR_AVANCE"
                                            )
                                          }
                                        >
                                          <Image src={editar} rounded />
                                        </Button>
                                      </td>

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
                                            avanceSeleccion(
                                              avance._id,
                                              "ACTUALIZAR_OBSERVACION"
                                            )
                                          }
                                        >
                                          <Image src={obs} rounded />
                                        </Button>
                                      </td>

                                      <td>
                                        <Button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            avanceSeleccion(
                                              avance._id,
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
        show={showActualizarA}
        onHide={handleCloseActualizarA}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar avance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container fluid>
              <Row>
                <Form.Group className="mb-2">
                  <Form.Label>Descripción avance</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={avanceSel.descripcion || ""}
                    name="descripcion"
                    onChange={handleChange}
                    rows="10"
                  />
                </Form.Group>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizarA}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              avanceActualizar("AVANCE");
            }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        name="ModalActualizarObservacion"
        className="modal-dialog-scrollable"
        show={showActualizarO}
        onHide={handleCloseActualizarO}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Observación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container fluid>
              <Row>
                <Form.Group className="mb-2">
                  <Form.Label>Observación</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={avanceSel.observaciones || ""}
                    name="observaciones"
                    onChange={handleChange}
                    rows="10"
                  />
                </Form.Group>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizarO}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              avanceActualizar("OBSERVACION");
            }}
          >
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
          <Modal.Title>Visualizar avace y observaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container fluid>
              <Row>
                <Form.Group className="mb-2">
                  <Form.Label>Descripción avance</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder={avanceSel.descripcion}
                    readOnly
                    rows="10"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha Avance</Form.Label>
                  <Form.Control
                    placeholder={avanceSel.fechaAvance || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Observacion</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder={avanceSel.observaciones}
                    readOnly
                    rows="10"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha Observación</Form.Label>
                  <Form.Control
                    placeholder={avanceSel.fechaObservacion || ""}
                    readOnly
                  />
                </Form.Group>
              </Row>
            </Container>
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
export default ListarAvances;
