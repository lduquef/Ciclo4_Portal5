import { Table, Button } from "react-bootstrap";
import proLogo from "../img/proyecto.png";
import solLogo from "../img/solicitud.png";
import { useHistory } from "react-router-dom";

const Content = () => {
  const history = useHistory();
  const saludo = (
    localStorage.getItem("nombreUsuario") +
    " " +
    localStorage.getItem("apellidoUsuario")
  ).toUpperCase();

  const gestionProyectos = () => {
    history.push("/listarProyectos");
  };

  const gestionSolicitudes = () => {
    history.push("/listarSolicitudes");
  };

  return (
    <div className="justify-content-center mt-5">
      <h3>Bienvenido {saludo} </h3>

      <Table className="justify-content-center mt-5">
        <tbody className="border-0">
          <tr>
            <td className="ml-5"></td>
            <td>
              <Button variant="light" onClick={gestionProyectos}>
                <img src={proLogo} alt="" width="200" height="200" />
                <h3>Base de proyectos</h3>
              </Button>
            </td>
            <td>
              <Button variant="light" onClick={gestionSolicitudes}>
                <img src={solLogo} alt="" width="200" height="200" />
                <h3>Solicitudes</h3>
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Content;
