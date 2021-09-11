
import { dispatchGetAllProductsBusiness, dispatchGetCategoriesBusiness, dispatchGetRequisicionesBusiness, dispatchGetStatusInventory } from '../actions/restaurantActions';
import firebase from './config';


export const getDataBusiness = (businessName) => {
    return (dispatch) => {
        
        const character = businessName[0].toUpperCase();

        getMakeInventory(businessName, dispatch);

        //GET CATEGORIES
        firebase.firestore()
            .collection(businessName)
            .get().then(async (querySnapshot) => {

                const categories = [];

                for(const category of querySnapshot.docs){
                    
                    let catego = {};

                    catego = {
                        ...category.data(),
                        name: category.id,
                        open: false,
                        products: []
                    };

                    await category.ref
                        .collection('products')
                        .get().then((products) => {

                            products.forEach((product) => {
                                catego.products.push({
                                    ...product.data(),
                                    name: product.id
                                });
                            });

                        });
                    
                    categories.push(catego);
                }


                dispatch(dispatchGetCategoriesBusiness(
                    categories
                ));

                dispatch(getAllProducts(categories));
            });
        

        //GET REQUISICIONES
        firebase.firestore()
            .collection('cedis')
            .orderBy('requestedDate', 'desc')
            .get().then(async (querySnapshot) => {

                const requisiciones = [];

                for(const requisicion of querySnapshot.docs){
                    
                    let requi = {};

                    if(requisicion.id[0] === character){
                        requi = {
                            ...requisicion.data(),
                            folio: requisicion.id,
                            details: []
                        };

                        await requisicion.ref
                            .collection('details')
                            .get().then(async (categories) => {
                                
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

                                    requi.details.push({
                                        ...category.data(),
                                        name: category.id,
                                        open: false,
                                        products: allProducts
                                    });
                                }
                            });
                        
                        requisiciones.push(requi);
                    }
                }
                
                dispatch(dispatchGetRequisicionesBusiness(
                    requisiciones
                ));
            })
    }
}


const getMakeInventory = (businessName, dispatch) => {
    firebase.firestore()
        .collection('infoAlmacen')
        .doc(businessName)
        .get().then((document) => {

            dispatch(dispatchGetStatusInventory(
                document.data().makeInventory
            ));

        })
}

const getAllProducts = (categories) => {
    return (dispatch) => {
        
        const allProducts = [];

        categories.forEach(category => {
            category.products.forEach(product => {
                allProducts.push(product);
            });
        });

        
        dispatch(dispatchGetAllProductsBusiness(allProducts));
    }
}