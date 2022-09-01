import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import { setIncomeSourceAdd } from "../../store/incomes/actions";
import { axios } from "../../system";

const IncomeSourceAdd = props => {

    const { setRows } = props;
    const dispatch = useDispatch();
    const { showSourceAdd } = useSelector(s => s.incomes);

    const [loading, setLoading] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const handleChange = React.useCallback((e, { name, value, prename, checked, type }) => {

        setFormdata(p => {

            if (prename) {
                let data = { ...p[prename], [name]: value };
                name = prename;
                value = data;
            }

            if (type === "checkbox") {
                value = checked;
            }

            return { ...p, [name]: value }

        });

    }, []);

    React.useEffect(() => {

        if (Boolean(showSourceAdd?.id)) {

            setLoading(true);

            axios.get('incomes/source/get', {
                params: { id: showSourceAdd.id }
            }).then(({ data }) => {
                setFormdata(data.row);
            }).catch(e => {
            }).then(() => {
                setLoading(false);
            });
        }

        return () => {
            setFormdata({});
            setSave(false);
        }

    }, [showSourceAdd]);

    React.useEffect(() => {

        if (save) {

            axios.put('incomes/source/save', formdata)
                .then(({ data }) => {
                    setRows(p => {
                        let parts = [...p];
                        parts.map((p, k) => {
                            p.rows.map((r, i) => {
                                if (r.id === data.source.id)
                                    parts[k].rows[i] = data.source;
                            });
                        });
                        return parts;
                    });
                })
                .catch(e => {
                    setSave(false);
                });
        }

    }, [save]);

    return <Modal
        open={Boolean(showSourceAdd)}
        header={Boolean(showSourceAdd?.id) ? "Изменить данные помещения" : "Добавить помещение"}
        centered={false}
        size="small"
        closeIcon={<Icon name="close" onClick={() => dispatch(setIncomeSourceAdd(false))} />}
        content={<div className="content position-relative">

            <Form>

                <Form.Group>

                    <Form.Field width={10}>
                        <Form.Input
                            label="Наименование"
                            placeholder="Введите наименование"
                            name="name"
                            value={formdata?.name || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={6}>
                        <Form.Input
                            label="ИНН"
                            placeholder="Введите ИНН организации"
                            name="inn"
                            value={formdata?.inn || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group>

                    <Form.Field width={4}>
                        <Form.Input
                            label="Кабинет"
                            placeholder="Укажите кабинет"
                            name="cabinet"
                            value={formdata?.cabinet || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={4}>
                        <Form.Input
                            label="Площадь, м²"
                            placeholder="Укажите площадь"
                            name="space"
                            value={formdata?.space || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={4}>
                        <Form.Input
                            label="Стоимость 1 м²"
                            placeholder="Укажите стоимость"
                            name="price"
                            value={formdata?.price || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={4}>
                        <Form.Input
                            label="Дата начала"
                            placeholder="Укажите стоимость"
                            type="date"
                            name="date"
                            value={formdata?.date || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group>

                    <Form.Field width={8}>
                        <Form.Input
                            label="Контактное лицо"
                            placeholder="Введите ФИО"
                            name="contact_person"
                            value={formdata?.contact_person || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={8}>
                        <Form.Input
                            label="Контакты"
                            placeholder="Введите контактные данные"
                            name="contact_number"
                            value={formdata?.contact_number || ""}
                            onChange={handleChange}
                            disabled={save}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Checkbox
                    label="Помещение свободное"
                    toggle
                    name="is_free"
                    checked={formdata?.is_free || false}
                    onChange={handleChange}
                    disabled={save}
                />

                <Form.TextArea
                    label="Комментарий к дате"
                    placeholder="Введите комментарий"
                    rows={2}
                    prename="settings"
                    name="comment_date"
                    value={formdata?.settings?.comment_date || ""}
                    onChange={handleChange}
                    disabled={save}
                />

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Введите комментарий"
                    rows={4}
                    prename="settings"
                    name="comment"
                    value={formdata?.settings?.comment || ""}
                    onChange={handleChange}
                    disabled={save}
                />

            </Form>

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </div>}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: () => dispatch(showSourceAdd(false)),
                disabled: loading || save,
            },
            {
                key: "save",
                content: "Сохранить",
                color: "green",
                icon: "save",
                labelPosition: "right",
                disabled: loading || save,
                onClick: () => setSave(true),
                loading: save,
            }
        ]}
    />
}

export default IncomeSourceAdd;