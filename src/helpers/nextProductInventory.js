import { selectProductInventory } from "../actions/restaurantActions";

export const nextProductInventory = () => {
    return async (dispatch, getState) => {

        const {selectedProductInventory, categories} = 
            getState().restaurantReducer;
    
        const categoryIndex = categories.findIndex(category => 
            category.name === 
            selectedProductInventory.categoryName
        );
    
        const productIndex = 
            categories[categoryIndex].products.findIndex(
                product =>
                    product.name ===
                    selectedProductInventory.productName
        );

        if(categories[categoryIndex].products[productIndex + 1]){
            await dispatch(selectProductInventory({
                'categoryName': selectedProductInventory.categoryName,
                'productName': categories[categoryIndex].products[productIndex + 1].name
            }));

            let inputID = categories[categoryIndex].name + categories[categoryIndex].products[productIndex + 1].name;

            document.getElementById(inputID).focus();

        } else if(categories[categoryIndex + 1]){
            await dispatch(selectProductInventory({
                'categoryName': categories[categoryIndex + 1].name,
                'productName': categories[categoryIndex + 1].products[0].name
            })); 

            let inputID = categories[categoryIndex + 1].name + categories[categoryIndex + 1].products[0].name;

            if(document.getElementById(inputID)){
                document.getElementById(inputID).focus();                
            }

        } else {
            dispatch(selectProductInventory({})); 
        }
    }
}