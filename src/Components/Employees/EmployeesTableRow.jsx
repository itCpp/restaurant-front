import React from "react";
import moment from "moment";
import { Dimmer, Dropdown, Form, Icon, Loader, Table } from "semantic-ui-react";
import { axios } from "../../system";
import { setShowShedule } from "../../store/actions";
import { useDispatch } from "react-redux";

const EmployeesTableRow = props => {

    const { row, setEdit, setRows } = props;
    const d = useDispatch();

    return <Table.Row>
        {/* <Table.Cell>
            <div>{row.pin}</div>
        </Table.Cell> */}
        <Table.Cell>
            <div>{row.fullname}</div>
        </Table.Cell>
        <Table.Cell>
            <div>{row.job_title || <i className="opacity-40">Не указана</i>}</div>
        </Table.Cell>
        <Table.Cell>
            <div>{row.phone}</div>
        </Table.Cell>
        <Table.Cell>
            <div className="d-flex align-items-center justify-content-center">
                {row.work_shedule && <div>{row.work_shedule}</div>}
                {row.work_shedule_time && <div className="mx-1">({row.work_shedule_time})</div>}
            </div>
        </Table.Cell>
        <Table.Cell textAlign="center" error={Boolean(row.date_work_stop)}>
            {row.date_work_start && <span className="px-1">с {moment(row.date_work_start).format("DD.MM.YYYY")}</span>}
            {row.date_work_stop && <span className="px-1">по {moment(row.date_work_stop).format("DD.MM.YYYY")}</span>}
        </Table.Cell>
        <Table.Cell>
            <div className="d-flex align-items-center">
                <span className="flex-grow-1">{row.salary}{row.salary_one_day ? "/день" : ""}</span>
                <span>
                    <ChangeSalaryDropdown row={row} setRows={setRows} />
                </span>
            </div>
        </Table.Cell>
        <Table.Cell
            textAlign="center"
            content={<div>
                {row.personal_data_processing_hour}
            </div>}
        />
        <Table.Cell
            content={<div>
                {row.personal_data_additional_info}
            </div>}
        />
        <Table.Cell textAlign="center">
            <Dropdown
                icon={null}
                trigger={<Icon name="ellipsis vertical" link fitted />}
                pointing="top right"
            >
                <Dropdown.Menu>
                    <Dropdown.Item
                        content="Редактировать"
                        icon="edit"
                        onClick={() => setEdit(row)}
                    />
                    <Dropdown.Item
                        content="График работы"
                        icon="calendar alternate"
                        onClick={() => d(setShowShedule(row))}
                    />
                </Dropdown.Menu>
            </Dropdown>
        </Table.Cell>
    </Table.Row>
}

const ChangeSalaryDropdown = props => {

    const { row, setRows } = props;
    const [open, setOpen] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        if (open) {
            setFormdata({
                id: row.id,
                date: row.salary_date,
                salary: Number(row.salary) ? row.salary : null,
                is_one_day: row.salary_one_day || false,
            });
        }

        return () => {
            setFormdata({});
            setSave(false);
            setError(null);
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {
            axios.post('employees/salary/set', formdata)
                .then(({ data }) => {
                    setRows(p => {
                        let rows = [];
                        p.forEach(r => {
                            let row = { ...r };
                            if (r.id === data.row.id) row = { ...r, ...data.row }
                            rows.push(row);
                        });
                        return rows;
                    });
                    setOpen(false);
                })
                .catch(e => {
                    setSave(false);
                    setError(axios.getError(e));
                });
        }

    }, [save]);

    return <Dropdown
        open={open}
        trigger={<Icon
            name="exchange"
            link
            title="Сменить оклад"
            onClick={() => setOpen(p => !p)}
        />}
        icon={null}
        direction="left"
        pointing="top right"

    >
        <Dropdown.Menu style={{ maxWidth: 200 }}>
            <div className="px-2 py-2">
                <strong>Сменить оклад:</strong>
            </div>
            <Dropdown.Divider className="my-0" />

            <Form className="p-1 mb-0">
                <Form.Input
                    type="date"
                    size="mini"
                    className="mb-1"
                    value={formdata?.date || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, date: value }))}
                />
                <Form.Input
                    size="mini"
                    placeholder="Укажите размер оклада"
                    type="number"
                    step="0.01"
                    value={formdata?.salary || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, salary: value }))}
                    className="mb-1"
                />

                <Form.Checkbox
                    label="Оклад в день"
                    className="mb-0"
                    checked={Boolean(formdata?.is_one_day)}
                    onChange={(e, { checked }) => setFormdata(p => ({ ...p, is_one_day: checked }))}
                />

                <Dimmer active={save} inverted><Loader size="small" /></Dimmer>

                {error && <div className="text-danger px-1 pb-0">
                    <small><b>Ошибка</b>{' '}{error}</small>
                </div>}

            </Form>

            <div className="px-2 pb-2 d-flex justify-content-between">
                <Icon
                    name="cancel"
                    link={!save}
                    onClick={() => setOpen(false)}
                    title="Отмена"
                    disabled={save}
                />
                <Icon
                    name="save"
                    disabled={(!Boolean(formdata?.date) || !Boolean(formdata?.salary)) || save}
                    title="Сохранить"
                    fitted
                    color="green"
                    link={!save}
                    onClick={() => setSave(true)}
                />
            </div>

        </Dropdown.Menu>
    </Dropdown>

}

export default EmployeesTableRow;