import React from "react";
import { Button, Dimmer, Dropdown, Icon, Input, Loader } from "semantic-ui-react";
import { axios, moment } from "../../system";

const TenantPaysAddPay = props => {

    const { show, close, setRow, fine } = props;
    const { date, sum, purpose_pay, income_part_id, income_source_id, parking_id, service_id } = props;
    const { nextPayRow, lostPayRow } = props;

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);
    const [saveErrors, setSaveErrors] = React.useState({});

    React.useEffect(() => {

        if (show) {
            setFormdata({
                date,
                month: moment(date || new Date).format("YYYY-MM"),
                sum,
                purpose_pay,
                income_part_id: income_part_id || 0,
                income_source_id,
                service_id,
                fine,
                parking_id: parking_id || null,
                type_pay: 1,
            });
        }

    }, [show]);

    React.useEffect(() => {

        if (save) {
            axios.post('/incomes/save', formdata)
                .then(({ data }) => {

                    typeof setRow == "function" && setRow(p => {

                        let source = { ...p, ...data.source },
                            pays = [...(p.pays || [])],
                            next_pays = [...(p.next_pays || [])];

                        source.pays = [];

                        if (nextPayRow) {

                            source.next_pays = [];

                            next_pays.forEach(r => {
                                if ((r.type === data.row.purpose_id && r.income_source_parking_id !== data.row.income_source_parking_id) || r.type !== data.row.purpose_id) {
                                    source.next_pays.push(r);
                                }
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

                                let rrMonth = moment(rr.date || new Date).format("YYYY-MM");

                                if (
                                    month
                                    && !Boolean(rr.sum)
                                    && rrMonth === data.pay.month
                                    && rr.purpose_pay === data.pay.purpose_pay
                                    && rr.income_source_parking_id === data.pay.income_source_parking_id
                                ) {
                                    return;
                                } else if (
                                    month
                                    && !Boolean(rr.sum)
                                    && rrMonth === data.pay.month
                                    && rr.purpose_pay === data.pay.purpose_pay
                                ) {
                                    return;
                                }

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

                    typeof close == "function" && close();
                })
                .catch(e => {
                    setSaveError(axios.getError(e));
                    setSaveErrors(axios.getErrors(e));
                })
                .then(() => setSave(false));
        }

    }, [save]);

    return <Dropdown
        open={show}
        icon={null}
        trigger={props.trigger || null}
        direction="left"
    >
        <Dropdown.Menu>
            <div className="p-1 position-relative" style={{ maxWidth: 200, color: "#000000" }}>

                <div className="mb-1 px-1 d-flex align-items-center">
                    <strong className="flex-grow-1">Новый платеж</strong>
                    <Icon
                        name="cancel"
                        fitted
                        link={!save}
                        disabled={save}
                        onClick={() => close()}
                    />
                </div>

                <label className="px-1"><small><b>Дата</b></small></label>
                <Input
                    size="mini"
                    type="date"
                    style={{ maxHeight: 32 }}
                    value={formdata.date || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, date: value }))}
                    disabled={save}
                    fluid
                    className="mb-1"
                    error={Boolean(saveErrors?.date)}
                />

                <label className="px-1"><small><b>Отчетный месяц</b></small></label>
                <Input
                    size="mini"
                    type="month"
                    style={{ maxHeight: 32 }}
                    value={formdata.month || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, month: value }))}
                    disabled={save}
                    fluid
                    className="mb-1"
                    error={Boolean(saveErrors?.month)}
                />

                <label className="px-1"><small><b>Сумма</b></small></label>
                <Input
                    size="mini"
                    placeholder="Введите сумму"
                    type="number"
                    step="0.01"
                    value={formdata.sum || ""}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, sum: value }))}
                    disabled={save}
                    fluid
                    className="mb-1"
                    error={Boolean(saveErrors?.sum)}
                />

                <Button.Group size="mini" fluid>
                    <Button
                        content="Нал."
                        active={formdata.type_pay === 1}
                        color={formdata.type_pay === 1 ? "green" : null}
                        onClick={() => setFormdata(p => ({ ...p, type_pay: 1 }))}
                        disabled={save}
                    />
                    <Button
                        content="Б/Н"
                        active={formdata.type_pay === 2}
                        color={formdata.type_pay === 2 ? "blue" : null}
                        onClick={() => setFormdata(p => ({ ...p, type_pay: 2 }))}
                        disabled={save}
                    />
                    <Button
                        content="Р/С"
                        active={formdata.type_pay === 3}
                        color={formdata.type_pay === 3 ? "orange" : null}
                        onClick={() => setFormdata(p => ({ ...p, type_pay: 3 }))}
                        disabled={save}
                    />
                </Button.Group>

                <div className="mt-1 pb-1 px-1 d-flex align-items-center justify-content-between">
                    <Icon
                        name="cancel"
                        fitted
                        link={!save}
                        disabled={save}
                        onClick={() => close()}
                    />
                    <Icon
                        name="save"
                        color={saveError ? "red" : "green"}
                        fitted
                        link={!save}
                        disabled={save}
                        onClick={() => setSave(true)}
                    />
                </div>

                <Dimmer active={save} inverted>
                    <Loader />
                </Dimmer>

            </div>
        </Dropdown.Menu>
    </Dropdown>

}

export default TenantPaysAddPay;