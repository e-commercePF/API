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

const getProductByName = async (req, res) => {
    const { name } = req.params;
    const match = await Product.find({"name": {'$regex': name, "$options": "i"}});

    if(!match || !name){
        res.status(404).send({message: 'Something went wrong'})
    } else {
                  
    
        res.status(200).send(match);
    }
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


const updateProduct = async (req, res) => { // in future we have to add a middleware to check access token before testing it
    const { id } = req.params;
    const actualization = req.body;
    console.log(actualization)

    Product.findByIdAndUpdate(
        id, 
        actualization,
        {new: true}, // because by default it returns false (prev model, but we want the new model)
        function async(err, product){
            if(err) return err;
            else {
                console.log(product)
                return res.status(200).send(product)
    }})

}

const sortPriceDesc = async (req, res) => {

   const resultPrice = await Product.find({}).sort({price: -1,})

   
   return res.status(200).send(resultPrice)

}

const sortPriceAsc = async (req, res) => {

    const resultPrice = await Product.find({}).sort({price: 1,})
 
    
    return res.status(200).send(resultPrice)
 
}

const sortNameAsc = async (req, res) => {

    const resultName = await Product.find({}).sort({name: 1,})
 
    
    return res.status(200).send(resultName)
 
}

const sortNameDesc = async (req, res) => {

    const resultName = await Product.find({}).sort({name: -1,})
 
    
    return res.status(200).send(resultName)
 
}
const filterByCategory = async (req, res)=>{
    const name = req.query.name;
    const filterProducts= await Product.find({"category": name})

    if(!filterProducts || !name){
        res.status(404).send({message: 'Something went wrong'})
    } else {
                  
    
        res.status(200).send(filterProducts);
    }
}
    




module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    deleteProduct,
    getProductByName,
    updateProduct,
    sortPriceDesc,
    sortPriceAsc,
    sortNameAsc,
    sortNameDesc,
    filterByCategory
}