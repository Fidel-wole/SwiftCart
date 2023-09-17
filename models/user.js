const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    middlename:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    phone_number:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    required:true,
                    ref:"Product"
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >=0){
newQuantity = this.cart.items[cartProductIndex].quantity + 1;
updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
        updatedCartItems.push({
            productId:product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items:updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeCartItem = function (productId){
    const updatedCartItem = this.cart.items.filter(item =>{
        return item.productId.toString() != productId.toString() 
    });
    this.cart.items = updatedCartItem;
    return this.save(); 
}

userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
}
module.exports = mongoose.model('User', userSchema);