import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { restaurantReducer } from './reducers/restaurantReducer';
import { cedisReducer } from './reducers/cedisReducer';
import { userReducer } from './reducers/userReducer';
import { financeReducer } from './reducers/financeReducer';


const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
    restaurantReducer: restaurantReducer,
    cedisReducer: cedisReducer,
    userReducer: userReducer,
    financeReducer: financeReducer
});

export const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);