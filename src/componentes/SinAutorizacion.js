import { useHistory } from "react-router-dom";
import restringido from "../img/restringido.svg";
import Button from "react-bootstrap/Button";

const SinAutorizacion = () => {
  const history = useHistory();
  return (
    <div className="d-flex justify-content-center mt-5">
      <div>
        <img
          className="mb-4"
          src={restringido}
          alt=""
          width="500"
          height="200"
        />
        <h1>Sin autorización</h1>
        <h3>
          Por favor contactar al adminsitrador para validar su autorización a
          este contenido
        </h3>
        <span className="tag">soporte@Portal5.com</span>
        <br />
        <br />
        <div>
          <Button
            variant="primary"
            onClick={() => {
              history.goBack();
            }}
          >
            Regresar al sitio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SinAutorizacion;
