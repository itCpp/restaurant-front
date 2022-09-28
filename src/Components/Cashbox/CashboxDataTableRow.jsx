import moment from "moment";
import { Icon, Table } from "semantic-ui-react";

let dateChange = null;
const colspan = 7;

const typePayCash = <Icon name="ruble" className="ms-0 me-2" title="Наличные" />;
const typePayCard = <Icon name="credit card" className="ms-0 me-2" title="Безналичные" />;
const typePayCheckingAccount = <Icon name="file text" className="ms-0 me-2" title="Расчетный счет" />;

const CashboxDataTableRow = props => {

    const { row, stats, keyId } = props;

    let toDate = false,
        typePay = null,
        lastDate = dateChange,
        stat = null;

    if (dateChange !== row.date) {
        dateChange = row.date;
        toDate = true;
        stat = stats[moment(lastDate).format("YYYYMMDD")] || null;
    }

    if (row.type_pay === 1 || !row.type_pay)
        typePay = typePayCash;
    else if (row.type_pay === 2)
        typePay = typePayCard;
    else if (row.type_pay === 3)
        typePay = typePayCheckingAccount;

    return <>

        {toDate && lastDate && keyId > 0 && <Table.Row warning className="celled-cashbox">
            <Table.Cell>
                <strong>Итого за день:</strong>
            </Table.Cell>
            <Table.Cell verticalAlign="top" className="text-success">
                {Number(stat?.incomingCash) > 0 && <div className="text-nowrap">
                    {typePayCash}
                    {stat.incomingCash.toFixed(2)}
                </div>}
                {Number(stat?.incomingCard) > 0 && <div className="text-nowrap">
                    {typePayCard}
                    {stat.incomingCard.toFixed(2)}
                </div>}
                {Number(stat?.incomingCheckingAccount) > 0 && <div className="text-nowrap">
                    {typePayCheckingAccount}
                    {stat.incomingCheckingAccount.toFixed(2)}
                </div>}
            </Table.Cell>
            <Table.Cell verticalAlign="top" className="text-danger">
                {Boolean(stat?.expenseCash) && <div className="text-nowrap">
                    {typePayCash}
                    {stat.expenseCash.toFixed(2)}
                </div>}
                {Boolean(stat?.expenseCard) && <div className="text-nowrap">
                    {typePayCard}
                    {stat.expenseCard.toFixed(2)}
                </div>}
                {Boolean(stat?.expenseCheckingAccount) && <div className="text-nowrap">
                    {typePayCheckingAccount}
                    {stat.expenseCheckingAccount.toFixed(2)}
                </div>}
            </Table.Cell>
            <Table.Cell colSpan={3} />
        </Table.Row>}

        {toDate && <Table.Row active className="cashbox-date-row">
            <Table.Cell
                colSpan={colspan}
                className="px-2 text-center"
                content={<div>
                    <strong>{moment(row.date).format("DD.MM.YYYY")}</strong>
                </div>}
            />
        </Table.Row>}

        <Table.Row
            // positive={row.sum > 0}
            // negative={row.sum < 0}
            className="celled-cashbox"
        >

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

            <Table.Cell></Table.Cell>

            {/* <Table.Cell>
                <small className="opacity-50">{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>
            </Table.Cell> */}

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