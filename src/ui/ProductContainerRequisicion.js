import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoX, GoPencil, GoCheck } from 'react-icons/go';
import { BsCheckCircle, BsFillXCircleFill } from 'react-icons/bs';
import { clickProductCanceled, selectProductRequisicion } from '../actions/restaurantActions';
import { cancelProductRequisicion, completedProductRequisicion, editAmountProductRequisicion } from '../helpers/clickIconsProduct';
import { useForm } from '../hooks/useForm';
import { dispatchSelectedProductCedis } from '../actions/cedisActions';
import { checkProductCedis } from '../helpers/checkProductCedis';
import { emitCheckProductCedis } from '../socketEvents';



export const ProductContainerRequisicionBusiness = ({
    folio, categoryName, product, isFinance
}) => {

    const formatCurrency = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    });

    const dispatch = useDispatch();

    const {selectedProductRequisicion:productSelected} = 
        useSelector(state => state.restaurantReducer);
    
    const [formValue, changeInput, reset] = useForm({
        'amount': ''
    });
    
    const {amount} = formValue;

    let {
        name, 
        requestedAmount, 
        missingAmount,
        measure, 
        unitPrice,
        completed,
        missing,
        canceled

    } = product;

    const inputID = categoryName + name;

    let totalMoneyProduct = unitPrice * requestedAmount;
    
    if(canceled && missing){
        totalMoneyProduct = unitPrice * missingAmount;
    }

    if(missing && !completed){
        totalMoneyProduct = unitPrice * missingAmount;
    }
    
    totalMoneyProduct = formatCurrency.format(totalMoneyProduct);

    unitPrice = formatCurrency.format(unitPrice);

    const clickProduct = () => {

        if(completed !== true){

            if(canceled){
                dispatch(selectProductRequisicion({}));
                
                dispatch(clickProductCanceled(product));
                
            } else if(!isFinance){
                dispatch(selectProductRequisicion({
                    folio: folio,
                    categoryName: categoryName,
                    productName: name,
                }));
            }
        }
    }

    const clickIconCompleted = () => {
        dispatch(completedProductRequisicion(false));
        
        dispatch(selectProductRequisicion({}));
    }

    const clickIconEdit = () => {
        dispatch(selectProductRequisicion(
            {...productSelected,edit: true}, inputID
        ));
    }

    const clickIconCancel = () => {
        dispatch(cancelProductRequisicion(false));
        
        dispatch(selectProductRequisicion({}));
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        document.getElementById(inputID).blur();
    }

    const focusOutInput = () => {
        let amountNumber = parseFloat(amount);

        if(amountNumber > 0){
            dispatch(editAmountProductRequisicion(
                amountNumber, false
            ));

            dispatch(selectProductRequisicion({}));
        }

        reset();
    }

    return (
        <div 
            className="product-container"
            style={{
                backgroundColor: completed === true ?
                    'green'
                    :
                    canceled === true ?
                        'red'
                        :
                        missing === true ?
                            'yellow'
                            :
                            'gray'
            }}
        >
            <div 
                className="product-container-row1"
                onClick={clickProduct}
            >
                <h5>
                    {missing && !completed ?
                        missingAmount
                        :
                        requestedAmount
                    }
                </h5>

                <h5>{name}</h5>
            </div>

            {productSelected.productName !== name ?
                <div 
                    className="product-container-row2"
                    onClick={clickProduct}
                >
                    <h5>{measure}</h5>

                    <h5>{unitPrice}</h5>

                    <h5>{totalMoneyProduct}</h5>
                </div>
                :
                <div className="product-container-row-icons">
                    {!productSelected.edit &&
                        <GoCheck
                            size="2rem"
                            style={{backgroundColor: 'green', width: '100%'}}
                            onClick={clickIconCompleted}
                        />
                    }

                    {productSelected.edit ?
                        <form onSubmit={onSubmitForm}>
                            <input
                                id={inputID}
                                style={{
                                    display: productSelected.edit ?
                                        '' : 'none'
                                }}
                                type="number"
                                name="amount"
                                autoComplete="off"
                                inputMode='decimal'
                                step="0.01"
                                onBlur={focusOutInput}
                                value={amount}
                                onChange={changeInput}
                            />
                        </form>
                        :
                        <GoPencil
                            size="2rem"
                            style={{backgroundColor: 'yellow', width: '100%'}}
                            onClick={clickIconEdit}
                        />
                    }

                    {!productSelected.edit &&
                        <GoX
                            size="2rem"
                            style={{backgroundColor: 'red', width: '100%'}}
                            onClick={clickIconCancel}
                        />
                    }
                </div>
            }
            
        </div>
    )
}


