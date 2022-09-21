import { NavLink, useLocation } from "react-router-dom";
import { ExpenseHeaderButtons } from "./Expenses";
import { IncomeHeaderButtons } from "./Incomes";

const Header = () => {

    const { pathname } = useLocation();

    return <div className="body-header">
        <div>
            <NavLink to="/">
                <strong>CRM</strong>
            </NavLink>
        </div>

        <NavLink to="/income/1" className="header-link">Строение 1</NavLink>
        <NavLink to="/income/2" className="header-link">Строение 2</NavLink>
        <NavLink to="/income/parking" className="header-link">Парковка</NavLink>
        <NavLink to="/expenses" className="header-link">Раcходы</NavLink>
        <NavLink to="/employees" className="header-link">Сотрудники</NavLink>

        <div className="flex-grow-1">

            {pathname.indexOf("/expenses") >= 0 && <ExpenseHeaderButtons />}
            {pathname.indexOf("/income/1") >= 0 && <IncomeHeaderButtons />}
            {pathname.indexOf("/income/2") >= 0 && <IncomeHeaderButtons />}

        </div>

    </div>

}

export default Header;