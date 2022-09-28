import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../system";
import CashboxData from "./CashboxData";

const Cashbox = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [load, setLoad] = React.useState(true);
    const [rows, setRows] = React.useState([]);

    const getRows = param => {

        setLoad(true);

        axios.post('cashbox', param || {})
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => {
                setLoading(false);
                setLoad(false);
            });
    }

    React.useEffect(() => {

        getRows();

        return () => {
            setLoading(true);
        }

    }, []);

    return <div className="px-2 py-1">

        {loading && <Loader active inline="centered" className="mt-3" />}

        {!loading && error && <Message
            error
            content={error}
            size="mini"
            className="mx-auto"
            style={{ maxWidth: 500 }}
        />}

        {!loading && !error && rows.length > 0 && <CashboxData
            rows={rows}
            setRows={setRows}
        />}

    </div>
}

export default Cashbox;