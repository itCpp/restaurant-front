import React from "react";
import { useSelector } from "react-redux";
import { Header, Icon, Loader, Message } from "semantic-ui-react";
import { axios, moment, ucFirst } from "../../system";
import Shedule from "../Employees/Shedule";
import SalaryMore from "./SalaryMore";
import SalaryTable from "./SalaryTable";

const Salary = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [month, setMonth] = React.useState(moment().subtract('days', 5).format("YYYY-MM"));
    const shedule = useSelector(s => s.main.showShedule);
    const [load, setLoad] = React.useState(null);

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

    React.useEffect(() => {

        const a = shedule;

        return () => {

            if (!Boolean(a?.id)) return;

            setLoad(a?.id);

            axios.post('employees/salary', { month, id: a?.id })
                .then(({ data }) => {
                    setRows(p => {
                        let rows = [];
                        p.forEach(r => {
                            let fund = data.rows.find(i => i.id === r.id);
                            if (fund) r = { ...r, ...fund }
                            rows.push(r);
                        })
                        return rows;
                    });
                })
                .catch(() => null)
                .then(() => setLoad(null));
        }

    }, [shedule]);

    return <div className="px-2 py-1">

        <SalaryMore />

        <Shedule month={month} />

        <div className="mt-3 d-flex align-items-center justify-content-center">
            <span>
                <Icon
                    name="chevron left"
                    size="large"
                    link={!loading}
                    disabled={loading}
                    className="ms-0 me-3"
                    onClick={() => {
                        setMonth(p => moment(p || new Date).subtract(1, 'months').format("YYYY-MM"))
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
                        setMonth(p => moment(p || new Date).add(1, 'months').format("YYYY-MM"))
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
            load={load}
        />}

    </div>
}

export default Salary;