
import firebase from './config';

export function makeInventoryFirebase(businessName){

    firebase.firestore()
        .collection('infoAlmacen')
        .doc(businessName)
        .get().then((document) => {
            document.ref.update({
                makeInventory: true
            });
        });

    firebase.firestore()
        .collection(businessName)
        .get().then((categories) => {

            for(const category of categories.docs){

                category.ref.update({
                    check: false
                });

                category.ref
                    .collection('products')
                    .get().then((products) => {

                        products.forEach((product) => {

                            product.ref.update({
                                check: false
                            });

                        });

                    });
            }

        });
}