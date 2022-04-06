const router = require('express').Router();
const Order = require('../../models/orders/Order');
const Product = require('../../models/products/Product');
const { transporter } = require('../users/mailer');

//STRIPE 
router.post('/', async (req, res) => {
        Order.findOne({ "orderId": req.body.orderId}, async (err, order) => {
            if(order){
                res.status(200).send(order);
            } else {
                try{ 
                    req.body.products.forEach(p =>{
                        Product.findByIdAndUpdate(p.productId,{ $inc: {
                            "quantity": -p.quantity
                        }}, {new: true}, (err, product) => {
                            if(err){
                                console.log(err);
                            }
                            console.log(product.quantity);
                        });
                    })
                    const newOrder = new Order(req.body);
                    const saveOrder = await newOrder.save();
                    res.status(200).send(saveOrder);
                    const productsTemp = req.body.products.map(p=>{
                        return `<h4>Quantity: ${p.quantity} - ${p.name} - Price: $${p.price}</h4>`
                    })
                    const options = {
                        from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                        to: req.body.email , // list of receivers
                        subject: "Purchase", // Subject line
                        html: `<h1>Thanks for buying at Sports-Market</h1>
                        <h2>Your purchase</h2>
                        ${productsTemp.join(' ')}<br>
                        <h3>ORDER TOTAL: $${req.body.amount}</h3>
                        <h3>YOUR ORDER ID: ${req.body.orderId}</h3>
                        <h3>The Order will be delivered when it will be ready, check your email for update or contact us: sportsmarketnl@gmail.com</h3>
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

// ["pending", "dispatched", "completed", "canceled"]

router.put('/:orderId', async (req, res) => {
    
    let status = ["pending", "dispatched", "completed", "canceled"];
    
    let foundOrder = await Order.findOne({"orderId": req.params.orderId})
    console.log(foundOrder.status)
    console.log(foundOrder.products)
    let idx = status.indexOf(foundOrder.status);
    console.log(idx)
    if(req.body.status === "canceled" || foundOrder.status === "canceled") {
        if(foundOrder.status === "completed") {
            Order.findOneAndUpdate({ "orderId": req.params.orderId}, req.body, { new: true },(err,order)=>{
                if(err) {
                    return res.status(500).send({error: "Internal server error"})
                }
                else {
                    foundOrder.products.forEach(p=>{
                        Product.findByIdAndUpdate(p.productId,{ $inc: {
                            "quantity": +p.quantity
                        }}, {new: true}, (err, product) => {
                            if(err){
                                console.log(err);
                            }
                            console.log(product.quantity);
                        });
                    })
                    let day = Date()
                    const options = {
                        from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                        to: foundOrder.email , // list of receivers
                        subject: "Update in your order", // Subject line
                        html: `<h1>Sports-Market</h1>
                        <h3>YOUR ORDER ID: ${foundOrder.orderId}</h3>
                        <h3>The order has been updated at ${day} and now has been ${req.body.status}</h3>
                        <h3>We are sorry that you cancel the order, we hope you bought again at Sports-Market</h3>
                        
                        `
                    }
                    transporter.sendMail(options, function (error,info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message Sent: ' + info.response);
                        }
                    }); 
                    return res.status(200).send(order);
                }
            })
            
        } else {
            return res.status(400).send({error: `You can't cancel an order that is already in progress or has finished, please contact us if you need for more help`})
        }
       
    } else if(req.body.status !== status[idx+1]) {
        return res.status(400).send({error: `You can't change the status from ${foundOrder.status} to ${req.body.status}, first has to be ${status[idx+1]}`})
    } else {
        Order.findOneAndUpdate({ "orderId": req.params.orderId}, req.body, { new: true },(err, order) => {
            if(err) {
                return res.status(400).send({error: "Error updating correctly"})
            }
            else {
                var day = new Date();
                console.log(day); // Apr 30 2000

                var nextDay = new Date(day);
                nextDay.setDate(day.getDate() + 1);
                console.log(nextDay); // May 1 2000
                const options = {
                    from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                    to: foundOrder.email , // list of receivers
                    subject: "Update in your order", // Subject line
                    html: `<h1>Sports-Market</h1>
                    <h3>YOUR ORDER ID: ${foundOrder.orderId}</h3>
                    <h3>The order has been updated at ${day} and now is ${req.body.status}</h3>
                    ${req.body.status === 'dispatched' ? `<h2> The order is in process of delivery, we estimate it will be delivered on ${nextDay}</h2>` : `<h2>You have recieved your order on ${day}, for any inquieres contact us to this email</h2>`}
                    `
                }
                transporter.sendMail(options, function (error,info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message Sent: ' + info.response);
                    }
                });  
                return res.status(200).send(order);
            }
        })

    }
})

module.exports = router