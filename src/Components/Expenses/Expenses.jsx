import { axios } from "../../system";
import React from "react";
import { Loader } from "semantic-ui-react";
import ExpenseAdd from "./ExpenseAdd";
import ExpenseTable from "./ExpenseTable";
import ExpenseFiles from "./ExpenseFiles";
import { useSelector } from "react-redux";

const Expenses = () => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [showFiles, setShowFiles] = React.useState(false);
    const [page, setPage] = React.useState(null);
    const { search } = useSelector(s => s.expenses);

    const getRows = React.useCallback(param => {

        axios.post('expenses', param || {})
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(e => { })
            .then(() => {
                setLoading(false);
                setLoad(false);
            });

    }, []);

    const scrollHandle = React.useCallback((e) => {

        const height = document.getElementById('root').offsetHeight;
        const screenHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const threshold = height - screenHeight / 4;
        const position = scrolled + screenHeight;

        if (threshold >= position || load) return;

        setPage(p => (p || 1) + 1);

    }, [page, load]);

    React.useEffect(() => {

        getRows({ page: 1, search });

        document.addEventListener('scroll', scrollHandle);

        return () => {

            setPage(null);
            setLoading(true);

            document.removeEventListener('scroll', scrollHandle);
        }

    }, [search]);

    // React.useEffect(() => {
    //     if (Boolean(page)) {
    //         setLoad(true);
    //         getRows({ page });
    //     }
    // }, [page]);

    return <div>

        <ExpenseAdd setRows={setRows} />

        <ExpenseFiles
            setRows={setRows}
            show={showFiles}
            setShowFiles={setShowFiles}
        />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && rows.length === 0 && <div className="mt-4 text-center">
            <strong className="opacity-40">{search ? "Ничего не найдено" : "Данных ещё нет"}</strong>
        </div>}

        {!loading && rows.length > 0 && <ExpenseTable
            rows={rows}
            setShowFiles={setShowFiles}
        />}

    </div>
}

export default Expenses;