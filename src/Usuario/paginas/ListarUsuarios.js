import { Container, Col, Row, Form, Button, Modal } from "react-bootstrap";
import React, { useState ,useEffect } from "react";
import Image from "react-bootstrap/Image";
import editar from "../../img/edit.svg";
import info from "../../img/info.svg";

const ListarUsuarios = () => {
  const datosPrueba = [
    {
      _id: "619882fb8d71dceb481655c9",
      correo: "marv@outoo.com",
      identificacion: "3008",
      nombre: "maribel",
      apellido: "valencia",
      rol: "ESTUDIANTE",
      estado: "PENDIENTE",
    },
    {
      _id: "619919cf84434e9bdf6da60c",
      correo: "camilo@gmail.com",
      identificacion: "125486",
      nombre: "camilo",
      apellido: "pinto",
      rol: "ADMINISTRADOR",
      estado: "PENDIENTE",
    },
  ];

  //hooks para actualizar lista de usuarios, usuario seleccionado
  const [Usuarios,setUsuario] = useState([]);
  // const [usuarioSel, setusuarioSel] = useState([]);
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
  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: queryListaUsuarios(),
      };
      const response = await fetch("http://localhost:4000/graphql", config);

      const data = await response.json();
      if (data) {
        console.log(data.data.listarUsuarios)
        setUsuario(data.data.listarUsuarios);
      } else {
        alert("Sin resultados");
      }
    }
    if (Usuarios.length === 0) fetchData();
  });
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
              <h2>Lista de usuarios del listema</h2>
              <Container className="mt-4">
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
                              <td>{usuario.estado}</td>
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
                                          onClick={handleShowActualizar}
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
                                          onClick={handleShowVisualizar}
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
          <Modal.Title>Visualizar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          {Usuarios.map((usuario, index) => {
                          return (
                            <tr key={index + 1}>
                              <th scope="row">{index + 1}</th>
                              <td>{usuario.nombre}</td>
                              <td>{usuario.apellido}</td>
                              <td>{usuario.correo}</td>
                              <td>{usuario.identificacion}</td>
                              <td>{usuario.rol}</td>
                              <td>{usuario.estado}</td>
                              <td>

                              </td>
                            </tr>
                          );
                        })}
          </Form>
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

export default ListarUsuarios;
