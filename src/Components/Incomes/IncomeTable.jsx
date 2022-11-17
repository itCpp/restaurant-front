import React from "react";
import { Button, Dropdown, Icon, Popup, Table } from "semantic-ui-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setShowAdd, setIncomeSourceAdd, setShowIncomes, setPartAdd } from "../../store/incomes/actions";
import IncomeFiles from "./IncomeFiles";
import { useNavigate } from "react-router-dom";

const colSpan = 11;

const IncomeTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();
    const [showFiles, setShowFiles] = React.useState(null);

    return <div>

        <IncomeFiles
            show={showFiles}
            setShowFiles={setShowFiles}
        />

        <Table compact celled>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Кабинет</Table.HeaderCell>
                    <Table.HeaderCell>Компания</Table.HeaderCell>
                    <Table.HeaderCell>Контактное лицо</Table.HeaderCell>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Площадь, м²</Table.HeaderCell>
                    <Table.HeaderCell>Стоимость 1м²</Table.HeaderCell>
                    <Table.HeaderCell>Цена</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Оплата</Table.HeaderCell>
                    <Table.HeaderCell>Платеж</Table.HeaderCell>
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
                        <span>
                            <Icon
                                name="pencil"
                                link
                                fitted
                                onClick={() => props.dispatch(setPartAdd(row))}
                                title="Изменить данные раздела"
                            />
                        </span>
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

            {row.rows.length === 0 && <Table.Row disabled>
                <Table.Cell colSpan={11}>
                    <div className="text-center my-3">
                        Данных нет
                    </div>
                </Table.Cell>
            </Table.Row>}

        </Table.Body>

    </>
}

const TableRowSource = props => {

    const { row, dispatch, setShowFiles } = props;
    const overdue = Boolean(row.overdue);
    const navigate = useNavigate();

    const className = ["income-table-row"];
    (overdue || row.is_overdue) && !row.is_free && className.push("overdue");
    !row.is_free && className.push('not-free');

    const price = Number(Number(row.price) * Number(row.space));

    return <Table.Row
        className={className.join(" ")}
        style={{
            background: row?.settings?.color || null,
        }}
    >

        <Table.Cell>{row.cabinet || ``}</Table.Cell>
        <Table.Cell
            content={<div>
                <div>{row.name}</div>
                {Boolean(row.inn) && <div>
                    <small><b>ИНН/ОГРН</b>{' '}{row.inn}</small>
                </div>}
                {Boolean(row.settings?.comment) && <div>
                    <small><Icon name="comment" disabled />{row.settings.comment}</small>
                </div>}
            </div>}
        />
        <Table.Cell>
            {row.contact_person && <div>{row.contact_person}</div>}
            {row.contact_number && <div><a href={`tel:${row.contact_number}`}>{row.contact_number}</a></div>}
        </Table.Cell>
        <Table.Cell>
            <TableCellIcons row={row} />
        </Table.Cell>
        <Table.Cell>{row.space}</Table.Cell>
        <Table.Cell>{row.price}</Table.Cell>
        <Table.Cell>{price > 0 ? price.toFixed(2) : null}</Table.Cell>
        <Table.Cell>
            <div className="d-flex">
                {row.date && <div className="text-nowrap">с {moment(row.date).format("DD.MM.YYYY")}</div>}
                {row.date_to && <div className="ms-1 text-nowrap">по {moment(row.date_to).format("DD.MM.YYYY")}</div>}
            </div>
            {Boolean(row?.settings?.comment_date) && <div>
                <small>{row.settings.comment_date}</small>
            </div>}
        </Table.Cell>
        <Table.Cell>
            {row.last && <div className="d-flex text-nowrap" style={{ opacity: row.last.is_prev ? "0.5" : "1" }}>
                <span style={overdue ? { fontWeight: 700, color: "#dc3545" } : {}}>
                    {moment(row.last.date).format("DD.MM.YYYY")}
                </span>
                <span className="ms-2">{row.last.sum}</span>
            </div>}
            <div className="d-flex align-items-center">
                {row.is_overdue && <span>
                    <Icon
                        name="calendar"
                        color="red"
                        title="Просрочка с ранних периодов"
                    />
                </span>}
                {Boolean(row.fine) && <div className="text-danger text-nowrap" title="Пеня">
                    <Icon name="time" color="red" />
                    <b>{row.fine}</b>
                </div>}
            </div>
        </Table.Cell>
        <Table.Cell
            content={<div>
                {Boolean(row.next_pays) && row.next_pays.map((pay, key) => <div key={key} className="d-flex align-items-center text-nowrap">
                    {pay.icon && <Icon name={pay.icon} disabled title={pay.title} size="small" color={pay.color} />}
                    {pay.date && <span>{moment(pay.date).format("DD.MM.YYYY")}</span>}
                    <span className="ms-2">{pay.price}</span>
                </div>)}
            </div>}
        />
        <Table.Cell>
            <div className="d-flex justify-content-center align-items-center">
                {/* <span>
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
                </span> */}

                <span>
                    <Icon
                        name={row.files_count > 0 ? "folder open" : "folder"}
                        link
                        title="Файлы"
                        onClick={() => setShowFiles(row)}
                        className="me-2"
                    />
                </span>

                <span>
                    <Dropdown icon={null} trigger={<Icon name="ellipsis vertical" link />} direction="left" pointing="top">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                content="Редактировать"
                                icon="pencil"
                                onClick={() => dispatch(setIncomeSourceAdd(row))}
                            />
                            <Dropdown.Item
                                content="Вывести платежи"
                                icon="eye"
                                onClick={() => dispatch(setShowIncomes(row))}
                            />
                            <Dropdown.Item
                                content="Внести оплату"
                                icon="plus"
                                onClick={() => dispatch(setShowAdd({
                                    income_part_id: row.part_id,
                                    income_source_id: row.id,
                                }))}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </span>

                {/* <span>
                    <Icon
                        name="chevron right"
                        link
                        onClick={() => navigate("/tenant/" + row.id)}
                        fitted
                    />
                </span> */}

                <Button
                    icon="chevron right"
                    size="mini"
                    basic
                    title="Перейти на страницу помещения"
                    onClick={() => navigate("/tenant/" + row.id)}
                />

            </div>
        </Table.Cell>
    </Table.Row>

}

