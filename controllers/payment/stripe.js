const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { authenticateJWT } = require('../../controllers/login/authFunctions');
router.post('/create', authenticateJWT, (req, res) => {
    console.log(req.user)
    let newAmount = parseInt(req.body.amount)
    console.log(req.body)

    stripe.charges.create({
        source: req.body.tokenId,
        amount: newAmount,
        currency: "usd"
    }, (stripeErr, stripeSuccess) => {
        if(stripeErr){
            res.status(500).send(stripeErr);
        } else {
            console.log(stripeSuccess)
            // userId, amount, products, address, orderId
            
            res.status(200).send({
                userId: req.user._id,
                address: stripeSuccess.billing_details.address,
                orderId: stripeSuccess.id
            })
        }
    })
})

module.exports = router;
