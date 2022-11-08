import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setShowAdd, setIncomeSourceAdd, setPartAdd, setIncomeFilter } from "../../store/incomes/actions";
import { useCallback } from "react";

const IncomeHeaderButtons = () => {

    const dispatch = useDispatch();
    const { filter } = useSelector(s => s.incomes);

    const setFilter = useCallback((data) => {
        dispatch(setIncomeFilter(data));
    }, []);

    return <div className="d-flex justify-content-end">

        <Dropdown
            trigger={<Button
                basic
                icon="filter"
                color={Object.keys(filter).length > 0 ? "orange" : null}
            />}
            icon={null}
            pointing="top left"
            direction="left"
        >
            <Dropdown.Menu>
                <Dropdown.Header icon='tags' content='Фильтрация' />
                <Dropdown.Divider />
                <Dropdown.Item
                    label={{ color: 'blue', empty: true, circular: true }}
                    text='Все помещения'
                    onClick={() => setFilter({})}
                    active={!Boolean(filter?.onlyRent) && !Boolean(filter?.onlyFree)}
                />
                <Dropdown.Item
                    label={{ color: 'red', empty: true, circular: true }}
                    text='Арендованные'
                    onClick={() => setFilter({ onlyRent: true })}
                    active={Boolean(filter?.onlyRent)}
                />
                <Dropdown.Item
                    label={{ color: 'green', empty: true, circular: true }}
                    text='Свободные'
                    onClick={() => setFilter({ onlyFree: true })}
                    active={Boolean(filter?.onlyFree)}
                />
            </Dropdown.Menu>
        </Dropdown>

        <Dropdown
            floating
            trigger={<Button
                basic
                icon="plus"
            />}
            icon={null}
            pointing="top left"
            direction="left"
        >
            <Dropdown.Menu>
                <Dropdown.Item
                    content="Внести оплату"
                    icon="plus"
                    onClick={() => dispatch(setShowAdd(true))}
                />
                <Dropdown.Divider className="my-0" />
                <Dropdown.Item
                    content="Создать раздел"
                    icon="factory"
                    onClick={() => dispatch(setPartAdd(true))}
                />
                <Dropdown.Item
                    content="Добавить арендатора"
                    icon="plus square"
                    onClick={() => dispatch(setIncomeSourceAdd(true))}
                />
            </Dropdown.Menu>
        </Dropdown>

    </div>

}

export default IncomeHeaderButtons;