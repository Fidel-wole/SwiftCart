const User = require('../models/user');

//Middleware function to remove a product from users cart
function removeProductFromUsersCart(productId){
    return User.updateMany(
        { 'cart.items.productId': productId }, // Target users with the specified product in their cart
    { $pull: { 'cart.items': { productId: productId } } } // Remove the product from the cart
    ).then(()=>{
        console.log("Product removed from users cart")
    }).catch(err =>{
        console.log(err);
    })
}

module.exports = removeProductFromUsersCart;