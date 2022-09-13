import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import "./crm.css";
import * as Components from "./Components";

const Crm = props => {

    return <Router>

        <Components.Header />

        <Routes>
            <Route path="/income" element={<Components.Income />} />
            <Route path="/expenses" element={<Components.Expenses />} />
            <Route path="/employees" element={<Components.Employees />} />
            <Route path="*" element={<Components.Main />} />
        </Routes>

    </Router>
}

export default Crm;