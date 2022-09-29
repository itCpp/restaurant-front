import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { setShowCashboxRowEdit, setShowCashboxCalendar } from "../../store/cashbox/actions";

const CashboxHeaderButtons = () => {

    const dispatch = useDispatch();
    const { calendar } = useSelector(s => s.cashbox);

    return <div className="d-flex justify-content-end">

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