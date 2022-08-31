import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Form, Loader, Modal, Icon } from "semantic-ui-react";
import { setShowAdd } from "../../store/expenses/actions";
import { axios } from "../../system";

const ExpenseAdd = () => {

    const dispatch = useDispatch();
    const { showAdd } = useSelector(s => s.expenses);

    const [formdata, setFormdata] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [types, setTypes] = React.useState([]);
    const [save, setSave] = React.useState(false);
    const [saveErrors, setSaveErrors] = React.useState({});

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
                    setFormdata(data.row);
                    setTypes([{ id: null, name: "Не выбрано" }, ...data.types].map((row, key) => ({
                        key,
                        text: row.name,
                        value: row.id,
                    })))
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
        }

    }, [showAdd]);

    React.useEffect(() => {

        if (save) {

            axios.put('expenses/save', formdata)
                .then(({ data }) => {
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
                            onChange={handleChange}
                            required
                            error={Boolean(saveErrors?.expense_type_id)}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={10}>
                        <Form.Select
                            label="Подтип расхода"
                            placeholder="Выберите подтип расхода"
                            options={[]}
                            name="expense_subtype_id"
                            value={formdata?.expense_subtype_id || null}
                            onChange={handleChange}
                            disabled={!Boolean(formdata?.expense_type_id) || save}
                            error={Boolean(saveErrors?.expense_subtype_id)}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group>

                    <Form.Field width={4}>
                        <Form.Input
                            label="Сумма расхода"
                            placeholder="Введите сумму"
                            name="sum"
                            value={formdata?.sum || null}
                            onChange={handleChange}
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            error={Boolean(saveErrors?.sum)}
                            disabled={save}
                        />
                    </Form.Field>

                    <Form.Field width={12}>
                        <Form.Input
                            label="Наименование расхода"
                            placeholder="Укажите наименование"
                            name="name"
                            value={formdata?.name || null}
                            onChange={handleChange}
                            error={Boolean(saveErrors?.name)}
                            disabled={save}
                        />
                    </Form.Field>

                </Form.Group>

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