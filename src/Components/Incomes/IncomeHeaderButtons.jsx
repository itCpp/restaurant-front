import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { setShowAdd, setIncomeSourceAdd, setPartAdd } from "../../store/incomes/actions";

const IncomeHeaderButtons = () => {

    const dispatch = useDispatch();

    return <div className="d-flex justify-content-end">

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
                    content="Добавить помещение"
                    icon="plus square"
                    onClick={() => dispatch(setIncomeSourceAdd(true))}
                />
            </Dropdown.Menu>
        </Dropdown>

    </div>

}

export default IncomeHeaderButtons;