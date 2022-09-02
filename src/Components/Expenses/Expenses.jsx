import { axios } from "../../system";
import React from "react";
import { Loader } from "semantic-ui-react";
import ExpenseAdd from "./ExpenseAdd";
import ExpenseTable from "./ExpenseTable";
import ExpenseFiles from "./ExpenseFiles";

const Expenses = () => {

    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [showFiles, setShowFiles] = React.useState(false);

    const getRows = React.useCallback(() => {

        setLoading(true);

        axios.post('expenses')
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(e => { })
            .then(() => {
                setLoading(false);
            });

    }, []);

    React.useEffect(() => {

        getRows();

    }, []);

    return <div>

        <ExpenseAdd setRows={setRows} />

        <ExpenseFiles
            setRows={setRows}
            show={showFiles}
            setShowFiles={setShowFiles}
        />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && rows.length === 0 && <div className="mt-4 text-center">
            <strong className="opacity-40">Данных ещё нет</strong>
        </div>}

        {!loading && rows.length > 0 && <ExpenseTable
            rows={rows}
            setShowFiles={setShowFiles}
        />}

    </div>
}

export default Expenses;