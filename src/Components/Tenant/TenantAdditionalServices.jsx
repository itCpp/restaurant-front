import React from "react";
import Segment from "../UI/Segment";
import { Button, Dimmer, Form, Header, Icon, Label, Loader, Message, Modal } from "semantic-ui-react";
import { axios, moment } from "../../system";
import useDropRow from "./useDropRow";

const TenantAdditionalServices = props => {

    const { row, setRow } = props;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [edit, setEdit] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);

        axios.get('services?id=' + row?.id)
            .then(({ data }) => {
                setRows(data.rows);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => {
                setLoading(false);
            });

        return () => {
            setLoading(true);
            setError(null);
        }

    }, []);

    return <Segment className="pb-4">

        <div className="mb-4 d-flex align-items-center">

            <Header as="h3" className="mb-0 flex-grow-1">Дополнительные услуги</Header>

            <SelectAdditionalServices
                row={props.row}
                setRows={setRows}
                toEdit={edit}
                setEdit={setEdit}
                setRow={setRow}
            />

        </div>

        {!loading && error && <div className="mx-auto my-5 text-center text-danger">
            <span>Ошибка {error}</span>
        </div>}

        {!loading && !error && rows.length === 0 && <div className="mx-auto my-5 text-center">
            <span className="opacity-30">Услуги не найдены</span>
        </div>}

        {!loading && !error && rows.map(r => <TenantAdditionalServiceRow
            key={r.id}
            row={r}
            setEdit={setEdit}
            setRows={setRows}
        />)}

        <Dimmer active={loading} inverted>
            <Loader />
        </Dimmer>

    </Segment>
}

/**
 * Выводит наименование периода оплаты
 * 
 * @param {number} type
 * @return {string} 
 */
export const getTypePayName = type => {
    switch (type) {
        case 1: return "раз";
        case 2: return "день";
        case 3: return "неделю";
        case 4: return "месяц";
        case 5: return "квартал";
        case 6: return "полгода";
        case 7: return "год";
        default: return "";
    }
}

const TenantAdditionalServiceRow = props => {

    const { row, setEdit, setRows } = props;
    const { load, Drop } = useDropRow({
        setRows,
        id: row?.id,
        source_id: row?.income_source_id
    });

    return <div className="d-flex align-items-center additional-service-row position-relative">

        {row.icon && <span>
            <Icon name={row.icon} disabled />
        </span>}

        <div className="flex-grow-1">{row.name}</div>

        <div className="opacity-50 me-2">
            <small>с {moment(row.start_date).format("DD.MM.YYYY")}</small>
        </div>

        <Label
            size="mini"
            color="green"
            content={`${row.sum} / ${getTypePayName(row.type_pay)}`}
        />

        <div className="d-flex align-items-center ms-2">
            <span>
                <Icon name="edit" link onClick={() => setEdit(row)} />
            </span>
            <span>
                <Drop />
            </span>
        </div>

        <Dimmer active={load} inverted />

    </div>
}

