import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ContentLogin from "./Componentes/ContentLogin";
import SinAutorizacion from "./Componentes/SinAutorizacion";
import Home from "./Componentes/Home";
import Error from "./Componentes/Error";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
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
            render={() => {
              return <Home />;
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
