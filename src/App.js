import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ContentLogin from "./componentes/ContentLogin";
import SinAutorizacion from "./componentes/SinAutorizacion";
import Home from "./componentes/Home";
import Error from "./componentes/Error";
import UsuarioRegistro from "./Usuario/paginas/UsuarioRegistro";
import UsuarioActualizar from "./Usuario/paginas/UsuarioActualizar";
import ListarUsuarios from "./Usuario/paginas/ListarUsuarios";
import ListarProyectos from "./Proyecto/paginas/ListarProyectos";
import ListarAvancesProyecto from "./Proyecto/paginas/ListarAvancesProyecto";
import CrearAvance from "./Proyecto/paginas/CrearAvance";
import ProyectoRegistro from "./Proyecto/paginas/ProyectoRegistro";
import ListarSolicitudes from "./Solicitudes/paginas/ListarSolicitudes";
import SolicitudRegistro from "./Solicitudes/paginas/SolicitudRegistro";
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
              if (localStorage.getItem("estado") === "AUTORIZADO") {
                return (
                  <div>
                    <Home />
                  </div>
                );
              } else {
                return <Redirect to="/SinAutorizacion" />;
              }
            }}
          />

          <Route
            path="/usuarioRegistro"
            exact
            render={() => {
              return (
                <div>
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

          <Route
            path="/ListarAvancesProyecto" //MVH
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <ListarAvancesProyecto />
                </div>
              );
            }}
          />

          <Route
            path="/CrearAvance" //MVH
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <CrearAvance />
                </div>
              );
            }}
          />

          <Route
            path="/proyectoRegistro"
            exact
            render={() => {
              if (
                localStorage.getItem("estado") === "AUTORIZADO" &&
                localStorage.getItem("rol") === "LIDER"
              ) {
                return (
                  <div>
                    <Menu />
                    <ProyectoRegistro />
                  </div>
                );
              } else {
                return <Redirect to="/SinAutorizacion" />;
              }
            }}
          />

          <Route
            path="/listarSolicitudes"
            exact
            render={() => {
              return (
                <div>
                  <Menu />
                  <ListarSolicitudes />
                </div>
              );
            }}
          />

          <Route
            path="/solicitudRegistro"
            exact
            render={() => {
              if (
                localStorage.getItem("estado") === "AUTORIZADO" &&
                localStorage.getItem("rol") === "ESTUDIANTE"
              ) {
                return (
                  <div>
                    <Menu />
                    <SolicitudRegistro />
                  </div>
                );
              } else {
                return <Redirect to="/SinAutorizacion" />;
              }
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
