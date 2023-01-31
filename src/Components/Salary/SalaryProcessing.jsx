import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dimmer, Form, Header, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { setShowProcessing } from "../../store/actions";
import { axios, moment } from "../../system";

const SalaryProcessing = props => {

    const d = useDispatch();

    const { showProcessing } = useSelector(s => s.main);
    const { month } = props;
    const data = showProcessing;
    const open = Boolean(showProcessing);

    const [formdata, setFormdata] = useState({});
    const [loading, setLoading] = useState(true);
    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    const handleChangeProcessing = useCallback(({ key, name, value }) => {
        setFormdata(p => {

            let processings = p?.processings || [];

            if (typeof processings[key] == "undefined") {
                processings[key] = {};
            }

            processings[key][name] = value;

            return { ...p, processings }
        });
    }, []);

    const removeProcessingRow = useCallback(key => {
        setFormdata(p => {

            let processings = p?.processings || [],
                deleted = [];

            if (typeof processings[key] != "undefined") {
                deleted.push(processings[key]?.id || null);
                processings.splice(key, 1);
            }

            return { ...p, processings, deleted }
        });
    }, []);

    const close = useCallback(() => d(setShowProcessing(false)));

    useEffect(() => {

        if (data) {

            axios.get(`employees/salary/${data.id}/processing`, { params: { month } })
                .then(({ data }) => {
                    setFormdata({ processings: data.processings || [] });
                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => setLoading(false));

        }

        return () => {
            setFormdata({});
            setErrors({});
            setError(null);
            setLoading(true);
        }

    }, [data]);

    useEffect(() => {

        if (save) {
            axios.post(`employees/salary/${data.id}/processing`, formdata)
                .then(() => {
                    close();
                })
                .catch(e => {
                    setError(axios.getError(e));
                    setErrors(axios.getErrors(e));
                })
                .then(() => setSave(false));
        }

    }, [save]);

    return <Modal
        open={open}
        header="Ночные переработки"
        size="tiny"
        centered={false}
        closeIcon={<Icon name="close" onClick={() => !save && close()} />}
        content={<Form className="content" error={Boolean(error)}>

            <Header
                content={data?.fullname}
                subheader={data?.personal_data_processing_hour ? `${data.personal_data_processing_hour} руб/час` : null}
                as="h3"
            />

            {(formdata.processings || []).map((row, key) => {
                return <Form.Group widths={2} key={key}>
                    <Form.Input
                        label={key === 0 && "День переработки"}
                        placeholder="Укажите количество"
                        type="date"
                        name="date"
                        value={row?.date || ""}
                        onChange={(e, { name, value }) => handleChangeProcessing({ key, name, value })}
                        error={Boolean(errors[`processings.${key}.date`])}
                    />
                    <Form.Input
                        label={key === 0 && "Часы переработки"}
                        placeholder="Укажите количество"
                        type="number"
                        step="0.01"
                        name={`hour`}
                        value={row?.hour || ""}
                        onChange={(e, { name, value }) => handleChangeProcessing({ key, name, value })}
                        error={Boolean(errors[`processings.${key}.hour`])}
                        action={{
                            color: 'red',
                            icon: 'trash',
                            title: 'Удалить строку',
                            onClick: () => removeProcessingRow(key),
                        }}
                    />
                </Form.Group>
            })}

            {error && <Message content={error} error />}

            <Button basic fluid onClick={() => setFormdata(p => ({
                ...p,
                processings: [...(p.processings || []), {}],
            }))}>
                <Icon name="plus" /> Добавить строку
            </Button>

            <Button
                color="green"
                fluid
                disabled={(formdata?.processings || []).length === 0}
                className="mt-2"
                content={<><Icon nams="save" /> Сохранить</>}
                onClick={() => setSave(true)}
            />

            <Dimmer active={loading || save} inverted>
                <Loader />
            </Dimmer>

        </Form>}
    />
}

export default SalaryProcessing;