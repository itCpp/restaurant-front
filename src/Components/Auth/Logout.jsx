import React from "react";
import { useDispatch } from "react-redux";
import { Button, Dimmer, Form, Loader } from "semantic-ui-react";
import { axios } from "../../system";
import { setIsLogin, setUserData } from "../../store/actions";


const Logout = () => {

    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        if (loading) {
            axios.get('user/logout')
                .then(() => {
                    dispatch(setIsLogin(false));
                    dispatch(setUserData(false));
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => {
                    setLoading(false);
                });
        }
    }, [loading]);

    return <Button
        content="Выход"
        icon="log out"
        labelPosition="right"
        color={error ? "red" : null}
        onClick={() => setLoading(true)}
        loading={loading}
    />
}

export default Logout;