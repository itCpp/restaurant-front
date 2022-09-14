import { NavLink, useLocation } from "react-router-dom";
import { ExpenseHeaderButtons } from "./Expenses";
import { IncomeHeaderButtons } from "./Incomes";

const Header = props => {

    const { pathname } = useLocation();

    return <div className="body-header">
        <div>
            <NavLink to="/">
                <strong>CRM</strong>
            </NavLink>
        </div>

        <NavLink to="/income/1" className="header-link">Строение 1</NavLink>
        <NavLink to="/income/2" className="header-link">Строение 2</NavLink>
        <NavLink to="/expenses" className="header-link">Раcходы</NavLink>
        <NavLink to="/employees" className="header-link">Сотрудники</NavLink>

        <div className="flex-grow-1">

            {pathname.indexOf("/expenses") >= 0 && <ExpenseHeaderButtons />}
            {pathname.indexOf("/income") >= 0 && <IncomeHeaderButtons />}

        </div>

    </div>

}

export default Header;