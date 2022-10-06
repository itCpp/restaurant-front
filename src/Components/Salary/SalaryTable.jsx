import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, Icon, Table } from "semantic-ui-react";
import { setShowShedule } from "../../store/actions";

const SalaryTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();
    const [stat, setStat] = useState(null);

    useEffect(() => {

        let counter = {
            toPayoff: 0,
            prepayment: 0,
            debt: 0,
            balance: 0,
        }

        rows.forEach(r => {
            counter.toPayoff += Number(r.toPayoff || 0);
            counter.prepayment += Number(r.prepayment || 0);
            counter.debt += Number(r.debt || 0);
            counter.balance += Number(r.balance || 0);
        });

        setStat(counter);

    }, [rows]);

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

            {rows.length > 0 && Boolean(stat) && <Table.Row active textAlign="center">
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell content={stat.toPayoff}/>
                <Table.Cell content={stat.debt}/>
                <Table.Cell content={stat.prepayment}/>
                <Table.Cell content={stat.balance}/>
                <Table.Cell />
            </Table.Row>}

            {rows.map(row => <SalaryTableRow
                key={row.id}
                {...props}
                row={row}
                dispatch={dispatch}
            />)}

            {rows.length === 0 && <Table.Row>
                <Table.Cell disabled colSpan={9}>
                    <div className="text-center py-4">Данных еще нет</div>
                </Table.Cell>
            </Table.Row>}

        </Table.Body>

    </Table>
}

const SalaryTableRow = props => {

    const { row, dispatch, load } = props;

    return <Table.Row textAlign="center" negative={row.is_fired} disabled={load === row.id}>
        <Table.Cell>{row.pin}</Table.Cell>
        <Table.Cell textAlign="left">{row.fullname}</Table.Cell>
        <Table.Cell><small className="opacity-70">{row.job_title}</small></Table.Cell>
        <Table.Cell>{row.salary}{row.salary_one_day ? "/день" : ""}</Table.Cell>
        <Table.Cell>{row.toPayoff || 0}</Table.Cell>
        <Table.Cell>{0}</Table.Cell>
        <Table.Cell>{row.prepayment || 0}</Table.Cell>
        <Table.Cell>
            <strong className={`${load === row.id ? "opacity-40" : ((row.balance || 0) > 0 ? "text-success" : ((row.balance || 0) < 0 ? "text-danger" : ""))}`}>{row.balance || 0}</strong>
        </Table.Cell>
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