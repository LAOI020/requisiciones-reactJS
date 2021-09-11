import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { CedisDetailsRequisicion } from '../components/CedisDetailsRequisicion';
import { CedisRequisiciones } from '../components/CedisRequisiciones';
import { MakeInventoryScreen } from '../components/MakeInventoryScreen';
import { ProductsRequisicion } from '../components/ProductsRequisicion';
import { RequisicionesScreen } from '../components/RequisicionesScreen';
import { CedisDesktop, WelcomeDesktop } from '../components/WelcomeDesktop';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { verifyUser } from '../helpers/verifyUser';


export const Routes = () => {

    const dispatch = useDispatch();

    const history = useHistory();

    let restaurantName = 
            new URLSearchParams(history.location.search).get('rn');
    
    const {makeInventory} = 
        useSelector(state => state.restaurantReducer);

    const {widthScreen} = 
        useSelector(state => state.userReducer);
    

    useEffect(() => {
        console.log('verify user');

        let businessName = 
            new URLSearchParams(history.location.search).get('rn');

        if(history.location.pathname.includes('/cedis')){

            businessName = 'cedis';
        }

        if(localStorage.getItem('ioal')){
            
            verifyUser(dispatch, history, businessName);
            
        } else {
            history.replace("/");
        }

    }, [dispatch, history])

    return (
        <div>
            <Switch>
                <Route 
                    exact 
                    path="/cedis"
                    component={
                        widthScreen < 1050 ?
                            CedisRequisiciones
                            :
                            CedisDesktop
                    }
                />

                <Route 
                    exact 
                    path="/cedis/:folio"
                    component={
                        widthScreen < 1050 ?
                            CedisDetailsRequisicion
                            :
                            DesktopComponent
                    }
                />



                <ShowWelcomeScreen 
                    exact 
                    path="/welcome"
                    component={
                        widthScreen < 1050 ?
                            WelcomeScreen
                            :
                            WelcomeDesktop
                    }
                    makeInventory={makeInventory}
                    businessName={restaurantName}
                />

                <Route 
                    exact 
                    path="/welcome/make-inventory"
                    component={
                        widthScreen < 1050 ?
                            MakeInventoryScreen
                            :
                            DesktopComponent
                    }
                />

                <Route
                    exact
                    path="/welcome/requisiciones" 
                    component={
                        widthScreen < 1050 ?
                            RequisicionesScreen
                            :
                            DesktopComponent
                    }
                />

                <Route
                    exact
                    path="/welcome/requisiciones/:folio" 
                    component={
                        widthScreen < 1050 ?
                            ProductsRequisicion
                            :
                            DesktopComponent
                    }
                />
            </Switch>
        </div>
    )
}


const ShowWelcomeScreen = ({
    makeInventory,
    businessName,
    component: Component,
    ...rest
}) => {

    return (
        <Route {...rest}
            component={(pros) => (
                (!makeInventory) ?
                    <Component {...pros} />
                    :
                    <Redirect to={
                        `/welcome/make-inventory?rn=${businessName}`
                    }/>
            )}
        />
    )
}


const DesktopComponent = () => {
    return (
        <Redirect to="/welcome"/>
    )
}