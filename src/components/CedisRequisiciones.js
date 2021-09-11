import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { RiFileExcel2Line } from 'react-icons/ri';
import { BsPower } from 'react-icons/bs';
import { types } from '../types';
import { getDataBusiness } from '../firebase/getDataBusiness';
import { getReportFinance } from '../helpers/getReportFinance';


export const CedisRequisiciones = () => {

    const dispatch = useDispatch();

    const history = useHistory();

    const {folioRequisicionDesktop} = 
        useSelector(state => state.restaurantReducer);

    const {job, widthScreen} = 
        useSelector(state => state.userReducer);

    const {requisiciones} = 
        useSelector(state => state.cedisReducer);

    const {businessInfo} = 
        useSelector(state => state.financeReducer);

    const clickRequisicion = (folio) => {
        if(widthScreen < 1050){
            history.push(`/cedis/${folio}`);
        } else {
            dispatch({
                type: types.clickRequisicionDesktop,
                payload: folio
            });
        }
    }

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
        <div>
            <div style={{height: '1rem'}}></div>

            {job === 'finanzas' ?
                <RiFileExcel2Line
                    size="2.2rem"
                    className="icon-excel"
                    onClick={getReportFinance}
                />
                :
                null
            }

            {widthScreen < 1050 ?
                <BsPower
                    className="icon-logout"
                    size="2rem"
                    onClick={clickLogout}
                />
                :
                null
            }

            {job === 'finanzas' && widthScreen < 1050 ?
                businessInfo.map((business, index) => (
                    <BusinessContainer
                        key={`${business}${index}`}
                        business={business}
                    />
                ))
                :
                null
            }

            <div style={{height: '2rem'}}></div>
            
            {requisiciones.map((requisicion, index) => (
                <RequisicionContainer
                    key={`${requisicion.folio}${index}`}
                    requisicion={requisicion}
                    click={() => clickRequisicion(requisicion.folio)}
                    selectedFolio={folioRequisicionDesktop}
                />
            ))}

            <div style={{height: '7rem'}}></div>
        </div>
    )
}


export const BusinessContainer = ({business}) => {
    
    const history = useHistory();

    const dispatch = useDispatch();

    const {
        businessName,
        stockMoney,
        currentMoney,
        missingMoney

    } = business;

    const formatMoney = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    });

    const clickBusinessContainer = () => {

        dispatch({
            type: types.clickRequisicionDesktop,
            payload: null
        });

        dispatch(getDataBusiness(businessName));
        
        history.push(`/welcome?rn=${businessName}`);
    }

    return (
        <div className="business-container">
            <h4 onClick={clickBusinessContainer}>
                {businessName}
            </h4>
            
            <div onClick={clickBusinessContainer}>
                <h5 style={{borderTopLeftRadius: '0.5rem'}}>
                    Stock
                </h5>
                <h5 style={{borderTopRightRadius: '0.5rem'}}>
                    {formatMoney.format(stockMoney)}
                </h5>

                <h5>Inventario</h5>
                <h5>{formatMoney.format(currentMoney)}</h5>
            
                <h5 style={{borderBottomLeftRadius: '0.5rem'}}>
                    Faltante
                </h5>
                <h5 style={{borderBottomRightRadius: '0.5rem'}}>
                    {formatMoney.format(missingMoney)}
                </h5>
            </div>
        </div>
    )
}


const RequisicionContainer = ({
    requisicion, click, selectedFolio
}) => {

    const {
        folio, 
        status,
        requestedDate, 
        deliveredDate, 
        completedDate,
        totalMoney,
        totalMoneyCanceled

    } = requisicion;

    const formatMoney = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    });

    const totalMoneyFormat = formatMoney.format(totalMoney);

    const totalMoneyCanceledFormat = 
        formatMoney.format(totalMoneyCanceled);

    let isSelected;

    if(selectedFolio === folio){
        isSelected = true;
    }

    return (
        <div 
            className="requisicion-container"
            onClick={click}
            style={{
                backgroundColor: isSelected ?
                    'orange' : ''
            }}
        >
            <h3>Folio : {folio}</h3>

            <div className="dates-container">
                <h4>Se pidio : {requestedDate}</h4>

                {deliveredDate &&
                    <h4>Se entrego : {deliveredDate}</h4>
                }

                {completedDate &&
                    <h4>Se completo : {completedDate}</h4>
                }
            </div>

            <div className="status-container">
                <h3 style={{
                    backgroundColor: status === 'aun no llega' ?
                        'white'
                        :
                        status === 'incompleta' ?
                            'yellow'
                            :
                            'green' //COMPLETADA
                }}>
                    {status}
                </h3>

                <div>
                    <h4>
                        {totalMoneyCanceled > 0 ?
                            formatMoney.format(totalMoney - totalMoneyCanceled) 
                            :
                            totalMoneyFormat
                        }
                    </h4>

                    {totalMoneyCanceled > 0 ?
                        <h4 style={{color: 'red'}}>
                            {totalMoneyCanceledFormat}
                        </h4> 
                        :
                        null
                    }
                </div>
            </div>
        </div>
    )
}
