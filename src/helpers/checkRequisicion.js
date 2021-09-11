
import moment from 'moment';
import { checkRequisicionFirebase } from '../firebase/checkRequisicionFirebase';


export const checkRequisicion = (
    folio, history, fromSocket
) => {
    return async (dispatch, getState) => {

        const {requisiciones} = getState().restaurantReducer;

        let requisicion = requisiciones.find(requi => 
            requi.folio === folio
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

            if(!fromSocket){
                checkRequisicionFirebase(requisicion);

                history.goBack();
            }

        } else if(sendUpdateRequisicion){
            requisicion.deliveredDate = moment().format('DD/MM/YYYY hh:mm A');
            
            requisicion.status = 'incompleta';

            if(!fromSocket){
                checkRequisicionFirebase(requisicion);
    
                history.goBack();
            }

        } else {
            console.log('no pasa nada');
        }
    }
}