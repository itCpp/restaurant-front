import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer, Form, Loader, Modal } from "semantic-ui-react";
import { setParkingPlaceAdd } from "../../store/incomes/actions";
import { axios } from "../../system";

const ParkingPlaceAdd = props => {

    const { showParkingPlaceAdd } = useSelector(s => s.incomes);
    const dispatch = useDispatch();
    const { setRows, toPays } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});
    const [sources, setSources] = React.useState([]);
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const isDisabled = Boolean(error);

    const close = React.useCallback(() => {
        dispatch(setParkingPlaceAdd(false));
    }, []);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
        setSaveErrors(p => ({ ...p, [name]: null }));
    }, []);

    React.useEffect(() => {

        if (showParkingPlaceAdd) {
            axios.post('parking/get', {
                id: showParkingPlaceAdd?.id,
                source_id: showParkingPlaceAdd?.source_id
            })
                .then(({ data }) => {
                    setFormdata({
                        source_id: showParkingPlaceAdd?.source_id,
                        ...(data.row || {}),
                    });
                    data.sources && setSources(data.sources);
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setLoading(false));
        }

        return () => {
            setLoading(true);
            setError(null);
            setFormdata({});
            setSources([]);
            setSaveError(null);
            setSaveErrors({});
        }

    }, [showParkingPlaceAdd]);

    React.useEffect(() => {

        if (save) {
            axios.put('parking/save', { ...formdata, toPays })
                .then(({ data }) => {

                    const dataRow = toPays ? { ...data.row, pays: data.pays } : data.row;

                    typeof setRows == "function" && setRows(p => {

                        let rows = [];

                        p.forEach(item => {

                            let row = { ...item },
                                add = true;

                            if (row.id === data.source_id) {

                                row.parking.forEach((r, i) => {
                                    if (r.id === dataRow.id) {
                                        add = false;
                                        row.parking[i] = { ...r, ...dataRow };
                                    }
                                });

                                add && row.parking.unshift(dataRow);
                            }

                            rows.push(row);

                        });

                        return rows;
                    });

                    close();
                })
                .catch(e => {
                    setSaveError(axios.getError(e));
                    setSaveErrors(axios.getErrors(e));
                })
                .then(() => {
                    setSave(false);
                });
        }

    }, [save]);

    return <Modal
        open={Boolean(showParkingPlaceAdd)}
        centered={false}
        size="tiny"
        closeIcon={{
            name: "close",
            onClick: () => close(),
        }}
        header="Парковочное место"
        content={{
            content: <div>
                <Form>

                    <Form.Group widths={2}>

                        <Form.Input
                            label="Парковочное место"
                            placeholder="Укажите парковочное место"
                            name="parking_place"
                            value={formdata.parking_place || ""}
                            onChange={handleChange}
                            required
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.parking_place)}
                        />

                        <Form.Input
                            label="Стоимость"
                            placeholder="Укажите стоимость аренды"
                            name="price"
                            value={formdata.price || ""}
                            onChange={handleChange}
                            required
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.price)}
                        />

                    </Form.Group>

                    <Form.Group widths={2}>

                        <Form.Input
                            label="Дата начала"
                            placeholder="Укажите дату начала"
                            type="date"
                            name="date_from"
                            value={formdata.date_from || ""}
                            onChange={handleChange}
                            required
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.date_from)}
                        />

                        <Form.Input
                            label="Дата окончания"
                            placeholder="Укажите дату окончания"
                            type="date"
                            name="date_to"
                            value={formdata.date_to || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.date_to)}
                        />

                    </Form.Group>

                    <Form.Group widths={2}>

                        <Form.Input
                            label="Марка и модель автомобиля"
                            placeholder="Укажите марку и модель"
                            name="car"
                            value={formdata.car || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.car)}
                        />

                        <Form.Input
                            label="Гос. номер автомобиля"
                            placeholder="Укажите гос. номер"
                            name="car_number"
                            value={formdata.car_number || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.car_number)}
                        />

                    </Form.Group>

                    <Form.Group widths={2}>

                        <Form.Input
                            label="ФИО владельца"
                            placeholder="Укажите ФИО владельца"
                            name="owner_name"
                            value={formdata.owner_name || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.owner_name)}
                        />

                        <Form.Input
                            label="Телефон для связи"
                            placeholder="Укажите номер телефона"
                            name="owner_phone"
                            value={formdata.owner_phone || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                            error={Boolean(saveErrors?.owner_phone)}
                        />

                    </Form.Group>

                    <Form.TextArea
                        label="Комментарий"
                        placeholder="Введите комментарий"
                        name="comment"
                        value={formdata.comment || ""}
                        onChange={handleChange}
                        disabled={isDisabled}
                        error={Boolean(saveErrors?.comment)}
                    />

                    <Dimmer active={loading || save} inverted>
                        <Loader />
                    </Dimmer>

                </Form>

                {error && <div className="text-danger">
                    <strong>{error}</strong>
                </div>}
                {saveError && <div className="text-danger">
                    <strong>{saveError}</strong>
                </div>}

            </div>
        }}
        actions={[
            {
                key: 0,
                content: "Отмена",
                onClick: () => close(),
                disabled: loading || save,
            },
            {
                key: 1,
                content: "Сохранить",
                onClick: () => setSave(true),
                disabled: loading || save || isDisabled,
                icon: "save",
                labelPosition: "right",
                color: "green",
            }
        ]}
    />

}

export default ParkingPlaceAdd;