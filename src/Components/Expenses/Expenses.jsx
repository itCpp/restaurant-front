import { axios } from "../../system";
import React from "react";
import { Loader } from "semantic-ui-react";
import ExpenseAdd from "./ExpenseAdd";

const Expenses = props => {

    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const getRows = React.useCallback(() => {

        setLoading(true);

        axios.post('expenses')
            .then(() => { })
            .catch(e => { })
            .then(() => {
                setLoading(false);
            });

    }, []);

    React.useEffect(() => {

        getRows();

    }, []);

    return <div>

        <ExpenseAdd />

        {loading && <Loader inline="centered" active className="mt-4" />}

    </div>
}

export default Expenses;