import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../system";
import IncomeAdd from "../Incomes/IncomeAdd";
import IncomeSourceAdd from "../Incomes/IncomeSourceAdd";
import IncomesView from "../Incomes/IncomesView";
import LegalAddressTable from "./LegalAddressTable";

const LegalAddress = props => {

    const { id } = props;
    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [error, setError] = React.useState(null);

    const getRows = React.useCallback(() => {

        setLoading(true);

        axios.get('incomes', { params: { id } })
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => {
                setLoading(false);
            });

    }, [id]);

    React.useEffect(() => {

        getRows();

        return () => {
            setRows([]);
            setLoading(true);
            setError(null);
        }

    }, [id]);

    return <div className="p-2">

        <IncomeAdd setRows={setRows} />
        <IncomesView setSourceRows={setRows} />
        <IncomeSourceAdd setRows={setRows} />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && rows.length === 0 && !error && <div className="mt-4 text-center">
            <strong className="opacity-40">Данных ещё нет</strong>
        </div>}

        {!loading && error && <Message
            error
            content={error}
            style={{ maxWidth: 500 }}
            className="mx-auto"
            size="mini"
        />}

        {!loading && !error && rows.length > 0 && <LegalAddressTable rows={rows} />}

    </div>
}

export default LegalAddress;