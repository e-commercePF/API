const router = require('express').Router();
const Order = require('../../models/orders/Order');
//STRIPE 
router.post('/', async (req, res) => {
    

    
        Order.findOne({ "orderId": req.body.orderId}, async (err, order) => {
            if(order){
                res.status(200).send(order);
            } else {
                try{
                    const newOrder = new Order(req.body);
                    const saveOrder = await newOrder.save();
                    res.status(200).send(saveOrder)
                }
                catch(e){
                    console.log("error del catch", e)
                }  
            }
            if(err) {
                console.log("error del Order.find", err)
            }
        }).clone().catch(err => console.log("error",err))
        
    
    
})



// router.put('/updateCart', authenticateJWT, (req,res)=>{
//     console.log(req.body);
//     User.findByIdAndUpdate(req.user._id, { "products": req.body}, {new: true})
//     .exec((err, user) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.status(200).send(user.products);
//         }
//     })

// })

// router.get('/getCart', authenticateJWT, (req,res)=>{
//     User.findById(req.user._id)
//     .exec((err, user) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.status(200).send(user.products);
//         }
//     })
// })

module.exports = router