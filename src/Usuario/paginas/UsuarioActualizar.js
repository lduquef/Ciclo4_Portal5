import { Container, Col, Row, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const UsuarioActualizar = () => {
  const history = useHistory();

  const actualizar = () => {
    history.push("/home");
  };

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
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Nombres
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite su nombres"
                      onChange={null}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Apellidos
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite su apellidos"
                      onChange={null}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      No. identificación
                    </Form.Label>
                    <Form.Control
                      type="Number"
                      placeholder="Digite su número de identificación (solo numeros)"
                      onChange={null}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex justify-content-start">
                      Teléfono contacto
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite un número telefónico de contacto"
                      onChange={null}
                    />
                  </Form.Group>

                  <div className="form-group mt-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={actualizar}
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
