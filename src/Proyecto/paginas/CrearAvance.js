import {
  Container,
  Col,
  Row,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const CrearAvances = () => {
  const history = useHistory();

  //hook para contener el avance a crear
  const [avance, setAvance] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////
  const mutacionCrearAvanceP = (
    idProyecto,
    idEstudiante,
    descripcion,
    fechaAvance
  ) => {
    return JSON.stringify({
      query: `
        mutation CrearAvanceProyecto($idProyecto: String!, $idEstudiante: String!, $descripcion: String!, $fechaAvance: Date!) {
          crearAvanceProyecto(_idProyecto: $idProyecto, _idEstudiante: $idEstudiante, descripcion: $descripcion, fechaAvance: $fechaAvance) {
            _id
            proyecto {
              nombre
            }
            estudiante {
              nombre
            }
            descripcion
            fechaAvance
          }
        }
      `,
      variables:
        `
          {
            "idProyecto":  "` +
        idProyecto +
        `",
              "idEstudiante": "` +
        idEstudiante +
        `",
              "descripcion": "` +
        descripcion +
        `",
              "fechaAvance": "` +
        fechaAvance +
        `",
            }
          }
      `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Función crear nuevo avance
  const CrearAvance = () => {
    // let idProyecto = localStorage.getItem("idProyecto")
    // let idEstudiante =localStorage.getItem("idEstudiante")

    var consulta = mutacionCrearAvanceP(
      avance.idProyecto,
      avance.idEstudiante,
      avance.descripcion,
      avance.fechaAvance
    );

    useEffect(() => {
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
        console.log(data);
        if (data.data.crearAvanceProyecto) {
          popupExitoso("Avance exitoso");
          setTimeout(function () {
            history.push("/listarAvancesProyecto");
          }, 3000);
        }
      }
      validarCamposRequeridos();
      if (validado) {
        fetchData();
      }
    });
  };

  //Función para validar los campos obligatorios del formulario
  var validado = false;
  const validarCamposRequeridos = () => {
    validado = true;
    if (avance.descripcion === "") {
      popupFallido("La descripción del avance es requerida");
      validado = false;
    }
    if (avance.fechaAvance === "") {
      popupFallido("Es necesario indicar la fecha del avance");
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
    setAvance({
      ...avance,
      [event.target.descripcion]: event.target.value,
      [event.target.fechaAvance]: event.target.value,
    });
  };

  // Return de componente formulario a renderizar
  return (
    <div>
      <Container className="justify-content-center">
        <Row>
          <Col xs={3} />
          <Col xs={5}>
            <div className="row justify-content-center">
              <h2>Crear Avance</h2>
              <Container>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Id Proyecto
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={avance.idProyecto || ""}
                      name="idProyecto"
                      //onChange={handleChange}
                      readOnly="true"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Id Estudiante
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={avance.idEstudiante || ""}
                      name="idEstudiante"
                      //onChange={handleChange}
                      readOnly="true"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={avance.descripcion || ""}
                      name="descripcion"
                      onChange={handleChange}
                      rows="5"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Fecha Avance
                    </Form.Label>
                    <FormControl
                      type="date"
                      value={avance.fechaAvance || ""}
                      name="fechaAvance"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="form-group mt-2">
                    <Button btn btn-primary type="button" onClick={CrearAvance}>
                      Crear Avance
                    </Button>
                  </div>
                </Form>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CrearAvances;
