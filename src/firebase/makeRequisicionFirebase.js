
import firebase from './config';

export async function makeRequisicionFirebase(requisicion){

    const {details, folio, ...infoRequisicion} = requisicion

    await firebase.firestore()
        .collection('cedis')
        .doc(folio)
        .set(infoRequisicion);
    
    for(const category of details){
        
        await firebase.firestore()
            .collection('cedis')
            .doc(folio)
            .collection('details')
            .doc(category.name)
            .set({
                check: category.check
            });
        
        category.products.forEach((product) => {
            firebase.firestore()
                .collection('cedis')
                .doc(folio)
                .collection('details')
                .doc(category.name)
                .collection('products')
                .doc(product.name)
                .set({
                    canceled: product.canceled,
                    check: product.check,
                    completed: product.completed,
                    current: product.current,
                    measure: product.measure,
                    missing: product.missing,
                    missingAmount: product.missingAmount,
                    orderValue: product.orderValue,
                    requestedAmount: product.requestedAmount,
                    stock: product.stock,
                    unitPrice: product.unitPrice
                });
        })
    }
}