import { Button } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { setShowAdd } from "../../store/expenses/actions";

const ExpenseHeaderButtons = () => {

    const dispatch = useDispatch();

    return <div className="d-flex justify-content-end">

        <Button
            basic
            icon="plus"
            onClick={() => dispatch(setShowAdd(true))}
        />

    </div>

}

export default ExpenseHeaderButtons;