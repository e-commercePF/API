step 1 git clone "repourl";
step 2 npm install
step 3 npm run dev



###PRODUCT - ROUTES

GET || http://localhost:3000/api/products
Returns all products.

GET || http://localhost:3000/api/products/id/:id
** Pass in params ID = a product ID
** e.g: 62316b69af6a67376456cfcd .
And should return the product by ID

GET || http://localhost:3000/api/products/name/:name
** Pass in params name = a product name
** e.g: ... .
And should return the product by name


POST || http://localhost:3000/api/products/create
Body should contain {
	"sku": "", 
    "name": "",
    "description": "",
    "price": 0,
    "isOnStock": true,
	"quantity": 0,
	"img": "noimage",
	"category": 
}
--if the product is a t-shirt an sku could be TS0001, TS --> T-Shirt 0001 the article number
--img for the moment is a link or should be... xd
These are props that will be modified by the time.

DELETE || http://localhost:3000/api/products/delete/:id
** Pass in params ID = a product ID
** e.g: 62316b69af6a67376456cfcd .


// PUT || http://localhost:3000/api/products/update/:id
productRouter.put('/update/:id', updateProduct)





###CATEGORIES - ROUTES

GET || http://localhost:3000/api/categories
We get all categories ---> In future array with products will appear with their info :D

GET || http://localhost:3000/api/categories/:name

name = T-Shirt e.g

POST || http://localhost:3000/api/categories/create

Body should be like this: {
    name: "categoryNameToAdd"
}

DELETE || http://localhost:3000/api/categories/delete/:name

name = Pants e.g and category will be deleted. Products inside won't be deleted. That's is the function of another request.





###USER - CREATE || METHOD: POST || URL: http://localhost:3000/api/user/signup
Body should be like this: {
    username: ""
    name: ""
    password: ""
    }






###USER - LOGIN  METHOD: POST || URL: http://localhost:3000/api/user/signin
Body should be like this: {
    username: ""
    password: ""
    }


FILTROS 

    POR PRECIO EN ORDEN DESCENDENTE
// GET || http://localhost:3000/api/products/desc
productRouter.get('/desc', sortPriceDesc)

    POR PRECIO EN ORDEN ASCENDENTE
// GET || http://localhost:3000/api/products/asc
productRouter.get('/asc', sortPriceAsc)


    POR NOMBRE ASCENDENTE
// GET || http://localhost:3000/api/products/nameA
productRouter.get('/nameA', sortNameAsc)

    POR NOMBRE DESCENDENTE
// GET || http://localhost:3000/api/products/nameZ
productRouter.get('/nameZ', sortNameDesc)


    POR CATEGORIA
// GET || http://localhost:3000/api/products/category
productRouter.get('/category', filterByCategory)


    POR RANGO DE PRECIO ENTRE DOS VALORES
// GET || http://localhost:3000/api/products/range
productRouter.get('/range', filterRange)

