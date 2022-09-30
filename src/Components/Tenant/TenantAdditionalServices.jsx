import React from "react";
import Segment from "../UI/Segment";
import { Button, Dimmer, Header, Loader, Message, Modal } from "semantic-ui-react";
import { axios } from "../../system";

const TenantAdditionalServices = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {

        setLoading(false);

    }, []);

    return <Segment className="pb-4">

        <div className="mb-4 d-flex align-items-center">
            <Header as="h3" className="mb-0 flex-grow-1">Дополнительные услуги</Header>
            <SelectAdditionalServices row={props.row} setRows={setRows} />
        </div>

        {!loading && !error && rows.length === 0 && <div className="mx-auto my-5 text-center">
            <span className="opacity-30">Услуги не найдены</span>
        </div>}

        <Dimmer active={loading} inverted>
            <Loader />
        </Dimmer>

    </Segment>
}

export const SelectAdditionalServices = props => {

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        if (open) {

            setLoading(true);

            axios.get('services/list')
                .then(({ data }) => {

                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setLoading(true);
            setError(null);
        }

    }, [open]);

    return <Modal
        open={open}
        header="Добавить дополнительную услугу"
        centered={false}
        size="tiny"
        closeIcon
        onClose={() => setOpen(false)}
        trigger={<Button
            icon="plus"
            size="mini"
            color="green"
            basic
            onClick={() => setOpen(true)}
        />}
        content={<div className="content position-relative">

            {!loading && error && <Message error content={error} size="mini" />}

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </div>}
    />

}

export default TenantAdditionalServices;