import React, { useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { useDispatch, useSelector } from 'react-redux';
import { clickCategoryInventory, selectProductInventory } from '../actions/restaurantActions';
import { nextProductInventory } from '../helpers/nextProductInventory';
import { useForm } from '../hooks/useForm';
import { inventoryChangeAmount } from '../helpers/inventoryChangeAmount';
import { checkInventory } from '../helpers/checkInventory';
import { useHistory } from 'react-router';
import { emitCheckInventory, emitUpdateProductInventory } from '../socketEvents';

export const MakeInventoryScreen = () => {

    const history = useHistory();

    let restaurantName = 
        new URLSearchParams(history.location.search).get('rn');


    const {categories} = 
        useSelector(state => state.restaurantReducer);

    return (
        <div>
            {categories.map((category, index) => (
                <CategoryDivider
                    key={`${category.name}${index}`}
                    businessName={restaurantName}
                    categoryName={category.name}
                    categoryCheck={category.check}
                    products={category.products}
                />
            ))}

            <FATbutton />

            <div style={{height: '4rem'}}></div>
        </div>
    )
}


const FATbutton = () => {

    const dispatch = useDispatch();

    const history = useHistory();
    
    const {business} = useSelector(state => state.userReducer);

    const clickButton = () => {
        dispatch(checkInventory(history, false));
        
        dispatch(selectProductInventory({}));

        emitCheckInventory(business);
    }

    return (
        <FaCheck 
            className="check-inventory-FAT"
            size="1.8rem"
            onClick={clickButton}
        />
    )
}


const CategoryDivider = ({
    categoryName, categoryCheck, products, businessName
}) => {

    const dispatch = useDispatch();

    const {selectedCategoryInventory} = 
        useSelector(state => state.restaurantReducer);
    
    let isSelected;

    if(selectedCategoryInventory === categoryName){
        isSelected = true;
    }

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100
        })
    );

    const clickOpenCategory = () => {
        if(selectedCategoryInventory === categoryName){
            dispatch(clickCategoryInventory(null));
        } else {
            dispatch(clickCategoryInventory(categoryName));
        }
    }

    return (
        <>
            <div 
                className="divider-container"
                onClick={clickOpenCategory}
                style={{
                    color: categoryCheck ?
                        'green': 'black'
                }}
            >
                {categoryName}
            </div>

            {isSelected && 
                <div style={{height: '100vh'}}>
                <AutoSizer>
                {({width, height}) => (
                    <List
                        width={width}
                        height={height}
                        rowHeight={cache.current.rowHeight}
                        deferredMeasurementCache={cache.current}
                        rowCount={products.length}
                        rowRenderer={({key, index, style, parent}) => {
                            return (
                                <CellMeasurer
                                    key={key}
                                    cache={cache.current}
                                    parent={parent}
                                    columnIndex={0}
                                    rowIndex={index}
                                >
                                    <div style={style}>
                                        <ProductContainer
                                            key={`${products[index].name}${index}`}
                                            businessName={businessName}
                                            categoryName={categoryName}
                                            product={products[index]}
                                            dispatch={dispatch}
                                        />
                                    </div>
                                </CellMeasurer>
                            )
                        }}
                    />
                )}
                </AutoSizer>
                </div>
            }
        </>
    )
}


const ProductContainer = ({
    categoryName, product, dispatch, businessName
}) => {

    const {selectedProductInventory:productSelected} = 
        useSelector(state => state.restaurantReducer);
    
    const {name, measure, stock, current, check} = product;

    const inputID = categoryName + name;

    const [formValue, changeInput, reset] = useForm({
        'amount': ''
    });
    const {amount} = formValue;

    const clickProduct = () => {
        dispatch(selectProductInventory(
            {categoryName: categoryName, productName: name},
            inputID
        ));
    }

    const onSubmitForm = (e) => {
        e.preventDefault();
        
        document.getElementById(inputID).blur();
    }

    const focusOutInput = () => {
        console.log('focus out');
        let amountNumber = parseFloat(amount);

        if(amountNumber > 0 && amountNumber[0] !== '.'){

            dispatch(inventoryChangeAmount(
                amountNumber, businessName, false
            ));

            emitUpdateProductInventory(
                amountNumber, businessName
            );
    
            if(amountNumber <= stock){
                dispatch(nextProductInventory());
            }
    
            reset();

        } else {            
            reset();
        }
        
    }
    
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 
                    productSelected?.productName === name ?
                        '0.75fr 0.25fr' : '1fr'
            }}
        >
            <div 
                className="inventory-product-container"
                onClick={clickProduct}
                style={{
                    backgroundColor: check ?
                        'green' : 'gray'
                }}
            >
                <div className="inventory-product-container-row1">
                    <h5>{name}</h5>
                </div>

                <div className="inventory-product-container-row2">
                    <h5>{measure}</h5>
                    <h5 style={{textAlign: 'center'}}> 
                        {stock} 
                    </h5>
                    <h5 style={{textAlign: 'center'}}> 
                        {current} 
                    </h5>
                </div>
            </div>

            {productSelected?.productName === name ?
                <form 
                    className="form-inventory-product-container"
                    onSubmit={onSubmitForm}
                >
                    <input
                        id={inputID}
                        type="number"
                        name="amount"
                        autoComplete="off"
                        inputMode='decimal'
                        step="0.01"
                        onBlur={focusOutInput}
                        value={amount}
                        onChange={changeInput}
                        // onKeyPress={pressKeyEnter}
                    />
                </form>
                :
                null
            }
        </div>
    )
}
