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
import detalle from "../../img/aprobar.svg";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const ListarProyectos = () => {
  const history = useHistory();
  //hooks para actualizar lista de proyectos, proyecto seleccionado
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSel, setProyectoSel] = useState([]);

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

  const queryconsultaProyectosLider = (idLider) => {
    return JSON.stringify({
      query: `
      query ConsultarProyectosLider($idLider: ID!) {
      consultarProyectosLider(idLider: $idLider) {
          _id
          nombre
          presupuesto
          fechaInicio
          fechaFin
          estado
          fase
          lider {
            nombre
            apellido
          }
          objetivosGenerales
          objetivosEspecificos
          apruebaCreacion  
        }
      }
      `,
      variables: `
      {
        "idLider": "${idLider}"
      }
      `,
    });
  };

  const queryProyectoSel = (id) => {
    return JSON.stringify({
      query: `
    query ConsultarProyecto($consultarProyectoId: ID!) {
      consultarProyecto(id: $consultarProyectoId) {
        _id
        nombre
        presupuesto
        fechaInicio
        fechaFin
        estado
        fase
        lider {
          nombre
          apellido
        }
        objetivosGenerales
        objetivosEspecificos
        apruebaCreacion
      }
    }
    `,
      variables: `
    {
      "consultarProyectoId": "${id}"
    }
    `,
    });
  };

  const mutacionAutorizaProyectoSel = (id) => {
    return JSON.stringify({
      query: `
      mutation AutorizaCreacionProyecto($autorizaCreacionProyectoId: ID!) {
        autorizaCreacionProyecto(id: $autorizaCreacionProyectoId) {
          _id
          nombre
          presupuesto
          fechaInicio
          fechaFin
          estado
          fase
          lider {
            nombre
            apellido
          }
          objetivosGenerales
          objetivosEspecificos
          apruebaCreacion  
        }
      }
      `,
      variables: `{
        "autorizaCreacionProyectoId": "${id}"
        }
      `,
    });
  };

  const mutacionActualizarProyectoSel = (
    id,
    nombre,
    objGen,
    objEsp,
    presupuesto
  ) => {
    return JSON.stringify({
      query: `
      mutation ActualizarProyecto($input: ActualizaProyectoInput!) {
        actualizarProyecto(input: $input) {
          _id
          nombre
          presupuesto
          fechaInicio
          fechaFin
          estado
          fase
          lider {
            nombre
            apellido
          }
          objetivosGenerales
          objetivosEspecificos
          apruebaCreacion
        }
      }
    `,
      variables: `
        {
          "input": {
            "_id": "${id}",
            "nombre": "${nombre}",
            "objetivosGenerales": "${objGen}",
            "objetivosEspecificos": "${objEsp}",
            "presupuesto": ${presupuesto}
          }
        }
    `,
    });
  };

  const mutacionActualizarEstadoProyectoSel = (id, estado, fechaInicio) => {
    return JSON.stringify({
      query: `
      mutation ActualizarEstadoProyecto($input: ActualizaEstadoProyectoInput!) {
      actualizarEstadoProyecto(input: $input) {
          _id
          nombre
          presupuesto
          fechaInicio
          fechaFin
          estado
          fase
          lider {
            nombre
            apellido
          }
          objetivosGenerales
          objetivosEspecificos
          apruebaCreacion
        }
      }
    `,
      variables: `
        {
          "input": {
            "_id": "${id}",
            "estado": "${estado}",
            "fechaInicio": "${fechaInicio}"
          }
        }
    `,
    });
  };

  const mutacionActualizarFaseProyectoSel = (id, fase, fechaFin) => {
    return JSON.stringify({
      query: `
      mutation ActualizarFaseProyecto($input: ActualizaFaseProyectoInput!) {
      actualizarFaseProyecto(input: $input) {
          _id
          nombre
          presupuesto
          fechaInicio
          fechaFin
          estado
          fase
          lider {
            nombre
            apellido
          }
          objetivosGenerales
          objetivosEspecificos
          apruebaCreacion
        }
      }
    `,
      variables: `
        {
          "input": {
            "_id": "${id}",
            "fase": "${fase}",
            "fechaFin": "${fechaFin}"
          }
        }
    `,
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Evento Hook que permite el cargue inicial de los proyectos en pantalla
  useEffect(() => {
    async function fetchData() {
      var consulta = "";
      if (localStorage.getItem("rol") === "LIDER") {
        consulta = queryconsultaProyectosLider(
          localStorage.getItem("idUsuario")
        );
      } else {
        consulta = queryListaProyectos();
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
      if (data.data.listarProyectos) {
        setProyectos(data.data.listarProyectos);
      } else if (data.data.consultarProyectosLider) {
        setProyectos(data.data.consultarProyectosLider);
      } else {
        alert("Sin resultados");
      }
    }
    if (proyectos.length === 0) fetchData();
  });

  //Función para consultar el proyecto a partir de la selección del registro desde la tabla
  const proyectoSeleccion = (id, operacion) => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryProyectoSel(id),
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data.data.consultarProyecto) {
        setProyectoSel(data.data.consultarProyecto);
        if (operacion === "ACTUALIZAR") handleShowActualizar();
        if (operacion === "VISUALIZAR") handleShowVisualizar();
        if (operacion === "AVANCES")
          verAvances(data.data.consultarProyecto._id);
      } else {
        alert("Sin resultados");
      }
    }
    fetchData();
  };

  //Función para actualizar el proyecto seleccionado desde la pantalla modal
  const proyectoActualizar = (tipoActualizacion) => {
    var dateParts = new Date().toLocaleDateString().split("/");
    var fechaActual = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
    var consulta = "";
    if (tipoActualizacion === "APROBACION") {
      consulta = mutacionAutorizaProyectoSel(proyectoSel._id);
    }
    if (tipoActualizacion === "ACTUALIZACION") {
      consulta = mutacionActualizarProyectoSel(
        proyectoSel._id,
        proyectoSel.nombre,
        proyectoSel.objetivosGenerales,
        proyectoSel.objetivosEspecificos,
        proyectoSel.presupuesto
      );
    }
    if (tipoActualizacion === "ESTADO") {
      if (!proyectoSel.fechaInicio && proyectoSel.estado === "ACTIVO") {
        consulta = mutacionActualizarEstadoProyectoSel(
          proyectoSel._id,
          proyectoSel.estado,
          fechaActual
        );
      } else {
        consulta = mutacionActualizarEstadoProyectoSel(
          proyectoSel._id,
          proyectoSel.estado,
          proyectoSel.fechaInicio
        );
      }
    }

    if (tipoActualizacion === "FASE") {

      if (proyectoSel.fase === "TERMINADO") {
        consulta = mutacionActualizarFaseProyectoSel(
          proyectoSel._id,
          proyectoSel.fase,
          fechaActual
        );
      } else {
        consulta = mutacionActualizarFaseProyectoSel(
          proyectoSel._id,
          proyectoSel.fase,
          fechaActual
        );
      }
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
        data.data.autorizaCreacionProyecto ||
        data.data.actualizarProyecto ||
        data.data.actualizarEstadoProyecto ||
        data.data.actualizarFaseProyecto
      ) {
        setProyectos([]);
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
    if (proyectoSel.nombre === "") {
      popupFallido("El nombre de proyecto es requerido");
      validado = false;
    }
    if (proyectoSel.presupuesto === "") {
      popupFallido("El valor de presupuesto es requerido");
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

  //Contantes para establecer el formato de dinero pesos COP
  const options2 = { style: "currency", currency: "COP" };
  const moneyFormat = new Intl.NumberFormat("es-CO", options2);

  //Función para registrar cambio en los campos del formulario
  const handleChange = (event) => {
    setProyectoSel({ ...proyectoSel, [event.target.name]: event.target.value });
  };

  //Función para registrar cambio en los campos del formulario
  const handleChangeAprueba = () => {
    if (!proyectoSel.apruebaCreacion) {
      proyectoSel.apruebaCreacion = true;
    } else {
      proyectoSel.apruebaCreacion = false;
    }
  };

  //Función para ver avances y observaciones proyecto
  const verAvances = (idProyecto) => {
    history.push({
      pathname: "/ListarAvancesProyecto",
      state: { detail: idProyecto },
    });
  };

  //Función para pintar la alerta color del estado de proyecto
  const colorAlertaEstado = (estado) => {
    if (estado === "ACTIVO") {
      return "bg-success text-white";
    } else if (estado === "INACTIVO") {
      return "bg-danger text-white";
    }
  };

  // Return de componente a renderizar
  return (
    <div>
      <Container>
        <Row>
          <Col xs={12}>
            <div className="row justify-content-center mt-4">
              <h2>Lista de proyectos registrados</h2>

              <Container className="mt-4">
                <Form>
                  <Col xs={5}>
                    <Button
                      className={
                        localStorage.getItem("rol") === "LIDER"
                          ? "visible btn btn-primary"
                          : "invisible btn btn-primary"
                      }
                      type="button"
                      onClick={() => {
                        history.push("/proyectoRegistro");
                      }}
                    >
                      Crear Proyecto
                    </Button>
                  </Col>
                  <Form.Group className="mb-3">
                    <table
                      id="tbProyecto"
                      className="table table-striped col-4 col-s-12"
                    >
                      <thead>
                        <tr>
                          <th scope="col">No.</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Lider</th>
                          <th scope="col">Fase</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Fecha Inicio</th>
                          <th scope="col">Fecha Fin</th>
                          <th scope="col">Presupuesto</th>
                          <th scope="col">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proyectos.map((proyecto, index) => {
                          return (
                            <tr key={index + 1}>
                              <th scope="row">{index + 1}</th>
                              <td>{proyecto.nombre}</td>
                              <td>
                                {proyecto.lider
                                  ? proyecto.lider.nombre +
                                    " " +
                                    proyecto.lider.apellido
                                  : ""}
                              </td>
                              <td>{proyecto.fase}</td>
                              <td
                                className={colorAlertaEstado(proyecto.estado)}
                              >
                                {proyecto.estado}
                              </td>
                              <td>{proyecto.fechaInicio}</td>
                              <td>{proyecto.fechaFin}</td>
                              <td>
                                {moneyFormat
                                  .format(proyecto.presupuesto)
                                  .replace(",00", "")}
                              </td>
                              <td>
                                <table className="table col-5 col-s-12">
                                  <thead></thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Button
                                          id={proyecto._id}
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            proyectoSeleccion(
                                              proyecto._id,
                                              "ACTUALIZAR"
                                            )
                                          }
                                        >
                                          <Image
                                            src={editar}
                                            rounded
                                            id={proyecto._id}
                                          />
                                        </Button>
                                      </td>

                                      <td>
                                        <Button
                                          id={proyecto._id}
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            proyectoSeleccion(
                                              proyecto._id,
                                              "VISUALIZAR"
                                            )
                                          }
                                        >
                                          <Image
                                            src={info}
                                            rounded
                                            id={proyecto._id}
                                          />
                                        </Button>
                                      </td>

                                      <td>
                                        <Button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            proyectoSeleccion(
                                              proyecto._id,
                                              "AVANCES"
                                            )
                                          }
                                        >
                                          <Image
                                            src={detalle}
                                            rounded
                                            id={proyecto._id}
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
                      value={proyectoSel.apruebaCreacion}
                      onChange={handleChangeAprueba}
                      defaultChecked={proyectoSel.apruebaCreacion}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      proyectoActualizar("APROBACION");
                    }}
                    disabled={proyectoSel.apruebaCreacion ? true : false}
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
                    value={proyectoSel.nombre || ""}
                    name="nombre"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Nombre lider</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      proyectoSel.lider
                        ? proyectoSel.lider.nombre +
                          " " +
                          proyectoSel.lider.apellido
                        : ""
                    }
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="text"
                    value={proyectoSel.fechaInicio || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Presupesto (pesos $ COP)</Form.Label>
                  <Form.Control
                    type="Number"
                    value={proyectoSel.presupuesto || 0}
                    name="presupuesto"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Objetivos generales</Form.Label>
                  <FormControl
                    as="textarea"
                    value={proyectoSel.objetivosGenerales || ""}
                    name="objetivosGenerales"
                    onChange={handleChange}
                    rows="5"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Objetivos específicos</Form.Label>
                  <FormControl
                    as="textarea"
                    value={proyectoSel.objetivosEspecificos || ""}
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
                disabled={proyectoSel.apruebaCreacion ? false : true}
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
                    value={proyectoSel.estado || ""}
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
                disabled={proyectoSel.apruebaCreacion ? false : true}
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
                    value={proyectoSel.fase || ""}
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
                disabled={proyectoSel.apruebaCreacion ? false : true}
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
              <Form.Control placeholder={proyectoSel.nombre || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Nombre lider</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  proyectoSel.lider
                    ? proyectoSel.lider.nombre +
                      " " +
                      proyectoSel.lider.apellido
                    : ""
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Control placeholder={proyectoSel.estado || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fase</Form.Label>
              <Form.Control placeholder={proyectoSel.fase || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                placeholder={proyectoSel.fechaInicio || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Presupesto (pesos $ COP)</Form.Label>
              <Form.Control
                placeholder={proyectoSel.presupuesto || 0}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Objetivos generales</Form.Label>
              <FormControl
                as="textarea"
                placeholder={proyectoSel.objetivosGenerales || ""}
                rows="5"
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Objetivos específicos</Form.Label>
              <FormControl
                as="textarea"
                placeholder={proyectoSel.objetivosEspecificos || ""}
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
                  value={proyectoSel.apruebaCreacion}
                  defaultChecked={proyectoSel.apruebaCreacion}
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
      </Modal>
    </div>
  );
};

export default ListarProyectos;
