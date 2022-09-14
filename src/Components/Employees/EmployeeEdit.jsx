import React from "react";
import { Dimmer, Form, Header, Loader, Modal } from "semantic-ui-react";
import { axios } from "../../system";

const EmployeeEdit = props => {

    const { show, data, close, handleRows } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});
    const [jobTitles, setJobTitles] = React.useState([]);
    const [shedule, setShedule] = React.useState([]);

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const isError = Boolean(error);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (data) {

            setFormdata(data);
            setLoading(true);

            axios.get('employees/get', { params: { id: data?.id } })
                .then(({ data }) => {
                    setFormdata(data.row || {});
                    setJobTitles(data.jobTitles || []);
                    setShedule(data.shedule || []);
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setLoading(false));
        }

        return () => {
            setFormdata({});
            setSave(false);
            setSaveErrors({});
            setSaveError(null);
            setLoading(true);
            setError(null);
        }

    }, [data]);

    React.useEffect(() => {

        if (save) {
            axios.put('employees/save', formdata)
                .then(({ data }) => {
                    handleRows(data);
                    close();
                })
                .catch(e => {
                    setSaveError(axios.getError(e));
                    setSaveErrors(axios.getErrors(e));
                })
                .then(() => setSave(false));
        }

    }, [save]);

    return <Modal
        open={show}
        header={<Header
            as="h3"
            content={formdata.fullname || "Изменить данные"}
            icon="edit"
        />}
        size="small"
        centered={false}
        closeIcon={{ name: "close", onClick: () => !save && close(), disabled: save }}
        content={<div className="content">

            <Form loading={save || loading}>

                <Form.Group widths={3}>
                    <Form.Input
                        label="Фамилия"
                        placeholder="Введите фаимилию"
                        name="surname"
                        value={formdata.surname || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.surname)}
                        required
                        disabled={isError}
                    />
                    <Form.Input
                        label="Имя"
                        placeholder="Введите имя"
                        name="name"
                        value={formdata.name || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.name)}
                        required
                        disabled={isError}
                    />
                    <Form.Input
                        label="Отчество"
                        placeholder="Введите отчество"
                        name="middle_name"
                        value={formdata.middle_name || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.middle_name)}
                        disabled={isError}
                    />
                </Form.Group>

                <Form.Group widths={2}>
                    <Form.Input
                        label="Номер телефона"
                        placeholder="Укажите номер телефона"
                        name="phone"
                        value={formdata.phone || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.phone)}
                        required
                        disabled={isError}
                        icon="phone"
                    />
                    <Form.Dropdown
                        label="Должность"
                        placeholder="Выберите или добавьте должность"
                        options={[null, ...jobTitles].map((row, i) => ({
                            key: i,
                            text: row || "Без должности",
                            value: row,
                        }))}
                        search
                        selection
                        allowAdditions
                        additionLabel="Добавить должность: "
                        name="job_title"
                        value={formdata.job_title || null}
                        onAddItem={(e, { name, value }) => {
                            setJobTitles(p => ([value, ...p]));
                            handleChange(e, { name, value });
                        }}
                        onChange={handleChange}
                        error={Boolean(saveErrors.job_title)}
                        disabled={isError}
                    />
                </Form.Group>

                <hr />

                <Form.Group widths={3}>

                    <Form.Input
                        label="Дополнительный телефон"
                        placeholder="Введите номер"
                        name="personal_data_phone_second"
                        value={formdata.personal_data_phone_second || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.personal_data_phone_second)}
                        disabled={isError}
                        icon="phone"
                    />

                    <Form.Input
                        label="Электронная почта"
                        placeholder="Введите адрес"
                        type="email"
                        name="email"
                        value={formdata.email || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.email)}
                        disabled={isError}
                        icon={{ name: "mail", color: "yellow" }}
                    />

                    <Form.Input
                        label="Телеграм"
                        placeholder="Введите идентификатор"
                        name="telegram_id"
                        value={formdata.telegram_id || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.telegram_id)}
                        disabled={isError}
                        icon={{ name: "telegram plane", color: "blue" }}
                    />

                </Form.Group>

                <hr />

                <Form.Group widths={2}>

                    <Form.Input
                        label="Дата начала работы"
                        type="date"
                        name="date_work_start"
                        value={formdata.date_work_start || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.date_work_start)}
                        disabled={isError}
                    />

                    <Form.Input
                        label="Дата окончания работы"
                        type="date"
                        name="date_work_stop"
                        value={formdata.date_work_stop || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.date_work_stop)}
                        disabled={isError}
                    />

                </Form.Group>

                <hr />

                <Form.Group widths={2}>

                    <Form.Select
                        label="График работы"
                        placeholder="Выберите график"
                        name="personal_data_work_shedule"
                        options={[{ text: "Свободный", value: null }, ...shedule].map((row, i) => ({
                            ...row,
                            key: i,
                        }))}
                        value={formdata.personal_data_work_shedule || null}
                        onChange={handleChange}
                        error={Boolean(saveErrors.personal_data_work_shedule)}
                        disabled={isError}
                    />

                    <Form.Group widths={2}>

                        <Form.Input
                            label="Время с"
                            type="time"
                            name="personal_data_work_shedule_time_with"
                            value={formdata.personal_data_work_shedule_time_with || ""}
                            onChange={handleChange}
                            error={Boolean(saveErrors.personal_data_work_shedule_time_with)}
                            disabled={isError}
                            style={{ maxHeight: 38 }}
                        />
                        <Form.Input
                            label="Время до"
                            type="time"
                            name="personal_data_work_shedule_time_on"
                            value={formdata.personal_data_work_shedule_time_on || ""}
                            onChange={handleChange}
                            error={Boolean(saveErrors.personal_data_work_shedule_time_on)}
                            disabled={isError}
                            style={{ maxHeight: 38 }}
                        />

                    </Form.Group>

                </Form.Group>

                <Dimmer inverted>
                    <Loader />
                </Dimmer>

            </Form>

            {saveError && <div className="mt-4 text-danger">
                <strong>{saveError}</strong>
            </div>}

            {error && <div className="mt-4 text-danger">
                <strong>{error}</strong>
            </div>}

        </div>}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: close,
                disabled: save,
            },
            {
                key: "save",
                content: "Сохранить",
                icon: "save",
                labelPosition: "right",
                color: "green",
                onClick: () => setSave(true),
                disabled: save || isError,
            }
        ]}
    />
}

export default EmployeeEdit;