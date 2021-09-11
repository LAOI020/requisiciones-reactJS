
import firebase from '../firebase/config';
import { getDataBusiness } from '../firebase/getDataBusiness';
import { getDataCedis } from '../firebase/getDataCedis';
import { getDataFinance } from '../firebase/getDataFinance';
import { types } from '../types';


export function verifyUser(
    dispatch, history, businessName
){

    const userUID = localStorage.getItem('ioal');

    firebase.firestore()
        .collection('usersAlmacen')
        .where('uid', '==', userUID)
        .limit(1)
        .get().then((users) => {
            
            const findUser = users.docs[0];

            if(findUser){

                const businessUser = findUser.data().business;

                //DISPATCH USER REDUCER
                dispatch({
                    type: types.getDataUser,
                    payload: {
                        name: findUser.data().name,
                        business: findUser.data().business,
                        job: findUser.data().job,
                        widthScreen: window.innerWidth
                    }
                });

                if(businessName === businessUser){
                    if(businessUser !== 'cedis'){
                        dispatch(getDataBusiness(businessUser));
                    } else {
                        dispatch(getDataCedis());

                        if(findUser.data().job === 'finanzas'){
                            getDataFinance(dispatch);
                        }
                    }

                } else {
                    if(businessUser !== 'cedis'){
                        
                        history.replace(
                            `/welcome?rn=${businessUser}`
                        );

                        dispatch(getDataBusiness(businessUser));

                    } else {

                        history.replace(
                            '/cedis'
                        );

                        dispatch(getDataCedis());

                        if(findUser.data().job === 'finanzas'){
                            getDataFinance(dispatch);
                        }
                    }
                }

            } else {
                localStorage.clear();

                history.replace("/")
            }

        });
}


export function loginUser(code, history){

    firebase.firestore()
        .collection('usersAlmacen')
        .where('password', '==', code)
        .limit(1)
        .get().then((users) => {
            
            const findUser = users.docs[0];

            if(findUser){
                localStorage.setItem(
                    'ioal', findUser.data().uid
                );

                if(findUser.data().business === 'cedis'){

                    history.replace('/cedis');

                } else {

                    history.replace(
                        `/welcome?rn=${findUser.data().business}`
                    );
                }

            } else {

            }
        })
}


export const checkLocalStorage = (dispatch, history) => {

    const userUID = localStorage.getItem('ioal');

    firebase.firestore()
        .collection('usersAlmacen')
        .where('uid', '==', userUID)
        .limit(1)
        .get().then((querySnapshot) => {

            const findUser = querySnapshot.docs[0].data();
            
            if(findUser){

                dispatch({
                    type: types.getDataUser,
                    payload: {
                        name: findUser.name,
                        business: findUser.business,
                        job: findUser.job,
                        widthScreen: window.innerWidth
                    }
                });

            } else {
                localStorage.clear();

                history.replace("/")
            }
        })

}