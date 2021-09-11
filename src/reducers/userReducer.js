import { types } from "../types";


const initialState = {
    name: null,
    job: null,
    business: null,
    widthScreen: null
}


export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.getDataUser:
            return {
                ...state,
                name: action.payload.name,
                job: action.payload.job,
                business: action.payload.business,
                widthScreen: action.payload.widthScreen
            }

        case types.changeWidthScreen:
            return {
                ...state,
                widthScreen: action.payload
            }
    
        default:
            return state;
    }
}