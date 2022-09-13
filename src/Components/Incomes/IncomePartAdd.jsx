import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";
import { setPartAdd } from "../../store/incomes/actions";

const IncomePartAdd = props => {

    const dispatch = useDispatch();
    const { showPartAdd } = useSelector(s => s.incomes);

    const close = () => dispatch(setPartAdd(false));

    return <Modal
        open={showPartAdd}
        header="Раздел"
        centered={false}
        size="small"
        onClose={close}
        closeIcon
        content={<div>
            
        </div>}
    />
}

export default IncomePartAdd;