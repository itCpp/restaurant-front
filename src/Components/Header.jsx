import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import CashboxHeaderButtons from "./Cashbox/CashboxHeaderButtons";
import { ExpenseHeaderButtons } from "./Expenses";
import { IncomeHeaderButtons } from "./Incomes";
import ParkingHeaderButtons from "./Parking/ParkingHeaderButtons";

const Header = () => {

    const { pathname } = useLocation();
    const [show, setShow] = useState(false);
    const menu = useRef();

    useEffect(() => {

        if (show) {
            menu.current.classList.add('show');
        } else {
            menu.current.classList.remove('show');
        }

    }, [show]);

    return <div className="body-header">

        <div ref={menu} className="header-body" onClick={() => setShow(false)}>

            <div className="header-menu">

                <div className="header-header d-flex align-items-center">
                    <Icon name="bars" link size="large" className="me-3" />
                    <NavLink to="/"><strong>CRM</strong></NavLink>
                </div>

                <NavLink to="/income/1" className="header-link">Строение 1</NavLink>
                <NavLink to="/income/2" className="header-link">Строение 2</NavLink>
                <NavLink to="/income/parking" className="header-link">Парковка</NavLink>
                <NavLink to="/expenses" className="header-link">Раcходы</NavLink>
                <NavLink to="/employees" className="header-link">Сотрудники</NavLink>
                <NavLink to="/salary" className="header-link">Зарплата</NavLink>
                <NavLink to="/cashbox" className="header-link">Касса</NavLink>
            </div>

        </div>

        <div className="d-flex align-items-center">
            <Icon name="bars" link size="large" className="me-3" onClick={() => setShow(p => !p)} />
            <NavLink to="/"><strong>CRM</strong></NavLink>
        </div>

        <div className="flex-grow-1">

            {pathname.indexOf("/expenses") >= 0 && <ExpenseHeaderButtons />}
            {pathname.indexOf("/income/1") >= 0 && <IncomeHeaderButtons />}
            {pathname.indexOf("/income/2") >= 0 && <IncomeHeaderButtons />}
            {pathname.indexOf("/cashbox") >= 0 && <CashboxHeaderButtons />}
            {pathname.indexOf("/income/parking") >= 0 && <ParkingHeaderButtons />}

        </div>

    </div>

}

export default Header;