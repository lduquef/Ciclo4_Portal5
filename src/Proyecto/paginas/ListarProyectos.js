import { Container, Col, Row, Form, Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";

const ListarProyectos = () => {
  const datosPrueba = [
    {
      nombre: "proyectoCamilo44",
      lider: {
        nombre: "Camilo",
        apellido: "Pinto",
      },
      fase: "INICIADO",
      estado: "INACTIVO",
      fechaInicio: null,
      presupuesto: 435234,
    },
    {
      nombre: "proyectoCamilo MODIFICADO",
      lider: {
        nombre: "maribel",
        apellido: "valencia",
      },
      fase: "EN_DESARROLLO",
      estado: "ACTIVO",
      fechaInicio: "2021-01-12T05:00:00.000Z",
      presupuesto: 200000000,
    },
  ];

  //hooks para actualizar lista de proyectos, proyecto seleccionado
  const [proyectos] = useState(datosPrueba);
  // const [proyectosel, setProyectosel] = useState([]);

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
                                {proyecto.lider.nombre}
                                {proyecto.lider.apellido}
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
                                          onClick={handleShowActualizar}
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
          <Form></Form>
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
