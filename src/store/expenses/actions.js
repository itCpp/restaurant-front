export const EXPENSES_SHOW_ADD = "EXPENSES_SHOW_ADD";
export const setShowAdd = data => ({
    type: EXPENSES_SHOW_ADD,
    payload: data
});

export const SEARCH_EXPENSES = "SEARCH_EXPENSES";
export const setSearchExpenses = data => ({
    type: SEARCH_EXPENSES,
    payload: data
});