const Category = require('../../models/products/Category');
const Product = require('../../models/products/Product');

const getCategories = async (req, res)=>{
    
    await Category.find({})
        .then(category => {
            const response = category.map(cate => {
                return cate.name;                    
            })
            res.send(response);
        })
        .catch(err => {
            res.send(err);
        })

}

const getCategoriesByName = async (req, res) => {
    const { name } = req.params;
    const match = await Category.findOne({name});

    if(!match || !name){
        res.status(404).send({message: 'Something went wrong'})
    } else {
        const responseMap = await Category.find({name})
                .populate({
                    path: 'products',
                    model: 'Product',
                })
                .exec();
    
        res.status(200).send(responseMap);
    }
}

const createCategory = async (req, res) => {
    const categoryToCreate = req.body;

    if(!categoryToCreate){
        return res.status(400).json({message: `We could't process your require`})
    }

    const categoryCreated = new Category(categoryToCreate);

    categoryCreated.save().then(category => {
        res.status(200).send(category)
    })
    .catch(err => {
        console.log(err)
    })
    
}

const deleteCategory = async (req, res) => {
    const { name } = req.params;

    await Product.updateMany({}, {
        $pull: {
            category: {$in : [name]} 
        }
    })
    await Category.deleteOne({name})
        .then(category => res.send(category))
        .catch(err => console.log(`Error deleting Product: `, err))
    
   
}

const updateCategory= async (req,res)=>{
    const {nameCategory}= req.query
    const updatedName= req.body.name

    await Product.updateMany({category:nameCategory}, {
        $set: {
            "category.$": updatedName
        }
    })
    

   const category= await Category.findOne({name:nameCategory})
   await Category.updateOne({name:nameCategory}, {name:updatedName}, {new:true})
   await category.save()
   res.send(category)
}

module.exports = {
    getCategories,
    getCategoriesByName,
    createCategory,
    deleteCategory, 
    updateCategory
}