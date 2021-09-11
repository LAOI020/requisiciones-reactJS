import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { FaCheck } from 'react-icons/fa';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { selectProductRequisicion } from '../actions/restaurantActions';
import { checkRequisicion } from '../helpers/checkRequisicion';
import { emitCheckRequisicion } from '../socketEvents';
import { types } from '../types';
import { ProductContainerDesktop } from '../ui/ProductContainerDesktop';
import { InfoProductCanceled } from '../ui/InfoProductCanceled';
import { ProductContainerRequisicionBusiness } from '../ui/ProductContainerRequisicion';


export const ProductsRequisicion = ({folioDesktop}) => {

    const params = useParams();

    const {folio} = params;

    const {job, widthScreen} = 
        useSelector(state => state.userReducer);

    const {requisiciones, selectedProductCanceled} = 
        useSelector(state => state.restaurantReducer);
    
    let requisicion;

    if(folioDesktop){
        requisicion = requisiciones.find(requi => 
            requi.folio === folioDesktop
        );
    } else {
        requisicion = requisiciones.find(requi => 
            requi.folio === folio
        );
    }

    requisicion?.details.sort(function(a, b){
        return Number(a.check) - Number(b.check)
    });

    return (
        <div>            
            {requisicion?.details.map((category, index) => (
                <CategoryDivider
                    key={`${category.name}${index}`}
                    folio={
                        folioDesktop ? 
                            folioDesktop : folio
                    }
                    categoryName={category.name}
                    categoryCheck={category.check}
                    products={category.products}
                    isFinance={job === 'finanzas' ? true : false}
                    widthScreen={widthScreen}
                />
            ))}

            {selectedProductCanceled &&
                <InfoProductCanceled
                    infoProduct={selectedProductCanceled}
                />
            }

            {job !== 'finanzas' ?
                !requisicion?.completedDate && <FATbutton/>
                :
                null
            }

            <div style={{height: '5rem'}}></div>
        </div>
    )
}


const FATbutton = () => {

    const dispatch = useDispatch();

    const params = useParams();

    const {folio} = params;

    const history = useHistory();

    const {business, widthScreen} = 
        useSelector(state => state.userReducer);

    const clickButton = () => {
        dispatch(checkRequisicion(folio, history, false));

        dispatch(selectProductRequisicion({}));

        emitCheckRequisicion(business, folio);

        if(widthScreen < 1050){
            window.scroll({top: 0, left: 0, behavior: 'smooth'});
        } else {
            dispatch({
                type: types.clickRequisicionDesktop,
                payload: null
            });
        }
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
    folio, categoryName, categoryCheck, products, 
    isFinance, widthScreen
}) => {
    
    products.sort(function(a, b){
        return a.orderValue - b.orderValue
    });
    
    const dispatch = useDispatch();

    const {selectedCategoryRequisicion} = 
        useSelector(state => state.restaurantReducer)

    let isSelected;

    if(selectedCategoryRequisicion === categoryName){
        isSelected = true;
    }

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100
        })
    );

    const clickOpenCategory = () => {
        if(selectedCategoryRequisicion === categoryName){
            dispatch({
                type: types.clickCategoryRequisicion,
                payload: null
            });
        } else {
            dispatch({
                type: types.clickCategoryRequisicion,
                payload: categoryName
            });
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
                                        {widthScreen < 1050 ?
                                            <ProductContainerRequisicionBusiness 
                                                key={`${products[index]}${index}`}
                                                folio={folio}
                                                categoryName={categoryName}
                                                product={products[index]}
                                                isFinance={isFinance}
                                            />
                                            :
                                            <ProductContainerDesktop
                                                key={`${products[index]}${index}`}
                                                folio={folio}
                                                categoryName={categoryName}
                                                product={products[index]}
                                                isFinance={isFinance}
                                            />
                                        }
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
