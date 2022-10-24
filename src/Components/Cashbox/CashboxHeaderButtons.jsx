import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form } from "semantic-ui-react";
import { setShowCashboxRowEdit, setShowCashboxCalendar, setCahsboxSearch } from "../../store/cashbox/actions";

const CashboxHeaderButtons = () => {

    const dispatch = useDispatch();
    const { calendar, search } = useSelector(s => s.cashbox);
    const [show, setShowSearch] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});

    const isSearch = Boolean(Object.keys(search || {}).length);

    React.useEffect(() => {

        return () => {
            setShowSearch(false);
            setFormdata({});
        }

    }, []);

    const toSearch = search => {

        let toSearch = false;

        Object.values(search).forEach(value => {
            if (Boolean(value))
                toSearch = true;
        });

        return toSearch ? search : null;
    }

    return <div className="d-flex justify-content-end">

        <Dropdown
            open={show}
            icon={null}
            direction="left"
            trigger={<Button
                basic={!isSearch}
                color={isSearch ? "orange" : null}
                icon="search"
                size="mini"
                title="Поиск"
                onClick={() => setShowSearch(p => !p)}
            />}
        >
            <Dropdown.Menu>
                <Dropdown.Header>Поиск</Dropdown.Header>
                <Dropdown.Divider />
                <div className="px-2 mb-2">
                    <Form>
                        <Form.Input
                            icon="search"
                            placeholder="Наименование"
                            label="Наименование"
                            className="mb-2"
                            value={formdata?.name || ""}
                            onChange={(e, { value }) => setFormdata(p => ({ ...p, name: value }))}
                        />
                        <Form.Input
                            type="date"
                            placeholder="Дата"
                            label="Дата"
                            className="mb-2"
                            value={formdata?.date || ""}
                            onChange={(e, { value }) => setFormdata(p => ({ ...p, date: value }))}
                        />
                    </Form>
                    <Button
                        fluid
                        content="Найти"
                        color="green"
                        icon="search"
                        labelPosition="right"
                        className="mt-3"
                        onClick={() => {
                            setShowSearch(false);
                            dispatch(setCahsboxSearch(toSearch(formdata)))
                        }}
                    />
                    {isSearch && <Button
                        fluid
                        content="Отменить поиск"
                        color="orange"
                        className="mt-1"
                        onClick={() => {
                            setShowSearch(false);
                            dispatch(setCahsboxSearch(null))
                        }}
                    />}
                </div>
            </Dropdown.Menu>
        </Dropdown>

        <Button
            color="blue"
            basic={!Boolean(calendar)}
            icon="calendar"
            size="mini"
            title="Календарь расходов"
            onClick={() => dispatch(setShowCashboxCalendar(calendar ? false : true))}
        />

        <Button
            color="green"
            basic
            icon="plus"
            size="mini"
            title="Добавить новый платеж"
            onClick={() => dispatch(setShowCashboxRowEdit(true))}
        />

    </div>
}

export default CashboxHeaderButtons;