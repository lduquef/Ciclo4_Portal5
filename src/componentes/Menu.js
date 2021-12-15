import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import userLogo from "../img/userLogo.svg";
import auth from "../img/auth.svg";
import { useHistory } from "react-router-dom";

const Menu = () => {
  const history = useHistory();
  const rol = localStorage.getItem("rol").toLowerCase();

  function handleClick(val) {
    if (val === "diauth") {
      localStorage.removeItem("estado");
      localStorage.removeItem("rol");
      localStorage.removeItem("nombreUsuario");
      localStorage.removeItem("apellidoUsuario");

      history.push("/");
    }
    if (val === "user") history.push("/usuarioActualizar");
  }

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
              <Nav.Link
                className={
                  localStorage.getItem("rol") === "ESTUDIANTE"
                    ? "invisible"
                    : "visible"
                }
                href="/listarUsuarios"
              >
                Usuarios
              </Nav.Link>
              <NavDropdown title="Proyectos" id="basic-nav-dropdown">
                <NavDropdown.Item href="/listarProyectos">
                  Base de proyectos
                </NavDropdown.Item>
                <NavDropdown.Item
                  className={
                    localStorage.getItem("rol") === "ESTUDIANTE"
                      ? "visible"
                      : "invisible"
                  }
                  href="/solicitudRegistro"
                >
                  Crear Solicitud
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

          <div>
            <h2 className="text-success">({rol})</h2>
          </div>

          <div>
            <Button variant="contained" onClick={() => handleClick("user")}>
              <img src={userLogo} alt="" width="40" height="40" />
            </Button>
          </div>
          <div>|</div>
          <div>
            <Button variant="contained" onClick={() => handleClick("diauth")}>
              <img src={auth} alt="" width="40" height="40" />
            </Button>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default Menu;
