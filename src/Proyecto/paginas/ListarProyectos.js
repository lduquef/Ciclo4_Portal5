import { Container, Col, Row, Form, Button, Modal } from "react-bootstrap";

import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";

const ListarProyectos = () => {
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
  const consultaListaProyectos = JSON.stringify({
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

  const consultaProyectoSel = JSON.stringify({
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
      "consultarProyectoId": "61a542e05d0eb3a6b541f79f"
    }
    `,
  });

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
        body: consultaListaProyectos,
      };
      const response = await fetch("http://localhost:4000/graphql", config);

      const data = await response.json();
      if (data) {
        console.log(data.data.listarProyectos);
        setProyectos(data.data.listarProyectos);
      } else {
        alert("Sin resultados");
      }
    }
    if (proyectos.length === 0) fetchData();
  });

  //Función para consultar el proyecto a partir de la seleección del registro desde la tabla
  const proyectoSeleccion = (e) => {
    alert("Id de registro seleccionado:   " + e.target.id);
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: consultaProyectoSel,
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      if (data) {
        console.log(data);
        setProyectoSel(data.data.consultarProyecto);
      } else {
        alert("Sin resultados");
      }
    }
    fetchData();
    handleShowActualizar();
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
                                {proyecto.lider ? proyecto.lider.nombre : ""}
                                {proyecto.lider ? proyecto.lider.apellido : ""}
                              </td>
                              <td>{proyecto.fase}</td>
                              <td>{proyecto.estado}</td>
                              <td>{proyecto.fechaInicio}</td>
                              <td>{proyecto.presupuesto}</td>
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
                                          onClick={proyectoSeleccion}
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
          <Modal.Title>Actualizar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Proyecto</Form.Label>
              <Form.Control type="text" placeholder={proyectoSel.nombre} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>lider</Form.Label>
              <Form.Control type="text" placeholder={null} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select size="lg" value={proyectoSel.estado} onChange={null}>
                <option>ACTIVO</option>
                <option>INACTIVO</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fase</Form.Label>
              <Form.Select size="lg" value={proyectoSel.fase} onChange={null}>
                <option>INICIADO</option>
                <option>EN_DESARROLLO</option>
                <option>TERMINADO</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Presupesto</Form.Label>
              <Form.Control
                type="Number"
                placeholder={proyectoSel.presupuesto}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActualizar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCloseActualizar}>
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
          <Modal.Title>Visualizar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form></Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVisualizar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCloseVisualizar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListarProyectos;
