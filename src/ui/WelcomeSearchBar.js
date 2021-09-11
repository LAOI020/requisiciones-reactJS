import React, { useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';


export const WelcomeSearchBar = ({value, changeInput, reset}) => {
    
    const [focus, setFocus] = useState(false);

    const onFocus = (value) => {
        setFocus(value)
    }

    return (
        <div 
            className="category-search-bar"
            style={{
                border: focus ?
                    '3px solid orange' : ''
            }}
        >
            <input
                type="text"
                name="search"
                autoComplete="off"
                value={value}
                onChange={changeInput}
                // onBlur={onFocus}
                onFocus={() => onFocus(true)}
                onBlur={() => onFocus(false)}
            />

            {value.trim() &&
                <ImCancelCircle
                    size="1.8rem"
                    className="icon-clear-input"
                    onClick={() => reset()}
                />
            }
        </div>
    )
}
