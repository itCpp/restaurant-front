import React from "react";
import { Button, Dropdown, Grid, Header, Icon, Input, Portal } from "semantic-ui-react";
import Segment from "../UI/Segment";
import { axios, moment } from "../../system";

const ucFirst = str => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}

const TenantPays = props => {

    const { row, setRow } = props;
    const { pays } = row;

    return <Segment>

        <Header as="h3" className="mb-4">Платежи</Header>

        {Boolean(row.fine) && <FineRow
            row={row}
            setRow={setRow}
        />}

        {(row.next_pays || []).length > 0 && <div className="mb-2">
            {row.next_pays.map((pay, i) => <NextPayRow
                key={i}
                row={pay}
                income_part_id={row.part_id}
                income_source_id={row.id}
                setRow={setRow}
            />)}
            <span></span>
        </div>}

        {pays.length > 0 && <Grid padded>

            {pays.map(pay => <Grid.Row key={pay.month} stretched columns="equal" className="py-1">

                <Grid.Column>
                    <span className="py-1">{ucFirst(moment(pay.month).format("MMMM YYYY"))}</span>
                </Grid.Column>

                <Grid.Column width={12}>
                    {pay.rows.map((item, key) => <PayRowColumn
                        key={`${pay.month}_${key}`}
                        row={item}
                        source={row}
                        month={pay.month}
                        setRow={setRow}
                    />)}
                </Grid.Column>

            </Grid.Row>)}

        </Grid>}

    </Segment>
}

const FineRow = props => {

    const { row, setRow } = props;
    const [addReady, setAddReady] = React.useState(false);

    return <div className="pay-row-tenant px-3 text-danger position-relative">
        <div className="me-3 opacity-60">{moment().format("DD.MM.YYYY")}</div>
        <div><Icon name="ban" /></div>
        <div className="flex-grow-1">Пеня за просроченные платежи <b>{row.fine} р.</b></div>
        <span>
            <Icon
                name="plus"
                fitted
                link
                title="Добавить оплату пени"
                onClick={() => setAddReady(true)}
            />
        </span>
        <AddPayForm
            show={addReady}
            close={() => setAddReady(false)}
            setRow={setRow}
            date={moment().format("YYYY-MM-DD")}
            sum={row.fine}
            purpose_pay={0}
            fine={true}
            income_part_id={row.part_id}
            income_source_id={row.id}
        />
    </div>
}

const NextPayRow = props => {

    const { row, setRow } = props;
    const { income_part_id, income_source_id } = props;
    const [addReady, setAddReady] = React.useState(false);

    return <div className="position-relative pay-row-tenant px-3" style={{ minHeight: 31 }}>

        <div className="me-3 opacity-60">{moment(row.date).format("DD.MM.YYYY")}</div>

        <div><Icon name={row.icon} /></div>

        <div className="flex-grow-1">{row.title}</div>

        <span>
            <Icon
                name="plus"
                fitted
                link
                title="Добавить платеж"
                onClick={() => setAddReady(true)}
            />
        </span>

        <AddPayForm
            show={addReady}
            close={() => setAddReady(false)}
            setRow={setRow}
            date={moment().format("YYYY-MM-DD")}
            sum={row.price}
            purpose_pay={row.type}
            income_part_id={income_part_id}
            income_source_id={income_source_id}
            nextPayRow={row}
        />

    </div>
}

