import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import "./crm.css";
import Expenses from "./Expenses";
import Header from "./Header";

const Crm = props => {

    return <Router>

        <Header />

        <Routes>
            <Route path="/income" element={<div>Доходы</div>} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="*" element={<div></div>} />
        </Routes>

    </Router>
}

export default Crm;