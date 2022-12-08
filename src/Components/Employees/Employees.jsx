import React from "react";
import { Button, Loader, Message, Table } from "semantic-ui-react";
import { axios } from "../../system";
import EmployeeAdd from "./EmployeeAdd";
import EmployeesTableRow from "./EmployeesTableRow";
import EmployeeEdit from "./EmployeeEdit";
import Shedule from "./Shedule";

const Employees = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [add, setAdd] = React.useState(false);
    const [edit, setEdit] = React.useState(null);

    const isError = !loading && error;
    const isOk = !loading && !error;

    const handleRows = React.useCallback(row => setRows(p => {
        let rows = [...p],
            added = true;
        rows.forEach((item, i) => {
            if (item.id === row.id) {
                rows[i] = row;
                added = false;
            }
        });
        added && rows.unshift(row);
        return rows;
    }));

    React.useEffect(() => {

        setLoading(true);

        axios.post('employees')
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false));

        return () => {
            setError(null);
            setLoading(true);
            setRows([]);
        }

    }, []);

    return <div className="p-2">

        <EmployeeAdd
            show={add}
            close={() => setAdd(false)}
            handleRows={handleRows}
        />

        <EmployeeEdit
            show={Boolean(edit)}
            data={edit}
            close={() => setEdit(null)}
            handleRows={handleRows}
        />

        <Shedule />

        {loading && <Loader active inline="centered" />}

        {isError && <Message error content={error} style={{ maxWidth: 500 }} className="mx-auto" size="mini" />}

        {isOk && <Table className="mt-2" celled selectable>

            <Table.Header>
                <Table.Row textAlign="center">
                    {/* <Table.HeaderCell /> */}
                    <Table.HeaderCell>ФИО</Table.HeaderCell>
                    <Table.HeaderCell>Должность</Table.HeaderCell>
                    <Table.HeaderCell>Телефон</Table.HeaderCell>
                    <Table.HeaderCell>График работы</Table.HeaderCell>
                    <Table.HeaderCell>Период работы</Table.HeaderCell>
                    <Table.HeaderCell>Оклад</Table.HeaderCell>
                    <Table.HeaderCell className="px-0">
                        <Button
                            icon="plus"
                            basic
                            size="tiny"
                            onClick={() => setAdd(true)}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            {rows.length > 0 && <Table.Body>
                {rows.map(row => <EmployeesTableRow
                    key={row.id}
                    row={row}
                    setEdit={setEdit}
                    setRows={setRows}
                />)}
            </Table.Body>}

        </Table>}

    </div>
}

export default Employees;