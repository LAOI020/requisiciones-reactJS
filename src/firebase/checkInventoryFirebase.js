
import firebase from './config';

export function checkInventoryFirebase(businessName){

    firebase.firestore()
        .collection(businessName)
        .get().then(async(categories) => {

            for(const category of categories.docs){
                
                category.ref.update({
                    check: true
                });

                category.ref
                    .collection('products')
                    .get().then((products) => {

                        products.forEach((product) => {

                            if(product.data().check === false ){
                                category.ref.update({
                                    check: false
                                });
                            }

                        });

                    });
            }

        })
}