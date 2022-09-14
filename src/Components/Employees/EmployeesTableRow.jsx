import { Button, Dropdown, Icon, Table } from "semantic-ui-react";

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
        <Table.Cell>

        </Table.Cell>
        <Table.Cell>

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

export default EmployeesTableRow;