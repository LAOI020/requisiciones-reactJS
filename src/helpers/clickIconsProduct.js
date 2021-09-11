import { iconCancelProduct, iconCompletedProduct, iconEditProduct } from "../actions/restaurantActions";
import { cancelProductRequisicionFirebase, completedProductRequisicionFirebase, editProductRequisicionFirebase } from "../firebase/clickIconsProductFirebase";
import { emitCancelProductRequisicion, emitCompletedProductRequisicion, emitEditProductRequisicion } from "../socketEvents";
import Swal from 'sweetalert2';


export const completedProductRequisicion = (fromSocket) => {
    return async (dispatch, getState) => {

        const {selectedProductRequisicion, requisiciones} =
            getState().restaurantReducer;
        
        const {business} = getState().userReducer;
        
        let requisicion = requisiciones.find(
            requi => requi.folio === selectedProductRequisicion.folio
        );

        let categoryIndex = requisicion.details.findIndex(
            category => category.name === 
                        selectedProductRequisicion.categoryName
        );

        let productIndex = 
            requisicion.details[categoryIndex].products.findIndex(
                product => product.name === 
                           selectedProductRequisicion.productName
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


        dispatch(iconCompletedProduct(updateCategories));

        if(!fromSocket){
            completedProductRequisicionFirebase(
                selectedProductRequisicion
            );

            emitCompletedProductRequisicion(
                business, selectedProductRequisicion
            );
        }
    }   
}


export const editAmountProductRequisicion = (amount, fromSocket) => {
    return async (dispatch, getState) => {

        const {selectedProductRequisicion, requisiciones} =
            getState().restaurantReducer;
        
        const {business} = getState().userReducer;
    
        
        if(!fromSocket){
            emitEditProductRequisicion(
                business, selectedProductRequisicion, amount
            );
        }
        
        let requisicion = requisiciones.find(
            requi => requi.folio === selectedProductRequisicion.folio
        );

        let categoryIndex = requisicion.details.findIndex(
            category => category.name === 
                        selectedProductRequisicion.categoryName
        );

        let productIndex = 
            requisicion.details[categoryIndex].products.findIndex(
                product => product.name === 
                           selectedProductRequisicion.productName
        );

        let product = requisicion.details[categoryIndex].products[productIndex]
        
        requisicion.details[categoryIndex].products[productIndex].check = true; 

        if(product.missing){

            if(amount === product.missingAmount){

                if(!fromSocket){
                    dispatch(completedProductRequisicion(false));
                } else {
                    dispatch(completedProductRequisicion(true));
                }

            } else if(amount < product.missingAmount){

                const updateAmount = parseFloat((product.missingAmount - amount).toFixed(2));

                requisicion.details[categoryIndex].products[productIndex].missingAmount =
                    updateAmount
                
                requisicion.details[categoryIndex].products[productIndex].orderValue = -1;
                
                let updateRequisiciones = requisiciones.map(requi =>
                    requi.folio === requisicion.folio ?
                        requisicion
                        :
                        requi
                );
    
    
                dispatch(iconEditProduct(updateRequisiciones));

                if(!fromSocket){
                    editProductRequisicionFirebase(
                        selectedProductRequisicion,
                        true,
                        updateAmount
                    );
                }

            } else if(amount > product.missingAmount){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'la cantidad no puede ser mayor al stock!',
                });
            }

        } else {

            if(amount === product.requestedAmount){

                if(!fromSocket){
                    dispatch(completedProductRequisicion(false));
                } else {
                    dispatch(completedProductRequisicion(true));
                }
    
            } else if(amount < product.requestedAmount){

                const updateAmount = parseFloat((product.requestedAmount - amount).toFixed(2));

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
    
    
                dispatch(iconEditProduct(updateRequisiciones));

                if(!fromSocket){
                    editProductRequisicionFirebase(
                        selectedProductRequisicion,
                        false,
                        updateAmount
                    );
                }

            } else if(amount > product.requestedAmount){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'la cantidad no puede ser mayor al stock!',
                });
            }
        }
    }
}


export const cancelProductRequisicion = (fromSocket) => {
    return async (dispatch, getState) => {
        
        const {
            selectedProductRequisicion:productSelected, 
            requisiciones
        
        } = getState().restaurantReducer;

        const {business} = getState().userReducer;


        let requisicion = requisiciones.find(requi => 
            requi.folio === productSelected.folio
        );

        let categoryIndex = requisicion.details.findIndex(
            category => category.name === 
                        productSelected.categoryName
        );

        let productIndex = 
            requisicion.details[categoryIndex].products.findIndex(
                product => product.name === 
                           productSelected.productName
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

        dispatch(iconCancelProduct(updateRequisiciones));

        if(!fromSocket){
            cancelProductRequisicionFirebase(productSelected);

            emitCancelProductRequisicion(
                business, productSelected
            )
        }
    }
}