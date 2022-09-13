import React from "react";
import { Button, Loader, Message, Table } from "semantic-ui-react";
import { axios } from "../../system";
import EmployeeAdd from "./EmployeeAdd";

const Employees = props => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [add, setAdd] = React.useState(false);

    const isError = !loading && error;
    const isOk = !loading && !error;

    React.useEffect(() => {

        setLoading(true);

        axios.post('employees')
            .then(({ data }) => { })
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false));

        return () => {
            setError(null);
            setRows([]);
        }

    }, []);

    return <div className="p-2">

        <EmployeeAdd
            show={add}
            close={() => setAdd(false)}
        />

        {loading && <Loader active inline="centered" />}

        {isError && <Message error content={error} style={{ maxWidth: 500 }} className="mx-auto" size="mini" />}

        {isOk && <Table basic="very" className="mt-2">

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>ФИО</Table.HeaderCell>
                    <Table.HeaderCell>Должность</Table.HeaderCell>
                    <Table.HeaderCell>Телефон</Table.HeaderCell>
                    <Table.HeaderCell>График работы</Table.HeaderCell>
                    <Table.HeaderCell>Период работы</Table.HeaderCell>
                    <Table.HeaderCell>Оклад</Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button
                            icon="plus"
                            basic
                            size="tiny"
                            onClick={() => setAdd(true)}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

        </Table>}

    </div>
}

export default Employees;