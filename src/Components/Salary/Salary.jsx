import React from "react";
import { useSelector } from "react-redux";
import { Header, Icon, Loader, Message } from "semantic-ui-react";
import { axios, moment, ucFirst } from "../../system";
import Shedule from "../Employees/Shedule";
import SalaryAdd from "./SalaryAdd";
import SalaryMore from "./SalaryMore";
import SalaryTable from "./SalaryTable";

export const getPeriodDatStartFromDate = (date = null) => {
    const m = moment(date || new Date);
    let day = Number(m.format("DD"));
    return m.format(`YYYY-MM-${day >= 16 ? '16' : '01'}`);
}

const Salary = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [month, setMonth] = React.useState(moment().subtract(5, 'days').format("YYYY-MM"));
    const [period, setPeriod] = React.useState(
        getPeriodDatStartFromDate(moment().subtract(5, 'days').format("YYYY-MM-DD"))
    );
    const [update, setUpdate] = React.useState(false);
    const shedule = useSelector(s => s.main.showShedule);
    const salary = useSelector(s => s.main.showEmployeeAddPay);
    const [load, setLoad] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('employees/salary', { month })
            .then(({ data }) => {
                setRows(data.rows || []);
                setError(null);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => setLoading(false));

    }, [month, update]);

    React.useEffect(() => {

        const a = shedule || salary;

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

    }, [shedule, salary]);

    return <div className="px-2 py-1">

        <SalaryMore />

        <Shedule month={month} />

        <SalaryAdd month={month} />

        <div className="mt-3 d-flex align-items-center justify-content-center">
            <span>
                <Icon
                    name="chevron left"
                    size="large"
                    link={!loading}
                    disabled={loading}
                    className="ms-0 me-3"
                    onClick={() => {
                        // setPeriod(p => {
                        //     const m = moment(p || new Date);
                        //     const d = Number(m.format("DD"));

                        //     if (d >= 16) m.set({ date: 1 });
                        //     else m.subtract(1, 'months').set({ date: 16 });

                        //     setMonth(m.format("YYYY-MM"));
                        //     return m.format("YYYY-MM-DD");
                        // })
                        setMonth(p => moment(p || new Date).subtract(1, 'months').format("YYYY-MM"))
                    }}
                />
            </span>
            <Header
                content={ucFirst(moment(month || new Date).format("MMMM YYYY"))}
                // subheader={`${Number(moment(period || new Date).format("DD")) >= 16 ? "2" : "1"} период`}
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
                        // setPeriod(p => {
                        //     const m = moment(p || new Date);
                        //     const d = Number(m.format("DD"));

                        //     if (d < 16) m.set({ date: 16 });
                        //     else m.add(1, 'months').set({ date: 1 });

                        //     setMonth(m.format("YYYY-MM"));
                        //     return m.format("YYYY-MM-DD");
                        // })
                        setMonth(p => moment(p || new Date).add(1, 'months').format("YYYY-MM"))
                    }}
                />
            </span>
            <span>
                <Icon
                    name="redo alternate"
                    size="large"
                    link={!loading}
                    disabled={loading}
                    className="ms-3 me-0"
                    onClick={() => setUpdate(p => !p)}
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