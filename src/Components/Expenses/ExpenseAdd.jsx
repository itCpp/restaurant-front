import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Form, Loader, Modal, Icon } from "semantic-ui-react";
import { setShowAdd } from "../../store/expenses/actions";
import { axios } from "../../system";

const ExpenseAdd = props => {

    const dispatch = useDispatch();
    const { showAdd } = useSelector(s => s.expenses);
    const { setRows } = props;

    const [formdata, setFormdata] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [types, setTypes] = React.useState([]);
    const [save, setSave] = React.useState(false);
    const [saveErrors, setSaveErrors] = React.useState({});
    const [typesLoad, setTypesLoad] = React.useState(false);
    const [subTypes, setSubTypes] = React.useState([]);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (Boolean(showAdd)) {

            setLoading(true);

            axios.post('expenses/get', {
                ...(typeof showAdd == "object" ? showAdd : {}),
                modalData: true,
            })
                .then(({ data }) => {
                    setFormdata({
                        ...data.row,
                        date: data.row.date || moment().format("YYYY-MM-DD"),
                    });
                    setTypes([{ id: null, name: "Не выбрано" }, ...data.types].map((row, key) => ({
                        key,
                        text: row.name,
                        value: row.id,
                    })));
                })
                .catch(e => { })
                .then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setFormdata({});
            setLoading(false);
            setSave(false);
            setSaveErrors({});
            setTypesLoad(false);
        }

    }, [showAdd]);

    React.useEffect(() => {

        if (Boolean(formdata?.expense_type_id)) {

            setTypesLoad(true);

            axios.post('expenses/types', { id: formdata.expense_type_id })
                .then(({ data }) => setSubTypes(data))
                .catch(() => null)
                .then(() => setTypesLoad(false));
        }

    }, [formdata?.expense_type_id])

    React.useEffect(() => {

        if (save) {

            axios.put('expenses/save', formdata)
                .then(({ data }) => {

                    setRows(p => {

                        let rows = [...p],
                            added = true;

                        rows.map((row, key) => {
                            if (row.id === data.row.id) {
                                rows[key] = data.row;
                                added = false;
                            }
                        });

                        if (added) rows.unshift(data.row);

                        return rows;
                    });

                    dispatch(setShowAdd(false))
                })
                .catch(e => {
                    setSave(false);
                    setSaveErrors(axios.getErrors(e));
                });
        }

    }, [save]);

    return <Modal
        open={Boolean(showAdd)}
        header={Boolean(showAdd?.id) ? "Изменить расход" : "Добавить расход"}
        centered={false}
        closeIcon={<Icon name="close" onClick={() => dispatch(setShowAdd(false))} />}
        size="small"
        content={<div className="content position-relative">

            <Form>

                <Form.Group>

                    <Form.Field width={6}>
                        <Form.Select
                            label="Тип расхода"
                            placeholder="Выберите тип расхода"
                            options={types}
                            name="expense_type_id"
                            value={formdata?.expense_type_id || null}
                            onChange={(e, { name, value }) => {
                                setFormdata(p => ({
                                    ...p,
                                    [name]: value,
                                    expense_subtype_id: null,
                                }));
                            }}
                            required
                            error={Boolean(saveErrors?.expense_type_id)}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={10}>
                        <Form.Dropdown
                            label="Фиксированное наименование"
                            placeholder="Выберите или добавьте наименование"
                            options={subTypes.map((row, key) => ({
                                key, ...row,
                            }))}
                            name="expense_subtype_id"
                            value={formdata?.expense_subtype_id || null}
                            onChange={handleChange}
                            disabled={!Boolean(formdata?.expense_type_id) || save}
                            error={Boolean(saveErrors?.expense_subtype_id)}
                            loading={typesLoad}
                            search
                            selection
                            fluid
                            allowAdditions
                            additionLabel="Добавить в список: "
                            onAddItem={(e, { name, value }) => {
                                setSubTypes(p => ([{ text: value, value: value }, ...p]));
                                setFormdata(p => ({ ...p, [name]: value }));
                            }}
                            noResultsMessage="Ничего не найдено..."
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group>

                    <Form.Field width={6}>
                        <Form.Input
                            label="Сумма расхода"
                            placeholder="Введите сумму"
                            name="sum"
                            value={formdata?.sum || ""}
                            onChange={handleChange}
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            error={Boolean(saveErrors?.sum)}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={6}>
                        <Form.Input
                            label="Дата расхода"
                            placeholder="Укажите дату"
                            type="date"
                            name="date"
                            value={formdata?.date || ""}
                            onChange={handleChange}
                            error={Boolean(saveErrors?.date)}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={6}>
                        <Form.Select
                            label="Тип платежа"
                            placeholder="Выберите тип"
                            name="type_pay"
                            options={[
                                { key: 0, value: 1, text: "Наличные" },
                                { key: 1, value: 2, text: "Безналичне", icon: "credit card" },
                            ]}
                            value={formdata?.type_pay || null}
                            onChange={handleChange}
                            error={Boolean(saveErrors?.type_pay)}
                            disabled={save}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Input
                    label="Наименование расхода"
                    placeholder="Укажите наименование"
                    name="name"
                    value={formdata?.name || ""}
                    onChange={handleChange}
                    error={Boolean(saveErrors?.name)}
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
                    || !Boolean(formdata.expense_type_id)
                ),
                onClick: () => setSave(true),
                loading: save,
            }
        ]}
    />

}

export default ExpenseAdd;