import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import { setShowAdd } from "../../store/incomes/actions";
import { axios } from "../../system";

const IncomeAdd = props => {

    const { setRows } = props;
    const dispatch = useDispatch();
    const { showAdd } = useSelector(s => s.incomes);
    const { payTypes } = useSelector(s => s.main);
    const [formdata, setFormdata] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const [parts, setParts] = React.useState([]);
    const [sources, setSources] = React.useState([]);
    const [purposes, setPurposes] = React.useState([]);
    const [loadSources, setLoadSources] = React.useState(false);
    const [selectSource, setSelectSource] = React.useState(null);

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (Boolean(showAdd)) {

            setLoading(true);

            if (typeof showAdd == "object") {
                setFormdata(p => ({
                    ...p,
                    income_part_id: showAdd.income_part_id || null,
                    income_source_id: showAdd.income_source_id || null,
                }))
            }

            axios.post('incomes/add', { income_part_id: showAdd?.income_part_id || null })
                .then(({ data }) => {
                    setParts(data.parts);
                    setSources(data.sources);
                    setPurposes(data.purposes || []);
                })
                .catch(e => {

                })
                .then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setFormdata({});
            setParts([]);
            setSources([]);
            setSelectSource(null);
            setSave(false);
            setSaveError(null);
            setSaveErrors({});
        }

    }, [showAdd]);

    React.useEffect(() => {

        if (Boolean(formdata?.income_part_id)) {

            setLoadSources(true);
            setSelectSource(null);

            axios.post('incomes/sources', { part_id: formdata.income_part_id })
                .then(({ data }) => {
                    setSources(data);
                })
                .catch(e => {

                })
                .then(() => setLoadSources(false));
        }

    }, [formdata?.income_part_id]);

    React.useEffect(() => {

        if (save) {

            axios.post('incomes/save', formdata)
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
                    dispatch(setShowAdd(false));
                })
                .catch(e => {
                    setSaveError(axios.getError(e));
                    setSaveErrors(axios.getErrors(e));
                    setSave(false);
                });
        }

    }, [save]);

    return <Modal
        open={Boolean(showAdd)}
        header={Boolean(showAdd?.id) ? "Изменить оплату" : "Внести оплату"}
        centered={false}
        size="tiny"
        closeIcon={<Icon name="close" onClick={() => dispatch(setShowAdd(false))} />}
        content={<div className="content position-relative">

            <Form>

                <Form.Select
                    label="Раздел"
                    placeholder="Выберите раздел"
                    options={[{ id: null, name: "Не выбран" }, ...parts].map(row => ({
                        key: row.id,
                        value: row.id,
                        text: row.name,
                        onClick: () => setFormdata(p => ({ ...p, income_source_id: null })),
                    }))}
                    name="income_part_id"
                    value={formdata?.income_part_id || null}
                    onChange={handleChange}
                    required
                    disabled={save}
                    error={Boolean(saveErrors?.income_part_id)}
                />

                <Form.Select
                    label="Помещение"
                    placeholder="Выберите помещение"
                    options={sources.map(row => ({
                        key: row.id,
                        value: row.id,
                        text: `${row.cabinet ? `Каб. ${row.cabinet} - ` : ``}${row.name || `ID#${row.id}`}`,
                        content: <div className="d-flex align-items-center">
                            {Boolean(row.cabinet) && <strong className="me-2">{row.cabinet}</strong>}
                            <div className="flex-grow-1">
                                {row.name || `ID#${row.id}`}
                            </div>
                            {Boolean(row.space) && <small className="ms-2">{row.space}{' '}м²</small>}
                        </div>,
                        onClick: () => setSelectSource(row),
                    }))}
                    loading={loadSources}
                    disabled={!Boolean(formdata?.income_part_id) || save}
                    name="income_source_id"
                    value={formdata?.income_source_id || null}
                    onChange={handleChange}
                    required
                    error={Boolean(saveErrors?.income_source_id)}
                />

                <Form.Group>

                    <Form.Field width={6}>
                        <Form.Input
                            label="Сумма"
                            placeholder="Введите сумму"
                            name="sum"
                            value={formdata?.sum || ""}
                            onChange={handleChange}
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            disabled={!Boolean(formdata?.income_source_id) || save}
                            error={Boolean(saveErrors?.sum)}
                        />
                    </Form.Field>

                    <Form.Field width={10}>
                        <Form.Select
                            label="Назначение платежа"
                            placeholder="Выберите тип назначения платежа"
                            options={purposes.map(row => ({
                                key: row.id,
                                text: row.name,
                                value: row.id,
                            }))}
                            name="purpose_pay"
                            value={formdata?.purpose_pay || null}
                            onChange={handleChange}
                            disabled={!Boolean(formdata?.income_source_id) || save}
                            error={Boolean(saveErrors?.purpose_pay)}
                            required
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group widths={2}>

                    <Form.Select
                        label="Вид платежа"
                        placeholder="Выберите тип платежа"
                        options={payTypes}
                        name="type_pay"
                        value={formdata?.type_pay || null}
                        onChange={handleChange}
                        disabled={!Boolean(formdata?.income_source_id) || save}
                        error={Boolean(saveErrors?.type_pay)}
                    />

                    <Form.Input
                        label="Дата платежа"
                        type="date"
                        name="date"
                        onChange={handleChange}
                        disabled={!Boolean(formdata?.income_source_id) || save}
                        error={Boolean(saveErrors?.date)}
                    />

                    {/* <Form.Field width={8}>

                    </Form.Field>
                    <Form.Field width={8}>
                        <Form.Input
                            label="Отчетный месяц"
                            type="month"
                            name="month"
                            onChange={handleChange}
                            disabled={!Boolean(formdata?.income_source_id) || save}
                            error={Boolean(saveErrors?.month)}
                        />
                    </Form.Field> */}
                </Form.Group>

            </Form>

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

            {saveError && <div className="text-danger"><b>Ошибка:</b> {saveError}</div>}

        </div>}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: () => dispatch(setShowAdd(false)),
                disabled: loading || save,
            },
            {
                key: "save",
                content: "Сохранить",
                color: "green",
                icon: "save",
                labelPosition: "right",
                disabled: (
                    loading
                    || save
                    || !Boolean(formdata.sum)
                    || !Boolean(formdata.income_source_id)
                ),
                onClick: () => setSave(true),
                loading: save,
            }
        ]}
    />

}

export default IncomeAdd;