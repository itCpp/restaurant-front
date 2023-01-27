import React from "react";
import { axios } from "../../system";
import { Loader } from "semantic-ui-react";
import ParkingTable from "./ParkingTable";
import ParkingPlaceAdd from "./ParkingPlaceAdd";
import ParkingSourceAdd from "./ParkingSourceAdd";

const ParkingMain = props => {

    const { id } = props;
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const getRows = React.useCallback(() => {

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

        getRows();

        return () => {
            setRows([]);
        }

    }, [id]);

    return <div className="p-2">

        <ParkingPlaceAdd setRows={setRows} />
        <ParkingSourceAdd setRows={setRows} />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && rows.length === 0 && <div className="mt-4 text-center">
            <strong className="opacity-40">Данных ещё нет</strong>
        </div>}

        {!loading && rows.length > 0 && <ParkingTable rows={rows} setRows={setRows} />}

    </div>
}

export default ParkingMain;