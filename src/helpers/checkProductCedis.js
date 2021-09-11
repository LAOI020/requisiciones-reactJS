
import { dispatchCheckProductCedis, dispatchSelectedProductCedis } from '../actions/cedisActions';


export const checkProductCedis = (value) => {
    return (dispatch, getState) => {

        const {selectedProduct, requisiciones} =
            getState().cedisReducer;
        
        let requisicion = requisiciones.find(requi => 
            requi.folio === selectedProduct.folio
        );

        let categoryIndex = requisicion.details.findIndex(
            catego =>
                catego.name === selectedProduct.categoryName
        );

        let productIndex = requisicion.details[categoryIndex].products.findIndex(produ => 
            produ.name === selectedProduct.productName
        );

        requisicion.details[categoryIndex].products[productIndex].check = value;

        let updateRequisiciones = requisiciones.map(requi => 
            requi.folio === requisicion.folio ?
                requisicion
                :
                requi
        );


        dispatch(dispatchCheckProductCedis(updateRequisiciones));

        dispatch(dispatchSelectedProductCedis({}));
    }
}
