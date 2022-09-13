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

        {/* <NavLink to="/employees" className="header-link">Сотрудники</NavLink> */}
        <NavLink to="/income" className="header-link">Доходы</NavLink>
        <NavLink to="/expenses" className="header-link">Раcходы</NavLink>

        <div className="flex-grow-1">

            {pathname.indexOf("/expenses") >= 0 && <ExpenseHeaderButtons />}
            {pathname.indexOf("/income") >= 0 && <IncomeHeaderButtons />}

        </div>

    </div>

}

export default Header;