export const CASHBOX_ROW_EDIT = "CASHBOX_ROW_EDIT";
export const setShowCashboxRowEdit = data => ({
    type: CASHBOX_ROW_EDIT,
    payload: data
});

export const CASHBOX_SHOW_CALENDAR = "CASHBOX_SHOW_CALENDAR";
export const setShowCashboxCalendar = data => ({
    type: CASHBOX_SHOW_CALENDAR,
    payload: data
});

export const CASHBOX_SEARCH = "CASHBOX_SEARCH";
export const setCahsboxSearch = data => ({
    type: CASHBOX_SEARCH,
    payload: data
});
