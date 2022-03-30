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
                    res.status(200).send(saveOrder);
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

module.exports = router