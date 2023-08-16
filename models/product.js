const getDb = require("../util/database").getdb;
const mongoDb = require('mongodb');
class Product {
  constructor(id, title, price, description, imageUrl) {
    this._id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  save() {
    const db = getDb();
    let dbOp;
    if(this._id){
        //update product
           dbOp = db.collection('products').updateOne({_id: new mongoDb.ObjectId (this._id)}, {$set: this})
    }else{
        dbOp = db; 
    }
    return dbOp
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  
    static fetchAll() {w
        const db = getDb();
    return db.collection("products").find().toArray().then(products =>{
        console.log(products);
        return products;
    }).catch(err =>{
        console.log(err);
    });
  }

  static findById(prodId){
const db =getDb();
return db.collection('products').find({_id: new mongoDb.ObjectId(prodId)}).next()
.then(product =>{
    console.log(product);
    return product;
})
.catch(err =>{
    console.log(err)
})
  }
}

module.exports = Product;
