
import { types } from '../types';
import firebase from './config';


export const getDataFinance = async (dispatch) => {
    

    let infoBusiness = [];

    let businessNames = [];

    await firebase.firestore()
        .collection('infoAlmacen')
        .get().then((docs) => {

            docs.forEach((doc) => {
                if(doc.id !== 'finance'){
                    businessNames.push(doc.id);
                }
            });
        });
    
    for(const business of businessNames){

        await firebase.firestore()
            .collection(business)
            .get().then(async (categories) => {

                let totalMoneyStock = 0;
                let totalMoneyCurrent = 0;
                
                for(const category of categories.docs){
                    
                    let stockMoney = 0;
                    let currentMoney = 0;

                    await category.ref
                        .collection('products')
                        .get().then((products) => {
                    
                            products.forEach((product) => {
                                stockMoney = 
                                    stockMoney +
                                    product.data().unitPrice * product.data().stock;

                                currentMoney =
                                    currentMoney +
                                    product.data().unitPrice * product.data().current;                                    
                            });

                        });
                    
                    totalMoneyStock =
                        totalMoneyStock + stockMoney;

                    totalMoneyCurrent =
                        totalMoneyCurrent + currentMoney;
                }

                infoBusiness.push({
                    businessName: business,
                    stockMoney: totalMoneyStock,
                    currentMoney: totalMoneyCurrent,
                    missingMoney: totalMoneyStock - totalMoneyCurrent,
                });

            });
    }


    dispatch({
        type: types.financeGetDataBusiness,
        payload: infoBusiness
    });
}