
import { dispatchGetDataCedis } from '../actions/cedisActions';
import firebase from './config';


export const getDataCedis = () => {
    return (dispatch) => {
        firebase.firestore()
            .collection('cedis')
            .get().then( async (querySnapshot) => {
                console.log('on snapshot firebase');
                const requisicionesFirebase = [];

                querySnapshot.forEach((doc) => {
                    requisicionesFirebase.push({
                        ...doc.data(),
                        folio: doc.id,
                        details: []
                    });
                });


                dispatch(getDataDetailsRequisicion(
                    requisicionesFirebase
                ));
            });
    }
}


const getDataDetailsRequisicion = (requisiciones) => {
    return async (dispatch) => {

        for(const requi of requisiciones){

            await firebase.firestore()
                .collection('cedis')
                .doc(requi.folio)
                .collection('details')
                .get().then(async (categories) => {

                    const detailsFirebase = [];

                    for(const category of categories.docs){

                        let allProducts = [];

                        await category.ref
                            .collection('products')
                            .get().then((products) => {
                                
                                products.forEach((product) => {
                                    allProducts.push({
                                        ...product.data(),
                                        name: product.id
                                    });
                                });
                            });

                        detailsFirebase.push({
                            ...category.data(),
                            name: category.id,
                            open: false,
                            products: allProducts
                        });
                    }
    
    
                    requi.details = detailsFirebase;
                });
        }

        dispatch(dispatchGetDataCedis(requisiciones));
    }
}