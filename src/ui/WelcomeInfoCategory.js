import React from 'react';


export const WelcomeInfoCategory = ({selectedCategory}) => {

    const {totalMoneyStock, totalMoneyCurrent} = 
        selectedCategory;

    const formatCurrency = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    });

    let stockMoney = formatCurrency.format(totalMoneyStock);

    let currentMoney = formatCurrency.format(totalMoneyCurrent);

    let missingMoney = formatCurrency.format(
        totalMoneyStock - totalMoneyCurrent
    );

    return (
        <div className="info-category-container">
            <div>
                <h5 style={{borderTopLeftRadius: '0.5rem'}}>
                    Stock
                </h5>
                <h5 style={{borderTopRightRadius: '0.5rem'}}>
                    {stockMoney}
                </h5>

                <h5>Inventario</h5>
                <h5>{currentMoney}</h5>
            
                <h5 style={{borderBottomLeftRadius: '0.5rem'}}>
                    Faltante
                </h5>
                <h5 style={{borderBottomRightRadius: '0.5rem'}}>
                    {missingMoney}
                </h5>
            </div>
        </div>
    )
}
