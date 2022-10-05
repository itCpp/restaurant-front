import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../system";

const Salary = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);
        axios.post('employees/salary')
            .then(({ data }) => {

            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => setLoading(false));
    }, []);

    return <div className="px-2 py-1">

        {loading && <Loader active inline="centered" className="mt-3" />}

        {!loading && error && <Message
            error
            content={error}
            style={{ maxWidth: 500 }}
            size="mini"
            className="mx-auto mt-3"
        />}

    </div>
}

export default Salary;