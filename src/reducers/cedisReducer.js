import { types } from "../types"

const initialState = {
    requisiciones: [],
    selectedProduct: {},
    selectedCategoryRequisicion: null
}


export const cedisReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.cedisGetData:
            return {
              ...state,
              requisiciones: action.payload
            }

        case types.cedisSelectProduct:
            return {
              ...state,
              selectedProduct: action.payload
            }

        case types.cedisSelectCategory:
            return {
              ...state,
              selectedCategoryRequisicion: action.payload
            }

        case types.cedisCheckProduct:
            return {
              ...state,
              requisiciones: action.payload
            }
    
        default:
            return state;
    }
}