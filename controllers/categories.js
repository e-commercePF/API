const categoryRouter = require('express').Router();
const Category = require('../models/products/Category')

categoryRouter.get('/', async (req, res)=>{
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

})

categoryRouter.get('/:name', async (req, res) => {
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
})

categoryRouter.post('/create', async (req, res) => {
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
    
})

categoryRouter.delete('/delete/:name', async (req, res) => {
    const { name } = req.params;

    await Category.deleteOne({name})
        .then(category => res.send(category))
        .catch(err => console.log(`Error deleting Product: `, err))
})

    

module.exports = categoryRouter;




















// Category.findOne({ name })
        // .then(products =>{
        //     if(products) {
        //         return res.json(products)
        //     } else {
        //         res.status(404).end()
        //     }
        // })// busca nota por id mas facil xd