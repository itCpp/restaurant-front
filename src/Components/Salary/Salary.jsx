import React from "react";
import { Header, Icon, Loader, Message } from "semantic-ui-react";
import { axios, moment, ucFirst } from "../../system";
import Shedule from "../Employees/Shedule";
import SalaryTable from "./SalaryTable";

const Salary = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [month, setMonth] = React.useState(moment().subtract('days', 5).format("YYYY-MM"));

    React.useEffect(() => {

        setLoading(true);

        axios.post('employees/salary', { month })
            .then(({ data }) => {
                setRows(data.rows || []);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => setLoading(false));

    }, [month]);

    return <div className="px-2 py-1">

        <Shedule
            month={month}
        />

        <div className="mt-3 d-flex align-items-center justify-content-center">
            <span>
                <Icon
                    name="chevron left"
                    size="large"
                    link={!loading}
                    disabled={loading}
                    className="ms-0 me-3"
                    onClick={() => {
                        setMonth(p => moment(p || new Date).subtract('months', 1).format("YYYY-MM"))
                    }}
                />
            </span>
            <Header
                content={ucFirst(moment(month || new Date).format("MMMM YYYY"))}
                as="h2"
                className="m-0"
            />
            <span>
                <Icon
                    name="chevron right"
                    size="large"
                    link={!loading}
                    disabled={loading}
                    className="ms-3 me-0"
                    onClick={() => {
                        setMonth(p => moment(p || new Date).add('months', 1).format("YYYY-MM"))
                    }}
                />
            </span>
        </div>

        {loading && <Loader active inline="centered" className="mt-3" />}

        {!loading && error && <Message
            error
            content={error}
            style={{ maxWidth: 500 }}
            size="mini"
            className="mx-auto mt-3"
        />}

        {!loading && !error && <SalaryTable
            rows={rows}
        />}

    </div>
}

export default Salary;