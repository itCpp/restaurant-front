import React from "react";
import { axios } from "./system";
import { Dimmer, Loader } from "semantic-ui-react";
import "./styles/bootstrap-utilites.min.css";
import "./App.css";
import Login from "./Components/Auth/Login";
import Error from "./Components/Errors/Error";
import Crm from "./Components/Crm";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./store/actions";

function App() {

  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [login, setLogin] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {

    setLoading(true);

    axios.get('user')
      .then(({ data }) => {
        setLogin(data);
        dispatch(setUserData(data));
      })
      .catch(e => {
        let status = e?.response?.status || 0;

        if (status === 401)
          return;

        setError(e?.response || {});
      })
      .then(() => setLoading(false));

  }, []);

  if (!loading && Boolean(error))
    return <Error data={error} />

  if (!Boolean(login) && !loading)
    return <Login setLogin={setLogin} />

  return <div>

    {!loading && <Crm />}

    <Dimmer active={loading} inverted>
      <Loader />
    </Dimmer>

  </div>
}

export default App;
