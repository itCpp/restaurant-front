import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { setShowAdd } from "../../store/incomes/actions";

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
                    onClick={() => dispatch(setShowAdd(true))}
                    content="Внести оплату"
                    icon="plus"
                />
                <Dropdown.Divider className="my-0" />
                <Dropdown.Item
                    content="Создать раздел"
                    icon="factory"
                    disabled
                />
                <Dropdown.Item
                    content="Добавить помещение"
                    icon="plus square"
                    disabled
                />
            </Dropdown.Menu>
        </Dropdown>

    </div>

}

export default IncomeHeaderButtons;