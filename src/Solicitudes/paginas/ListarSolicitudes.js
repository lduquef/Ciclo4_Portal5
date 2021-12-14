import {
  Container,
  Col,
  Row,
  Form,
  Button,
  //Modal,
  //FormControl,
} from "react-bootstrap";

import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";
//import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const ListarSolicitudes = () => {
  const history = useHistory();
  //hooks para actualizar lista de solicitudes, proyecto seleccionado
  const [solicitudes, setSolicitudes] = useState([]);
  //const [solicitudSel, setSolicitudSel] = useState([]);

  // // funciones visibilidad de las pantallas modales
  // const [showActualizar, setShowActualizar] = useState(false);
  // const [showVisualizar, setShowVisualizar] = useState(false);

  // const handleShowActualizar = () => {
  //   setShowActualizar(true);
  // };
  // const handleCloseActualizar = () => {
  //   setShowActualizar(false);
  // };
  // const handleShowVisualizar = () => {
  //   setShowVisualizar(true);
  // };
  // const handleCloseVisualizar = () => {
  //   setShowVisualizar(false);
  // };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////
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

  // const queryconsultaProyectosLider = (idLider) => {
  //   return JSON.stringify({
  //     query: `
  //     query ConsultarProyectosLider($idLider: ID!) {
  //     consultarProyectosLider(idLider: $idLider) {
  //         _id
  //         nombre
  //         presupuesto
  //         fechaInicio
  //         fechaFin
  //         estado
  //         fase
  //         lider {
  //           nombre
  //           apellido
  //         }
  //         objetivosGenerales
  //         objetivosEspecificos
  //         apruebaCreacion
  //       }
  //     }
  //     `,
  //     variables:
  //       `
  //     {
  //       "idLider": "` +
  //       idLider +
  //       `"
  //     }
  //     `,
  //   });
  // };

  // const queryProyectoSel = (id) => {
  //   return JSON.stringify({
  //     query: `
  //   query ConsultarProyecto($consultarProyectoId: ID!) {
  //     consultarProyecto(id: $consultarProyectoId) {
  //       _id
  //       nombre
  //       presupuesto
  //       fechaInicio
  //       fechaFin
  //       estado
  //       fase
  //       lider {
  //         nombre
  //         apellido
  //       }
  //       objetivosGenerales
  //       objetivosEspecificos
  //       apruebaCreacion
  //     }
  //   }
  //   `,
  //     variables:
  //       `
  //   {
  //     "consultarProyectoId": "` +
  //       id +
  //       `"
  //   }
  //   `,
  //   });
  // };

  // const mutacionAutorizaProyectoSel = (id) => {
  //   return JSON.stringify({
  //     query: `
  //     mutation AutorizaCreacionProyecto($autorizaCreacionProyectoId: ID!) {
  //       autorizaCreacionProyecto(id: $autorizaCreacionProyectoId) {
  //         _id
  //         nombre
  //         presupuesto
  //         fechaInicio
  //         fechaFin
  //         estado
  //         fase
  //         lider {
  //           nombre
  //           apellido
  //         }
  //         objetivosGenerales
  //         objetivosEspecificos
  //         apruebaCreacion
  //       }
  //     }
  //     `,
  //     variables:
  //       `{
  //       "autorizaCreacionProyectoId": "` +
  //       id +
  //       `"
  //       }
  //     `,
  //   });
  // };

  // const mutacionActualizarProyectoSel = (
  //   id,
  //   nombre,
  //   objGen,
  //   objEsp,
  //   presupuesto
  // ) => {
  //   return JSON.stringify({
  //     query: `
  //     mutation ActualizarProyecto($input: ActualizaProyectoInput!) {
  //       actualizarProyecto(input: $input) {
  //         _id
  //         nombre
  //         presupuesto
  //         fechaInicio
  //         fechaFin
  //         estado
  //         fase
  //         lider {
  //           nombre
  //           apellido
  //         }
  //         objetivosGenerales
  //         objetivosEspecificos
  //         apruebaCreacion
  //       }
  //     }
  //   `,
  //     variables:
  //       `
  //       {
  //         "input": {
  //           "_id": "` +
  //       id +
  //       `",
  //           "nombre": "` +
  //       nombre +
  //       `",
  //           "objetivosGenerales": "` +
  //       objGen +
  //       `",
  //           "objetivosEspecificos": "` +
  //       objEsp +
  //       `",
  //           "presupuesto": ` +
  //       presupuesto +
  //       `
  //         }
  //       }
  //   `,
  //   });
  // };

  // const mutacionActualizarEstadoProyectoSel = (id, estado, fechaInicio) => {
  //   return JSON.stringify({
  //     query: `
  //     mutation ActualizarEstadoProyecto($input: ActualizaEstadoProyectoInput!) {
  //     actualizarEstadoProyecto(input: $input) {
  //         _id
  //         nombre
  //         presupuesto
  //         fechaInicio
  //         fechaFin
  //         estado
  //         fase
  //         lider {
  //           nombre
  //           apellido
  //         }
  //         objetivosGenerales
  //         objetivosEspecificos
  //         apruebaCreacion
  //       }
  //     }
  //   `,
  //     variables:
  //       `
  //       {
  //         "input": {
  //           "_id": "` +
  //       id +
  //       `",
  //           "estado": "` +
  //       estado +
  //       `",
  //           "fechaInicio": "` +
  //       fechaInicio +
  //       `"
  //         }
  //       }
  //   `,
  //   });
  // };

  // const mutacionActualizarFaseProyectoSel = (id, fase) => {
  //   return JSON.stringify({
  //     query: `
  //     mutation ActualizarFaseProyecto($input: ActualizaFaseProyectoInput!) {
  //     actualizarFaseProyecto(input: $input) {
  //         _id
  //         nombre
  //         presupuesto
  //         fechaInicio
  //         fechaFin
  //         estado
  //         fase
  //         lider {
  //           nombre
  //           apellido
  //         }
  //         objetivosGenerales
  //         objetivosEspecificos
  //         apruebaCreacion
  //       }
  //     }
  //   `,
  //     variables:
  //       `
  //       {
  //         "input": {
  //           "_id": "` +
  //       id +
  //       `",
  //           "fase": "` +
  //       fase +
  //       `"
  //         }
  //       }
  //   `,
  //   });
  // };
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
  });

  // //Función para consultar el proyecto a partir de la selección del registro desde la tabla
  // const solicitudSeleccion = (id, operacion) => {
  //   async function fetchData() {
  //     const config = {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: queryProyectoSel(id),
  //     };
  //     const response = await fetch("http://localhost:4000/graphql", config);
  //     const data = await response.json();
  //     if (data.data.consultarProyecto) {
  //       setSolicitudSel(data.data.consultarProyecto);
  //     } else {
  //       alert("Sin resultados");
  //     }
  //   }
  //   fetchData();
  //   if (operacion === "ACTUALIZAR") handleShowActualizar();
  //   if (operacion === "VISUALIZAR") handleShowVisualizar();
  // };

  // //Función para actualizar el proyecto seleccionado desde la pantalla modal
  // const proyectoActualizar = (tipoActualizacion) => {
  //   var consulta = "";
  //   if (tipoActualizacion === "APROBACION") {
  //     consulta = mutacionAutorizaProyectoSel(solicitudSel._id);
  //   }
  //   if (tipoActualizacion === "ACTUALIZACION") {
  //     consulta = mutacionActualizarProyectoSel(
  //       solicitudSel._id,
  //       solicitudSel.nombre,
  //       solicitudSel.objetivosGenerales,
  //       solicitudSel.objetivosEspecificos,
  //       solicitudSel.presupuesto
  //     );
  //   }
  //   if (tipoActualizacion === "ESTADO") {
  //     consulta = mutacionActualizarEstadoProyectoSel(
  //       solicitudSel._id,
  //       solicitudSel.estado,
  //       new Date().toLocaleDateString()
  //     );
  //   }

  //   if (tipoActualizacion === "FASE") {
  //     consulta = mutacionActualizarFaseProyectoSel(
  //       solicitudSel._id,
  //       solicitudSel.fase
  //     );
  //   }

  //   async function fetchData() {
  //     const config = {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: consulta,
  //     };
  //     const response = await fetch("http://localhost:4000/graphql", config);
  //     const data = await response.json();
  //     if (
  //       data.data.autorizaCreacionProyecto ||
  //       data.data.actualizarProyecto ||
  //       data.data.actualizarEstadoProyecto ||
  //       data.data.actualizarFaseProyecto
  //     ) {
  //       setSolicitudes([]);
  //       popupExitoso("Actualización exitosa");
  //     }
  //   }
  //   validarCamposRequeridos();
  //   if (validado) {
  //     fetchData();
  //     handleCloseActualizar();
  //   }
  // };
  //
  // //Función para validar los campos obligatorios del formulario
  // var validado = false;
  // const validarCamposRequeridos = () => {
  //   validado = true;
  //   if (solicitudSel.nombre === "") {
  //     popupFallido("El nombre de proyecto es requerido");
  //     validado = false;
  //   }
  //   if (solicitudSel.presupuesto === "") {
  //     popupFallido("El valor de presupuesto es requerido");
  //     validado = false;
  //   }
  // };

  // //Funciones para generar popup confirmación de exito o falla de operación
  // const popupExitoso = (msg) => {
  //   Swal.fire({
  //     title: "Operación Exitosa",
  //     text: msg,
  //     type: "success",
  //   });
  // };

  // const popupFallido = (msg) => {
  //   Swal.fire({
  //     title: "Operación fallida",
  //     text: msg,
  //     type: "warning",
  //   });
  // };

  // //Función para registrar cambio en los campos del formulario
  // const handleChange = (event) => {
  //   setSolicitudSel({
  //     ...solicitudSel,
  //     [event.target.name]: event.target.value,
  //   });
  // };

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
                          <th scope="col">Fecha egreso</th>
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
                              <td>{solicitud.estado}</td>
                              <td>{solicitud.fechaIngreso}</td>
                              <td>{solicitud.fechaEgreso}</td>
                              <td>
                                <table className="table col-5 col-s-12">
                                  <thead></thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={null}
                                        >
                                          <Image
                                            src={editar}
                                            rounded
                                            id={solicitud._id}
                                          />
                                        </Button>
                                      </td>

                                      <td>
                                        <Button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={null}
                                        >
                                          <Image
                                            src={info}
                                            rounded
                                            id={solicitud._id}
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

      {/* <Modal
        name="ModalActualizar"
        className="modal-dialog-scrollable"
        show={showActualizar}
        onHide={handleCloseActualizar}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container fluid>
              <Modal.Title>Aprobacion proyecto</Modal.Title>
              <Row>
                <Form.Group className="mb-2">
                  <div className="row">
                    <Form.Label className="col-md-3">
                      Aprobación creación
                    </Form.Label>
                    <Form.Check
                      className="col-md-9 ms-auto"
                      aria-label="option 1"
                      name="apruebaCreacion"
                      value={solicitudSel.apruebaCreacion}
                      onChange={handleChangeAprueba}
                      defaultChecked={solicitudSel.apruebaCreacion}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      proyectoActualizar("APROBACION");
                    }}
                    disabled={solicitudSel.apruebaCreacion ? true : false}
                  >
                    Aprobar
                  </Button>
                </Form.Group>
              </Row>
            </Container>

            <Container fluid className="mt-5">
              <Modal.Title>Formulación proyecto</Modal.Title>
              <Row>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre proyecto</Form.Label>
                  <Form.Control
                    type="text"
                    value={solicitudSel.nombre || ""}
                    name="nombre"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Nombre lider</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      solicitudSel.lider
                        ? solicitudSel.lider.nombre +
                          " " +
                          solicitudSel.lider.apellido
                        : ""
                    }
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="text"
                    value={solicitudSel.fechaInicio || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Presupesto (pesos $ COP)</Form.Label>
                  <Form.Control
                    type="Number"
                    value={solicitudSel.presupuesto || 0}
                    name="presupuesto"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Objetivos generales</Form.Label>
                  <FormControl
                    as="textarea"
                    value={solicitudSel.objetivosGenerales || ""}
                    name="objetivosGenerales"
                    onChange={handleChange}
                    rows="5"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Objetivos específicos</Form.Label>
                  <FormControl
                    as="textarea"
                    value={solicitudSel.objetivosEspecificos || ""}
                    name="objetivosEspecificos"
                    onChange={handleChange}
                    rows="5"
                  />
                </Form.Group>
              </Row>
              <Button
                variant="primary"
                onClick={() => {
                  proyectoActualizar("ACTUALIZACION");
                }}
                disabled={solicitudSel.apruebaCreacion ? false : true}
              >
                Guardar
              </Button>
            </Container>

            <Container fluid className="mt-5">
              <Modal.Title>Actualizar estado</Modal.Title>
              <Row>
                <Form.Group className="mb-2">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    size="lg"
                    name="estado"
                    value={solicitudSel.estado || ""}
                    onChange={handleChange}
                  >
                    <option>ACTIVO</option>
                    <option>INACTIVO</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Button
                variant="primary"
                onClick={() => {
                  proyectoActualizar("ESTADO");
                }}
                disabled={solicitudSel.apruebaCreacion ? false : true}
              >
                Guardar
              </Button>
            </Container>

            <Container fluid className="mt-5">
              <Modal.Title>Actualizar fase</Modal.Title>
              <Row>
                <Form.Group className="mb-2">
                  <Form.Label>Fase</Form.Label>
                  <Form.Select
                    size="lg"
                    name="fase"
                    value={solicitudSel.fase || ""}
                    onChange={handleChange}
                  >
                    <option>INICIADO</option>
                    <option>EN_DESARROLLO</option>
                    <option>TERMINADO</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Button
                variant="primary"
                onClick={() => {
                  proyectoActualizar("FASE");
                }}
                disabled={solicitudSel.apruebaCreacion ? false : true}
              >
                Guardar
              </Button>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizar}>
            Cancelar
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
              <Form.Label>Nombre proyecto</Form.Label>
              <Form.Control placeholder={solicitudSel.nombre || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Nombre lider</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  solicitudSel.lider
                    ? solicitudSel.lider.nombre +
                      " " +
                      solicitudSel.lider.apellido
                    : ""
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Control placeholder={solicitudSel.estado || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fase</Form.Label>
              <Form.Control placeholder={solicitudSel.fase || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                placeholder={solicitudSel.fechaInicio || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Presupesto (pesos $ COP)</Form.Label>
              <Form.Control
                placeholder={solicitudSel.presupuesto || 0}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Objetivos generales</Form.Label>
              <FormControl
                as="textarea"
                placeholder={solicitudSel.objetivosGenerales || ""}
                rows="5"
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Objetivos específicos</Form.Label>
              <FormControl
                as="textarea"
                placeholder={solicitudSel.objetivosEspecificos || ""}
                rows="5"
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <div className="row">
                <Form.Label className="col-md-3">Aprueba creación</Form.Label>
                <Form.Check
                  className="col-md-9 ms-auto"
                  aria-label="option 1"
                  name="apruebaCreacion"
                  value={solicitudSel.apruebaCreacion}
                  defaultChecked={solicitudSel.apruebaCreacion}
                  disabled
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVisualizar}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default ListarSolicitudes;
