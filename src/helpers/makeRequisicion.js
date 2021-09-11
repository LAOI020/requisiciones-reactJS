
import moment from 'moment';
import { dispatchMakeRequisicion } from '../actions/restaurantActions';
import { makeRequisicionFirebase } from '../firebase/makeRequisicionFirebase';


export const makeRequisicion = (
    businessName, folio, categories, history
) => {
    
    return async (dispatch) => {

        const folioRequisicion = 
            `${businessName[0].toUpperCase()}${folio}`;

        categories.forEach(category => {
            category.products = 
                category.products.filter(product => 
                    product.current < product.stock
                );
        });

        categories.forEach(category => {
            category.products = 
                category.products.map(product => {
                    return {
                        ...product,
                        check: false,
                        requestedAmount: parseFloat((product.stock - product.current).toFixed(2)),
                        missingAmount: 0,
                        // canceledAmount: 0,
                        completed: false,
                        missing: false,
                        canceled: false,
                        orderValue: -2
                    }
                });
        });

        categories = categories.filter(
            category => category.products.length > 0
        );

        let requisicion = {
            folio: folioRequisicion,
            status: 'aun no llega',
            requestedDate: moment().format('DD/MM/YYYY hh:mm A'),
            deliveredDate: null,
            completedDate: null,
            details: categories
        };


        calculateTotalMoney(requisicion, dispatch);

        history.replace(`/welcome?rn=${businessName}`);
    }
}


const calculateTotalMoney = (requisicion, dispatch) => {
    
    let totalMoney = 0;

    requisicion.details.forEach(category => {
        category.products.forEach(product => {
            
            totalMoney = 
                totalMoney + 
                (product.unitPrice * product.requestedAmount)

        });
    });

    let totalMoneyFormat = parseFloat(totalMoney.toFixed(2));

    requisicion = {
        ...requisicion,
        totalMoney: totalMoneyFormat,
        totalMoneyCanceled: 0
    }


    dispatch(dispatchMakeRequisicion(requisicion));

    makeRequisicionFirebase(requisicion);
}