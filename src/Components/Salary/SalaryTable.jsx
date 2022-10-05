import { Table } from "semantic-ui-react";

const SalaryTable = props => {

    const { rows } = props;

    return <Table className="mx-auto" style={{ maxWidth: 1000 }} compact>

        <Table.Header>
            <Table.Row textAlign="center">
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="left">ФИО</Table.HeaderCell>
                <Table.HeaderCell>Должность</Table.HeaderCell>
                <Table.HeaderCell>Оклад</Table.HeaderCell>
                <Table.HeaderCell>Зарплата</Table.HeaderCell>
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
            />)}

        </Table.Body>

    </Table>
}

const SalaryTableRow = props => {

    const { row } = props;

    return <Table.Row textAlign="center">
        <Table.Cell>{row.pin}</Table.Cell>
        <Table.Cell textAlign="left">{row.fullname}</Table.Cell>
        <Table.Cell><small className="opacity-70">{row.job_title}</small></Table.Cell>
        <Table.Cell>{row.salary}{row.salary_one_day ? "/день" : ""}</Table.Cell>
        <Table.Cell>{row.salaryToPay || 0}</Table.Cell>
        <Table.Cell>{row.prepayment || 0}</Table.Cell>
        <Table.Cell>{row.balance || 0}</Table.Cell>
        <Table.Cell />
    </Table.Row>
}

export default SalaryTable;