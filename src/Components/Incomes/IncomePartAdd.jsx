import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Dimmer, Form, Loader, Message, Modal } from "semantic-ui-react";
import { setPartAdd } from "../../store/incomes/actions";
import { axios } from "../../system";

const IncomePartAdd = props => {

    const dispatch = useDispatch();
    const { showPartAdd } = useSelector(s => s.incomes);
    const { id } = useParams();
    const { setRows } = props;

    const close = () => dispatch(setPartAdd(false));

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {

        if (showPartAdd) {
            setFormdata(p => ({
                ...p,
                building_id: id,
                ...(typeof showPartAdd == "object" ? showPartAdd : {}),
            }));
        }

        return () => {
            setFormdata({});
            setSave(false);
            setErrors({});
            setError(null);
        }

    }, [showPartAdd]);

    React.useEffect(() => {

        if (save) {
            axios.post('incomes/part/save', formdata)
                .then(({ data }) => {
                    setRows(p => {
                        let rows = [...p],
                            added = true;

                        rows.forEach((row, i) => {
                            if (row.id === data.row.id) {
                                rows[i] = data.row;
                                added = false;
                            }
                        });

                        if (added) rows.unshift(data.row);

                        return rows;
                    });

                    close();
                })
                .catch(e => {
                    setError(axios.getError(e));
                    setErrors(axios.getErrors(e));
                })
                .then(() => setSave(false))
        }

    }, [save]);


    return <Modal
        open={Boolean(showPartAdd)}
        header="Раздел"
        centered={false}
        size="small"
        onClose={close}
        closeIcon
        content={<div className="content">

            <Form>

                <Form.Input
                    label="Наименование"
                    placeholder="Укажите наименование раздела или этажа"
                    name="name"
                    value={formdata.name || ""}
                    onChange={(e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }))}
                    error={Boolean(errors.name)}
                    required
                />

                <Form.Input
                    label="Краткое описание"
                    placeholder="Введите кратенькое описание раздела"
                    name="comment"
                    value={formdata.comment || ""}
                    onChange={(e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }))}
                    error={Boolean(errors.comment)}
                />

                <Dimmer active={save} inverted>
                    <Loader />
                </Dimmer>

            </Form>

            {error && <div className="text-danger mt-3" style={{ opacity: save ? "0.4" : "1" }}>
                <strong>Ошибка</strong>{' '}{error}
            </div>}

            <div className="d-flex align-items-center justify-content-center mt-5">
                <Button
                    content="Отмена"
                    onClick={() => close()}
                    disabled={save}
                    className="mx-1"
                />
                <Button
                    content="Сохранить"
                    onClick={() => setSave(true)}
                    color="green"
                    icon="save"
                    labelPosition="right"
                    disabled={save}
                    className="mx-1"
                />
            </div>

        </div>}
    />
}

export default IncomePartAdd;