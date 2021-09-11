import { types } from "../types";


const initialState = {
    businessInfo: []
}


export const financeReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.financeGetDataBusiness:
            return {
                ...state,
                businessInfo: action.payload
            }
    
        default:
            return state;
    }
}