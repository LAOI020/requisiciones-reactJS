import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { types } from '../types';
import { ProductCedisDesktop } from '../ui/ProductContainerDesktop';
import { ProductContainerRequisicionCedis } from '../ui/ProductContainerRequisicion';


export const CedisDetailsRequisicion = ({folioDesktop}) => {

    const params = useParams();
    const {folio} = params;

    const {widthScreen} = 
        useSelector(state => state.userReducer);

    const {requisiciones} = 
        useSelector(state => state.cedisReducer);
    
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
                    widthScreen={widthScreen}
                />
            ))}

            <div style={{height: '7rem'}}></div>
        </div>
    )
}


const CategoryDivider = ({
    folio, categoryName, categoryCheck, products, widthScreen
}) => {

    products.sort(function(a, b){
        return a.orderValue - b.orderValue
    });

    const dispatch = useDispatch();

    const {selectedCategoryRequisicion} = 
        useSelector(state => state.cedisReducer);

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
                type: types.cedisSelectCategory,
                payload: null
            });
        } else {
            dispatch({
                type: types.cedisSelectCategory,
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
                                            <ProductContainerRequisicionCedis 
                                                key={`${products[index]}${index}`}
                                                folio={folio}
                                                categoryName={categoryName}
                                                product={products[index]}
                                            />
                                            :
                                            <ProductCedisDesktop
                                                key={`${products[index]}${index}`}
                                                folio={folio}
                                                categoryName={categoryName}
                                                product={products[index]}
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

