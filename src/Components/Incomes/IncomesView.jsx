import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Table, Icon, Loader, Modal } from "semantic-ui-react";
import { setShowIncomes } from "../../store/incomes/actions";
import { axios, moment } from "../../system";

const IncomesView = props => {

    const dispatch = useDispatch();
    const { show } = useSelector(s => s.incomes);
    const { setSourceRows } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [row, setRow] = React.useState({});
    const [load, setLoad] = React.useState(false);

    const setHideOverdue = React.useCallback(formdata => {
        setLoad(false);
        axios.post('incomes/setHideOverdue', formdata)
            .then(({ data }) => {

                setData(p => {
                    let rows = [...p];
                    rows.forEach((m, i) => {
                        if (m.month === data.month) {
                            m.rows.forEach((r, k) => {
                                if (data.row?.purpose_id && r?.purpose_id === data.row?.purpose_id) {
                                    rows[i].rows[k] = { ...r, ...data.row };
                                }
                            });
                        }
                    });
                    return rows;
                });

                if (typeof setSourceRows === "function") {
                    setSourceRows(p => {
                        let rows = [...p];
                        rows.forEach((m, i) => {
                            m.rows.forEach((r, k) => {
                                if (data.source?.id && r?.id === data.source?.id) {
                                    rows[i].rows[k] = { ...r, ...data.source };
                                }
                            });
                        });
                        return rows;
                    });
                }
            })
            .catch(e => null)
            .then(() => setLoad(false));
    }, []);

    React.useEffect(() => {

        if (Boolean(show)) {

            setLoading(true);
            setRow(show);

            axios.post('incomes/view', { source_id: show?.id || null })
                .then(({ data }) => {
                    setRows(data.rows);
                    setData(data.data);
                    setRow(data.row);
                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setRows([]);
            setError(null);
            setLoading(true);
        }

    }, [show]);

    return <Modal
        open={Boolean(show)}
        header={`Платежи${row?.name ? ` - ${row.name}` : ""}`}
        centered={false}
        // size="large"
        closeIcon={{ name: "close", onClick: () => dispatch(setShowIncomes(false)) }}
        content={{
            scrolling: !loading,
            content: <div className="position-relative">

                {loading && <div className="my-4">&nbsp;</div>}

                {!loading && data.length === 0 && <div className="text-center my-4 opacity-40">
                    <strong>Данных ещё нет</strong>
                </div>}

                {!loading && !error && data.length > 0 && <Table compact basic="very" textAlign="center">

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Месяц</Table.HeaderCell>
                            <Table.HeaderCell textAlign="left">Назначение</Table.HeaderCell>
                            <Table.HeaderCell>Дата</Table.HeaderCell>
                            <Table.HeaderCell>Сумма</Table.HeaderCell>
                            <Table.HeaderCell>Дата ввода информации</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.map((item, key) => {
                            return item.rows.map((iRow, i) => <Table.Row
                                key={`${key}_${i}`}
                                className={`pay-row ${(!Boolean(iRow.sum) && !Boolean(iRow.hide_overdue)) ? "no-pay" : ""} ${Boolean(iRow.purpose?.every_month
                                ) ? "" : "one-pay"}`}
                            >
                                {i === 0 && <Table.Cell
                                    content={moment(item.month).format("MMM YYYY").toUpperCase()}
                                    rowSpan={item.rows.length}
                                    verticalAlign="top"
                                    className="not-colors"
                                />}
                                <Table.Cell
                                    textAlign="left"
                                    className="ps-3 pe-2"
                                    content={<div className="d-flex">
                                        {iRow.purpose && <div>
                                            {iRow.purpose?.icon && <span>
                                                <Icon
                                                    name={iRow.purpose?.icon}
                                                    color={Boolean(iRow.sum) ? "green" : ((!Boolean(iRow.sum) && Boolean(iRow.hide_overdue)) ? "red" : null)}
                                                    className="me-3"
                                                />
                                            </span>}
                                            <span>{iRow.purpose?.name}</span>
                                        </div>}
                                    </div>}
                                />
                                <Table.Cell
                                    content={Boolean(iRow.sum) && moment(iRow.date || iRow.created_at).format("DD.MM.YYYY")}
                                />
                                <Table.Cell
                                    content={<div>
                                        <code>{iRow.sum}</code>
                                        <PayTypeIcon type={iRow.type_pay} />
                                    </div>}
                                />
                                <Table.Cell
                                    className="pe-2"
                                    content={<div className="d-flex align-items-center" title="Дата ввода информации">

                                        <small className="flex-grow-1">{Boolean(iRow.sum) && moment(iRow.created_at).format("DD.MM.YYYY HH:mm")}</small>

                                        <div>

                                            {!Boolean(iRow.sum) && <span>
                                                <Icon
                                                    name={!Boolean(iRow.hide_overdue) ? "eye slash" : "eye"}
                                                    link={!load}
                                                    disabled={load}
                                                    title="Не учитывать как просроченное"
                                                    onClick={() => setHideOverdue({
                                                        month: item?.month,
                                                        purpose: iRow?.purpose?.id,
                                                        source_id: show?.id,
                                                    })}
                                                />
                                            </span>}

                                        </div>

                                    </div>}
                                />
                            </Table.Row>);
                        })}
                    </Table.Body>

                </Table>}

                {false && !loading && !error && rows.length > 0 && <Table compact basic="very" selectable>

                    <Table.Body>

                        {rows.map(row => <Table.Row key={row.id} textAlign="center">
                            <Table.Cell
                                content={moment(row.date || row.created_at).format("DD.MM.YYYY")}
                            />
                            <Table.Cell
                                content={<div className="d-flex">
                                    {/* {row.source?.cabinet && <b className="mx-1" title="Кабинет">{row.source.cabinet}</b>} */}
                                    {row.source?.name ? <span className="mx-1">{row.source.name}</span> : <span className="opacity-40 mx-1">ID#{row.source.id}</span>}
                                </div>}
                            />
                            <Table.Cell
                                content={<div>
                                    <code>{row.sum}</code>
                                    <PayTypeIcon type={row.type_pay} />
                                </div>}
                            />
                            <Table.Cell
                                content={<div>
                                    <small>{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</small>
                                </div>}
                            />
                        </Table.Row>)}

                    </Table.Body>

                </Table>}

                <Dimmer active={loading} inverted>
                    <Loader />
                </Dimmer>

            </div>
        }}
    />

}

const PayTypeIcon = ({ type }) => {

    const { payTypes } = useSelector(s => s.main);
    const typeObject = payTypes.find(s => s.value === type);

    if (typeObject?.icon) {
        return <Icon
            {...typeObject.icon}
            className="me-0 ms-2"
        />
    }

    return null;
}

export default IncomesView;