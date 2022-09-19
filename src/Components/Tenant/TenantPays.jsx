import React from "react";
import { Button, Grid, Header, Icon, Input } from "semantic-ui-react";
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

        <Header as="h5" className="mb-4">Платежи</Header>

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
                    {pay.rows.map((item, key) => <PayRowColumn key={`${pay.month}_${key}`} row={item} />)}
                </Grid.Column>

            </Grid.Row>)}

        </Grid>}

    </Segment>
}

const NextPayRow = props => {

    const { row, setRow } = props;
    const { income_part_id, income_source_id } = props;

    const [addReady, setAddReady] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

    React.useEffect(() => {

        if (addReady) {

            setSave(false);
            setSaveError(false);

            setFormdata({
                date: moment().format("YYYY-MM-DD"),
                sum: row.price,
                purpose_pay: row.type,
                income_part_id,
                income_source_id
            });

        }

    }, [addReady]);

    React.useEffect(() => {

        if (save) {
            axios.post('/incomes/save', formdata)
                .then(({ data }) => {
                    setAddReady(false);
                    setRow(p => {

                        let source = { ...p, ...data.source },
                            pays = [...(p.pays || [])],
                            next_pays = [...(p.next_pays || [])];

                        source.pays = [];
                        source.next_pays = [];

                        next_pays.forEach(r => {
                            if (row.date != r.date)
                                source.next_pays.push(r);
                        });

                        let add = true;

                        pays.forEach(r => {
                            if (r.month === data.row.month) {
                                add = false;
                                r.rows.unshift(data.pay);
                            }

                            source.pays.push(r);
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

    return <div className="position-relative pay-row-tenant px-3" style={{ minHeight: 31 }}>

        <div className="me-3 opacity-60">{moment(row.date).format("DD.MM.YYYY")}</div>

        <div><Icon name={row.icon} /></div>

        <div className="flex-grow-1">{row.title}</div>

        {addReady && <div style={{
            position: "absolute",
            right: "-0.25rem",
            bottom: -1,
            top: 0,
            left: 0,
            background: "#ffffffc4",
            textAlign: "right",
        }}>
            <Button
                icon="cancel"
                size="mini"
                basic
                className="mx-1"
                onClick={() => setAddReady(false)}
                disabled={save}
            />
            <Input
                size="mini"
                type="date"
                className="me-1"
                style={{ maxHeight: 30.25 }}
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
                basic
                color={saveError ? "red" : "green"}
                onClick={() => setSave(true)}
                loading={save}
                disabled={save}
            />
        </div>}

        {!addReady && <span><Icon name="plus" fitted link title="Добавить платеж" onClick={() => setAddReady(true)} /></span>}

    </div>
}

const PayRowColumn = props => {

    const { row } = props;

    const className = ["pay-row-tenant"];
    !Boolean(row.purpose_every_month) && className.push("pay-row-type-one");

    let pay_color = Boolean(row.sum) ? "green" : (Boolean(row.hide_overdue) ? "red" : null)
    let pay_title = Boolean(row.sum) ? "Оплачено" : "Не оплачено";

    !Boolean(pay_color) && !Boolean(row.sum) && className.push("pay-row-no-pay");

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

    </div>

}

export default TenantPays;