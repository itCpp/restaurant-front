import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { Button, Icon, Table } from "semantic-ui-react";
import { setParkingPlaceAdd, setIncomeSourceAdd } from "../../store/incomes/actions";

const ParkingTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();

    return <Table compact celled>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Место</Table.HeaderCell>
                <Table.HeaderCell>Авто</Table.HeaderCell>
                <Table.HeaderCell>Гос. номер</Table.HeaderCell>
                <Table.HeaderCell>Период аренды</Table.HeaderCell>
                <Table.HeaderCell>Контакт</Table.HeaderCell>
                <Table.HeaderCell>Стоимость</Table.HeaderCell>
                <Table.HeaderCell>Комментарий</Table.HeaderCell>
                <Table.HeaderCell>Платежи</Table.HeaderCell>
                <Table.HeaderCell
                    content={<div className="text-center">
                        <Button
                            icon="plus"
                            color="green"
                            size="mini"
                            basic
                            title="Создать арендатора"
                            className="mx-0"
                            onClick={() => dispatch(setIncomeSourceAdd(true))}
                        />
                    </div>}
                />
            </Table.Row>
        </Table.Header>

        {rows.map(row => <ParkingTableSource
            key={row.id}
            row={row}
        />)}

    </Table>
}

const colSpan = 9;

const ParkingTableSource = props => {

    const { row } = props;
    const dispatch = useDispatch();
    const rows = row.parking || [];

    return <>

        <Table.Body className="header-table-parts">

            <Table.Row>
                <Table.Cell
                    colSpan={colSpan}
                    content={<div className="d-flex align-items-center">

                        <div className="flex-grow-1">
                            <div>
                                {row.is_rent && <Icon name="building" color="blue" title="Аренда помещения" />}
                                <strong>{row.name}</strong>
                            </div>
                            {Boolean(row?.settings?.comment) && <div><small>{row.settings.comment}</small></div>}
                        </div>

                        <div>
                            <Button
                                icon="pencil"
                                basic
                                color="green"
                                size="mini"
                                title="Изменить данные арендатора"
                                onClick={() => dispatch(setIncomeSourceAdd(row))}
                            />
                            <Button
                                icon="plus"
                                basic
                                size="mini"
                                title="Добавить парковочное место"
                                onClick={() => dispatch(setParkingPlaceAdd({ source_id: row.id }))}
                            />
                        </div>

                    </div>}
                />
            </Table.Row>

        </Table.Body>

        <Table.Body>

            {rows.length === 0 && <Table.Row>
                <Table.Cell
                    colSpan={colSpan}
                    content={<div className="text-center py-2">
                        <div className="opacity-50">Парковочные места не определены</div>
                    </div>}
                />
            </Table.Row>}

            {rows.map(row => <ParkingPlaceRow
                key={row.id}
                row={row}
            />)}

        </Table.Body>

    </>
}

const ParkingPlaceRow = props => {

    const { row } = props;
    const dispatch = useDispatch();

    return <Table.Row>
        <Table.Cell>{row.parking_place}</Table.Cell>
        <Table.Cell>{row.car}</Table.Cell>
        <Table.Cell>{row.car_number}</Table.Cell>
        <Table.Cell>
            <div>
                {row.date_from && <span>с {moment(row.date_from).format("DD.MM.YYYY")}</span>}
                {row.date_to && <span> по {moment(row.date_to).format("DD.MM.YYYY")}</span>}
            </div>
        </Table.Cell>
        <Table.Cell>
            <div>
                {row.owner_name && <div>{row.owner_name}</div>}
                {row.owner_phone && <div>{row.owner_phone}</div>}
            </div>
        </Table.Cell>
        <Table.Cell>{row.price}</Table.Cell>
        <Table.Cell>{row.comment}</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>

            <div className="d-flex justify-content-center align-items-center">
                <Button
                    size="mini"
                    basic
                    icon="pencil"
                    title="Редактировать"
                    onClick={() => dispatch(setParkingPlaceAdd({
                        id: row.id,
                        source_id: row.source_id
                    }))}
                />
            </div>

        </Table.Cell>
    </Table.Row>
}

export default ParkingTable;
