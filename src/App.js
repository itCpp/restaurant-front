import React from "react";
import { axios } from "./system";
import { Dimmer, Loader } from "semantic-ui-react";
import "./styles/bootstrap-utilites.min.css";
import "./App.css";

function App() {

  const [loading, setLoading] = React.useState(true);
  const [login, setLogin] = React.useState(false);

  React.useEffect(() => {
    
    axios.get('user')
    .then(() => {
      setLogin(false);
    })
    .catch(e => {

    })
    .then(() => setLoading(false));

  }, []);

  console.log(process.env);

  return <div className="App">

    <Dimmer active={loading} inverted><Loader /></Dimmer>

  </div>
}

export default App;
