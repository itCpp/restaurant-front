import { Icon, Table } from "semantic-ui-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setShowAdd } from "../../store/incomes/actions";

const colSpan = 9;

const IncomeTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();

    return <div>

        <Table basic compact selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Кабинет</Table.HeaderCell>
                    <Table.HeaderCell>Компания</Table.HeaderCell>
                    <Table.HeaderCell>Контактное лицо</Table.HeaderCell>
                    <Table.HeaderCell>ИНН</Table.HeaderCell>
                    <Table.HeaderCell>Площадь, м²</Table.HeaderCell>
                    <Table.HeaderCell>Стоимость 1м²</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Оплата</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            {rows.map(row => <Table.Body key={row.id}>

                <Table.Row textAlign="center" warning>
                    <Table.Cell colSpan={colSpan}>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <b>{row.name}</b>
                                {row.comment && <i>{' '}{row.comment}</i>}
                            </div>
                            {/* <div>
                                <Icon
                                    name="plus"
                                    link
                                    fitted
                                    title="Добавить кабинет или помещение"
                                />
                            </div> */}
                        </div>
                    </Table.Cell>
                </Table.Row>

                {row.rows.length === 0 && <Table.Row textAlign="center" disabled>
                    <Table.Cell colSpan={colSpan}>Данных ещё нет</Table.Cell>
                </Table.Row>}

                {row.rows.map(row => <TableRowSource
                    key={row.id}
                    row={row}
                    dispatch={dispatch}
                />)}

            </Table.Body>)}

        </Table>

    </div>

}

const TableRowSource = props => {

    const { row, dispatch } = props;

    return <Table.Row negative={Boolean(row.overdue)} positive={row.is_free}>

        <Table.Cell>{row.cabinet}</Table.Cell>
        <Table.Cell>{row.name}</Table.Cell>
        <Table.Cell>
            {row.contact_person && <div>{row.contact_person}</div>}
            {row.contact_number && <div>{row.contact_number}</div>}
        </Table.Cell>
        <Table.Cell>{row.inn}</Table.Cell>
        <Table.Cell>{row.space}</Table.Cell>
        <Table.Cell>{row.price}</Table.Cell>
        <Table.Cell>
            {row.date && <div>{moment(row.date).format("DD.MM.YYYY")}</div>}
            {Boolean(row?.settings?.comment_date) && <div>
                <small>{row.settings.comment_date}</small>
            </div>}
        </Table.Cell>
        <Table.Cell>
            {row.last && <div>
                <span>{moment(row.last.date).format("DD.MM.YYYY")}</span>
                {' - '}
                <span>{row.last.sum}</span>
            </div>}
        </Table.Cell>
        <Table.Cell>
            <div className="d-flex justify-content-center">
                <span>
                    <Icon
                        name="eye"
                        link
                        title="Посмотреть оплаты"
                        disabled
                    />
                </span>
                <span>
                    <Icon
                        name="plus"
                        link
                        title="Внести оплату"
                        fitted
                        onClick={() => dispatch(setShowAdd({
                            income_part_id: row.part_id,
                            income_source_id: row.id,
                        }))}
                    />
                </span>
            </div>
        </Table.Cell>
    </Table.Row>

}

export default IncomeTable;