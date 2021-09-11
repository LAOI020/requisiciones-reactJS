import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { types } from '../types';


export const RequisicionesScreen = () => {

    const history = useHistory();

    const dispatch = useDispatch();

    const {requisiciones, folioRequisicionDesktop} = 
        useSelector(state => state.restaurantReducer);

    const {widthScreen} = 
        useSelector(state => state.userReducer);

    const clickRequisicion = (folio) => {
        if(widthScreen < 1050){
           
            history.push(`/welcome/requisiciones/${folio}?rn=cholula`);

        } else {
            dispatch({
                type: types.clickRequisicionDesktop,
                payload: folio
            });
        }
    }

    return (
        <div>
            {requisiciones.map((requisicion, index) => (
                <RequisicionContainer
                    key={`${requisicion.folio}${index}`}
                    requisicion={requisicion}
                    click={() => clickRequisicion(requisicion.folio)}
                    selectedFolio={folioRequisicionDesktop}
                />
            ))}
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
