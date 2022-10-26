import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import { setShowCashboxRowEdit } from "../../store/cashbox/actions";
import { axios, moment } from "../../system";

const CashboxRowEdit = props => {

    const { setRows, setStats } = props;
    const store = useSelector(s => s);
    const { showCashboxRowEdit } = store.cashbox;
    const { payTypes } = store.main;
    const dispatch = useDispatch();

    const [formdata, setFormdata] = React.useState({});
    const [options, setOptions] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [loadingExpenseTypes, setLoadingExpenseTypes] = React.useState(false);
    const [loadingIncomeSourceParkings, setLoadingIncomeSourceParkings] = React.useState(false);

    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [saveError, setSaveError] = React.useState(null);

    const close = React.useCallback(() => dispatch(setShowCashboxRowEdit(false)), []);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (showCashboxRowEdit) {

            typeof showCashboxRowEdit == "object" && setFormdata({ ...showCashboxRowEdit });

            axios.post('cashbox/get', { id: showCashboxRowEdit?.id })
                .then(({ data }) => {
                    setFormdata(data.row);
                    setOptions(p => ({
                        ...p,
                        expense_types: data.expense_types,
                        expense_subtypes: data.expense_subtypes,
                        income_sources: data.income_sources,
                        income_source_parkings: data.income_source_parkings,
                        purpose: data.purpose,
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
            setLoadingExpenseTypes(false);
            setLoadingIncomeSourceParkings(false);
            setSave(false);
            setError(null);
            setSaveError(null);
            setErrors({});
        }

    }, [showCashboxRowEdit]);

    React.useEffect(() => {

        if (!loading) {

            if (Boolean(formdata?.expense_type_id)) {
                setLoadingExpenseTypes(true);
                axios.post('expenses/types', { id: formdata.expense_type_id })
                    .then(({ data }) => {
                        setOptions(p => ({ ...p, expense_subtypes: data }));
                        setErrors(p => ({ ...p, expense_subtype_id: null }));
                    })
                    .catch(e => setErrors(p => ({ ...p, expense_subtype_id: [axios.getError(e)] })))
                    .then(() => setLoadingExpenseTypes(false));
            } else {
                setOptions(p => ({ ...p, expense_subtypes: [] }));
            }

        }

    }, [formdata?.expense_type_id]);

    React.useEffect(() => {

        if (!loading) {

            if (Boolean(formdata?.income_source_id)) {
                setLoadingIncomeSourceParkings(true);
                axios.post('parking/list', { id: formdata.income_source_id })
                    .then(({ data }) => {
                        setOptions(p => ({ ...p, income_source_parkings: data }));
                        setErrors(p => ({ ...p, income_source_parking_id: null }));
                    })
                    .catch(e => setErrors(p => ({ ...p, income_source_parking_id: [axios.getError(e)] })))
                    .then(() => setLoadingIncomeSourceParkings(false));
            } else {
                setOptions(p => ({ ...p, income_source_parkings: [] }));
            }

        }

    }, [formdata?.income_source_id]);

    React.useEffect(() => {

        if (save) {
            axios.post('cashbox/save', formdata)
                .then(({ data }) => {

                    typeof setStats == "function" && setStats(p => ({ ...p, ...data.statistics }));

                    typeof setRows == "function" && setRows(p => {

                        let rows = [],
                            add = true;

                        p.forEach(r => {

                            if (r.id === data.row.id) {
                                r = { ...r, ...data.row };
                                add = false;
                            }

                            rows.push(r);
                        });

                        add && rows.unshift(data.row);

                        return rows;
                    });

                    close();
                })
                .catch(e => {
                    setSaveError(axios.getError(e));
                    setErrors(axios.getErrors(e));
                })
                .then(() => {
                    setSave(false);
                });
        }

    }, [save]);

    return <Modal
        open={Boolean(showCashboxRowEdit)}
        header={showCashboxRowEdit === true ? "Новая операция" : "Изменить данные"}
        centered={false}
        closeIcon={<Icon name="close" link onClick={() => close()} />}
        size="small"
        content={<div className="content">

            <Form>

                <Form.Group widths="equal">

                    <Form.Input
                        label="Сумма"
                        placeholder="Укажите сумму"
                        name="sum"
                        value={Boolean(formdata?.sum) ? Math.abs(formdata.sum) : ""}
                        onChange={handleChange}
                        required
                        error={Boolean(errors?.sum)}
                    />

                    <Form.Select
                        label="Вид расчета"
                        placeholder="Укажите вид расчета"
                        options={payTypes}
                        name="type_pay"
                        value={formdata?.type_pay || null}
                        onChange={handleChange}
                        error={Boolean(errors?.type_pay)}
                    />

                    <Form.Select
                        label="Тип платежа"
                        placeholder="Выберите тип платежа"
                        options={[
                            { key: 0, text: "Приход", value: "is_income" },
                            { key: 1, text: "Расход", value: "is_expense" },
                        ]}
                        value={formdata?.is_income ? "is_income" : (formdata?.is_expense ? "is_expense" : null)}
                        onChange={(e, { value }) => setFormdata(p => ({
                            ...p,
                            is_income: false,
                            is_expense: false,
                            income_type_pay: null,
                            [value]: true
                        }))}
                        required
                        error={Boolean(errors?.is_income) || Boolean(errors?.is_expense)}
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
                        error={Boolean(errors?.date)}
                    />

                    <Form.Input
                        label="Отчетный месяц"
                        type="month"
                        name="month"
                        value={formdata?.month || ""}
                        onChange={(e, { value }) => {
                            setFormdata(p => ({
                                ...p,
                                month: value,
                                period_start: value && moment(value).startOf('month').format("YYYY-MM-DD"),
                                period_stop: value && moment(value).endOf('month').format("YYYY-MM-DD"),
                            }))
                        }}
                        error={Boolean(errors?.month)}
                    />

                    <Form.Input
                        label="Начало периода"
                        type="date"
                        name="period_start"
                        value={formdata?.period_start || ""}
                        onChange={handleChange}
                        error={Boolean(errors?.period_start)}
                    />

                    <Form.Input
                        label="Конец периода"
                        type="date"
                        name="period_stop"
                        value={formdata?.period_stop || ""}
                        onChange={handleChange}
                        error={Boolean(errors?.period_stop)}
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
                            onChange={(e, { name, value }) => {
                                setFormdata(p => ({ ...p, [name]: value, expense_subtype_id: null }))
                            }}
                            required
                            error={Boolean(errors?.expense_type_id)}
                        />

                        <Form.Dropdown
                            label="Фиксированное наименование"
                            placeholder="Выберите или добавьте наименование"
                            options={[
                                { text: "Не выбрано", value: null },
                                ...(options?.expense_subtypes || [])
                            ].map((r, i) => ({
                                ...r,
                                key: i,
                            }))}
                            name="expense_subtype_id"
                            value={formdata?.expense_subtype_id || null}
                            onChange={handleChange}
                            loading={loadingExpenseTypes}
                            disabled={loadingExpenseTypes}
                            search
                            selection
                            allowAdditions
                            additionLabel="Добавить в список: "
                            noResultsMessage="Ничего не найдено..."
                            onAddItem={(e, { name, value }) => {
                                setOptions(p => ({
                                    ...p,
                                    expense_subtypes: [...(p.expense_subtypes || []), { text: value, value }]
                                }));
                                setFormdata(p => ({ ...p, [name]: value }));
                            }}
                            error={Boolean(errors.expense_subtype_id)}
                        />

                    </Form.Group>

                    <Form.Input
                        label="Наименование или пояснение платежа"
                        placeholder="Укажите наименование"
                        name="name"
                        value={formdata?.name || ""}
                        onChange={handleChange}
                        error={Boolean(errors.name)}
                    />

                </>}

                {formdata.is_income && <>

                    <Form.Select
                        label="Вид оплаты"
                        placeholder="Выберите вид оплаты"
                        options={[
                            { key: 0, value: "tenant", text: "Платеж от арендатора" },
                            { key: 1, value: "parking_one", text: "Оплата гостевой парковки" },
                        ]}
                        name="income_type_pay"
                        value={formdata.income_type_pay || null}
                        onChange={handleChange}
                        required
                    />

                    {formdata?.income_type_pay == "tenant" && <>

                        <Form.Group widths="equal">

                            <Form.Dropdown
                                label="Арендатор"
                                placeholder="Выберите арендатора"
                                selection
                                options={[{ id: null, name: "Не выбрано" }, ...(options.income_sources || [])].map(r => ({
                                    key: r.id,
                                    text: r.name,
                                    value: r.id,
                                    description: r?.settings?.comment || null,
                                }))}
                                name="income_source_id"
                                value={formdata.income_source_id || null}
                                onChange={(e, { name, value }) => {
                                    setFormdata(p => ({ ...p, [name]: value, income_source_parking_id: null }))
                                }}
                                search
                                noResultsMessage="Ничего не найдено"
                                required
                                error={Boolean(errors.income_source_id)}
                            />

                        </Form.Group>

                        <Form.Group widths="equal">

                            <Form.Select
                                label="Назначение платежа"
                                placeholder="Выберите назначение платежа"
                                options={[{ id: null, name: "Не выбрано" }, ...(options.purpose || [])].map(r => ({
                                    key: r.id,
                                    text: r.name,
                                    value: r.id,
                                    icon: r.icon || null,
                                }))}
                                name="purpose_pay"
                                value={formdata.purpose_pay || null}
                                onChange={handleChange}
                                required
                                error={Boolean(errors.purpose_pay)}
                            />

                            <Form.Select
                                label="Парковочное место"
                                placeholder="Выберите парковочное место"
                                options={options.income_source_parkings || []}
                                name="income_source_parking_id"
                                value={formdata.income_source_parking_id || null}
                                onChange={handleChange}
                                disabled={formdata?.purpose_pay !== 2 || loadingIncomeSourceParkings || (options.income_source_parkings || []).length === 0}
                                loading={loadingIncomeSourceParkings}
                                error={Boolean(errors.income_source_parking_id)}
                                required={formdata?.purpose_pay === 2}
                            />

                        </Form.Group>

                    </>}

                </>}

                {saveError && <div className="text-danger">
                    <strong>Ошибка</strong>{' '}{saveError}
                </div>}

                <Dimmer active={loading || save} inverted>
                    <Loader />
                </Dimmer>

            </Form>

        </div>}
        actions={[
            {
                key: 0,
                content: "Отмена",
                onClick: () => close(),
                size: "mini",
            },
            {
                key: 1,
                content: "Сохранить",
                color: "green",
                labelPosition: "right",
                icon: "save",
                disabled: loading || save,
                onClick: () => setSave(true),
                size: "mini",
            }
        ]}
    />
}

export default CashboxRowEdit;