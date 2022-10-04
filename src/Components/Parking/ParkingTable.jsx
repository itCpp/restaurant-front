import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Dimmer, Dropdown, Form, Icon, Input, Loader, Table } from "semantic-ui-react";
import { setParkingPlaceAdd, setIncomeSourceAdd } from "../../store/incomes/actions";
import { axios } from "../../system";
import IncomeFiles from "../Incomes/IncomeFiles";

const ParkingTable = props => {

    const { rows } = props;
    const dispatch = useDispatch();

    const [showFiles, setShowFiles] = React.useState(null);

    return <>

        <IncomeFiles
            show={showFiles}
            setShowFiles={setShowFiles}
        />

        <Table compact celled>

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
                {...props}
                row={row}
                setShowFiles={setShowFiles}
            />)}

        </Table>

    </>
}

const colSpan = 9;

const ParkingTableSource = props => {

    const { row, setShowFiles } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

                        <div className="d-flex align-items-center">

                            <span>
                                <Icon
                                    name="pencil"
                                    link
                                    color="green"
                                    title="Изменить данные арендатора"
                                    onClick={() => dispatch(setIncomeSourceAdd(row))}
                                    className="me-2"
                                />
                            </span>
                            <span>
                                <Icon
                                    name={Number(row.files) > 0 ? "folder open" : "folder"}
                                    link
                                    title="Файлы арендатора"
                                    onClick={() => setShowFiles(row)}
                                    className="me-2"
                                />
                            </span>
                            <span>
                                <Icon
                                    name="plus"
                                    link
                                    title="Добавить парковочное место"
                                    onClick={() => dispatch(setParkingPlaceAdd({ source_id: row.id }))}
                                    className="me-2"
                                />
                            </span>
                            <span>
                                <Icon
                                    name="chevron right"
                                    link
                                    title="Перейти на страницу помещения"
                                    onClick={() => navigate("/tenant/" + row.id)}
                                    className="me-2"
                                />
                            </span>

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
                {...props}
                row={row}
            />)}

        </Table.Body>

    </>
}

const ParkingPlaceRow = props => {

    const { row } = props;
    const dispatch = useDispatch();

    const className = ["income-table-row"];
    row.is_overdue && className.push("overdue");
    !row.is_overdue && className.push('not-free');

    return <Table.Row className={className.join(" ")}>
        <Table.Cell>{row.parking_place}</Table.Cell>
        <Table.Cell>{row.car}</Table.Cell>
        <Table.Cell>{row.car_number && String(row.car_number).replace(/ /ig, "")}</Table.Cell>
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
        <Table.Cell>
            {row.last_pay && <div className="text-nowrap">
                {moment(row.last_pay?.date).format("DD.MM.YYYY")}{' - '}{row.last_pay?.sum || 0}
                <Icon name="check" color="green" className="ms-1 me-0" />
            </div>}
            {row.next_pay && <div className="text-nowrap">
                {moment(row.next_pay?.date).format("DD.MM.YYYY")}{' - '}{row.last_pay?.sum || 0}
                <Icon name="close" color="red" className="ms-1 me-0" title="Не оплачено" disabled />
            </div>}
        </Table.Cell>
        <Table.Cell>

            <div className="d-flex justify-content-center align-items-center">

                <span>
                    <Icon
                        name="pencil"
                        link
                        title="Редактировать"
                        onClick={() => dispatch(setParkingPlaceAdd({
                            id: row.id,
                            source_id: row.source_id
                        }))}
                        className="mx-1"
                    />
                </span>

                <span>
                    <AddNextPayParking
                        {...props}
                        pay={row.next_pay || {}}
                        row={row}
                    />
                </span>

            </div>

        </Table.Cell>
    </Table.Row>
}

const AddNextPayParking = props => {

    const { row, pay, setRows } = props;
    const [active, setActive] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {

        if (active) {
            setFormdata({
                date: pay?.date || moment().format("YYYY-MM-DD"),
                month: pay?.month || moment().format("YYYY-MM"),
                sum: pay?.pay_sum || "",
                parking_id: row?.id,
                type_pay: 1,
            });
        }

        return () => {
            setSave(false);
            setLoading(false);
            setError(null);
            setErrors({});
        }

    }, [active]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.put('incomes/parking/save', formdata)
                .then(({ data }) => {
                    typeof setRows == "function" && setRows(p => {
                        let rows = [];
                        p.forEach(row => {
                            let m = { ...row };
                            m.parking.forEach((p, i) => {
                                m.parking[i] = p.id === data.row.id ? { ...p, ...data.row } : { ...p };
                            });
                            rows.push(m);
                        });
                        return rows;
                    });
                    setActive(false);
                })
                .catch(e => {
                    setError(axios.getError(e));
                    setErrors(axios.getErrors(e));
                })
                .then(() => {
                    setSave(false);
                    setLoading(false);
                });
        }

    }, [save]);

    return <Dropdown
        open={active}
        icon={null}
        direction="left"
        trigger={<Icon.Group title="Добавить платеж" onClick={() => setActive(p => !p)}>
            <Icon name="ruble" link />
            <Icon corner name="add" link />
        </Icon.Group>}
        className="mx-1"
    >
        <Dropdown.Menu className="px-2 py-1">
            <Form style={{ maxWidth: 200 }}>
                <Form.Input
                    label="Дата платежа"
                    type="date"
                    size="mini"
                    className="mb-1"
                    value={formdata.date || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, date: value }))}
                    error={Boolean(errors?.date)}
                />
                <Form.Input
                    label="Отчетный месяц"
                    type="month"
                    size="mini"
                    className="mb-1"
                    value={formdata.month || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, month: value }))}
                    error={Boolean(errors?.month)}
                />
                <Form.Input
                    label="Сумма платежа"
                    placeholder="Введите сумму"
                    size="mini"
                    type="number"
                    className="mb-2"
                    value={formdata.sum || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, sum: value }))}
                    error={Boolean(errors?.sum)}
                />
                <Button.Group size="mini" fluid className="mb-1">
                    <Button
                        content="Нал."
                        active={formdata.type_pay === 1}
                        color={formdata.type_pay === 1 ? "green" : null}
                        onClick={() => setFormdata(p => ({ ...p, type_pay: 1 }))}
                    />
                    <Button
                        content="Б/Н"
                        active={formdata.type_pay === 2}
                        color={formdata.type_pay === 2 ? "blue" : null}
                        onClick={() => setFormdata(p => ({ ...p, type_pay: 2 }))}
                    />
                    <Button
                        content="Р/С"
                        active={formdata.type_pay === 3}
                        color={formdata.type_pay === 3 ? "orange" : null}
                        onClick={() => setFormdata(p => ({ ...p, type_pay: 3 }))}
                    />
                </Button.Group>

                {error && <div className="text-danger">
                    <small><b>Ошибка</b>{' '}{error}</small>
                </div>}

                <div className="d-flex align-items-center justify-content-between">
                    <span>
                        <Icon
                            name="close"
                            link
                            onClick={() => setActive(false)}
                        />
                    </span>
                    <span>
                        <Icon
                            name="save"
                            color="green"
                            link={Number(formdata.sum || "") > 0}
                            disabled={!Number(formdata.sum || "")}
                            fitted
                            onClick={() => setSave(true)}
                        />
                    </span>
                </div>

                <Dimmer active={loading} inverted>
                    <Loader />
                </Dimmer>
            </Form>
        </Dropdown.Menu>
    </Dropdown>
}

export default ParkingTable;
