import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { Dropdown, Icon, Table } from "semantic-ui-react";
import { setShowAdd } from "../../store/expenses/actions";
import { axios } from "../../system";

const ExpenseTable = props => {

    const { rows } = props;

    return <div className="p-2">

        <Table compact>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Наименование</Table.HeaderCell>
                    <Table.HeaderCell>Тип</Table.HeaderCell>
                    <Table.HeaderCell>Сумма</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows.map(row => <ExpenseTableRow key={row.id} row={row} />)}
            </Table.Body>

        </Table>
    </div>
}

// const trigger = <Icon name="ellipsis vertical" link />

const ExpenseTableRow = props => {

    const dispatch = useDispatch();
    const { row } = props;
    const [deleted, setDeleted] = React.useState(Boolean(row.deleted_at));
    const [drop, setDrop] = React.useState(false);

    React.useEffect(() => {

        if (drop) {

            axios.post('expenses/drop', { id: row.id })
                .then(() => setDeleted(true))
                .catch(e => null)
                .then(() => setDrop(false));
        }

    }, [drop]);

    return <Table.Row disabled={Boolean(row.deleted_at) || deleted}>

        <Table.Cell>{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</Table.Cell>

        <Table.Cell>
            <div>{row.name_type || row.name}</div>
            {Boolean(row.name_type) && Boolean(row.name) && <div>
                <small>{row.name}</small>
            </div>}
        </Table.Cell>

        <Table.Cell>{row.type}</Table.Cell>

        <Table.Cell>{row.sum}</Table.Cell>

        <Table.Cell textAlign="center">
            {/* <Dropdown
                trigger={trigger}
                icon={null}
                pointing='top right'
                options={[
                    {
                        key: "pencil",
                        icon: "pencil",
                        content: "Изменить",
                        onClick: () => dispatch(setShowAdd(row)),
                    },
                    {
                        key: "trash",
                        icon: "trash",
                        content: "Удалить",
                    }
                ]}
            /> */}
            <Icon
                name="pencil"
                title="Изменить"
                onClick={() => dispatch(setShowAdd(row))}
                link
            />
            {!deleted && <Icon
                name="trash"
                color="red"
                title="Удалить"
                link={!drop}
                disabled={drop}
                onClick={() => setDrop(true)}
            />}
        </Table.Cell>

    </Table.Row>

}

export default ExpenseTable;