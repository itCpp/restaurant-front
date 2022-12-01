import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { Dimmer, Form, FormSelect, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { setShowClientEdit } from "../../store/client/actions";
import { axios } from "../../system";

const ClientEdit = props => {

    const { callback } = props;
    const { showEdit } = useSelector(s => s.client);
    const d = useDispatch();
    const [loading, setLoading] = React.useState(true);
    const [formdata, setFormdata] = React.useState({});
    const [error, setError] = React.useState(null);
    const [errorLoading, setErrorLoading] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [save, setSave] = React.useState(false);

    const close = React.useCallback(() => d(setShowClientEdit(false)), []);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (save) {
            axios.post(`clients/${typeof showEdit == "boolean" ? 'create' : `${showEdit.id}/save`}`, formdata)
                .then(({ data }) => {
                    typeof callback == "function" && callback(data);
                    close();
                })
                .catch(e => {
                    setErrors(axios.getErrors(e));
                    setError(axios.getError(e));
                })
                .then(() => {
                    setSave(false);
                })
        }

    }, [save]);

    React.useEffect(() => {

        if (typeof showEdit == "object") {

            setFormdata(showEdit);

            axios.get(`clients/${showEdit?.id}/get`)
                .then(({ data }) => {
                    setFormdata(data);
                })
                .catch(e => {
                    setErrorLoading(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });

        } else if (Boolean(showEdit)) {
            setLoading(false);
        }

        return () => {
            setLoading(true);
            setFormdata({});
            setError(null);
            setErrors({});
            setSave(false);
            setErrorLoading(null);
        }

    }, [showEdit]);

    return <Modal
        open={Boolean(showEdit)}
        header={"Добавить клиента"}
        centered={false}
        closeIcon={<Icon name="close" link onClick={close} />}
        size="small"
        content={{
            content: <div className="position-relative">

                <Form>

                    <Form.Group widths="equal">

                        <Form.Input
                            label="Наименование"
                            placeholder="Укажите наименование компании"
                            name="name"
                            value={formdata?.name || ""}
                            onChange={handleChange}
                            error={Boolean(errors?.name)}
                            required
                        />

                        <Form.Input
                            label="ИНН/ОГРН"
                            placeholder="Введите ИНН и ОГРН организации"
                            name="requisites"
                            value={formdata?.requisites || ""}
                            onChange={handleChange}
                            error={Boolean(errors?.requisites)}
                        />

                    </Form.Group>

                    <hr />

                    <Form.Group widths="equal">

                        <Form.Input
                            label="Контактное лицо"
                            placeholder="Введите ФИО"
                            name="contacts_name"
                            value={formdata?.contacts_name || ""}
                            onChange={handleChange}
                            error={Boolean(errors?.contacts_name)}
                        />

                        <Form.Input
                            label="Телефон"
                            placeholder="Введите номер телефона"
                            name="contacts_phone"
                            value={formdata?.contacts_phone || ""}
                            onChange={handleChange}
                            error={Boolean(errors?.contacts_phone)}
                        />

                        <Form.Input
                            label="E-mail"
                            placeholder="Введите e-mail"
                            name="contacts_email"
                            value={formdata?.contacts_email || ""}
                            onChange={handleChange}
                            error={Boolean(errors?.contacts_email)}
                        />

                    </Form.Group>

                    <Form.TextArea
                        label="Комментарий"
                        placeholder="Укажите комментарий"
                        name="comment"
                        value={formdata?.comment || ""}
                        onChange={handleChange}
                        error={Boolean(errors?.comment)}
                    />

                </Form>

                {(error || errorLoading) && <Message
                    error
                    content={error || errorLoading}
                    size="mini"
                    className="mb-0"
                />}

                <Dimmer active={save || loading} inverted>
                    <Loader />
                </Dimmer>

            </div>
        }}
        actions={[
            {
                key: 0,
                content: "Отмена",
                onClick: () => !save && close(),
                disabled: save || loading,
            },
            {
                key: 1,
                content: "Сохранить",
                icon: "save",
                labelPosition: "right",
                color: "green",
                onClick: () => setSave(true),
                disabled: save || loading,
            }
        ]}
    />

}

export default ClientEdit;