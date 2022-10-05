import axios from "./axios";
import moment from "./moment";

export const ucFirst = str => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}

export {
    axios,
    moment,
}