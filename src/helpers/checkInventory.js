
import Swal from 'sweetalert2';
import { dispatchGetStatusInventory, modifyOrder } from "../actions/restaurantActions";
import { changeStatusInventoryFirebase } from "../firebase/changeStatusInventoryFirebase";
import { checkInventoryFirebase } from "../firebase/checkInventoryFirebase";
import { makeRequisicion } from "./makeRequisicion";
import firebase from '../firebase/config';
import { emitMakeRequisicion } from "../socketEvents";


export const checkInventory = (history, fromSocket) => {
    return async (dispatch, getState) => {

        let restaurantName = 
            new URLSearchParams(history.location.search).get('rn');
        
        const {categories:getCategories} = 
            getState().restaurantReducer;

        let categories = getCategories;

        categories.forEach(category => {
            
            category.check = true;

            category.products.forEach((product) => {
                if(product.check === false){
                    category.check = false;
                }
            })
            
            category.products.sort(function(a, b){
                return Number(a.check) - Number(b.check);
            });
        });

        categories.sort(function(a, b){
            return Number(a.check) - Number(b.check);
        });

        let incompleteInventory = categories.find(category => 
            category.check === false
        )

        if(!fromSocket){
            checkInventoryFirebase(restaurantName);
        }

        if(incompleteInventory){
            dispatch(modifyOrder(categories));

            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'faltan productos por revisar',
            });

        } else {

            if(!fromSocket){                
                changeStatusInventoryFirebase(restaurantName);
            }

            dispatch(dispatchGetStatusInventory(false));

            categories.forEach(category => {
            
                category.check = false;
                
                category.products.sort(function(a, b){
                    return a.name > b.name ? 1 : -1
                });
            });

            categories.sort(function(a, b){
                return a.name > b.name ? 1 : -1
            });

            dispatch(modifyOrder(categories));

            if(!fromSocket){
                getFolioFirebase(
                    restaurantName, categories, dispatch, history
                );
            }
        }

        window.scrollTo(0, 0);
    }
}


const getFolioFirebase = (
    businessName, categories, dispatch, history
) => {

    firebase.firestore()
        .collection('infoAlmacen')
        .doc(businessName)
        .get().then(async (document) => {

            await dispatch(makeRequisicion(
                businessName, 
                document.data().requisicion,
                categories, 
                history
            ));

            document.ref.update({
                requisicion: firebase.firestore.FieldValue.increment(1)
            });

            
            emitMakeRequisicion(businessName);
        })
}