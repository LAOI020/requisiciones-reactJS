import { types } from "../types";


export const dispatchGetDataCedis = (requisiciones) => ({
    type: types.cedisGetData,
    payload: requisiciones
});


export const dispatchSelectedProductCedis = (product) => ({
    type: types.cedisSelectProduct,
    payload: product
});


export const dispatchCheckProductCedis = (updateRequisiciones) => ({
    type: types.cedisCheckProduct,
    payload: updateRequisiciones    
})