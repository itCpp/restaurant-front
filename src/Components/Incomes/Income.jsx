import React from "react";
import { useSelector } from "react-redux";
import { axios } from "../../system";
import { Loader } from "semantic-ui-react";
import IncomeTable from "./IncomeTable";
import IncomeAdd from "./IncomeAdd";

const Income = props => {

    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const getIncomes = React.useCallback(() => {

        setLoading(true);

        axios.get('incomes')
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(() => { })
            .then(() => {
                setLoading(false);
            });

    }, []);

    React.useEffect(() => {

        getIncomes();

    }, []);

    return <div className="p-2">

        <IncomeAdd setRows={setRows} />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && rows.length === 0 && <div className="mt-4 text-center">
            <strong className="opacity-40">Данных ещё нет</strong>
        </div>}

        {!loading && rows.length > 0 && <IncomeTable rows={rows} />}

    </div>
}

export default Income;