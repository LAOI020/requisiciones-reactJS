
import Swal from 'sweetalert2';
import { inventoryUpdateProduct } from "../actions/restaurantActions";
import { updateAmountInventoryFirebase } from "../firebase/updateAmountInventory";


export const inventoryChangeAmount = (
    newAmount, businessName, fromSocket
) => {

    return async (dispatch, getState) => {

        const {selectedProductInventory, categories} = 
            getState().restaurantReducer;
        
        let categorySelected = categories.find(
            category => 
                category.name === 
                selectedProductInventory.categoryName
        );

        let productSelected = categorySelected.products.find(
            product => 
                product.name === 
                selectedProductInventory.productName
        )

        if(newAmount <= productSelected.stock){
            
            productSelected.current = newAmount;

            productSelected.check = true;

            categorySelected.products = 
                categorySelected.products.map(product => 
                    product.name === productSelected.name ?
                        productSelected
                        :
                        product
            );

            let updateCategories = categories.map(category => 
                category.name === categorySelected.name ?
                    categorySelected
                    :
                    category
            )

            dispatch(inventoryUpdateProduct({updateCategories}));

            if(!fromSocket){
                updateAmountInventoryFirebase(
                    businessName,
                    selectedProductInventory.categoryName,
                    selectedProductInventory.productName,
                    newAmount
                );
            }

        } else {
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'la cantidad no puede superar el stock',
            });
        }
    }
}