import moment from "moment";
import { Icon, Table } from "semantic-ui-react";

let dateChange = null;
const colspan = 6;

const CashboxDataTableRow = props => {

    const { row } = props;
    let toDate = false;

    if (dateChange !== row.date) {
        dateChange = row.date;
        toDate = true;
    }

    return <>

        {toDate && <Table.Row active>
            <Table.Cell
                textAlign="center"
                content={<strong>{moment(row.date).format("DD.MM.YYYY")}</strong>}
            />
            <Table.Cell
                colSpan={colspan}
            />
        </Table.Row>}

        <Table.Row
            positive={row.sum > 0}
            negative={row.sum < 0}
        >

            <Table.Cell
                textAlign="center"
                content={row.type_pay === 2 && <Icon name="credit card" color="green" fitted />}
            />

            <Table.Cell>
                {row.sum > 0 && <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                    {row.sum.toFixed(2)}
                    <Icon name="ruble" className="ms-0 me-0" />
                </strong>}
            </Table.Cell>

            <Table.Cell>
                {row.sum < 0 && <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                    {row.sum.toFixed(2)}
                    <Icon name="ruble" className="ms-0 me-0" />
                </strong>}
            </Table.Cell>

            {/* <Table.Cell>{moment(row.date).format("DD.MM.YYYY")}</Table.Cell> */}

            <Table.Cell>{row.name}</Table.Cell>

            <Table.Cell>
                <div className="d-flex align-items-center">
                    {row.purpose && <PurposeType data={row.purpose} />}
                    {(row.purpose && row.comment) && <span className="mx-2">/</span>}
                    {row.comment && <span><small className="opacity-80">{row.comment}</small></span>}
                </div>
            </Table.Cell>

            <Table.Cell>
                <small className="opacity-50">{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>
            </Table.Cell>

            <Table.Cell></Table.Cell>

        </Table.Row>
    </>

}

const PurposeType = props => {

    const { data } = props;

    return <span className="d-flex">
        {data.icon && <span>
            <Icon
                name={data.icon}
                disabled
                className="me-2"
                color={data?.color || null}
            />
        </span>}
        <span>{data.name}</span>
    </span>

}

export default CashboxDataTableRow;