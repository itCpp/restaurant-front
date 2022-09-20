import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import { setIncomeSourceAdd } from "../../store/incomes/actions";
import { axios } from "../../system";

const IncomeSourceAdd = props => {

    const { setRow, setRows } = props;
    const dispatch = useDispatch();
    const { id } = useParams();
    const { showSourceAdd } = useSelector(s => s.incomes);

    const [loading, setLoading] = React.useState(false);
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
                params: { id: showSourceAdd?.id, getParts: true, building: id }
            }).then(({ data }) => {
                setFormdata(data.row);
                setParts(data.parts);
            }).catch(e => {

            }).then(() => {
                setLoading(false);
            });
        }

        return () => {
            setFormdata({});
            setSave(false);
            setSaveError(null);
            setSaveErrors({});
        }

    }, [showSourceAdd]);

    React.useEffect(() => {

        if (save) {

            axios.put('incomes/source/save', formdata)
                .then(({ data }) => {

                    typeof setRows == "function" && setRows(p => {
                        let parts = [...p];
                        parts.map((p, k) => {
                            let add = true;
                            p.rows.map((r, i) => {
                                if (r.id === data.row?.id) {
                                    parts[k].rows[i] = data.row;
                                    add = false;
                                }
                            });
                            if (add && p.id === data.row?.part_id) parts[k].rows.unshift(data.row);
                        });
                        return parts;
                    });

                    typeof setRow == "function" && setRow(p => ({ ...p, ...data.row }));

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
        header={Boolean(showSourceAdd?.id) ? "Изменить данные помещения" : "Добавить помещение"}
        centered={false}
        size="small"
        closeIcon={<Icon name="close" onClick={() => dispatch(setIncomeSourceAdd(false))} />}
        content={<div className="content position-relative">

            <Form>

                <Form.Select
                    label="Раздел"
                    placeholder="Выберите раздел"
                    options={parts.map(row => ({
                        key: row.id,
                        text: `${row.name} ${row.comment || ""}`,
                        value: row.id,
                    }))}
                    name="part_id"
                    value={formdata?.part_id || null}
                    onChange={handleChange}
                    disabled={save || Boolean(formdata?.id)}
                    error={Boolean(saveErrors.part_id)}
                />

                <Form.Checkbox
                    label="Помещение свободное"
                    toggle
                    name="is_free"
                    checked={formdata?.is_free || false}
                    onChange={handleChange}
                    disabled={save || !Boolean(formdata?.part_id)}
                    error={Boolean(saveErrors.is_free)}
                />

                <Form.Group>

                    <Form.Field width={10}>
                        <Form.Input
                            label="Наименование"
                            placeholder="Введите наименование"
                            name="name"
                            value={formdata?.name || ""}
                            onChange={handleChange}
                            disabled={save || !Boolean(formdata?.part_id)}
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
                            disabled={save || !Boolean(formdata?.part_id)}
                            error={Boolean(saveErrors.inn)}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group widths={3}>

                    <Form.Input
                        label="Кабинет"
                        placeholder="Укажите кабинет"
                        name="cabinet"
                        value={formdata?.cabinet || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.cabinet)}
                    />

                    <Form.Input
                        label="Площадь, м²"
                        placeholder="Укажите площадь"
                        name="space"
                        value={formdata?.space || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.space)}
                    />

                    <Form.Input
                        label="Стоимость 1 м²"
                        placeholder="Укажите стоимость"
                        name="price"
                        value={formdata?.price || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.price)}
                    />

                </Form.Group>

                <hr />

                <Form.Group widths={2}>

                    <Form.Input
                        label="Дата начала договора"
                        type="date"
                        name="date"
                        value={formdata?.date || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.date)}
                    />

                    <Form.Input
                        label="Дата окончания договора"
                        type="date"
                        name="date_to"
                        value={formdata?.date_to || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.date_to)}
                    />

                </Form.Group>

                <Form.TextArea
                    label="Комментарий к дате"
                    placeholder="Введите комментарий"
                    rows={2}
                    prename="settings"
                    name="comment_date"
                    value={formdata?.settings?.comment_date || ""}
                    onChange={handleChange}
                    disabled={save || !Boolean(formdata?.part_id)}
                    error={Boolean(saveErrors.comment_date)}
                />

                <hr />

                <Form.Group widths={2}>

                    <Form.Input
                        label="Контактное лицо"
                        placeholder="Введите ФИО"
                        name="contact_person"
                        value={formdata?.contact_person || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.contact_person)}
                    />

                    <Form.Input
                        label="Контакты"
                        placeholder="Введите контактные данные"
                        name="contact_number"
                        value={formdata?.contact_number || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.contact_number)}
                    />

                </Form.Group>

                <hr />

                <Form.Group widths={2} className="align-items-center">

                    <Form.Checkbox
                        label="Аренда парковки"
                        toggle
                        name="is_parking"
                        checked={formdata?.is_parking || false}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.is_parking)}
                    />

                    <Form.Input
                        label="Стоимость парковки"
                        placeholder="Введите сумму"
                        type="number"
                        min="0"
                        step="0.01"
                        prename="settings"
                        name="parking_price"
                        value={formdata?.settings?.parking_price || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || !Boolean(formdata?.is_parking)}
                        error={Boolean(saveErrors.parking_price)}
                    />

                </Form.Group>

                <Form.Group widths={3} className="align-items-center">

                    <Form.Input
                        label="Дата начала аренды парковки"
                        placeholder="Введите дату"
                        prename="settings"
                        name="parking_date"
                        type="date"
                        value={formdata?.settings?.parking_date || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || !Boolean(formdata?.is_parking)}
                        error={Boolean(saveErrors.parking_date)}
                    />

                    <Form.Input
                        label="Колчество машиномест"
                        placeholder="Укажите количество"
                        prename="settings"
                        name="parking_count"
                        type="number"
                        value={formdata?.settings?.parking_count || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || !Boolean(formdata?.is_parking)}
                        error={Boolean(saveErrors.parking_count)}
                    />

                    <Form.Input
                        label="Номер автомобиля"
                        placeholder="Введите гос. номер машины"
                        prename="settings"
                        name="car_number"
                        value={formdata?.settings?.car_number || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || !Boolean(formdata?.is_parking)}
                        error={Boolean(saveErrors.car_number)}
                    />

                </Form.Group>

                <hr />

                <Form.Group widths={3} className="align-items-center">

                    <Form.Checkbox
                        label="Интернет услуги"
                        toggle
                        name="is_internet"
                        checked={formdata?.is_internet || false}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.is_internet)}
                    />

                    <Form.Input
                        label="Стоимость интернета"
                        placeholder="Введите сумму"
                        type="number"
                        min="0"
                        step="0.01"
                        prename="settings"
                        name="internet_price"
                        value={formdata?.settings?.internet_price || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || !Boolean(formdata?.is_internet)}
                        error={Boolean(saveErrors.internet_price)}
                    />

                    <Form.Input
                        label="Дата начала использования"
                        placeholder="Введите дату"
                        prename="settings"
                        name="internet_date"
                        type="date"
                        value={formdata?.settings?.internet_date || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || !Boolean(formdata?.is_internet)}
                        error={Boolean(saveErrors.internet_date)}
                    />

                </Form.Group>

                <hr />

                <b>Процент пени за один просроченный день</b>

                <Form.Group widths={2} className="align-items-center">

                    <Form.Checkbox
                        label="Не насчитывать пеню"
                        toggle
                        prename="settings"
                        name="no_fine"
                        checked={Boolean(formdata?.settings?.no_fine)}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.no_fine)}
                    />

                    <Form.Input
                        placeholder="Укажите процент (1% по умолчанию)"
                        type="number"
                        min="0"
                        step="0.01"
                        prename="settings"
                        name="fine_percent"
                        value={formdata?.settings?.fine_percent || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id) || Boolean(formdata?.settings?.no_fine)}
                        error={Boolean(saveErrors.fine_percent)}
                    />

                </Form.Group>

                <hr />

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Введите комментарий"
                    rows={4}
                    prename="settings"
                    name="comment"
                    value={formdata?.settings?.comment || ""}
                    onChange={handleChange}
                    disabled={save || !Boolean(formdata?.part_id)}
                    error={Boolean(saveErrors.comment)}
                />

                {/* <Form.Field>
                    <label className="d-flex">
                        <span>Цвет строки</span>
                        <span
                            style={{
                                background: formdata?.settings?.color || "none",
                                border: "1px solid #eee",
                                marginLeft: "1rem",
                                width: "20px",
                                borderRadius: "0.25rem",
                                opacity: save ? "0.4" : "1",
                            }}
                            children="&nbsp;"
                        />
                        <span className=""></span>
                    </label>

                    <Form.Input
                        placeholder="Выберите цвет оформления"
                        type="color"
                        prename="settings"
                        name="color"
                        value={formdata?.settings?.color || ""}
                        onChange={handleChange}
                        disabled={save || !Boolean(formdata?.part_id)}
                        error={Boolean(saveErrors.color)}
                    />
                </Form.Field> */}

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