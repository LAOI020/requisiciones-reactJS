
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CedisDetailsRequisicion } from './CedisDetailsRequisicion';
import { BusinessContainer, CedisRequisiciones } from './CedisRequisiciones';
import { MakeInventoryScreen } from './MakeInventoryScreen';
import { ProductsRequisicion } from './ProductsRequisicion';
import { RequisicionesScreen } from './RequisicionesScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { BsListCheck, BsPower } from 'react-icons/bs';
import { emitMakeInventory } from '../socketEvents';
import { dispatchMakeInventory } from '../actions/restaurantActions';
import { useHistory } from 'react-router-dom';
import { types } from '../types';


export const WelcomeDesktop = () => {
    
    const history = useHistory();
    
    const dispatch = useDispatch();

    const {business, job} = 
        useSelector(state => state.userReducer);
    
    const {folioRequisicionDesktop, makeInventory} = 
        useSelector(state => state.restaurantReducer);
    
    const clickIconInventory = () => {

        dispatch(dispatchMakeInventory(business, false));

        emitMakeInventory(business);
    }

    const clickLogout = async () => {

        dispatch({
            type: types.getDataUser,
            payload: {
                name: null,
                business: null,
                job: null,
                widthScreen: window.innerWidth
            }
        });
        
        localStorage.clear();
        
        history.replace("/");
    }

    return (
        <div className="main-container-desktop">
            {job !== 'finanzas' ?
                <BsListCheck 
                    className="Fat-button-make-inventory-desktop"
                    size="1.6rem" 
                    onClick={clickIconInventory}
                />
                :
                null
            }

            {job !== 'finanzas' ?
                <BsPower 
                    className="Fat-button-logout-desktop"
                    size="1.6rem" 
                    onClick={clickLogout}
                />
                :
                null
            }

            {makeInventory ?
                <MakeInventoryScreen/>
                :
                <WelcomeScreen/>
            }

            <RequisicionesScreen/>

            {folioRequisicionDesktop &&
                <ProductsRequisicion
                    folioDesktop={folioRequisicionDesktop}
                />
            }
        </div>
    )
}


export const CedisDesktop = () => {

    const history = useHistory();

    const dispatch = useDispatch();

    const {job} = 
        useSelector(state => state.userReducer);

    const {folioRequisicionDesktop} = 
        useSelector(state => state.restaurantReducer);

    const {businessInfo} = 
        useSelector(state => state.financeReducer);

    const clickLogout = () => {
        
        dispatch({
            type: types.getDataUser,
            payload: {
                name: null,
                business: null,
                job: null,
                widthScreen: window.innerWidth
            }
        });

        localStorage.clear();

        history.replace("/");
    }

    return (
        <div 
            className="main-container-desktop-cedis"
            style={{
                gridTemplateColumns: job === 'finanzas' ?
                    '0.32fr 0.32fr 0.36fr' : '0.5fr 0.5fr'
            }}
        >
            <BsPower 
                className="Fat-button-logout-desktop"
                size="1.6rem" 
                onClick={clickLogout}
            />

            {job === 'finanzas' ?
                businessInfo.map((business, index) => (
                    <BusinessContainer
                        key={`${business}${index}`}
                        business={business}
                    />
                ))
                :
                null
            }

            <CedisRequisiciones/>

            {folioRequisicionDesktop &&
                <CedisDetailsRequisicion
                    folioDesktop={folioRequisicionDesktop}
                />
            }
        </div>
    )
}
