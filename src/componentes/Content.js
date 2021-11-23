import { Table } from "react-bootstrap";
import proLogo from "../img/proyecto.png";
import solLogo from "../img/solicitud.png";

const Content = () => {
  return (
    <div className="justify-content-center mt-5">
      <Table className="justify-content-center mt-5">
        <tbody>
          <tr>
            <td>
              <img src={proLogo} alt="" width="200" height="200" />
            </td>
            <td>
              <img src={solLogo} alt="" width="200" height="200" />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Content;
