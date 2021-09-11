
import firebase from './config';

export function completedProductRequisicionFirebase(product){
    
    firebase.firestore()
        .collection('cedis')
        .doc(product.folio)
        .collection('details')
        .doc(product.categoryName)
        .collection('products')
        .doc(product.productName)
        .update({
            check: true,
            completed: true,
            orderValue: 2
        });
}


export function editProductRequisicionFirebase(
    product, missing, amount
){
    if(missing){

        firebase.firestore()
            .collection('cedis')
            .doc(product.folio)
            .collection('details')
            .doc(product.categoryName)
            .collection('products')
            .doc(product.productName)
            .update({
                check: true,
                missingAmount: amount,
                orderValue: -1
            });

    } else {

        firebase.firestore()
            .collection('cedis')
            .doc(product.folio)
            .collection('details')
            .doc(product.categoryName)
            .collection('products')
            .doc(product.productName)
            .update({
                check: true,
                missing: true,
                missingAmount: amount,
                orderValue: -1
            });
    }
}


export function cancelProductRequisicionFirebase(product){

    firebase.firestore()
        .collection('cedis')
        .doc(product.folio)
        .collection('details')
        .doc(product.categoryName)
        .collection('products')
        .doc(product.productName)
        .update({
            check: true,
            canceled: true,
            orderValue: 1
        });
}