export const SelectAdditionalServices = props => {

    const { row, toEdit, setEdit, setRows, setRow } = props;

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [options, setOptions] = React.useState([]);
    const [formdata, setFormdata] = React.useState({});

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    React.useEffect(() => {

        toEdit && setOpen(true);

    }, [toEdit])

    React.useEffect(() => {

        if (open) {

            if (Boolean(toEdit?.id)) {
                setFormdata(p => ({ ...p, ...toEdit }));
            }

            setLoading(true);

            axios.get('services/list')
                .then(({ data }) => {
                    setOptions(data.rows);
                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        } else {
            setEdit(null);
        }

        return () => {
            setLoading(true);
            setError(null);
            setFormdata({ type_pay: 4 });
            setSaveError(null);
            setSaveErrors({});
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {
            axios.put('services/save', { ...formdata, id: row?.id, toPays: true })
                .then(({ data }) => {
                    setRows(p => data.list || p);
                    setOpen(false);

                    typeof setRow == "function"
                        && typeof data.pays == "object"
                        && setRow(p => ({ ...p, pays: data.pays }));
                })
                .catch(e => {
                    setSaveError(axios.getError(e));
                    setSaveErrors(axios.getErrors(e));
                })
                .then(() => setSave(false));
        }

    }, [save]);

    return <Modal
        open={open}
        header={formdata.id ? "Изменить услугу" : "Добавить дополнительную услугу"}
        centered={false}
        size="tiny"
        closeIcon
        onClose={() => setOpen(false)}
        trigger={<Button
            icon="plus"
            size="mini"
            color="green"
            basic
            onClick={() => setOpen(true)}
        />}
        content={<div className="content position-relative">

            {!loading && error && <Message error content={error} size="mini" />}

            <Form>

                <Form.Dropdown
                    label="Наименование услуги"
                    placeholder="Выберите или добавьте услугу"
                    options={[
                        { text: "Не выбрано", value: null },
                        ...options
                    ].map((r, i) => ({
                        ...r,
                        key: i,
                    }))}
                    value={formdata?.additional_service_id || null}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, additional_service_id: value }))}
                    search
                    selection
                    allowAdditions
                    additionLabel="Добавить в список: "
                    noResultsMessage="Ничего не найдено..."
                    onAddItem={(e, { value }) => {
                        setOptions(p => ([
                            ...p,
                            { text: value, value }
                        ]));
                        setFormdata(p => ({ ...p, additional_service_id: value }));
                    }}
                    required
                    error={Boolean(saveErrors?.additional_service_id)}
                />

                <Form.Group widths="equal">

                    <Form.Input
                        label="Стоимость услуги"
                        placeholder="Укажите стоимость"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formdata?.sum || ""}
                        onChange={(e, { value }) => setFormdata(p => ({ ...p, sum: value }))}
                        required
                        error={Boolean(saveErrors?.sum)}
                    />

                    <Form.Input
                        label="Дата начала"
                        type="date"
                        value={formdata?.start_date || ""}
                        onChange={(e, { value }) => setFormdata(p => ({ ...p, start_date: value }))}
                        required
                        error={Boolean(saveErrors?.start_date)}
                    />

                </Form.Group>

                <Form.Select
                    label="Вид оплаты"
                    placeholder="Выберите форму"
                    options={[
                        { key: 0, value: 1, text: "Разовая" },
                        { key: 1, value: 2, text: "Ежедневная", disabled: true },
                        { key: 2, value: 3, text: "Еженедельная", disabled: true },
                        { key: 3, value: 4, text: "Ежемесячная" },
                        { key: 4, value: 5, text: "Квартальная", disabled: true },
                        { key: 5, value: 6, text: "Полугодовая", disabled: true },
                        { key: 6, value: 7, text: "Годовая", disabled: true },
                    ]}
                    value={formdata?.type_pay || null}
                    onChange={(e, { value }) => setFormdata(p => ({ ...p, type_pay: value }))}
                    error={Boolean(saveErrors?.type_pay)}
                />

            </Form>

            {saveError && <div className="text-danger mt-3">
                <strong>Ошибка</strong>{' '}<span>{saveError}</span>
            </div>}

            <Dimmer active={loading || save} inverted>
                <Loader />
            </Dimmer>

        </div>}
        actions={{
            content: <div className="d-flex">
                <Button
                    content="Отмена"
                    fluid
                    className="ms-0 me-1"
                    onClick={() => setOpen(false)}
                    disabled={save}
                />
                <Button
                    content="Сохранить"
                    icon="save"
                    color="green"
                    labelPosition="right"
                    fluid
                    className="me-0 ms-1"
                    onClick={() => setSave(true)}
                    disabled={save || loading}
                />
            </div>
        }}
    />

}

export default TenantAdditionalServices;