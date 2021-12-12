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

const ListarAvances = () => {
  const [avances, setAvances] = useState([]);
  
  const queryListaAvances = (id) => {
    return JSON.stringify({
      query: `
      query Query($idProyecto: String!) {
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
    variables:
      `
  {
    "idProyecto": "` +
      id +
      `"
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
        body: queryListaAvances(),
      };
      const response = await fetch("http://localhost:4000/graphql", config);

      const data = await response.json();
      console.log (data);
    
      if (data.data.listarAvancesProyecto) {
        setAvances(data.data.listarAvancesProyecto);
      } else {
        alert("Sin resultados");
      }
     }
     if (avances.length === 0) fetchData();
  });


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
                              <td>{avance.oservaciones}</td>
                              <td>{avance.fechaAvance}</td>
                              <td>{avance.fechaObservaciones}</td>
                              
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

      </div>
    );
//setAvances(data.data.listarProyectos);
};
  export default ListarAvances;