
import moment from 'moment';
import { dispatchSelectedProductCedis } from './actions/cedisActions';
import { dispatchMakeInventory, selectProductRequisicion } from './actions/restaurantActions';
import { getDataBusiness } from './firebase/getDataBusiness';
import { getDataCedis } from './firebase/getDataCedis';
import { checkInventory } from './helpers/checkInventory';
import { checkProductCedis } from './helpers/checkProductCedis';
import { checkRequisicion } from './helpers/checkRequisicion';
import { cancelProductRequisicion, completedProductRequisicion, editAmountProductRequisicion } from './helpers/clickIconsProduct';
import { inventoryChangeAmount } from './helpers/inventoryChangeAmount';
import {socket} from './routers/AppRouter';
import { types } from './types';


//LISTEN EVENTS SOCKET SERVER
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
export const socketMakeInventory = (data) => {
    return (dispatch, getState) => {

        const {business} = getState().userReducer;

        if(
            business !== 'cedis' &&
            data.businessName === business
        ){
            dispatch(dispatchMakeInventory(
                data.businessName, true
            ));
        }
    }
}


export const socketUpdateProductInventory = (data) => {
    return (dispatch, getState) => {
        
        const {business} = getState().userReducer;
        
        if(
            business !== 'cedis' &&
            data.businessName === business
        ){
            dispatch(inventoryChangeAmount(
                data.amount, data.businessName, true
            ));
        }
    }
}


export const socketCheckInventory = (data) => {
    return (dispatch, getState) => {

        const {business} = getState().userReducer;
        
        if(
            business !== 'cedis' &&
            data.businessName === business
        ){
            dispatch(checkInventory(null, true));
        }
    }
}


export const socketMakeRequisicion = (data) => {
    return (dispatch, getState) => {
        
        const {business} = getState().userReducer;
        
        setTimeout(() => {
            
            if(business === 'cedis'){            
                dispatch(getDataCedis());
    
            } else if (business === data.businessName){
                dispatch(getDataBusiness(data.businessName));
            }

        }, 2000);
        
    }
}


export const socketCompletedProductRequisicion = (data) => {
    return async (dispatch, getState) => {

        const {business} = getState().userReducer;

        const {requisiciones} = 
            getState().cedisReducer;

        if(business === data.businessName){
            await dispatch(selectProductRequisicion({
                folio: data.folio,
                categoryName: data.categoryName,
                productName: data.productName
            }));

            dispatch(completedProductRequisicion(true));

        } else if(business === 'cedis'){
            
            let requisicion = requisiciones.find(
                requi => requi.folio === data.folio
            );

            let categoryIndex = requisicion.details.findIndex(
                category => category.name === data.categoryName
            );
    
            let productIndex = 
                requisicion.details[categoryIndex].products.findIndex(
                    product => product.name === data.productName
            );

            requisicion.details[categoryIndex].products[productIndex].check = true; 
            requisicion.details[categoryIndex].products[productIndex].completed = true; 
            requisicion.details[categoryIndex].products[productIndex].orderValue = 2; 

            const updateCategories = requisiciones.map(requi => 
                requi.folio === requisicion.folio ?
                    requisicion
                    :
                    requi
            );


            dispatch({
                type: types.cedisGetData,
                payload: updateCategories
            });            
        }
    }
}


export const socketEditProductRequisicion = (data) => {
    return (dispatch, getState) => {

        const {business} = getState().userReducer;

        const {requisiciones} = getState().cedisReducer;

        if(business === data.businessName){
            
            dispatch(editAmountProductRequisicion(
                data.amount, true
            ));

        } else if(business === 'cedis'){

            let requisicion = requisiciones.find(
                requi => requi.folio === data.folio
            );

            let categoryIndex = requisicion.details.findIndex(
                category => category.name === data.categoryName
            );
    
            let productIndex = 
                requisicion.details[categoryIndex].products.findIndex(
                    product => product.name === data.productName
            );

            let product = requisicion.details[categoryIndex].products[productIndex]

            requisicion.details[categoryIndex].products[productIndex].check = true; 

            if(product.missing){

                if(data.amount === product.missingAmount){
                    requisicion.details[categoryIndex].products[productIndex].completed = true; 

                    requisicion.details[categoryIndex].products[productIndex].orderValue = 2; 

                } else if(data.amount < product.missingAmount){
                    
                    const updateAmount = 
                        parseFloat((product.missingAmount - data.amount).toFixed(2));

                    requisicion.details[categoryIndex].products[productIndex].missingAmount =
                        updateAmount
                    
                    requisicion.details[categoryIndex].products[productIndex].orderValue = -1;
                    
                    let updateRequisiciones = requisiciones.map(requi =>
                        requi.folio === requisicion.folio ?
                            requisicion
                            :
                            requi
                    );


                    dispatch({
                        type: types.cedisGetData,
                        payload: updateRequisiciones
                    });
                
                }   

            } else {

                if(data.amount === product.requestedAmount){

                    requisicion.details[categoryIndex].products[productIndex].completed = true; 

                    requisicion.details[categoryIndex].products[productIndex].orderValue = 2; 
                    
                } else if(data.amount < product.requestedAmount){
                    
                    const updateAmount = 
                        parseFloat((product.requestedAmount - data.amount).toFixed(2));

                    requisicion.details[categoryIndex].products[productIndex].missingAmount =
                        updateAmount    
                                
                    requisicion.details[categoryIndex].products[productIndex].missing = true;
                    
                    requisicion.details[categoryIndex].products[productIndex].orderValue = -1;
                    
                    let updateRequisiciones = requisiciones.map(requi =>
                        requi.folio === requisicion.folio ?
                            requisicion
                            :
                            requi
                    );


                    dispatch({
                        type: types.cedisGetData,
                        payload: updateRequisiciones
                    });
                }
            }
        }
    }
}


