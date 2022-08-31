import { Icon, Table } from "semantic-ui-react";

const colSpan = 7;

const IncomeTable = props => {

    const { rows } = props;

    return <div>

        <Table basic compact fixed>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Кабинет</Table.HeaderCell>
                    <Table.HeaderCell>Компания</Table.HeaderCell>
                    <Table.HeaderCell>Контактное лицо</Table.HeaderCell>
                    <Table.HeaderCell>ИНН</Table.HeaderCell>
                    <Table.HeaderCell>Площадь, м²</Table.HeaderCell>
                    <Table.HeaderCell>Стоимость 1м²</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            {rows.map(row => <Table.Body key={row.id} compact>

                <Table.Row textAlign="center" warning>
                    <Table.Cell colSpan={colSpan}>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <b>{row.name}</b>
                                {row.comment && <i>{' '}{row.comment}</i>}
                            </div>
                            <div>
                                <Icon
                                    name="plus"
                                    link
                                    fitted
                                    title="Добавить кабинет или помещение"
                                />
                            </div>
                        </div>
                    </Table.Cell>
                </Table.Row>

                {row.rows.length === 0 && <Table.Row textAlign="center" disabled>
                    <Table.Cell colSpan={colSpan}>Данных ещё нет</Table.Cell>
                </Table.Row>}

            </Table.Body>)}

        </Table>


    </div>

}

export default IncomeTable;