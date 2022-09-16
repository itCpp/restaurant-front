import React from "react";
import moment from "moment";
import { Dropdown, Form, Icon, Table } from "semantic-ui-react";

const EmployeesTableRow = props => {

    const { row, setEdit } = props;

    return <Table.Row>
        <Table.Cell>
            <div>{row.pin}</div>
        </Table.Cell>
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
                <span className="flex-grow-1">{row.salary}</span>
                <span>
                    <ChangeSalaryDropdown row={row} />
                </span>
            </div>
        </Table.Cell>
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
                </Dropdown.Menu>
            </Dropdown>
        </Table.Cell>
    </Table.Row>
}

const ChangeSalaryDropdown = props => {

    const { row } = props;
    const [open, setOpen] = React.useState(false);

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
        <Dropdown.Menu>
            <div className="px-2 py-2">
                <strong>Сменить оклад:</strong>
            </div>
            <Dropdown.Divider className="my-0" />
            <Form className="p-1">
                <Form.Input
                    type="date"
                    size="mini"
                    className="mb-1"
                />
                <Form.Input
                    size="mini"
                    placeholder="Укажите размер оклада"
                />
            </Form>
            <div className="px-2 pb-2 d-flex justify-content-between">
                <Icon
                    name="cancel"
                    link
                    onClick={() => setOpen(false)}
                    title="Отмена"
                />
                <Icon
                    name="save"
                    disabled
                    title="Сохранить"
                />
            </div>
        </Dropdown.Menu>
    </Dropdown>

}

export default EmployeesTableRow;