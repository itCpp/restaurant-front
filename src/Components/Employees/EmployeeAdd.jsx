import React from "react";
import { Form, Header, Modal } from "semantic-ui-react";
import { axios } from "../../system";

const EmployeeAdd = props => {

    const { show, close } = props;

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [jobTitles, setJobTitles] = React.useState([]);

    React.useEffect(() => {

        if (show) {
            axios.get('employees/jobTitleList')
                .then(({ data }) => { })
                .catch(e => { })
                .then(() => { })
        }

        return () => {
            setFormdata({});
            setSave(false);
        }

    }, [show]);

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
        closeIcon={{ name: "close", onClick: () => close() }}
        content={<div className="content">
            <Form>

                <Form.Group widths={3}>
                    <Form.Input
                        label="Фамилия"
                        name="surname"
                    />
                    <Form.Input
                        label="Имя"
                        name="name"
                    />
                    <Form.Input
                        label="Отчество"
                        name="middle_name"
                    />
                </Form.Group>

                <Form.Group widths={2}>
                    <Form.Input
                        label="Номер телефона"
                        name="phone"
                    />
                    <Form.Dropdown
                        label="Должность"
                        options={[]}
                        selection
                        name="job_title"
                    />
                </Form.Group>

            </Form>
        </div>}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: close,
            },
            {
                key: "save",
                content: "Сохранить",
                icon: "save",
                labelPosition: "right",
                color: "green",
                onClick: () => setSave(true),
            }
        ]}
    />
}

export default EmployeeAdd;