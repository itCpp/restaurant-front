import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../system";
import CashboxData from "./CashboxData";
import _ from "lodash"
import CashboxRowEdit from "./CashboxRowEdit";
import { useSelector } from "react-redux";
import CashboxCalendar from "./CashboxCalendar";

const Cashbox = () => {

    const { calendar } = useSelector(s => s.cashbox);

    return Boolean(calendar) ? <CashboxCalendar /> : <CashboxRows />;

}

const CashboxRows = () => {

    const { search } = useSelector(s => s.cashbox);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [load, setLoad] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [stats, setStats] = React.useState({});

    const [page, setPage] = React.useState(null);
    const [pages, setPages] = React.useState(null);
    const [end, setEnd] = React.useState(false);

    const getRows = (param = {}) => {

        if (load || (end && !(Boolean(param?._start))) || (typeof pages == "number" && pages < Number(param?.page))) return;

        setLoad(true);

        axios.post('cashbox', { search, ...(param || {}) })
            .then(({ data }) => {
                setRows(p => Number(data.page) > 1 ? [...p, ...data.rows] : data.rows);
                setPage(data.page || null);
                setEnd(data.end);
                setPages(data.pages);
                setStats(p => ({ ...p, ...data.statistics }));
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => {
                setLoading(false);
                setLoad(false);
            });
    }

    React.useEffect(() => {

        setTimeout(() => getRows({ _start: true, search, page: 1 }), 500);

        return () => {
            setLoading(true);
            setPage(null);
            setPages(null);
            setEnd(false);
            setError(null);
        }

    }, [search]);

    React.useEffect(() => {

        const scrollHandle = _.throttle(() => {

            const height = document.getElementById('root').offsetHeight;
            const screenHeight = window.innerHeight;
            const scrolled = window.scrollY;
            const threshold = height - screenHeight / 4;
            const position = scrolled + screenHeight;

            if (end || load || !page || threshold >= position) return;

            getRows({ page: (page || 1) + 1 });
        }, 700);

        window.addEventListener('scroll', scrollHandle);

        return () => {
            window.removeEventListener('scroll', scrollHandle);
        }

    }, [page, load, end]);

    return <div className="px-2 py-1">

        <CashboxRowEdit setRows={setRows} setStats={setStats} />

        {loading && <Loader active inline="centered" className="mt-3" />}

        {!loading && error && <Message
            error
            content={error}
            size="mini"
            className="mx-auto"
            style={{ maxWidth: 500 }}
        />}

        {!loading && !error && rows.length === 0 && <div className="text-center my-4 opacity-50"><b>Ничего не найдено</b></div>}

        {!loading && !error && rows.length > 0 && <CashboxData
            rows={rows}
            setRows={setRows}
            loading={!loading && load}
            end={end}
            stats={stats}
        />}

    </div>
}

export default Cashbox;