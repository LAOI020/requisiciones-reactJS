import React from 'react';


export const WelcomeProductContainer = ({product}) => {

    const {name, unitPrice, measure, stock, current} = product;

    const unitPriceFormat = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    }).format(unitPrice);

    return (
        <div className="product-category-container">
            <div className="product-category-row1">
                <h5>{name}</h5>
                <h5>{unitPriceFormat}</h5>
            </div>

            <div className="product-category-row2">
                <h5>{measure} </h5>
                <h5>{stock}</h5>
                <h5>{current}</h5>
            </div>
        </div>
    )
}


export const WelcomeProductContainerDesktop = ({product}) => {

    const {name, unitPrice, measure, stock, current} = product;

    const unitPriceFormat = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    }).format(unitPrice);

    return (
        <div className="container-product-desktop">
            <h5>{name}</h5>
            <h5>{measure} </h5>
            <h5>{unitPriceFormat}</h5>
            <h5>{stock}</h5>
            <h5>{current}</h5>
        </div>
    )
}