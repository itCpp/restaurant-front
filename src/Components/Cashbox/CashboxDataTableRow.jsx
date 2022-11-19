import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Icon, Table } from "semantic-ui-react";
import { setShowCashboxRowEdit } from "../../store/cashbox/actions";
import { axios } from "../../system";

let dateChange = null;
const colspan = 7;

export const typePayCash = <Icon name="ruble" className="ms-0 me-2" title="Наличные" />;
export const typePayCard = <Icon name="credit card" className="ms-0 me-2" title="Безналичные" />;
export const typePayCheckingAccount = <Icon name="file text" className="ms-0 me-2" title="Расчетный счет" />;

const TypePayIcon = props => {

    const { type, title, color } = props;
    const { payTypes } = useSelector(s => s.main);

    let fund = payTypes.find(i => i.value === type);

    if (!fund) return null;

    return <span>
        {fund.icon?.name && <Icon
            name={fund.icon.name}
            className="ms-0 me-2"
            color={(color && fund?.icon?.color) ? fund.icon.color : null}
        />}
        {Boolean(title) && <b>{fund.text}</b>}
    </span>
}

export const getIconTypePay = (type, title = false, color = false) => {
    if (type === 1 || !type)
        return <span>{typePayCash}{title && <b>Наличные</b>}</span>;
    else if (type === 2)
        return <span>{typePayCard}{title && <b>Безналичные</b>}</span>;
    else if (type === 3)
        return <span>{typePayCheckingAccount}{title && <b>Расчетный счёт</b>}</span>;
    else
        return <TypePayIcon type={type} title={title} color={color} />
}

const CashboxDataTableRow = props => {

    const { row, stats, keyId } = props;
    const deleted = Boolean(row.deleted_at);

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
    else
        typePay = <TypePayIcon type={row.type_pay} />

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
                <StatCashboxTotalRow type="incoming" stat={stat} />
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
                <StatCashboxTotalRow type="expense" stat={stat} />
            </Table.Cell>
            <Table.Cell colSpan={3} />
        </Table.Row>}

        {toDate && <Table.Row active className="cashbox-date-row" >
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

            <Table.Cell disabled={deleted}>{row.name}</Table.Cell>

            <Table.Cell disabled={deleted}>
                {row.sum > 0 && <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                    {typePay}
                    {row.sum.toFixed(2)}
                </strong>}
            </Table.Cell>

            <Table.Cell disabled={deleted}>
                {row.sum < 0 && <strong className={row.sum >= 0 ? "text-success" : "text-danger"}>
                    {typePay}
                    {row.sum.toFixed(2)}
                </strong>}
            </Table.Cell>

            {/* <Table.Cell disabled={deleted}>{moment(row.date).format("DD.MM.YYYY")}</Table.Cell> */}

            <Table.Cell disabled={deleted}>
                <div className="d-flex align-items-center">
                    {row.purpose && <PurposeType data={row.purpose} />}
                    {(row.purpose && row.comment) && <span className="mx-2">/</span>}
                    {row.comment && <span><small className="opacity-80">{row.comment}</small></span>}
                </div>
            </Table.Cell>

            <Table.Cell disabled={deleted}>
                {Boolean(row.period_start && row.period_stop)
                    ? <div className="d-flex text-nowrap">
                        <div className="me-1">с {moment(row.period_start).format("DD.MM.YYYY")}</div>
                        <div>по {moment(row.period_stop).format("DD.MM.YYYY")}</div>
                    </div>
                    : (row.month && <div>{moment(row.month).format("MMMM YYYY")}</div>)}
            </Table.Cell>

            {/* <Table.Cell disabled={deleted}>
                <small className="opacity-50">{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>
            </Table.Cell> */}

            <Table.Cell textAlign="center">
                <DropdownRowMenu row={row} setRows={props.setRows} />
            </Table.Cell>

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

export const StatCashboxTotalRow = props => {

    const { stat, type } = props;

    // console.log(stat, type)

    if (typeof stat != "object" || (type !== "incoming" && type != "expense"))
        return null;

    const rows = [];

    for (let i in stat) {
        if (i.indexOf(type + "Type") >= 0 && stat[i] !== 0) {
            let typeId = Number(i.replace(type + "Type", ""));
            rows.push({ sum: stat[i], type: typeId })
        }
    }

    return rows.map((r, i) => <div className="text-nowrap" key={i}>
        <TypePayIcon type={r.type} />
        {r.sum.toFixed(2)}
    </div>);

}

const DropdownRowMenu = props => {

    const dispatch = useDispatch();
    const { row, setRows } = props;
    const [drop, setDrop] = React.useState(false);
    const deleted = Boolean(row.deleted_at);

    React.useEffect(() => {

        if (drop) {
            axios.post('cashbox/remove', { id: row.id })
                .then(({ data }) => {
                    typeof setRows == "function" && setRows(p => {
                        let rows = [];
                        p.forEach(row => {
                            if (row.id === data.row.id) {
                                row.deleted_at = data.row.deleted_at;
                            }
                            rows.push(row);
                        })
                        return rows;
                    });
                })
                .catch(e => { })
                .then(() => {
                    setDrop(false);
                });
        }

    }, [drop]);

    return <Dropdown
        icon={null}
        trigger={<Icon
            name="ellipsis vertical"
            link
        />}
        direction="left"
        loading={drop}
    >
        <Dropdown.Menu>
            <Dropdown.Item
                icon="pencil"
                content="Изменить"
                onClick={() => dispatch(setShowCashboxRowEdit(row))}
                disabled={Boolean(row.deleted_at)}
            />
            <Dropdown.Item
                icon={deleted ? "redo" : "trash"}
                content={deleted ? "Восстановить" : "Удалить"}
                onClick={() => setDrop(row)}
                disabled={drop}
            />
        </Dropdown.Menu>
    </Dropdown>
}

export default CashboxDataTableRow;