const PayRowColumn = props => {

    const { month, row, setRow, source } = props;
    const [load, setLoad] = React.useState(false);
    const [addPay, setAddPay] = React.useState(false);

    const className = ["pay-row-tenant position-relative"];
    !Boolean(row.purpose_every_month) && className.push("pay-row-type-one");

    let pay_color = Boolean(row.sum) ? "green" : (Boolean(row.hide_overdue) ? "red" : null)
    let pay_title = Boolean(row.sum) ? "Оплачено" : "Не оплачено";

    !Boolean(pay_color) && !Boolean(row.sum) && className.push("pay-row-no-pay");

    if (row.deleted_at) {
        className.push("deleted-pay");
        pay_color = null;
    }

    const setHideOverdue = React.useCallback(formdata => {

        setLoad("setHideOverdue");

        axios.post('incomes/setHideOverdue', formdata)
            .then(({ data }) => {

                setRow(p => {
                    let source = { ...p, ...data.source };

                    (source.pays || []).forEach((m, i) => {
                        if (m.month === data.month) {
                            m.rows.forEach((r, k) => {
                                if (data.row?.purpose_id && r?.purpose_id === data.row?.purpose_id) {
                                    source.pays[i].rows[k] = { ...r, ...data.row };
                                }
                            });
                        }
                    });

                    return source;
                });
            })
            .catch(e => null)
            .then(() => setLoad(false));
    }, []);

    const dropPay = React.useCallback(formdata => {

        setLoad("dropPay");

        axios.post('incomes/drop', formdata)
            .then(({ data }) => {

                setRow(p => {
                    let source = { ...p, ...data.source };

                    (source.pays || []).forEach((m, i) => {
                        if (m.month === data.month) {
                            m.rows.forEach((r, k) => {
                                if (r.id === data.row.id) {
                                    source.pays[i].rows[k] = { ...r, ...data.row };
                                    console.log(source.pays[i].rows[k]);
                                }
                            });
                        }
                    });

                    return source;
                });
            })
            .catch(e => null)
            .then(() => setLoad(false));
    }, []);

    return <div className={className.join(" ")}>

        <div className="me-3 opacity-60">{moment(row.date).format("DD.MM.YYYY")}</div>

        <div title={pay_title}>

            {Boolean(row.purpose_icon) && <Icon
                name={row.purpose_icon}
                className="me-3"
                color={pay_color}
            />}

            {!Boolean(row.purpose_icon) && Boolean(row.sum) && <Icon
                color="green"
                name="check"
            />}

        </div>

        <div className="me-3">{row.purpose_name}</div>
        <div className="flex-grow-1">{row.sum}</div>

        <div className="buttons-row">

            {Boolean(row.sum) && <>

                {!Boolean(row.deleted_at) && <span>
                    <Dropdown
                        icon={null}
                        trigger={<Icon
                            name="trash"
                            color="red"
                            link={load === false}
                            disabled={load !== false}
                        />}
                        direction="left"
                    >
                        <Dropdown.Menu>
                            <div className="px-2 py-1" style={{ maxWidth: 200 }}>
                                <div className="mb-2" style={{ wordWrap: "normal", whiteSpace: "normal" }}>Вы действительно хотите удалить платёж?</div>
                                <div className="d-flex">
                                    <Button
                                        content="Нет"
                                        size="mini"
                                        fluid
                                    />
                                    <Button
                                        content="Да"
                                        color="red"
                                        onClick={() => dropPay({ id: row.id })}
                                        size="mini"
                                        fluid
                                    />
                                </div>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                </span>}

            </>}

            {!Boolean(row.sum) && <>

                <span>
                    <Icon
                        name="plus"
                        link
                        title="Добавить платеж"
                        onClick={() => setAddPay(true)}
                    />
                </span>

                <span>
                    <Icon
                        name={!Boolean(row.hide_overdue) ? "eye slash" : "eye"}
                        link={load === false}
                        disabled={load !== false}
                        title="Не учитывать как просроченное"
                        onClick={() => setHideOverdue({
                            month: month,
                            purpose: row?.purpose?.id,
                            source_id: source?.id,
                        })}
                    />
                </span>

            </>}
        </div>

        {!Boolean(row.sum) && <AddPayForm
            show={addPay}
            close={() => setAddPay(false)}
            setRow={setRow}
            date={moment(row.date).format("YYYY-MM-DD")}
            sum={Number(row?.source?.price) * Number(row?.source?.space)}
            purpose_pay={row.purpose_pay}
            income_part_id={row?.source?.part_id}
            income_source_id={row.income_source_id}
            lostPayRow={row}
        />}

    </div>

}

const AddPayForm = props => {

    const { show, close, setRow, fine } = props;
    const { date, sum, purpose_pay, income_part_id, income_source_id } = props;
    const { nextPayRow, lostPayRow } = props;

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

    React.useEffect(() => {

        if (show) {
            setFormdata({ date, sum, purpose_pay, income_part_id, income_source_id, fine });
        }

    }, [show]);

    React.useEffect(() => {

        if (save) {
            axios.post('/incomes/save', formdata)
                .then(({ data }) => {

                    typeof close == "function" && close();

                    typeof setRow == "function" && setRow(p => {

                        let source = { ...p, ...data.source },
                            pays = [...(p.pays || [])],
                            next_pays = [...(p.next_pays || [])];

                        source.pays = [];

                        if (nextPayRow) {

                            source.next_pays = [];

                            next_pays.forEach(r => {
                                if (nextPayRow.date != r.date)
                                    source.next_pays.push(r);
                            });
                        } else {
                            source.next_pays = next_pays;
                        }

                        let add = true,
                            month = null;

                        if (lostPayRow)
                            month = moment(lostPayRow.date).format("YYYY-MM");

                        pays.forEach(r => {

                            let monthRows = [];

                            if (r.month === data.row.month) {
                                add = false;
                                monthRows.push(data.pay);
                            }

                            r.rows.forEach(rr => {

                                if (
                                    month
                                    && !Boolean(rr.sum)
                                    && month === data.pay.month
                                    && rr.purpose_pay === data.pay.purpose_pay
                                ) return;

                                monthRows.push(rr);
                            });

                            source.pays.push({ ...r, rows: monthRows });
                        });

                        add && source.pays.unshift({
                            month: data.row.month,
                            rows: [data.pay],
                        });

                        return source;
                    });
                })
                .catch(e => setSaveError(axios.post(e)))
                .then(() => setSave(false));
        }

    }, [save]);

    if (!show)
        return null;

    return <div
        style={{
            position: "absolute",
            right: 0,
            bottom: (nextPayRow || fine) ? 1 : 0,
            top: (nextPayRow || fine) ? 1 : 0,
            left: 0,
            background: "#ffffffe6",
        }}
        className="d-flex justify-content-end"
    >
        <Input
            size="mini"
            type="date"
            className="me-1"
            style={{ maxHeight: "100%" }}
            value={formdata.date || ""}
            onChange={(e, { value }) => setFormdata(p => ({ ...p, date: value }))}
            disabled={save}
        />
        <Input
            size="mini"
            placeholder="Введите сумму"
            type="number"
            step="0.01"
            value={formdata.sum || ""}
            onChange={(e, { value }) => setFormdata(p => ({ ...p, sum: value }))}
            className="me-1"
            disabled={save}
        />
        <Button
            icon="save"
            size="mini"
            color={saveError ? "red" : "green"}
            onClick={() => setSave(true)}
            loading={save}
            disabled={save}
            className="me-1"
        />
        <Button
            icon="cancel"
            size="mini"
            className="me-0"
            onClick={() => close()}
            disabled={save}
        />
    </div>

}

export default TenantPays;