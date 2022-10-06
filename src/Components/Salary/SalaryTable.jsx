import { useDispatch } from "react-redux";
import { Dropdown, Icon, Table } from "semantic-ui-react";
import { setShowShedule } from "../../store/actions";

const SalaryTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();

    return <Table className="mx-auto" style={{ maxWidth: 1000 }} compact>

        <Table.Header>
            <Table.Row textAlign="center">
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="left">ФИО</Table.HeaderCell>
                <Table.HeaderCell>Должность</Table.HeaderCell>
                <Table.HeaderCell>Оклад</Table.HeaderCell>
                <Table.HeaderCell>Зарплата</Table.HeaderCell>
                <Table.HeaderCell>Долг</Table.HeaderCell>
                <Table.HeaderCell>Аванс</Table.HeaderCell>
                <Table.HeaderCell>Остаток</Table.HeaderCell>
                <Table.HeaderCell />
            </Table.Row>
        </Table.Header>

        <Table.Body>

            {rows.map(row => <SalaryTableRow
                key={row.id}
                {...props}
                row={row}
                dispatch={dispatch}
            />)}

        </Table.Body>

    </Table>
}

const SalaryTableRow = props => {

    const { row, dispatch } = props;

    return <Table.Row textAlign="center" negative={row.is_fired}>
        <Table.Cell>{row.pin}</Table.Cell>
        <Table.Cell textAlign="left">{row.fullname}</Table.Cell>
        <Table.Cell><small className="opacity-70">{row.job_title}</small></Table.Cell>
        <Table.Cell>{row.salary}{row.salary_one_day ? "/день" : ""}</Table.Cell>
        <Table.Cell>{row.toPayoff || 0}</Table.Cell>
        <Table.Cell>{0}</Table.Cell>
        <Table.Cell>{row.prepayment || 0}</Table.Cell>
        <Table.Cell
            positive={(row.balance || 0) > 0}
            negative={(row.balance || 0) < 0}
            content={row.balance || 0}
        />
        <Table.Cell
            content={<Dropdown
                direction="left"
                pointing="right"
                icon={null}
                trigger={<Icon
                    name="ellipsis vertical"
                    link
                    fitted
                />}
            >
                <Dropdown.Menu>
                    <Dropdown.Item
                        icon="calendar alternate"
                        content="График работы"
                        onClick={() => dispatch(setShowShedule(row))}
                    />
                    <Dropdown.Item
                        icon="plus"
                        content="Добавить выплату"
                        disabled
                    />
                    <Dropdown.Item
                        icon="info"
                        content="Подробнее"
                        disabled
                    />
                </Dropdown.Menu>
            </Dropdown>}
        />
    </Table.Row>
}

export default SalaryTable;