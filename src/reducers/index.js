const initialState = {
    num: 0
};
const appReducers = (state=initialState, action) => {
    switch (action.type) {
        case "ADD":
            return {
                ...state,
                num: state.num + 1
            };
        default:
            return state;
    }
};
export default appReducers;
