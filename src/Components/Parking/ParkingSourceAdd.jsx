import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import { setIncomeSourceAdd } from "../../store/incomes/actions";
import { axios } from "../../system";

const IncomeSourceAdd = props => {

    const { setRow, setRows, toPays } = props;
    const dispatch = useDispatch();
    const { id } = useParams();
    const { showSourceAdd } = useSelector(s => s.incomes);

    const [loading, setLoading] = React.useState(true);
    const [formdata, setFormdata] = React.useState({});
    const [parts, setParts] = React.useState([]);

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const handleChange = React.useCallback((e, { name, value, prename, checked, type }) => {

        setFormdata(p => {

            if (type === "checkbox") {
                value = checked;
            }

            if (prename) {
                let data = { ...p[prename], [name]: value };
                name = prename;
                value = data;
            }

            return { ...p, [name]: value }

        });

    }, []);

    React.useEffect(() => {

        if (Boolean(showSourceAdd)) {

            setLoading(true);

            axios.get('incomes/source/get', {
                params: {
                    id: showSourceAdd?.id,
                    getParts: true,
                    building: id
                }
            }).then(({ data }) => {
                setFormdata(data.row);
                setParts(data.parts);
            }).catch(e => {

            }).then(() => {
                setLoading(false);
            });
        }

        return () => {
            setLoading(true);
            setFormdata({});
            setSave(false);
            setSaveError(null);
            setSaveErrors({});
        }

    }, [showSourceAdd]);

    React.useEffect(() => {

        if (save) {

            axios.put('incomes/source/save', {
                ...formdata,
                toParking: true,
                is_parking: true,
                toPays,
            })
                .then(({ data }) => {

                    const dataRow = toPays ? { ...data.row, pays: data.pays } : data.row;

                    typeof setRows == "function" && setRows(p => {

                        let rows = [],
                            add = true;

                        p.forEach(r => {

                            let row = { ...r };

                            if (row.id === dataRow.id) {
                                row = { ...row, ...dataRow };
                                add = false;
                            }

                            rows.push(row);
                        });

                        add && rows.push(dataRow);

                        return rows;
                    });

                    typeof setRow == "function" && setRow(p => ({ ...p, ...dataRow }));

                    dispatch(setIncomeSourceAdd(false));

                })
                .catch(e => {
                    setSave(false);
                    setSaveError(axios.getError(e));
                    setSaveErrors(axios.getErrors(e));
                });
        }

    }, [save]);

    return <Modal
        open={Boolean(showSourceAdd)}
        header={Boolean(showSourceAdd?.id) ? "Изменить данные арендатора" : "Добавить арендатора"}
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
                            error={Boolean(saveErrors.name)}
                        />
                    </Form.Field>

                    <Form.Field width={6}>
                        <Form.Input
                            label="ИНН/ОГРН"
                            placeholder="Введите ИНН и ОГРН организации"
                            name="inn"
                            value={formdata?.inn || ""}
                            onChange={handleChange}
                            disabled={save}
                            error={Boolean(saveErrors.inn)}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group widths={2}>

                    <Form.Input
                        label="Контактное лицо"
                        placeholder="Введите ФИО"
                        name="contact_person"
                        value={formdata?.contact_person || ""}
                        onChange={handleChange}
                        disabled={save}
                        error={Boolean(saveErrors.contact_person)}
                    />

                    <Form.Input
                        label="Контакты"
                        placeholder="Введите контактные данные"
                        name="contact_number"
                        value={formdata?.contact_number || ""}
                        onChange={handleChange}
                        disabled={save}
                        error={Boolean(saveErrors.contact_number)}
                    />

                </Form.Group>

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Введите комментарий"
                    rows={4}
                    prename="settings"
                    name="comment"
                    value={formdata?.settings?.comment || ""}
                    onChange={handleChange}
                    disabled={save}
                    error={Boolean(saveErrors.comment)}
                />

            </Form>

            {saveError && <div className="text-danger mt-3"><b>Ошибка</b>{' '}{saveError}</div>}

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </div>}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: () => dispatch(setIncomeSourceAdd(false)),
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