import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import "./crm.css";
import Expenses from "./Expenses";
import Header from "./Header";
import Income from "./Incomes";
import Main from "./Main";

const Crm = props => {

    return <Router>

        <Header />

        <Routes>
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="*" element={<Main />} />
        </Routes>

    </Router>
}

export default Crm;