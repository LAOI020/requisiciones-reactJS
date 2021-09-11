
import firebase from './config';

export function changeStatusInventoryFirebase(businessName){

    firebase.firestore()
        .collection('infoAlmacen')
        .doc(businessName)
        .get().then((document) => {
            document.ref.update({
                makeInventory: false
            });
        })
}