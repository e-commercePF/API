const Order = require("../../models/orders/Order");
const Review = require("../../models/users/Review");

const createReview= async(req, res)=>{
    const {userId, productId}= req.query 
    let response= {
        message:'Debe ser usuario para agregar un comentario',
        status: false
    }
    if (userId){
        response= await statusReview(userId, productId)
        if(response.status){ 
           const review=newReviewFunction(req.body) 
           if(review){
            review.id_product= productId
            review.user= userId
            const saveReview= await new Review(review)           
                saveReview.save()
                res.json(response.message)
            }else{
                res.json({message:'no se guarda por que no hay comentario'})
            }               
        }else{ 
        res.json(response)
        }
    }else{
        res.json(response)
    }
        
    


 
    
    
}
const newReviewFunction=(reviewBody)=>{
    if(reviewBody.hasOwnProperty('rating') && reviewBody.hasOwnProperty('description')){
        if(reviewBody.description.length>0){ // falta controla rating
          return reviewBody
        }
    }else{
        return false
    }
   
}

const statusReview =async (userId, productId)=>{
    const reviewProduct= await getReviewsProduct(productId)
    console.log('se analizo por statusReview porque existe usuario')
    let response= {
        message:'', 
        status:''
    }
    if(reviewProduct.length>0) {     
        const filteredReview=reviewProduct.filter(review=> review.user=== userId)
        if(filteredReview.length>0){
            response.message='este usuario ya realizó un comentario a este producto'
            response.status= false
            console.log(' es falso porque ya hizo un comentario')
        }else{
            response= await statusOrderProduct(userId, productId)
            
        }
    }else{
        response= await statusOrderProduct(userId, productId)
    }
    return response
}
const statusOrderProduct = async (userId, productId)=>{
    console.log('se analiza por statusOrder porque no hay comentario ')
    let response= {
        message:'', 
        status:''
    }
    const orderUser= await Order.find({userId:userId})    // ordenes del usuario
    const idProducts= orderUser.map(order=>{// los id de los prodctos de cada orden 
       const idproduct= order.products.map(product=>product.productId)
        return idproduct
    })
    const allIdProducts =idProducts.flat() // todos los id en un solo array
    response.status=allIdProducts.some(product=> product===productId)
    response.status?response.message='se realizo exitosamente la review':response.message='se debe de comprar el producto para agregar un comentario'
    

   if(response.status)console.log(' es true por que hizo la compra del producto')
   else console.log('es false por que no compro el producto')

    return response


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

 
const getReviewsByDb= async ()=>{
    const reviewsResult= await Review.find({})
    return reviewsResult
 }
 
const getReview= async (req, res)=>{
   const reviewsResult= await getReviewsByDb()
   res.json(reviewsResult)
}

const getRatingProduct=  async(id_product, name)=>{// para hacerlo desde todos los prodcutos 
   const reviewsProduct= await Review.find({id_product: id_product})
   let totalRating= 0
   let suma=0

   if(reviewsProduct.length>0){
    for(let i=0; i<reviewsProduct.length; i++){
        suma= suma+reviewsProduct[i].rating
    }
        totalRating=suma/reviewsProduct.length
   } 
   console.log('promedio',totalRating,'id:', name)
   return totalRating
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
    getReviewsProduct,
    getReviewsByDb,
    getRatingProduct
}
