import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { dispatchClickCategory } from '../actions/restaurantActions';
import { useForm } from '../hooks/useForm';
import { WelcomeInfoCategory } from '../ui/WelcomeInfoCategory';
import { WelcomeMenuFAT } from '../ui/WelcomeMenuFAT';
import { WelcomeProductContainer, WelcomeProductContainerDesktop } from '../ui/WelcomeProductContainer';
import { WelcomeSearchBar } from '../ui/WelcomeSearchBar';


export const WelcomeScreen = () => {

    const dispatch = useDispatch();

    const {categories, selectedCategory} = 
        useSelector(state => state.restaurantReducer);

    const {widthScreen} = 
        useSelector(state => state.userReducer);

    const [formValue, changeInput, reset] = useForm({
        'search': ''
    });

    const {search} = formValue;

    const clickCategory = (categoryName) => {
        dispatch(dispatchClickCategory(categoryName));
    }

    return (
        <div>
            <div style={{height: search.trim() === '' ? '5rem' : '0px'}}></div>
            

            {search.trim() === '' ?
                //LIST CATEOGIES NAMES
                categories.map((category, index) => {
                    
                    let selected;

                    if(
                        selectedCategory?.name === 
                        categories[index].name
                    ){
                        selected = true
                    } else {
                        selected = false
                    }

                    return (
                        <CategoryContainer
                            key={`${category.name}${index}`}
                            category={category}
                            click={() => 
                                clickCategory(category.name)
                            }
                            selected={selected}
                            widthScreen={widthScreen}
                        />
                    )
                })
                :
                //SEARCH PRODUCT (LIST PRODUCTS)
                <AllProductsListVirtualized 
                    searchText={search}
                />
            }

            <WelcomeSearchBar
                value={search}
                changeInput={changeInput}
                reset={reset}
            />

            {selectedCategory ?
                <WelcomeInfoCategory 
                    selectedCategory={selectedCategory}
                />
                :
                widthScreen < 1050 ?
                    <WelcomeMenuFAT/>
                    :
                    null
            }

            <div style={{height: search.trim() === '' ? '7rem' : '0px'}}></div>
        </div>
    )
}


const AllProductsListVirtualized = ({searchText}) => {

    const {allProducts} = 
        useSelector(state => state.restaurantReducer);

    let filterProducts = allProducts.filter(
        product => product.name.includes(searchText.toUpperCase())
    );

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 1
        })
    );

    return (
        <div style={{height: '90vh', marginTop: '10vh'}}>
        <AutoSizer>
        {({width, height}) => (
            <List
                width={width}
                height={height}
                rowHeight={cache.current.rowHeight}
                deferredMeasurementCache={cache.current}
                rowCount={filterProducts.length}
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
                                <WelcomeProductContainer
                                    product={filterProducts[index]}
                                />
                            </div>
                        </CellMeasurer>
                    )
                }}
            />
        )}
        </AutoSizer>
        </div>
    )
}


const CategoryContainer = ({
    category, click, selected, widthScreen
}) => {
    
    const {name, open} = category;

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100
        })
    );
    
    return (
        <div className="category-container">
            <h3 
                onClick={click}
                style={{ 
                    backgroundColor: selected ?
                        'white' : 'red',
                    color: selected ?
                        'red' : 'white'
                }}
            > 
                {name} 
            </h3>
            
            {open &&
                <div style={{height: '60vh'}}>
                <AutoSizer>
                {({width, height}) => (
                    <List
                        width={width}
                        height={height}
                        rowHeight={cache.current.rowHeight}
                        deferredMeasurementCache={cache.current}
                        rowCount={category.products.length}
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
                                            <WelcomeProductContainer
                                                key={`${category.products[index].name}${index}`}
                                                product={category.products[index]}
                                            />
                                            :
                                            <WelcomeProductContainerDesktop
                                                key={`${category.products[index].name}${index}`}
                                                product={category.products[index]}
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
        </div>
    )
}
