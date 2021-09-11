
import { types } from "../types";


const initialState = {
    categories: [],
    selectedCategory: false,
    selectedCategoryInventory: null,
    selectedCategoryRequisicion: null,
    makeInventory: false,
    selectedProductInventory: null,
    requisiciones: [],
    allProducts: [],
    selectedProductRequisicion: {},
    selectedProductCanceled: null,
    folioRequisicionDesktop: null
}

export const restaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.getMakeInventory:
            return {
                ...state,
                makeInventory: action.payload
            }

        case types.getCategories:
            return {
                ...state,
                categories: action.payload,
            }

        case types.getAllProducts:
            return {
                ...state,
                allProducts: action.payload
            }

        case types.getRequisiciones:
            return {
                ...state,
                requisiciones: action.payload
            }

        case types.clickCategory:
            return {
                ...state,
                categories: action.payload.updateCategories,
                selectedCategory: action.payload.selectedCategory
            }

        case types.makeInventory:
            return {
                ...state,
                categories: action.payload,
                makeInventory: true
            }

        case types.clickCategoryInventory:
            return {
                ...state,
                selectedCategoryInventory: action.payload
            }

        case types.selectProductInventory:
            return {
                ...state,
                selectedProductInventory: action.payload
            }

        case types.updateAmountInventory:
            return {
                ...state,
                categories: action.payload.updateCategories
            }

        case types.modifyOrderInventory:
            return {
                ...state,
                categories: action.payload
            }

        case types.makeRequisicion:
            return {
                ...state,
                requisiciones: [
                    action.payload,
                    ...state.requisiciones
                ]
            }

        case types.clickCategoryRequisicion:
            return {
                ...state,
                selectedCategoryRequisicion: action.payload
            }

        case types.clickRequisicionDesktop:
            return {
                ...state,
                folioRequisicionDesktop: action.payload
            }

        case types.selectProductRequisicion:
            return {
                ...state,
                selectedProductRequisicion: action.payload
            }

        case types.completedProductRequisicion:
            return {
                ...state,
                requisiciones: action.payload
            }
        
        case types.editProductRequisicion:
            return {
                ...state,
                requisiciones: action.payload
            }

        case types.cancelProductRequisicion:
            return {
                ...state,
                requisiciones: action.payload
            }

        case types.selectProductCanceled:
            return {
                ...state,
                selectedProductCanceled: action.payload
            }
            
        default:
            return state;
    }    
}