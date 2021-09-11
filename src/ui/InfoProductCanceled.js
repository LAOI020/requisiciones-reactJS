import React from 'react';


export const InfoProductCanceled = ({infoProduct}) => {
    
    const {
        name, 
        unitPrice,
        requestedAmount, 
        amountCompleted,
        missingAmount
        
    } = infoProduct;

    const formatCurrency = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    });

    const requestedAmountMoney = 
        formatCurrency.format(requestedAmount * unitPrice);

    const amountCompletedMoney = 
        formatCurrency.format(amountCompleted * unitPrice);

    const missingAmountMoney = 
        formatCurrency.format(missingAmount * unitPrice);

    return (
        <div className="info-product-canceled-container">
            <h5>{name}</h5>

            <h5>{`Pidio ${requestedAmount}`}</h5>

            {amountCompleted ?
                <div className="info-product-canceled-grid">
                    <h5>Completado</h5>
                    <h5>{amountCompleted}</h5>
                    <h5>{amountCompletedMoney}</h5>

                    <h5>Cancelado</h5>
                    <h5>{missingAmount}</h5>
                    <h5>{missingAmountMoney}</h5>
                </div>
                :
                <div className="info-product-canceled-grid">
                    <h5>Cancelado</h5>
                    <h5>{requestedAmount}</h5>
                    <h5>{requestedAmountMoney}</h5>
                </div>
            }
        </div>
    )
}
