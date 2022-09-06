import React from "react";
import { axios } from "../../system";
import { Loader } from "semantic-ui-react";
import ChartIncomesExpenses from "./ChartIncomesExpenses";
import Logout from "../Auth/Logout";

const Main = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [chart, setChart] = React.useState([]);

    React.useEffect(() => {

        setLoading(true);

        axios.get('main')
            .then(({ data }) => {
                setChart(data.chart);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => {
                setLoading(false);
            });

        return () => {
            setError(null);
            setChart([]);
        }

    }, []);

    return <div>

        {loading && <Loader active inline="centered" className="mt-4" />}

        {!loading && error && <div className="text-center mt-4 text-danger">
            <b>Ошибка</b>{' '}<span>{error}</span>
        </div>}

        {!loading && !error && <>

            <ChartIncomesExpenses data={chart} />

            <div className="mt-4 text-center">
                <Logout />
            </div>

        </>}

    </div>
}

export default Main;