export const socketCancelProductRequisicion = (data) => {
    return (dispatch, getState) => {

        const {business} = getState().userReducer;

        const {requisiciones} = getState().cedisReducer;

        if(business === data.businessName){
            
            dispatch(cancelProductRequisicion(true));

        } else if(business === 'cedis'){
            
            let requisicion = requisiciones.find(requi => 
                requi.folio === data.folio
            );
    
            let categoryIndex = requisicion.details.findIndex(
                category => category.name === 
                            data.categoryName
            );
    
            let productIndex = 
                requisicion.details[categoryIndex].products.findIndex(
                    product => product.name === 
                               data.productName
            );
            
            let product = requisicion.details[categoryIndex].products[productIndex];
    
            product.check = true; 
            product.canceled = true;
            product.orderValue = 1;
    
            requisicion.details[categoryIndex].products[productIndex] = product;
            
            let updateRequisiciones = requisiciones.map(requi =>
                requi.folio === requisicion.folio ?
                    requisicion
                    :
                    requi
            );


            dispatch({
                type: types.cedisGetData,
                payload: updateRequisiciones
            });
        }
    }
}


export const socketCheckRequisicion = (data) => {
    return (dispatch, getState) => {
        
        const {business} = getState().userReducer;

        const {requisiciones} = getState().cedisReducer;

        if(business === data.businessName){
            dispatch(checkRequisicion(
                data.folio, null, true
            ));

        } else if(business === 'cedis'){

            let requisicion = requisiciones.find(requi => 
                requi.folio === data.folio
            );

            let requisicionCompleted = true;

            let sendUpdateRequisicion = true;

            let totalMoneyCanceled = 0;

            requisicion.details.forEach(category => {

                category.check = true;

                category.products.forEach((product) => {
                    if(!product.check){
                        sendUpdateRequisicion = false;
                        requisicionCompleted = false;
                        category.check = false

                    } else if(
                        product.missing && 
                        !product.completed &&
                        !product.canceled
                    ){
                        requisicionCompleted = false;
                        category.check = false

                    }

                    if(product.canceled){
                        if(product.missing){
                            totalMoneyCanceled =
                                totalMoneyCanceled + 
                                (product.unitPrice * product.missingAmount)
                        } else {
                            totalMoneyCanceled = 
                                totalMoneyCanceled + 
                                (product.unitPrice * product.requestedAmount)
                        }
                    }
                })

                category.products.sort(function(a, b){            
                    return a.orderValue - b.orderValue;
                });
            });

            requisicion.details.sort(function(a, b){
                return Number(a.check) - Number(b.check);
            });

            if(totalMoneyCanceled > 0){
                requisicion.totalMoneyCanceled = 
                    parseFloat(totalMoneyCanceled.toFixed(2));

                console.log(requisicion);
            }

            if(requisicionCompleted){
                requisicion.completedDate = moment().format('DD/MM/YYYY hh:mm A');

                requisicion.status = 'completada';

                const updateRequisiciones = requisiciones.map(
                    requi => requi.folio === requisicion.folio ?
                        requisicion
                        :
                        requi
                );


                dispatch({
                    type: types.cedisGetData,
                    payload: updateRequisiciones
                });

            } else if(sendUpdateRequisicion){
                requisicion.deliveredDate = moment().format('DD/MM/YYYY hh:mm A');
                
                requisicion.status = 'incompleta';

                const updateRequisiciones = requisiciones.map(
                    requi => requi.folio === requisicion.folio ?
                        requisicion
                        :
                        requi
                );


                dispatch({
                    type: types.cedisGetData,
                    payload: updateRequisiciones
                });

            } else {
                console.log('no pasa nada');
            }
        }
    }
}


export const socketCheckProductCedis = (data) => {
    return async (dispatch, getState) => {
        
        const {business} = getState().userReducer;
        
        if(business === 'cedis'){
            await dispatch(dispatchSelectedProductCedis({
                folio: data.folio,
                categoryName: data.categoryName,
                productName: data.productName
            }));

            dispatch(checkProductCedis(data.value));
        }
    }
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<




//EMIT EVENT SOCKET
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
export const emitMakeInventory = (businessName) => {
    socket.emit("serverMakeInventory", {
        businessName,
    });
}


export const emitUpdateProductInventory = (
    amount, businessName
) => {
    socket.emit("serverUpdateProductInventory", {
        amount,
        businessName,
    });
}


export const emitCheckInventory = (businessName) => {
    socket.emit("serverCheckInventory", {
        businessName
    });
}


export const emitMakeRequisicion = (businessName) => {
    socket.emit("serverMakeRequisicion", {
        businessName
    });
}


export const emitCompletedProductRequisicion = (
    businessName, product
) => {
    socket.emit("serverCompletedProductRequisicion", {
        businessName,
        folio: product.folio,
        categoryName: product.categoryName,
        productName: product.productName
    });
}


export const emitEditProductRequisicion = (
    businessName, product, amount
) => {
    socket.emit("serverEditProductRequisicion", {
        businessName,
        amount,
        folio: product.folio,
        categoryName: product.categoryName,
        productName: product.productName
    });
}


export const emitCancelProductRequisicion = (
    businessName, product
) => {
    socket.emit("serverCancelProductRequisicion", {
        businessName,
        folio: product.folio,
        categoryName: product.categoryName,
        productName: product.productName
    });
}

export const emitCheckRequisicion = (businessName, folio) => {
    socket.emit("serverCheckRequisicion", {
        businessName,
        folio
    });
}


export const emitCheckProductCedis = (value, product) => {
    socket.emit("serverCheckProductCedis", {
        value,
        product
    });
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<