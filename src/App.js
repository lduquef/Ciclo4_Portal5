import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ContentLogin from "./componentes/ContentLogin";
import SinAutorizacion from "./componentes/SinAutorizacion";
import Home from "./componentes/Home";
import Error from "./componentes/Error";
import UsuarioRegistro from "./Usuario/paginas/UsuarioRegistro";
import UsuarioActualizar from "./Usuario/paginas/UsuarioActualizar";
import ListarUsuarios from "./Usuario/paginas/ListarUsuarios";
import ListarProyectos from "./Proyecto/paginas/ListarProyectos";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Menu from "./componentes/Menu";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <ContentLogin />
          </Route>

          <Route
            path="/home"
            exact
            render={() => {
              return <Home />;
            }}
          />

          <Route
            path="/usuarioRegistro"
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <UsuarioRegistro />
                </div>
              );
            }}
          />

          <Route
            path="/usuarioActualizar"
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <UsuarioActualizar />
                </div>
              );
            }}
          />

          <Route
            path="/listarUsuarios"
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <ListarUsuarios />
                </div>
              );
            }}
          />

          <Route
            path="/listarProyectos"
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <ListarProyectos />
                </div>
              );
            }}
          />

          <Route path="/SinAutorizacion" exact>
            <SinAutorizacion />
          </Route>

          <Route path="/error" exact>
            <Error />
          </Route>

          <Redirect to="/error" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
