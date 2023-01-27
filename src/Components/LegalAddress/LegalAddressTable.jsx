import moment from "moment";
import React from "react";
import { Dropdown, Header, Icon, Table } from "semantic-ui-react";
import IncomeFiles from "../Incomes/IncomeFiles";
import { TableCellIcons } from "../Incomes/IncomeTable";
import { useDispatch } from "react-redux";
import { setShowAdd, setIncomeSourceAdd, setShowIncomes, setPartAdd } from "../../store/incomes/actions";
import { useNavigate } from "react-router-dom";

const LegalAddressTable = props => {

    const { rows } = props;
    const [showFiles, setShowFiles] = React.useState(null);
    const dispatch = useDispatch();

    return <>

        <Header
            content="Юридические адреса"
            className="mt-4"
        />

        <IncomeFiles
            show={showFiles}
            setShowFiles={setShowFiles}
        />

        <Table compact celled>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Компания</Table.HeaderCell>
                    <Table.HeaderCell>Контактное лицо</Table.HeaderCell>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows.map(r => <LegalAddressTableRow
                    key={r.id}
                    row={r}
                    setShowFiles={setShowFiles}
                    dispatch={dispatch}
                />)}
            </Table.Body>

        </Table>

    </>

}

const LegalAddressTableRow = props => {

    const { row, setShowFiles, dispatch } = props;
    const navigate = useNavigate();

    return <Table.Row>

        <Table.Cell
            content={<div>
                <div>{row.name}</div>
                {Boolean(row.inn) && <div>
                    <small><b>ИНН/ОГРН</b>{' '}{row.inn}</small>
                </div>}
                {Boolean(row.part) && <div>
                    <small>{row.part.name}</small>
                </div>}
            </div>}
        />

        <Table.Cell>
            {row.contact_person && <div>{row.contact_person}</div>}
            {row.contact_number && <div><a href={`tel:${row.contact_number}`}>{row.contact_number}</a></div>}
        </Table.Cell>

        <Table.Cell
            content={<TableCellIcons row={row} />}
        />

        <Table.Cell>
            <div className="d-flex">
                {row.date && <div>с {moment(row.date).format("DD.MM.YYYY")}</div>}
                {row.date_to && <div className="ms-1">по {moment(row.date_to).format("DD.MM.YYYY")}</div>}
            </div>
            {Boolean(row?.settings?.comment_date) && <div>
                <small>{row.settings.comment_date}</small>
            </div>}
        </Table.Cell>

        <Table.Cell>
            <div className="d-flex justify-content-center align-items-center">
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
                    <Icon
                        name="chevron right"
                        title="Перейти на страницу помещения"
                        onClick={() => navigate("/tenant/" + row.id)}
                        link
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
            </div>
        </Table.Cell>

    </Table.Row>

}

export default LegalAddressTable;