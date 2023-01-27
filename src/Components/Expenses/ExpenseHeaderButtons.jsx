import { Button, Dropdown, Form, Label, Select } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setShowAdd, setSearchExpenses } from "../../store/expenses/actions";
import React from "react";
import { axios } from "../../system";

const ExpenseHeaderButtons = () => {

    const dispatch = useDispatch();
    const [openSearch, setOpenSearch] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});
    const { search } = useSelector(s => s.expenses);
    const [types, setTypes] = React.useState([]);
    const [loadTypes, setLoadTypes] = React.useState(false);

    const changeHandle = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    React.useEffect(() => {

        if (openSearch && types.length === 0) {
            setLoadTypes(true);
            axios.get('expenses/types')
                .then(({ data }) => {
                    setTypes(data);
                })
                .catch(e => null)
                .then(() => setLoadTypes(false));
        }

    }, [openSearch]);

    return <div className="d-flex justify-content-end">

        <Dropdown
            open={openSearch}
            icon={null}
            trigger={<span className="position-relative">
                <Button
                    basic
                    icon="search"
                    onClick={() => setOpenSearch(p => !p)}
                />
                {search && <Label empty floating color="orange" circular />}
            </span>}
            direction="left"
            pointing="top right"
        >
            <Dropdown.Menu className="shadow">
                <Dropdown.Header>Поиск</Dropdown.Header>
                <Dropdown.Divider />
                <Form className="px-2 py-2 position-relative">
                    <Form.Input
                        label="Наименование"
                        placeholder="Укажите наименование"
                        name="name"
                        value={formdata.name || ""}
                        onChange={changeHandle}
                        className="mb-1"
                    />
                    <Form.Select
                        label="Тип расхода"
                        placeholder="Выберите тип"
                        options={[{ value: null, text: "Любой тип" }, ...types].map((r, i) => ({
                            key: i,
                            ...r,
                        }))}
                        name="type"
                        value={formdata.type || null}
                        onChange={changeHandle}
                        className="mb-1 search-select"
                        loading={loadTypes}
                    />
                    <Form.Input
                        label="Месяц"
                        type="month"
                        name="month"
                        value={formdata.month || ""}
                        onChange={changeHandle}
                        className="mb-1"
                    />
                    <Form.Input
                        label="Дата"
                        type="date"
                        name="date"
                        value={formdata.date || ""}
                        onChange={changeHandle}
                        className="mb-1"
                    />
                    <Button
                        className="mt-2"
                        color="green"
                        content="Найти"
                        fluid
                        onClick={() => {
                            dispatch(setSearchExpenses({ ...formdata }));
                            setOpenSearch(false);
                        }}
                    />
                    {search && <Button
                        className="mt-1"
                        color="orange"
                        content="Отменить поиск"
                        fluid
                        onClick={() => {
                            setFormdata({});
                            dispatch(setSearchExpenses(null));
                            setOpenSearch(false);
                        }}
                    />}
                </Form>
            </Dropdown.Menu>
        </Dropdown>

        <Button
            basic
            icon="plus"
            title="Добавить расход"
            onClick={() => dispatch(setShowAdd(true))}
        />

    </div>

}

export default ExpenseHeaderButtons;