export const ProductContainerRequisicionCedis = ({
    folio, categoryName, product
}) => {
    
    const dispatch = useDispatch();

    const {selectedProduct} = 
        useSelector(state => state.cedisReducer);

    const formatCurrency = Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    });

    let {
        name, 
        requestedAmount, 
        missingAmount,
        measure, 
        unitPrice,
        completed,
        missing,
        canceled,
        check

    } = product;

    let totalMoneyProduct = unitPrice * requestedAmount;
    
    if(canceled && missing){
        totalMoneyProduct = unitPrice * missingAmount;
    }

    if(missing && !completed){
        totalMoneyProduct = unitPrice * missingAmount;
    }
    
    totalMoneyProduct = formatCurrency.format(totalMoneyProduct);

    unitPrice = formatCurrency.format(unitPrice);

    const clickProduct = () => {
        dispatch(dispatchSelectedProductCedis({
            folio: folio,
            categoryName,
            productName: name
        }));
    }

    const clickIcon = (value) => {
        dispatch(checkProductCedis(value));

        emitCheckProductCedis(
            value,
            {
                folio: folio,
                categoryName,
                productName: name
            }
        );
    }

    return (
        <div style={{
            alignItems: 'center',
            display: 'grid',
            gridTemplateColumns: check === false ?
                '1fr' : '0.1fr 0.9fr'
        }}>

            {check === true ?
                <BsCheckCircle
                    className="icon-check-product-cedis"
                    size="2.2rem"
                    style={{backgroundColor: 'green'}}
                />
                :
                check === null ?
                    <BsFillXCircleFill 
                        className="icon-check-product-cedis"
                        size="2.2rem"
                        style={{backgroundColor: 'red'}}
                    />
                    :
                    null
            }

            <div 
                className="product-container"
                style={{
                    backgroundColor: completed === true ?
                        'green'
                        :
                        canceled === true ?
                            'red'
                            :
                            missing === true ?
                                'yellow'
                                :
                                'gray'
                }}
            >
                <div 
                    className="product-container-row1"
                    onClick={clickProduct}
                >
                    <h5>
                        {missing && !completed ?
                            missingAmount
                            :
                            requestedAmount
                        }
                    </h5>

                    <h5>{name}</h5>
                </div>

                {selectedProduct.productName === name ?
                    <div style={{
                        display: 'grid', 
                        gridTemplateColumns: '0.5fr 0.5fr'
                    }}>
                        <BsCheckCircle
                            size="2rem"
                            style={{backgroundColor: 'green', width: '100%'}}
                            onClick={() => clickIcon(true)}
                        />

                        <BsFillXCircleFill
                            size="2rem"
                            style={{backgroundColor: 'red', width: '100%'}}
                            onClick={() => clickIcon(null)}
                        />
                    </div>
                    :
                    <div 
                        className="product-container-row2"
                        onClick={clickProduct}
                    >
                        <h5>{measure}</h5>

                        <h5>{unitPrice}</h5>

                        <h5>{totalMoneyProduct}</h5>
                    </div>
                }
            </div>
        </div>
    )
}
