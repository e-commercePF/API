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

const deleteProduct = async (req, res)=>{ // solo lo hace el admin 
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
    Product.findByIdAndUpdate(
        id, 
        actualization,
        {new: true}, // because by default it returns false (prev model, but we want the new model)
        function async(err, product){
            if(err) return err;
            else {
                
                return res.status(200).send(product)
    }})

}

const filterBycategories = async (response2, category) => {
   const res = response2.filter(p => p.category.includes(category))  
   return res
}

const filterbybrands = async (response2, brand) => {
    const res = response2.filter(p => p.brand.includes(brand))
    return res
}


const orderProducts = async (response2, value) => {
    switch (value) {
        case 'pasc':
            return response2 = await response2.sort((a,b)=> a.price -b.price)
        case 'pdesc':
            return response2 = await response2.sort((a,b)=> b.price -a.price)
        case 'nasc':
            return response2.sort((a,b)=>{
                if (a.name > b.name) {
                  return 1;
                }
                if (b.name > a.name) {
                  return -1;
                }
                return 0;
            })
        case 'ndesc':
            return response2.sort((a,b)=>{
                if (a.name > b.name) {
                  return -1;
                }
                if (b.name > a.name) {
                  return 1;
                }
                return 0;
            })
        default: 
        return await response2
    }
}



const getPaginatedFilters = async(req, res) => {
    const {page}= req.query;
    const productsForPage= 6;
    
    const products = await Product.find({})
    let response = products
    let response2 = products

    const {category, brand, name, pricemin, pricemax} = req.query
   
    if (category) {
        response = await filterBycategories(response2, category)
        response2 = response
    }
    if (brand) {
        response = await filterbybrands(response2, brand)
        response2 = response
    }
    // if (pricemin && pricemax) {
        
    //     responseFilter = response.filter(e => (e.price >= pricemin && e.price <= pricemax))
    //     response = responseFilter.sort((a,b) => a.price - b.price)
    //     response2 = response
    // } 
    if (pricemin && !pricemax) {
        
        responseFilter = response.filter(e => (e.price >= pricemin))
        response = responseFilter.sort((a,b) => a.price - b.price)
        response2 = response
    } else if (pricemax && !pricemin) {
        
        responseFilter = response.filter(e => (e.price <= pricemax))
        response = responseFilter.sort((a,b) => a.price - b.price)
        response2 = response
    } else if (pricemin && pricemax) {
        
        responseFilter = response.filter(e => (e.price >= pricemin && e.price <= pricemax))
        response = responseFilter.sort((a,b) => a.price - b.price)
        response2 = response
    }    
    if (name) {
        response = await orderProducts(response2, name)
    }

    
    const resultProducts= response.filter(product=> product.quantity>=1)
    if(resultProducts){
        const start= (page*productsForPage)-productsForPage
        const final= page*productsForPage
        const totalProducts= resultProducts.slice(start, final)
        const totalPage= Math.ceil(resultProducts.length/productsForPage)
        res.json({
            totalProducts,
            totalResult:resultProducts.length,
            productsForPage,
            totalPage            
        })
    }
}


    
// const filterRange = async (req, res)=> {
//     const {minprice, maxprice } = req.query
//     const allProducts = await Product.find({})
    
    
//     if(!minprice || !maxprice){
//         res.status(404).send({message: 'Something went wrong'})
//     } else {
//         const results = allProducts.filter(e => (e.price >= minprice && e.price <= maxprice))
//         const resultPrice = results.sort((a,b) => a.price - b.price)
 
        
//         return res.status(200).send(resultPrice)
//     }     
// }

//
const getBrands = async (req, res)=>{
    
    await Product.find({})
        .then(brand => {
            const response = brand.map(b => {
                return b.brand;                    
            })
            res.send(response);
        })
        .catch(err => {
            res.send(err);
        })

}





module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    deleteProduct,
    getProductByName,
    updateProduct,
    // filterRange,
    getBrands, 
    getPaginatedFilters,
}

  