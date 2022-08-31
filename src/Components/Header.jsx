import { NavLink, useLocation } from "react-router-dom";
import { ExpenseHeaderButtons } from "./Expenses";

const Header = props => {

    const { pathname } = useLocation();

    return <div className="body-header">
        <div>
            <NavLink to="/">
                <strong>CRM</strong>
            </NavLink>
        </div>

        <NavLink to="/income" className="header-link">Доходы</NavLink>
        <NavLink to="/expenses" className="header-link">Раcходы</NavLink>

        <div className="flex-grow-1">

            {pathname.indexOf("/expenses") >= 0 && <ExpenseHeaderButtons />}

        </div>

    </div>

}

export default Header;