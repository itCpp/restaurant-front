import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Table, Icon, Loader, Modal } from "semantic-ui-react";
import { setShowIncomes } from "../../store/incomes/actions";
import { axios } from "../../system";
import moment from "moment";

const IncomesView = props => {

    const dispatch = useDispatch();
    const { show } = useSelector(s => s.incomes);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {

        if (Boolean(show)) {

            setLoading(true);

            axios.post('incomes/view', { source_id: show?.id || null })
                .then(({ data }) => {
                    setRows(data.rows);
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
        header="Оплаты"
        centered={false}
        size="large"
        closeIcon={{ name: "close", onClick: () => dispatch(setShowIncomes(false)) }}
        content={{
            scrolling: !loading,
            content: <div className="position-relative">

                {loading && <div className="my-4">&nbsp;</div>}

                {!loading && rows.length === 0 && <div className="text-center my-4 opacity-40">
                    <strong>Данных ещё нет</strong>    
                </div>}

                {!loading && !error && rows.length > 0 && <Table compact basic="very" selectable>

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