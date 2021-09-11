
import firebase from './config';

export function checkRequisicionFirebase(requisicion){

    console.log(requisicion);
    const {details, folio, ...infoRequisicion} = requisicion;

    for(const category of details){
        
        firebase.firestore()
            .collection('cedis')
            .doc(folio)
            .collection('details')
            .doc(category.name)
            .update({
                check: category.check
            });
    }

    firebase.firestore()
        .collection('cedis')
        .doc(folio)
        .update(infoRequisicion)
}