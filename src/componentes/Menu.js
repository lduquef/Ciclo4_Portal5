import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import userLogo from "../img/userLogo.svg";
const Menu = () => {
  return (
    <div className="justify-content-center">
      <Navbar
        bg="light"
        expand="lg"
        sticky="top"
        className="justify-content-center"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Inicio</Nav.Link>
              <Nav.Link href="/usuarios">Usuarios</Nav.Link>
              <NavDropdown title="Proyectos" id="basic-nav-dropdown">
                <NavDropdown.Item href="/crearSolicitud">
                  Crear Solicitud
                </NavDropdown.Item>
                <NavDropdown.Item href="/consultarSolicitudes">
                  Historial Solicitudes
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <div>
            <img src={userLogo} alt="" width="40" height="40" />
            <h5>Actualizar perfil</h5>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default Menu;
