import { useEffect ,useState } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
const UsuarioActualizar = () => {
  const history = useHistory();

  const actualizar = () => {
    history.push("/home");
  };
  const [Usuario, setUsuario] = useState([])
  const [UsuarioConsul,setUsuarioConsul] = useState([]);

  const queryUsuario = (id) => {
    console.log(id)
    return JSON.stringify({
      query: `
      query ConsultarUsuario($id: String!) {
        consultarUsuario(_id: $id) {
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
    variables:
        `
        {
            "id": "${id}"
        }
        `
    });
  };
  const mutacionActualizarUsuarioConsul = (id, nombre, apellido, correo, identificacion, estado, rol) =>{
    console.log(estado,rol);
    return JSON.stringify({
        query: `
        mutation ActualizarUsuario($input: actualizarUsuarioInput!) {
          actualizarUsuario(input: $input) {
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
      variables:
        `
        {
          "input": {
            "_id":"${id}",
            "nombre": "${nombre}",
            "apellido": "${apellido}",
            "identificacion": "${identificacion}",
            "correo": "${correo}",
            "estado": "${estado}",
            "rol":"${rol}"
          }
        }
        `,
      });
  };
  let idUsuario = localStorage.getItem("idUsuario")
   
 useEffect(()=>{
  async function fetchData() {
    const config = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: queryUsuario(idUsuario),
    };
    const response = await fetch("http://localhost:4000/graphql", config);

    const data = await response.json();
    if (data) {
      setUsuario(data.data.consultarUsuario)
      setUsuarioConsul(Usuario);
      console.log(Usuario)
    } else {
      alert("Sin resultados");
    }
  }
  if (UsuarioConsul.length === 0) fetchData();
 })
  
  const ActualizarUsuario =() => {
    let idUsuario = localStorage("idUsuario")
    async function fetchData2() {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: mutacionActualizarUsuarioConsul(
          idUsuario,
          UsuarioConsul.nombre,
          UsuarioConsul.apellido,
          UsuarioConsul.correo,
          UsuarioConsul.identificacion,
          UsuarioConsul.estado,
          UsuarioConsul.rol
        ),
      };
      const response = await fetch("http://localhost:4000/graphql", config);
      const data = await response.json();
      console.log(data)
      if (data.data.actualizarUsuario) {
          setUsuario([]);
        popupExitoso("Actualización exitosa");
      }else {
        alert("Sin resultados");
      }
    }
    fetchData2();
    // validarCamposRequeridos();
    // if (validado) {
    //   fetchData();
    //   handleCloseActualizar();
    // }
  }
  const [showActualizar, setShowActualizar] = useState(false);
  const [showVisualizar, setShowVisualizar] = useState(false);

  //Funciones para generar popup confirmación de exito o falla de operación
  const popupExitoso = (msg) => {
    Swal.fire({
      title: "Operación Exitosa",
      text: msg,
      type: "success",
    });
  };

  // const popupFallido = (msg) => {
  //   Swal.fire({
  //     title: "Operación fallida",
  //     text: msg,
  //     type: "warning",
  //   });
  // };

  
  //Función para registrar cambio en los campos del formulario
  const handleChange = (event) => {
    setUsuarioConsul({ ...UsuarioConsul, [event.target.nombre]: event.target.value ,[event.target.apellido]: event.target.value , [event.target.correo]: event.target.value});
  };

  // const habilitarCampo= () =>{
  //   const rol = localStorage.getItem("rol"); 
  //   if (rol === "LIDER") {
  //     return("true" )
      
  //   }else {
  //     return "false"
  //   }
  // }
  // Return de componente formulario a renderizar
  return (
    <div>
      <Container className="justify-content-center">
        <Row>
          <Col xs={3} />
          <Col xs={5}>
            <div className="row justify-content-center">
              <h2>Perfil del usuario</h2>
              <Container>
                <Form>
                <Form.Group className="mb-2">
              <Form.Label>Nombre </Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.nombre || ""}
                name="nombre"
                onChange={handleChange}
                // readOnly = {habilitarCampo}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>apelido</Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.apellido || ""}
                name="apellido"
                onChange={handleChange}
                // readOnly = {habilitarCampo}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>correo</Form.Label>
              <Form.Control
                type="text"
                value={UsuarioConsul.correo || ""}
                name="correo"
                onChange={handleChange}
                // readOnly = {habilitarCampo}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Identficación</Form.Label>
              <Form.Control
                type="number"
                value={UsuarioConsul.identificacion || ""}
                name="identificacion"
                onChange={handleChange}
                // readOnly = {habilitarCampo}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                size="lg"
                name="rol"
                value={UsuarioConsul.rol || ""}
                onChange={handleChange}
                disabled 
              >
                <option>LIDER</option>
                <option>ADMINISTRADOR</option>
                <option>ESTUDIANTE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                size="lg"
                name="estado"
                value={UsuarioConsul.estado || ""}
                onChange={handleChange}
                disabled 
              >
                <option>PENDIENTE</option>
                <option>AUTORIZADO</option>
                <option>NO_AUTORIZADO</option>
              </Form.Select>
            </Form.Group>

                  <div className="form-group mt-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={ActualizarUsuario}
                    >
                      Actualizar Cambios
                    </button>
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

export default UsuarioActualizar;
