import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { setShowCashboxRowEdit } from "../../store/cashbox/actions";

const CashboxHeaderButtons = () => {

    const dispatch = useDispatch();

    return <div className="d-flex justify-content-end">
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