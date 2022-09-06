import React from "react";
import { Button, Dimmer, Form, Loader } from "semantic-ui-react";
import { axios } from "../../system";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../store/actions";

const Login = () => {

    const dispatch = useDispatch();
    const setLogin = React.useCallback(data => {
        dispatch(setIsLogin(data));
    }, []);

    const [formdata, setFormdata] = React.useState({});
    const [auth, setAuth] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        return () => {
            setFormdata({});
            setAuth(false);
            setError(null);
        }

    }, []);

    React.useEffect(() => {

        if (auth) {

            axios.post('user/auth', formdata)
                .then(({ data }) => {

                    let hostname = process.env.REACT_APP_API_COOKIE_DOMAIN || window.location.hostname;
                    let tokenKey = process.env.REACT_APP_TOKEN_KEY || "crm_ard_token";

                    Cookies.set(tokenKey, data.token, { expires: 2, domain: hostname });
                    localStorage.setItem(tokenKey, data.token);

                    setLogin(data.user);
                })
                .catch(e => {
                    setAuth(false);
                    setError(axios.getError(e));
                });

        }

    }, [auth]);

    return <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
    }} className="d-flex justify-content-center align-items-start p-3">

        <Dimmer.Dimmable blurring dimmed={auth}
            style={{
                width: "100%",
                maxWidth: 300,
                background: "#ffffff",
                borderRadius: "0.5rem",
            }}
        >

            <h3 className="text-center mt-3 mb-1">Аторизация</h3>

            <Form className="p-3">

                <Form.Field className="mx-2 mb-2">
                    <Form.Input
                        label="Логин"
                        placeholder="Введите логин"
                        value={formdata.login || ""}
                        onChange={(e, { value }) => setFormdata(p => ({ ...p, login: value }))}
                        error={Boolean(error)}
                    />
                </Form.Field>

                <Form.Field className="mx-2">
                    <Form.Input
                        label="Пароль"
                        placeholder="Введите пароль"
                        value={formdata.password || ""}
                        onChange={(e, { value }) => setFormdata(p => ({ ...p, password: value }))}
                        error={Boolean(error)}
                        type="password"
                    />
                </Form.Field>

                <div className="px-2">
                    <Button
                        content="Войти"
                        fluid
                        className="mt-3"
                        disabled={!Boolean(formdata?.login) || !Boolean(formdata?.password)}
                        onClick={() => setAuth(true)}
                    />
                </div>

                {error && <div style={{ position: "absolute", top: "100%" }} className="px-2 text-danger"><b>{error}</b></div>}

            </Form>

            <Dimmer active={auth} inverted>
                <Loader />
            </Dimmer>

        </Dimmer.Dimmable>

    </div>
}

export default Login;
