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
import aprobar from "../../img/aprobar.svg";
import Swal from "sweetalert2";

const ListarProyectos = () => {
  //hooks para actualizar lista de proyectos, proyecto seleccionado
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSel, setProyectoSel] = useState([]);

  // funciones visibilidad de las pantallas modales
  const [showActualizar, setShowActualizar] = useState(false);
  const [showVisualizar, setShowVisualizar] = useState(false);
  const [showAprobar, setShowAprobar] = useState(false);

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

  const handleShowAprobar = () => {
    setShowAprobar(true);
  };
  const handleCloseAprobar = () => {
    setShowAprobar(false);
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
      variables:
        `
    {
      "consultarProyectoId": "` +
        id +
        `"
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
      variables:
        `
        {
          "input": {
            "_id": "` +
        id +
        `",
            "nombre": "` +
        nombre +
        `",
            "objetivosGenerales": "` +
        objGen +
        `",
            "objetivosEspecificos": "` +
        objEsp +
        `",
            "presupuesto": ` +
        presupuesto +
        `
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
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryListaProyectos(),
      };
      const response = await fetch("http://localhost:4000/graphql", config);

      const data = await response.json();
      if (data) {
        setProyectos(data.data.listarProyectos);
      } else {
        alert("Sin resultados");
      }
    }
    if (proyectos.length === 0) fetchData();
  });

  //Función para consultar el proyecto a partir de la seleección del registro desde la tabla
  const proyectoSeleccion = (id, operacion) => {
    alert("Id de registro seleccionado:   " + id);
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
      if (data) {
        setProyectoSel(data.data.consultarProyecto);
      } else {
        alert("Sin resultados");
      }
    }
    fetchData();
    if (operacion === "ACTUALIZAR") handleShowActualizar();
    if (operacion === "APROBAR") handleShowAprobar();
  };

  //Función para actualizar el proyecto seleccionado desde la pantalla modal
  const proyectoActualizar = () => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: mutacionActualizarProyectoSel(
          proyectoSel._id,
          proyectoSel.nombre,
          proyectoSel.objetivosGenerales,
          proyectoSel.objetivosEspecificos,
          proyectoSel.presupuesto
        ),
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data) {
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
    console.log(event.target.name + " : " + event.target.value);
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
                  <Form.Group className="mb-3">
                    <table
                      id="tbProyecto"
                      className="table table-striped col-5 col-s-12"
                    >
                      <thead>
                        <tr>
                          <th scope="col">No.</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Lider</th>
                          <th scope="col">Fase</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Fecha Inicio</th>
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
                              <td>{proyecto.estado}</td>
                              <td>{proyecto.fechaInicio}</td>
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
                                          onClick={handleShowVisualizar}
                                        >
                                          <Image
                                            src={info}
                                            rounded
                                            id={proyecto._id}
                                          />
                                        </Button>
                                      </td>

                                      <td
                                        className={
                                          localStorage.getItem("rol") ===
                                          "ADMINISTRADOR"
                                            ? "visible"
                                            : "invisible"
                                        }
                                      >
                                        <Button
                                          id={proyecto._id}
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            proyectoSeleccion(
                                              proyecto._id,
                                              "APROBAR"
                                            )
                                          }
                                        >
                                          <Image
                                            src={aprobar}
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
              <Form.Label>Estado</Form.Label>
              <Form.Select
                size="lg"
                name="estado"
                value={proyectoSel.estado || ""}
                onChange={handleChange}
                disabled="true"
              >
                <option>ACTIVO</option>
                <option>INACTIVO</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fase</Form.Label>
              <Form.Select
                size="lg"
                name="fase"
                value={proyectoSel.fase || ""}
                onChange={handleChange}
                disabled="true"
              >
                <option>INICIADO</option>
                <option>EN_DESARROLLO</option>
                <option>TERMINADO</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
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

            <Form.Group className="mb-2">
              <div className="row">
                <Form.Label className="col-md-3">Aprueba creación</Form.Label>
                <Form.Check
                  className="col-md-9 ms-auto"
                  aria-label="option 1"
                  name="apruebaCreacion"
                  value={proyectoSel.apruebaCreacion}
                  onChange={handleChange}
                  disabled="true"
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={proyectoActualizar}>
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
                  placeholder={proyectoSel.apruebaCreacion}
                  disabled="true"
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVisualizar}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        name="ModalAprobar"
        className="modal-dialog-scrollable"
        show={showAprobar}
        onHide={handleCloseAprobar}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Aprobar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre proyecto</Form.Label>
              <Form.Control
                type="text"
                placeholder={proyectoSel.nombre || ""}
                name="nombre"
                readOnly
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
              <div className="row">
                <Form.Label className="col-md-3">Aprueba creación</Form.Label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexCheckIndeterminate"
                    name="apruebaCreacion"
                    value={proyectoSel.apruebaCreacion}
                    onChange={handleChange}
                  />
                  <label class="form-check-label" for="flexCheckIndeterminate">
                    Indeterminate checkbox
                  </label>
                </div>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAprobar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={proyectoActualizar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListarProyectos;
