const Order = require("../../models/orders/Order");
const Review = require("../../models/users/Review");

const createReview= async(req, res)=>{
    const {userId, productId}= req.query   
    const review = req.body 
    const newReview= {
        id_product: productId,
        user: userId,
        description: review.description,
        rating: review.rating
    }
    if(review){
        const saveReview= await new Review(newReview)
       
        saveReview.save()
        res.json(newReview)
        console.log(saveReview)
    } else{
        res.status(400).json({message: `We could't process your require`})
    }
    
    
}

const statusReview =async (reviewProduct, userId, productId)=>{
    console.log('se analizo por statusReview porque existe usuario')
    let status= ''
    if(reviewProduct.length>0) {     
        const filteredReview=reviewProduct.filter(review=> review.user=== userId)
        if(filteredReview.length>0){
            status=false
            console.log(' es falso porque ya hizo un comentario')
        }else{
            
            status= await statusOrderProduct(userId, productId)
            
        }
        //reviewProduct.filter(review=> review.user=== userId).length>0?status=false:
        //status= await statusOrderProduct(userId, productId)
    }else{
        status= await statusOrderProduct(userId, productId)
    }
    return status
}
const statusOrderProduct = async (userId, productId)=>{
    console.log('se analiza por statusOrder porque no hay comentario ')

    const orderUser= await Order.find({userId:userId})    
    const idProducts= orderUser.map(order=>{
       const idproduct= order.products.map(product=>product.productId)
        return idproduct
    })
    const newArray =idProducts.flat()
    let status=newArray.some(product=> product===productId)

   if(status)console.log(' es true por que hizo la compra del producto')
   else console.log('es false por que no compro el producto')

    return status


}
const  getReviewsProduct= async(idproduct)=>{ // tiene qu retornar o un array conlos reviews o un array vacio
    const reviewProduct= await Review.find({id_product: idproduct})
    let reviews=[]
    
  if (reviewProduct.length>0){
    const reviewsProduct= reviewProduct.map(review=> {
        return{
            user: review.user,
            rating: review.rating,
            description: review.description,
        }
    })
      reviews= reviewsProduct
  }
  
  return reviews
}

const getReview= async (req, res)=>{
   const reviewsResult= await Review.find({})
   res.json(reviewsResult)
}

const getRatingProduct=  async(reviews)=>{// para hacerlo desde todos los prodcutos 
   let totalRating= 0
   let suma=0
   for(let i=0; i<reviews.length; i++){
      suma= suma+reviews[i].rating
   }
   totalRating=suma/reviews.length
   console.log(totalRating)

}
const getOrder= async( req, res)=>{
   
    const orders= await Order.find({})
    res.json(orders)
}
const getOrderId= async( req, res)=>{
    const {id}= req.params
    const orders= await Order.find({userId:id})
    res.json(orders)
}
module.exports={
    createReview,
    getReview, 
    getOrder, getOrderId, 
    statusReview, 
    statusOrderProduct, 
    getReviewsProduct
}
