import React from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../helpers/verifyUser';
import { useForm } from '../hooks/useForm';
import Swal from 'sweetalert2';


export const LoginScreen = () => {

    const history = useHistory();

    const [formValues, changeInput] = useForm({
        'code': ''
    });
    
    const {code} = formValues;
    
    const clickButton = () => {
        if(code.length > 0){
            loginUser(code, history);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'no puede estar vacio',
            });
        }
    }

    return (
        <div className="main-container">
            <h1>Iniciar sesion</h1>

            <input 
                className="code-input"
                type="password"
                name="code"
                autoComplete="off"
                value={code}
                onChange={changeInput}
            />

            <button
                className="enter-button"
                onClick={clickButton}
            >
                Entrar
            </button>
        </div>
    )
}
