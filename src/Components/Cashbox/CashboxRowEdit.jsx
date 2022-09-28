import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Icon, Modal } from "semantic-ui-react";
import { setShowCashboxRowEdit } from "../../store/cashbox/actions";
import { axios } from "../../system";

const CashboxRowEdit = () => {

    const store = useSelector(s => s);
    const { showCashboxRowEdit } = store.cashbox;
    const { payTypes } = store.main;
    const dispatch = useDispatch();

    const [formdata, setFormdata] = React.useState({});
    const [options, setOptions] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    const close = React.useCallback(() => dispatch(setShowCashboxRowEdit(false)), []);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (typeof showCashboxRowEdit == "object") {

            setFormdata({ ...showCashboxRowEdit });

            axios.post('cashbox/get', { id: showCashboxRowEdit.id })
                .then(({ data }) => {
                    setFormdata(data.row);
                    setOptions(p => ({
                        ...p,
                        expense_types: data.expense_types,
                        expense_subtypes: data.expense_subtypes,
                    }))
                })
                .catch(e => {

                })
                .then(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        return () => {
            setFormdata({});
            setLoading(true);
        }

    }, [showCashboxRowEdit]);

    return <Modal
        open={Boolean(showCashboxRowEdit)}
        header={showCashboxRowEdit === true ? "Новая операция" : "Изменить данные"}
        centered={false}
        closeIcon={<Icon name="close" link onClick={() => close()} />}
        size="small"
        content={<div className="content">

            <Form>

                <Form.Group widths="equal">

                    <Form.Select
                        label="Тип платежа"
                        placeholder="Выберите тип платежа"
                        options={[
                            { key: 0, text: "Приход", value: "is_income" },
                            { key: 1, text: "Расход", value: "is_expense" },
                        ]}
                        value={formdata?.is_income ? "is_income" : (formdata?.is_expense ? "is_expense" : null)}
                        onChange={(e, { value }) => setFormdata(p => ({ ...p, is_income: false, is_expense: false, [value]: true }))}
                        required
                    />

                    <Form.Input
                        label="Сумма"
                        placeholder="Укажите сумму"
                        name="sum"
                        value={Boolean(formdata?.sum) ? Math.abs(formdata.sum) : ""}
                        onChange={handleChange}
                        required
                    />

                    <Form.Select
                        label="Вид расчета"
                        placeholder="Укажите вид расчета"
                        options={payTypes}
                        name="type_pay"
                        value={formdata?.type_pay || null}
                        onChange={handleChange}
                    />

                </Form.Group>

                <Form.Group widths="equal">

                    <Form.Input
                        label="Дата платежа"
                        type="date"
                        name="date"
                        value={formdata?.date || ""}
                        onChange={handleChange}
                        required
                    />

                    <Form.Input
                        label="Отчетный месяц"
                        type="month"
                        name="month"
                        value={formdata?.month || ""}
                        onChange={handleChange}
                    />

                </Form.Group>

                <Form.Group widths="equal">

                    <Form.Input
                        label="Начало периода"
                        type="date"
                        name="period_start"
                        value={formdata?.period_start || ""}
                        onChange={handleChange}
                    />

                    <Form.Input
                        label="Конец периода"
                        type="date"
                        name="period_stop"
                        value={formdata?.period_stop || ""}
                        onChange={handleChange}
                    />

                </Form.Group>

                {formdata.is_expense && <>

                    <Form.Group widths="equal">

                        <Form.Select
                            label="Тип расхода"
                            placeholder="Выберите тип расхода"
                            options={options?.expense_types || []}
                            name="expense_type_id"
                            value={formdata?.expense_type_id || null}
                            onChange={handleChange}
                            required
                        />

                        <Form.Select
                            label="Фиксированное наименование"
                            placeholder="Выберите фиксированное наименование расхода"
                            options={options?.expense_subtypes || []}
                            name="expense_subtype_id"
                            value={formdata?.expense_subtype_id || null}
                            onChange={handleChange}
                        />

                    </Form.Group>

                    <Form.Input
                        label="Наименование или пояснение платежа"
                        placeholder="Укажите наименование"
                        name="name"
                        value={formdata?.name || ""}
                        onChange={handleChange}
                    />

                </>}

            </Form>

        </div>}
    />
}

export default CashboxRowEdit;