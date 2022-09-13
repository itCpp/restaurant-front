import React from "react";
import { Icon, Table } from "semantic-ui-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setShowAdd, setIncomeSourceAdd, setShowIncomes } from "../../store/incomes/actions";
import IncomeFiles from "./IncomeFiles";

const colSpan = 9;

const IncomeTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();
    const [showFiles, setShowFiles] = React.useState([]);

    return <div>

        <IncomeFiles
            show={showFiles}
            setShowFiles={setShowFiles}
        />

        <Table compact selectable celled>

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

            {rows.map(row => <TableBodySource
                key={row.id}
                row={row}
                dispatch={dispatch}
                setShowFiles={setShowFiles}
            />)}

        </Table>

    </div>

}

const TableBodySource = props => {

    const { row } = props;

    return <>

        <Table.Body className="header-table-parts">

            <Table.Row textAlign="center">
                <Table.Cell
                    colSpan={colSpan}
                    className="py-2"
                    content={<div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                            <b>{row.name}</b>
                            {row.comment && <i>{' '}{row.comment}</i>}
                        </div>
                    </div>}
                />
            </Table.Row>

        </Table.Body>

        <Table.Body>

            {row.rows.map(row => <TableRowSource
                key={row.id}
                {...props}
                row={row}
            />)}

        </Table.Body>

    </>
}

const TableRowSource = props => {

    const { row, dispatch, setShowFiles } = props;
    const overdue = Boolean(row.overdue);

    return <Table.Row negative={overdue} positive={row.is_free}>

        <Table.Cell>{row.cabinet || `ID#${row.id}`}</Table.Cell>
        <Table.Cell
            content={<div>
                <div>{row.name}</div>
                {Boolean(row.settings?.comment) && <div>
                    <small><Icon name="comment" disabled />{row.settings.comment}</small>
                </div>}
            </div>}
        />
        <Table.Cell>
            {row.contact_person && <div>{row.contact_person}</div>}
            {row.contact_number && <div><a href={`tel:${row.contact_number}`}>{row.contact_number}</a></div>}
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
                <span style={overdue ? { fontWeight: 700, color: "#dc3545" } : {}}>
                    {moment(row.last.date).format("DD.MM.YYYY")}
                </span>
                <span>{' - '}</span>
                <span>{row.last.sum}</span>
            </div>}
        </Table.Cell>
        <Table.Cell>
            <div className="d-flex justify-content-center">
                <span>
                    <Icon
                        name="pencil"
                        link
                        title="Редактировать данные"
                        onClick={() => dispatch(setIncomeSourceAdd(row))}
                    />
                </span>
                <span>
                    <Icon
                        name="eye"
                        link
                        title="Посмотреть оплаты"
                        onClick={() => dispatch(setShowIncomes(row))}
                    />
                </span>
                <span>
                    <Icon
                        name="plus"
                        link
                        title="Внести оплату"
                        onClick={() => dispatch(setShowAdd({
                            income_part_id: row.part_id,
                            income_source_id: row.id,
                        }))}
                    />
                </span>
                <span>
                    <Icon
                        name={row.files_count > 0 ? "folder open" : "folder"}
                        link
                        title="Файлы"
                        fitted
                        onClick={() => setShowFiles(row)}
                    />
                </span>
            </div>
        </Table.Cell>
    </Table.Row>

}

export default IncomeTable;