import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useHistory,
} from 'react-router-dom';
import io from 'socket.io-client';
import { LoginScreen } from '../components/LoginScreen';
import { checkLocalStorage } from '../helpers/verifyUser';
import { socketCancelProductRequisicion, socketCheckInventory, socketCheckProductCedis, socketCheckRequisicion, socketCompletedProductRequisicion, socketEditProductRequisicion, socketMakeInventory, socketMakeRequisicion, socketUpdateProductInventory } from '../socketEvents';
import { types } from '../types';
import { Routes } from './Routes';


export const socket = io.connect(process.env.HOST);

export const AppRouter = () => {

    const dispatch = useDispatch();

    const {job, business} = 
        useSelector(state => state.userReducer);
    
    const debounce = (callback, wait) => {
        
        let timeout;
        
        return (...args) => {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    }
    const handleResize = useCallback(
        debounce(
            () => { console.log('change resize');
                dispatch({
                    type: types.changeWidthScreen,
                    payload: window.innerWidth
                })
            },

            1000
        ), []
    )

    useEffect(() => {
        console.log('app router effectt');

        socket.on('clientMakeInventory', (data) => {
            dispatch(socketMakeInventory(data));
        });
        
        socket.on('clientUpdateProductInventory', (data) => {
            dispatch(socketUpdateProductInventory(data));
        });

        socket.on('clientCheckInventory', (data) => {
            dispatch(socketCheckInventory(data));
        });
        
        socket.on('clientMakeRequisicion', (data) => {
            dispatch(socketMakeRequisicion(data));
        });
        
        socket.on('clientCompletedProductRequisicion', (data) => {
            dispatch(socketCompletedProductRequisicion(data));
        });
        
        socket.on('clientEditProductRequisicion', (data) => {
            dispatch(socketEditProductRequisicion(data));
        });
        
        socket.on('clientCancelProductRequisicion', (data) => {
            dispatch(socketCancelProductRequisicion(data));
        });

        socket.on('clientCheckRequisicion', (data) => {
            dispatch(socketCheckRequisicion(data));
        });

        socket.on('clientCheckProductCedis', (data) => {
            dispatch(socketCheckProductCedis(data));
        });

    }, [dispatch]);


    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }

    }, [handleResize])

    return (
        <Router>
            <div className="image-background">
                <Switch>
                    <ShowLoginScreen 
                        exact 
                        path="/" 
                        component={LoginScreen}
                        isLogged={job}
                        url={
                            business === 'cedis' ?
                                '/cedis'
                                :
                                `/welcome?rn=${business}`
                        }
                    />

                    <Routes/>
                    
                    <Redirect to="/"/>
                </Switch>
            </div>
        </Router>
    )
}


const ShowLoginScreen = ({
    isLogged,
    url,
    component: Component,
    ...rest
}) => {

    console.log('entro login screen');
    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => {

        if(localStorage.getItem('ioal')){
            checkLocalStorage(dispatch, history);
        }

    }, [])

    return (
        <Route {...rest}
            component={(pros) => (
                (!isLogged) ?
                    <Component {...pros} />
                    :
                    <Redirect to={url}/>
            )}
        />
    )
}