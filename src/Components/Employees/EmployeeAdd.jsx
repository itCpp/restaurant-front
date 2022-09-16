import React from "react";
import { Dimmer, Form, Header, Loader, Modal } from "semantic-ui-react";
import { axios } from "../../system";

const EmployeeAdd = props => {

    const { show, close, handleRows } = props;

    const [formdata, setFormdata] = React.useState({});
    const [jobTitles, setJobTitles] = React.useState([]);

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (show) {
            axios.get('employees/jobTitleList')
                .then(({ data }) => setJobTitles(data || []))
                .catch(e => { })
                .then(() => { });
        }

        return () => {
            setFormdata({});
            setSave(false);
            setSaveErrors({});
            setSaveError(null);
        }

    }, [show]);

    React.useEffect(() => {

        if (save) {
            axios.put('employees/create', formdata)
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
            content="Новый сотрудник"
            icon="plus"
            className="px-2 py-3"
        />}
        size="small"
        centered={false}
        closeIcon={{ name: "close", onClick: () => !save && close(), disabled: save }}
        content={<div className="content">

            <Form loading={save}>

                <Form.Group widths={3}>
                    <Form.Input
                        label="Фамилия"
                        placeholder="Введите фаимилию"
                        name="surname"
                        value={formdata.surname || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.surname)}
                        required
                    />
                    <Form.Input
                        label="Имя"
                        placeholder="Введите имя"
                        name="name"
                        value={formdata.name || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.name)}
                        required
                    />
                    <Form.Input
                        label="Отчество"
                        placeholder="Введите отчество"
                        name="middle_name"
                        value={formdata.middle_name || ""}
                        onChange={handleChange}
                        error={Boolean(saveErrors.middle_name)}
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
                    />
                </Form.Group>

                <Dimmer inverted><Loader /></Dimmer>

            </Form>

            {saveError && <div className="mt-4 text-danger">
                <strong>{saveError}</strong>
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
                disabled: save,
            }
        ]}
    />
}

export default EmployeeAdd;