export const TableCellIcons = props => {

    const { row } = props;

    return <div className="d-flex">

        {row.is_free && <PopupIcon
            content="Свободное помещение"
            trigger={<Icon
                name="check"
                color="green"
            />}
        />}

        {Boolean(row.is_deposit) && <PopupIcon
            content="Депозит оплачен"
            trigger={<Icon
                name="money"
                color="green"
            />}
        />}

        {Boolean(row.is_legal_address) && <PopupIcon
            content="Юридический адрес оплачен"
            trigger={<Icon
                name="point"
                color="green"
            />}
        />}

        {!row.is_free && <>

            {Boolean(row.is_rent) && <PopupIcon
                content="Аренда помещения"
                trigger={<Icon
                    name="building"
                    color="blue"
                />}
            />}

            {Boolean(row.fine) && <PopupIcon
                content="Имеется неоплаченная пеня"
                trigger={<Icon
                    name="ban"
                    color="red"
                />}
            />}

            {row.overdue && <PopupIcon
                content="Просроченный платеж"
                trigger={<Icon
                    name="usd"
                    color="red"
                />}
            />}

            {row.is_overdue && <PopupIcon
                content="Имеется просроченный платеж более ранних периодов"
                trigger={<Icon
                    name="calendar"
                    color="red"
                />}
            />}

            {row.is_parking && <PopupIcon
                content="Аренда парковочного места"
                trigger={<Icon
                    name="car"
                    color="blue"
                />}
            />}

            {row.is_internet && <PopupIcon
                content="Услуги интернета"
                trigger={<Icon
                    name="world"
                    color="blue"
                />}
            />}
        </>}

    </div>
}

const PopupIcon = props => {
    return <Popup
        size="mini"
        inverted
        {...props}
    />
}

export default IncomeTable;