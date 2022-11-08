import React from "react";
import { Button, Dimmer, Header, Image, Label, List, Loader, Message, Modal } from "semantic-ui-react"
import { axios } from "../../system";
import { getIconTypePay } from "./CashboxDataTableRow";

const CashboxBaseInfoModal = props => {

    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});

    React.useEffect(() => {

        if (show) {

            setLoading(true);

            axios.get('cashbox/info')
                .then(({ data }) => setData(data))
                .catch(e => setError(axios.getError(e)))
                .then(() => setLoading(false));
        }

        return () => {
            setError(null);
            setLoading(true);
        }

    }, [show]);

    return <>

        <Modal
            open={show}
            centered={false}
            header="Информация из кассы"
            closeIcon
            onClose={() => setShow(false)}
            size="tiny"
            content={<div className="content position-relative">

                {!loading && error && <Message error content={error} size="mini" className="mb-0" />}

                {loading && <div className="text-center my-3 opacity-60">
                    <strong>Загрузка...</strong>
                </div>}

                {!loading && !error && <>

                    {data?.info && data.info.length > 0 && <div>

                        <List divided verticalAlign="middle" selection>
                            {data.info.map(r => <List.Item key={r.type_pay}>
                                <List.Content className="d-flex align-items-center">
                                    <span className="flex-grow-1">{getIconTypePay(r.type_pay, true)}</span>
                                    <Label color="green">{r.sum}</Label>
                                </List.Content>
                            </List.Item>)}
                        </List>

                    </div>}

                    {data?.safe && data.safe.length > 0 && <div className="mb-4">

                        <Header content="Деньги в сейфе" as="h3" />

                        <List divided verticalAlign="middle" selection>
                            {data.safe.map(r => <List.Item key={r.office_id}>

                                <List.Content className="d-flex align-items-center">

                                    {r.office?.icon && <Image avatar src={r.office.icon} />}

                                    <div className="flex-grow-1">
                                        <List.Header>{r.office?.name}</List.Header>
                                        {r.office?.addressLitle}
                                    </div>

                                    <Label color="green">{r.sum}</Label>
                                </List.Content>

                            </List.Item>)}
                        </List>

                    </div>}

                    {data?.cashbox && data.cashbox.length > 0 && <div className="mb-4">

                        <Header content="Деньги в кассе" as="h3" />

                        <List divided verticalAlign="middle" selection>
                            {data.cashbox.map(r => <List.Item key={r.office_id}>

                                <List.Content className="d-flex align-items-center">

                                    {r.office?.icon && <Image avatar src={r.office.icon} />}

                                    <div className="flex-grow-1">
                                        <List.Header>{r.office?.name}</List.Header>
                                        {r.office?.addressLitle}
                                    </div>

                                    <Label color="green">{r.cash}</Label>
                                </List.Content>

                            </List.Item>)}
                        </List>

                    </div>}

                </>}

                <Dimmer active={loading} inverted>
                    <Loader />
                </Dimmer>

            </div>}
        />

        <Button
            basic
            color="green"
            icon="info"
            size="mini"
            title="Информация из базы"
            onClick={() => setShow(true)}
        />
    </>
}

export default CashboxBaseInfoModal;