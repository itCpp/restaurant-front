import moment from "moment";
import { Icon, Table } from "semantic-ui-react";

let dateChange = null;
const colspan = 7;

const CashboxDataTableRow = props => {

    const { row, stats } = props;
    const stat = stats[moment(row.date).format("YYYYMMDD")] || null;

    let toDate = false,
        typePay = null;

    if (dateChange !== row.date) {
        dateChange = row.date;
        toDate = true;
        // console.log(stat);
    }

    if (row.type_pay === 1 || !row.type_pay)
        typePay = <Icon name="ruble" className="ms-0 me-2" title="Наличные" />
    else if (row.type_pay === 2)
        typePay = <Icon name="credit card" className="ms-0 me-2" title="Безналичные" />
    else if (row.type_pay === 3)
        typePay = <Icon name="file text" className="ms-0 me-2" title="Расчетный счет" />

    return <>

        {toDate && <Table.Row active>
            <Table.Cell
                colSpan={1}
                className="px-2"
                content={<div>
                    <strong>{moment(row.date).format("DD.MM.YYYY")}</strong>
                </div>}
            />
            <Table.Cell
                className="px-1"
                content={Boolean(stat?.incoming) && <span className="text-success">
                    {stat.incoming.toFixed(2)}
                </span>}
            />
            <Table.Cell
                className="px-1"
                content={Boolean(stat?.expense) && <span className="text-danger">
                    {stat.expense.toFixed(2)}
                </span>}
            />
            <Table.Cell
                colSpan={colspan - 4}
                className="px-2"
            />
        </Table.Row>}

        <Table.Row
            positive={row.sum > 0}
            negative={row.sum < 0}
            className="celled-cashbox"
        >

            {/* <Table.Cell
                textAlign="center"
                content={row.type_pay === 2 && <Icon name="credit card" color="green" fitted />}
            /> */}

            <Table.Cell>{row.name}</Table.Cell>

            <Table.Cell>
                {row.sum > 0 && <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                    {typePay}
                    {row.sum.toFixed(2)}
                </strong>}
            </Table.Cell>

            <Table.Cell>
                {row.sum < 0 && <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                    {typePay}
                    {row.sum.toFixed(2)}
                </strong>}
            </Table.Cell>

            {/* <Table.Cell>{moment(row.date).format("DD.MM.YYYY")}</Table.Cell> */}

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