
import { makeInventoryFirebase } from "../firebase/makeInventoryFirebase";
import { types } from "../types";


export const dispatchGetStatusInventory = (value) => ({
    type: types.getMakeInventory,
    payload: value
});


export const dispatchGetCategoriesBusiness = (categories) => ({
    type: types.getCategories,
    payload: categories
});


export const dispatchGetAllProductsBusiness = (products) => ({
    type: types.getAllProducts,
    payload: products
});


export const dispatchGetRequisicionesBusiness = (requisiciones) => ({
    type: types.getRequisiciones,
    payload: requisiciones
});


export const dispatchClickCategory = (categoryName) => {
    return async (dispatch, getState) => {

        const {categories} = getState().restaurantReducer;

        let updateCategories = categories.map(
            category => category.name === categoryName ?
                {
                    ...category,
                    name: category.name, 
                    open: !category.open
                }
                :
                {
                    ...category,
                    name: category.name, 
                    open: false
                }
        );

        let selectedCategory = updateCategories.find(
            category => category.open === true
        );

        let totalMoneyStock = 0;
        let totalMoneyCurrent = 0;

        
        if(selectedCategory){

            selectedCategory.products.forEach(product => {
                totalMoneyStock = totalMoneyStock +
                    (product.unitPrice * product.stock);
    
                totalMoneyCurrent = totalMoneyCurrent +
                    (product.unitPrice * product.current);
    
            });

            selectedCategory = {
                name: selectedCategory.name,
                totalMoneyStock,
                totalMoneyCurrent
            }
        }


        dispatch({
            type: types.clickCategory,
            payload: {
                updateCategories,
                selectedCategory
            }
        });
    }
}


export const dispatchMakeInventory = (businessName, fromSocket) => {
    return async (dispatch, getState) => {

        const {categories} = getState().restaurantReducer;

        let updateProductsCategories = categories;

        updateProductsCategories.forEach(category => {

            category.check = false;

            category.products.forEach(product => {
                product.check = false
            });
        });


        await dispatch({
            type: types.makeInventory,
            payload: updateProductsCategories
        });

        if(!fromSocket){
            makeInventoryFirebase(businessName);
        }
    }
}


export const selectProductInventory = (product, inputID) => {
    return async (dispatch, getState) => {
        
        const {selectedProductInventory:productSelected} =
            getState().restaurantReducer;
        
        if(!product?.productName){
            dispatch({
                type: types.selectProductInventory,
                payload: null
            });

        } else if(productSelected?.productName === product.productName){
            dispatch({
                type: types.selectProductInventory,
                payload: null
            });           

        } else {
            await dispatch({
                type: types.selectProductInventory,
                payload: product
            });

            if(inputID){
                document.getElementById(inputID).focus();
            }
        }
    }
};

export const selectProductRequisicion = (product, inputID) => {
    return async (dispatch, getState) => {

        const {selectedProductRequisicion} =
            getState().restaurantReducer;
        
        if(
            selectedProductRequisicion?.productName ===
            product.productName 
            &&
            product?.edit !== true
        ){
            dispatch({
                type: types.selectProductRequisicion,
                payload: {}
            })

        } else {
            await dispatch({
                type: types.selectProductRequisicion,
                payload: product
            });
        }

        if(inputID){
            document.getElementById(inputID).focus();
        }

    }
}


export const inventoryUpdateProduct = (updateCategories) => ({
    type: types.updateAmountInventory,
    payload: updateCategories
});


export const clickCategoryInventory = (categoryName) => ({
    type: types.clickCategoryInventory,
    payload: categoryName
})

export const modifyOrder = (categories) => ({
    type: types.modifyOrderInventory,
    payload: categories
});


export const dispatchMakeRequisicion = (requisicion) => ({
    type: types.makeRequisicion,
    payload: requisicion
});


export const iconCompletedProduct = (updateCategories) => ({
    type: types.completedProductRequisicion,
    payload: updateCategories
});


export const iconEditProduct = (updateRequisiciones) => ({
    type: types.editProductRequisicion,
    payload: updateRequisiciones
});


export const iconCancelProduct = (updateRequisiciones) => ({
    type: types.cancelProductRequisicion,
    payload: updateRequisiciones
});


export const clickProductCanceled = (product) => {
    return async (dispatch, getState) => {

        const {selectedProductCanceled} = 
            getState().restaurantReducer;
        
        if(selectedProductCanceled?.name === product.name){
            dispatch({
                type: types.selectProductCanceled,
                payload: null
            });

        } else {

            if(product.missingAmount > 0){
                let amountCompleted = 
                    (product.requestedAmount - product.missingAmount);
                
                dispatch({
                    type: types.selectProductCanceled,
                    payload: {
                        name: product.name,
                        unitPrice: product.unitPrice,
                        requestedAmount: product.requestedAmount,
                        amountCompleted,
                        missingAmount: product.missingAmount
                    }
                });
    
            } else {
                dispatch({
                    type: types.selectProductCanceled,
                    payload: {
                        name: product.name,
                        unitPrice: product.unitPrice,
                        requestedAmount: product.requestedAmount,
                    }
                });
            }

        }

    }
}