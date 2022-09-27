import moment from "moment";
import { Icon, Table } from "semantic-ui-react"

const CashboxDataTableRow = props => {

    const { row } = props;

    return <Table.Row>

        <Table.Cell
            textAlign="center"
            content={row.type_pay === 2 && <Icon name="credit card" color="green" fitted />}
        />

        <Table.Cell>
            <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                {row.sum.toFixed(2)}
                <Icon name="ruble" className="ms-0 me-0" />
            </strong>
        </Table.Cell>

        <Table.Cell>{moment(row.date).format("DD.MM.YYYY")}</Table.Cell>

        <Table.Cell>{row.name}</Table.Cell>

        <Table.Cell>
            {row.purpose && <PurposeType data={row.purpose} />}
        </Table.Cell>

        <Table.Cell>{row.comment}</Table.Cell>

        <Table.Cell>
            <small className="opacity-50">{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>
        </Table.Cell>

        <Table.Cell></Table.Cell>

    </Table.Row>

}

const PurposeType = props => {

    const { data } = props;

    return <div className="d-flex">
        {data.icon && <span>
            <Icon
                name={data.icon}
                disabled
                className="me-2"
                color={data?.color || null}
            />
        </span>}
        <span>{data.name}</span>
    </div>

}

export default CashboxDataTableRow;