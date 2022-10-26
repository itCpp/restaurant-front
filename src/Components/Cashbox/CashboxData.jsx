import React from "react";
import { Loader, Table } from "semantic-ui-react";
import MySegment from "../UI/Segment";
import CashboxDataTableRow from "./CashboxDataTableRow";

const CashboxData = props => {

    const { rows, loading, end, stats, setRows } = props;

    return <MySegment>

        <Table compact="very" basic="very" selectable>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Наименование</Table.HeaderCell>
                    <Table.HeaderCell>Приход</Table.HeaderCell>
                    <Table.HeaderCell>Расход</Table.HeaderCell>
                    <Table.HeaderCell>Тип</Table.HeaderCell>
                    <Table.HeaderCell>Период</Table.HeaderCell>
                    {/* <Table.HeaderCell>Дата внесения</Table.HeaderCell> */}
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>

                {rows.map((row, i) => <CashboxDataTableRow
                    key={row.id}
                    row={row}
                    stats={stats}
                    keyId={i}
                    setRows={setRows}
                />)}

            </Table.Body>

        </Table>

        {end && <div className="text-center opacity-50">
            <small>Это все данные</small>
        </div>}

        {loading && <Loader active inline="centered" size="tiny" />}

    </MySegment>
}

export default CashboxData;