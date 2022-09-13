import React from "react";
import { useSelector } from "react-redux";
import { axios } from "../../system";
import { Loader } from "semantic-ui-react";
import IncomeTable from "./IncomeTable";
import IncomeAdd from "./IncomeAdd";
import IncomeSourceAdd from "./IncomeSourceAdd";
import IncomesView from "./IncomesView";
import IncomePartAdd from "./IncomePartAdd";
import { useParams } from "react-router-dom";

const Income = () => {

    const { id } = useParams();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const getIncomes = React.useCallback(() => {

        setLoading(true);

        axios.get('incomes', { params: { id } })
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(() => { })
            .then(() => {
                setLoading(false);
            });

    }, [id]);

    React.useEffect(() => {

        getIncomes();

    }, [id]);

    return <div className="p-2">

        <IncomeAdd setRows={setRows} />
        <IncomePartAdd setRows={setRows} />
        <IncomeSourceAdd setRows={setRows} />
        <IncomesView />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && rows.length === 0 && <div className="mt-4 text-center">
            <strong className="opacity-40">Данных ещё нет</strong>
        </div>}

        {!loading && rows.length > 0 && <IncomeTable rows={rows} />}

    </div>
}

export default Income;