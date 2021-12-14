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

const SolicitudRegistro = () => {
  const history = useHistory();

  //hook para contener el solicitud a crear
  const [solicitud, setSolicitud] = useState([]);

  //hook para contener la lista de proyectos disponibles
  const [proyectos, setProyectos] = useState([]);

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

  const mutacionCrearSolicitud = (proyecto, estudiante, estado) => {
    return JSON.stringify({
      query: `
      mutation CrearSolicitud($proyecto: String!, $estudiante: String!, $estado: Enum_EstadoSolicitud!) {
        crearSolicitud(proyecto: $proyecto, estudiante: $estudiante, estado: $estado) {
          _id
          proyecto {
            nombre
          }
          estudiante {
            nombre
            apellido
          }
          estado
          fechaIngreso
          fechaEgreso
        }
      }
    `,
      variables: `{  
          "proyecto": "${proyecto}",
          "estudiante": "${estudiante}",
          "estado": "${estado}"
        }
    `,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  //FUNCIONES
  //////////////////////////////////////////////////////////////////////////////////////////

  //Función para listar proyectos activos
  useEffect(() => {
    if (proyectos.length === 0) listarProyectosActivos();
  });

  const listarProyectosActivos = () => {
    var consulta = queryListaProyectos();

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
      if (data.data.listarProyectos) {
        setProyectos(data.data.listarProyectos);
      } else {
        popupFallido("Sin resultados consulta proyectos");
      }
    }

    fetchData();
  };

  //Función registro nuevo solicitud
  const registrarSolicitud = () => {
    var consulta = mutacionCrearSolicitud(
      solicitud.proyecto,
      localStorage.getItem("idUsuario"),
      "PENDIENTE"
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
      if (data.data.crearSolicitud) {
        popupExitoso("Registro exitoso");
        setTimeout(function () {
          history.push("/listarSolicitudes");
        }, 3000);
      }
    }

    fetchData();
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

  //Función para registrar cambio en la lista de proyectos del formulario
  const handleChangeProyecto = (event) => {
    const index = event.target.selectedIndex;
    const optionElement = event.target.childNodes[index];
    const optionElementId = optionElement.getAttribute("id");
    setSolicitud({ ...solicitud, proyecto: optionElementId });
  };

  // Return de componente formulario a renderizar
  return (
    <div>
      <Container className="justify-content-center">
        <Row>
          <Col xs={3} />
          <Col xs={5}>
            <div className="row justify-content-center">
              <h2>Registro de solicitud</h2>
              <Container>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Proyecto
                    </Form.Label>
                    <Form.Select
                      size="lg"
                      name="proyecto"
                      onChange={handleChangeProyecto}
                    >
                      <option></option>
                      {proyectos.map((proy, index) => {
                        return (
                          <option key={index} id={proy._id}>
                            {proy.nombre}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex justify-content-start">
                      Estudiante
                    </Form.Label>
                    <FormControl
                      type="text"
                      value={
                        localStorage.getItem("nombreUsuario") +
                        " " +
                        localStorage.getItem("apellidoUsuario")
                      }
                      placeholder={localStorage.getItem("nombreUsuario") || ""}
                      readOnly
                    />
                  </Form.Group>

                  <div className="form-group mt-5">
                    <Button className="btn btn-primary"
                      type="button"
                      onClick={registrarSolicitud}
                    >
                      Crear Solicitud
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

export default SolicitudRegistro;
