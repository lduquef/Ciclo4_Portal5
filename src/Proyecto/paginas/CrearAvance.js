import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const CrearAvances = () => {
  const history = useHistory();
  const location = useLocation();
  const idProyecto = location.state.detail;

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
              apellido
            }
            descripcion
            fechaAvance
          }
        }
      `,
      variables: `
        {
          "idProyecto": "${idProyecto}",
          "idEstudiante": "${idEstudiante}",
          "descripcion": "${descripcion}",
          "fechaAvance": "${fechaAvance}"
        }
      `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Función crear nuevo avance
  const CrearAvance = () => {
    var dateParts = new Date().toLocaleDateString().split("/");
    var fechaActual = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
    var consulta = mutacionCrearAvanceP(
      idProyecto,
      localStorage.getItem("idUsuario"),
      avance.descripcion,
      fechaActual
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
      console.log(data);
      if (data.data.crearAvanceProyecto) {
        popupExitoso("Avance exitoso");
        setTimeout(function () {
          history.push({
            pathname: "/listarAvancesProyecto",
            state: { detail: idProyecto },
          });
        }, 3000);
      }
    }
    validarCamposRequeridos();
    if (validado) {
      fetchData();
    }
  };

  //Función para validar los campos obligatorios del formulario
  var validado = false;
  const validarCamposRequeridos = () => {
    validado = true;
    if (avance.descripcion === "") {
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
    setAvance({ ...avance, [event.target.name]: event.target.value });
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
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={avance.descripcion || ""}
                      name="descripcion"
                      onChange={handleChange}
                      rows="10"
                    />
                  </Form.Group>

                  <div className="form-group mt-5">
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
