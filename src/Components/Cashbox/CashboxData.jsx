import React from "react";
import { Table } from "semantic-ui-react";
import MySegment from "../UI/Segment";
import CashboxDataTableRow from "./CashboxDataTableRow";

const CashboxData = props => {

    const { rows } = props;

    return <MySegment>

        <Table compact="very" basic="very" selectable>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Сумма</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Наименование</Table.HeaderCell>
                    <Table.HeaderCell>Тип</Table.HeaderCell>
                    <Table.HeaderCell>Дата внесения</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>

                {rows.map(row => <CashboxDataTableRow
                    key={row.id}
                    row={row}
                />)}

            </Table.Body>

        </Table>

    </MySegment>
}

export default CashboxData;