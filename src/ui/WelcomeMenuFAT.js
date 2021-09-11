import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ImMenu } from 'react-icons/im';
import { dispatchMakeInventory } from '../actions/restaurantActions';
import { emitMakeInventory } from '../socketEvents';
import { types } from '../types';


export const WelcomeMenuFAT = () => {
    const dispatch = useDispatch();

    const history = useHistory();

    let restaurantName = 
        new URLSearchParams(history.location.search).get('rn');
    
    const [open, setOpen] = useState(false);

    const itemsNames = ['Salir','Requisiciones','Pedido'];

    const clickMenu = () => {
        setOpen(value => !value);
    }

    const clickItem = (name) => {
        if(name === 'Salir'){

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

        } else if(name === 'Pedido') {
            
            dispatch(dispatchMakeInventory(restaurantName, false));

            emitMakeInventory(restaurantName);
            
            history.replace(
                `/welcome/make-inventory?rn=${restaurantName}`
            );
            
        } else {
            history.push(
                `/welcome/requisiciones?rn=${restaurantName}`
            );
        }
    }

    return (
        <div>
            <ImMenu
                className="Fat-button"
                size="2rem"
                onClick={clickMenu}
            />

            {open &&
                itemsNames.map((nameItem, index) => (
                    <ItemFatButton
                        key={`${nameItem}${index}`}
                        index={index}
                        name={itemsNames[index]}
                        click={() => clickItem(itemsNames[index])}
                    />
                ))
            }
        </div>
    )
}


const ItemFatButton = ({index, name, click}) => {

    const bottomMargin = index + 5 + (index * 2.5);

    return (
        <div 
            className="Item-fat-button"
            style={{
                position: 'fixed',
                bottom: `${bottomMargin}rem`, 
                right: '0.5rem'
            }}
            onClick={click}
        >
            {name}
        </div>
    )
}
