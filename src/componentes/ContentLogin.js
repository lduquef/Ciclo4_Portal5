import { Form } from "react-bootstrap";
import logo from "../img/proLogo.jpg";
import { useHistory } from "react-router-dom";

const Content = () => {
  const history = useHistory();

  const autenticar = () => {
    history.push("/home");
  };
  localStorage.removeItem("user"); //retira cualquier variable de autenticación de usuario que exista

  return (
    <div>
      <div className="d-flex justify-content-center mt-5">
        <Form>
          <div className="d-flex justify-content-center mt-5 mb-0">
            <img src={logo} alt="" width="400" height="200" />
          </div>

          <h3>Autenticación Portal5</h3>

          <div className="form-group mt-3">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingrese email"
            />
          </div>

          <div className="form-group mt-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese constraseña"
            />
          </div>

          <div className="form-group mt-3">
            <label>Rol</label>
            <Form.Select size="lg">
              <option>Estudiante</option>
              <option>Lider</option>
              <option>Administrador</option>
            </Form.Select>
          </div>

          <div className="form-group mt-5" />

          <div className="form-group mt-2">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={autenticar}
            >
              Iniciar sesión
            </button>
          </div>

          <div className="form-group mt-2">
            <button type="submit" className="btn btn-primary btn-block">
              Registro
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Content;
