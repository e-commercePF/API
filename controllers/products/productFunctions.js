const Product = require('../../models/products/Product');
const Category = require('../../models/products/Category');


const getProducts = (req, res) => {
    Product.find({}).then((products) =>{
        
        res.json(products)
            })
    .catch(err => res.status(err))
}

const getProductsById = (req, res) => {
    const { id } = req.params;
        Product.findById(id)
        .then(products =>{
            if(products) {
                return res.json(products)
            } else {
                res.status(404).end()
            }
        })// busca nota por id mas facil xd
    }

const createProduct = async (req, res) => {

    const product = req.body;
    
        if(!product){
            return res.status(400).json({message: `We could't process your require`})
        }
    
    const newProduct = await new Product(product); // We create a new instance of Product 
    
        
        newProduct.save().then(async (saveProduct)=> {
    
        Category.updateOne(
                    { name: saveProduct.category}, 
                    { 
                        $push: {
                            products: saveProduct._id
                        }
                    }, 
                    function (err, raw) {
                        if (err) return err;
                        console.log('The raw response from Mongo was ', raw);
                    }
                )
            res.json(saveProduct)
        }) // Then we save our product in DB and save is a promise so we can res the new product
        
    }
const deleteProduct = async (req, res)=>{
    const { id } = req.params;

    const saveProd = await Product.findById(id);
    const cate = saveProd.category
    await Product.deleteOne({_id: id}).then(prod => console.log(`Product deleted`)).catch(err => console.log(`Error deleting Product: `, err))


    await Category.updateOne({name: cate}, {
        
        $pullAll: {
                products: [id]
            },
        },
    )

    res.sendStatus(201)
}

module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    deleteProduct
}