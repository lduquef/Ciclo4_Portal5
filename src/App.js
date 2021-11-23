import logo from './logo.svg';
import {BrowserRouter as Router,
  Switch,
  Redirect,
  Route,} from "react-router-dom";
import './App.css';

function App() {
  return (
<div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <ContentLogin />
            <Header />
          </Route>

          <Route
            path="/home"
            render={() => {
              if (estado === "Autorizado") {
                return (
                  <div>
                    <Header />
                    <ContentHome />
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
