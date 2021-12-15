import {
  Container,
  Col,
  Row,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import Swal from "sweetalert2";

const ProyectoRegistro = () => {
  const history = useHistory();

  //hook para contener el proyecto a crear
  const [proyecto, setProyecto] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////////////
  //QUERYS
  //////////////////////////////////////////////////////////////////////////////////////////
  const mutacionCrearProyecto = (
    nombre,
    idLider,
    objGen,
    objEsp,
    presupuesto
  ) => {
    console.log(nombre, idLider, objGen, objEsp, presupuesto);
    return JSON.stringify({
      query: `
      mutation CrearProyecto($input: CreaProyectoInput!) {
      crearProyecto(input: $input) {
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
            "nombre": "${nombre}",
            "idLider": "${idLider}",
            "objetivosGenerales": "${objGen}",
            "objetivosEspecificos": "${objEsp}",
            "presupuesto": ${presupuesto}
          }
        }
    `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Función registro nuevo proyecto
  const registrarProyecto = () => {
    var consulta = mutacionCrearProyecto(
      proyecto.nombre,
      localStorage.getItem("idUsuario"),
      proyecto.objetivosGenerales,
      proyecto.objetivosEspecificos,
      proyecto.presupuesto
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
      if (data.data.crearProyecto) {
        popupExitoso("Registro exitoso");
        setTimeout(function () {
          history.push("/listarProyectos");
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
    if (proyecto.nombre === "") {
      popupFallido("El nombre de proyecto es requerido");
      validado = false;
    }
    if (proyecto.presupuesto === "") {
      popupFallido("El valor de presupuesto es requerido");
      validado = false;
    }
    if (proyecto.objetivosGenerales === "") {
      popupFallido("Es necesario indicar los objetivos Generales del proyecto");
      validado = false;
    }
    if (proyecto.objetivosEspecificos === "") {
      popupFallido(
        "Es necesario indicar los objetivos Específicos del proyecto"
      );
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
    setProyecto({ ...proyecto, [event.target.name]: event.target.value });
  };

  // Return de componente formulario a renderizar
  return (
    <div>
      <Container className="justify-content-center">
        <Row>
          <Col xs={3} />
          <Col xs={5}>
            <div className="row justify-content-center">
              <h2>Registro de proyecto</h2>
              <Container>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Nombre proyecto
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={proyecto.nombre || ""}
                      name="nombre"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Nombre lider
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={
                        localStorage.getItem("nombreUsuario") +
                        " " +
                        localStorage.getItem("apellidoUsuario")
                      }
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Presupesto (pesos $ COP)
                    </Form.Label>
                    <Form.Control
                      type="Number"
                      value={proyecto.presupuesto || 0}
                      name="presupuesto"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Objetivos generales
                    </Form.Label>
                    <FormControl
                      as="textarea"
                      value={proyecto.objetivosGenerales || ""}
                      name="objetivosGenerales"
                      onChange={handleChange}
                      rows="5"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Objetivos específicos
                    </Form.Label>
                    <FormControl
                      as="textarea"
                      value={proyecto.objetivosEspecificos || ""}
                      name="objetivosEspecificos"
                      onChange={handleChange}
                      rows="5"
                    />
                  </Form.Group>

                  <div className="form-group mt-2">
                    <Button
                      btn
                      btn-primary
                      type="button"
                      onClick={registrarProyecto}
                    >
                      Crear Proyecto
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

export default ProyectoRegistro;
