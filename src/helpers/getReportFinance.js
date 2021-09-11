
import Swal from 'sweetalert2';
import firebase from '../firebase/config';
import { helperFetch } from './fetch';


export const getReportFinance = async () => {

    const docFinance = await firebase.firestore()
        .collection('infoAlmacen')
        .doc('finance')
        .get();
    
    const dataHttp = {
        destinationEmail: docFinance.data().email
    };

    const res = await helperFetch(
        'finance/send-report', dataHttp, 'POST'
    );

    const body = await res.json();

    if(body.ok){
        Swal.fire({
            icon: 'success',
            title: 'Listo',
            text: 'el archivo estara en el correo en unos minutos',
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ocurrio un problema',
        });
    }
}