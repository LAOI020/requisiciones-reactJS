
import firebase from './config';


export function updateAmountInventoryFirebase(
    businessName,
    categoryName, 
    productName,
    amount
){

    firebase.firestore()
        .collection(businessName)
        .doc(categoryName)
        .collection('products')
        .doc(productName)
        .update({
            current: amount,
            check: true
        });
}