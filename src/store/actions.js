export const IS_LOGIN = "IS_LOGIN";
export const setIsLogin = data => ({
    type: IS_LOGIN,
    payload: data
});

export const USER_DATA = "USER_DATA";
export const setUserData = data => ({
    type: USER_DATA,
    payload: data
});