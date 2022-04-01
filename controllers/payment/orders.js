const router = require('express').Router();
const Order = require('../../models/orders/Order');
const { transporter } = require('../users/mailer');

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
                    const options = {
                        from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                        to: req.body.email , // list of receivers
                        subject: "Purchase", // Subject line
                        html: `<h2>Thanks for buying at Sports-Market</h2>
                        <p>Your purchase</p>
                        <p>${req.body.products[0].name}</p>
                        `
                    }
                    transporter.sendMail(options, function (error,info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message Sent: ' + info.response);
                        }
                    });  
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
// GET || http://localhost:3000/api/orders/all
// GET ALL ORDERS... verifyAdmin need header --> { headers: { Authorization: "Bearer " + token} }
router.get('/all', (req, res) => {
    if(req.user.role === 'admin') {
        Order.find({}, (err, orders) => {
            if(err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(orders);
            }
        })
    } else {
        return res.status(401).send({message: 'Not authorized'})
    }
})
// GET || http://localhost:3000/api/orders/allUser 
// GET ALL ORDERS FROM SPECIFC USER  need header --> { headers: { Authorization: "Bearer " + token} }
router.get('/allUser', (req, res) => {
    Order.find({userId: req.user._id}, (err, orders) => {
        if(err) {
            console.log("error del Order.find", err)
        }
        res.status(200).send(orders);
    })
})
// GET || http://localhost:3000/api/orders/:orderId  
// GET an order matching with the id /api/orders/${orderId}
router.get('/:orderId', (req, res) => {
    Order.findOne({ "orderId": req.params.orderId}, (err, order) => {
        if(err) {
            console.log("error del Order.find", err)
        }
        if(order.userId === req.user._id || req.user.role === 'admin') {
            res.status(200).send(order)
        } else {
            res.status(401).send({ message: "Not authorized"})
        }
    })
})


// PUT || http://localhost:3000/api/orders/:orderId  
// --> in params goes an order.orderId ${order.orderId} 
// --> in body ej. : { "status": "completed"} 

router.put('/:orderId', (req, res) => {
    Order.findOneAndUpdate({ "orderId": req.params.orderId}, req.body, { new: true },(err, order) => {
        if(err) {
            console.log("error del Order.find", err)
        }
        res.status(200).send(order);
    })
})


module.exports = router