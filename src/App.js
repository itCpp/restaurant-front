import React from "react";
import { axios } from "./system";
import { Dimmer, Loader } from "semantic-ui-react";
import "./styles/bootstrap-utilites.min.css";
import "./App.css";
import Login from "./Components/Auth/Login";

function App() {

  const [loading, setLoading] = React.useState(true);
  const [login, setLogin] = React.useState(false);

  React.useEffect(() => {

    setLoading(true);

    axios.get('user')
      .then(({ data }) => {
        setLogin(data);
      })
      .catch(e => {

      })
      .then(() => setLoading(false));

  }, []);

  if (!Boolean(login) && !loading)
    return <Login setLogin={setLogin} />

  return <div>

    <Dimmer active={loading} inverted><Loader /></Dimmer>

  </div>
}

export default App;
