step 1 git clone "repourl";
step 2 npm install
step 3 npm run dev



    PRODUCT - ROUTES

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

// GET || http://localhost:3000/api/products/brands
Return all brands 


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



PAGINADO
// GET || http://localhost:3000/api/products/forPage
productRouter.get('/forPage', getProductsforpage)
para hacer pruebas se muestra 3 productos por pagina 
recibe por query el numero de la pagina actual (...?page=2)






    CATEGORIES - ROUTES

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





    USER - CREATE || METHOD: POST || URL: http://localhost:3000/api/auth/signup
Body should be like this: {
    username: ""
    name: ""
    password: ""
    }


http://localhost:3000/api/auth/googlelogin



    USER - LOGIN  METHOD: POST || URL: http://localhost:3000/api/auth/signin
Body should be like this: {
    u"sername: ""
    password: "
    }

    USER - GET ALL: 
     GET || http://localhost:3000/api/users

    USER - FIND BY ID:
     GET || http://localhost:3000/api/users/:id

    USER - DELETE 
     DELETE || http://localhost:3000/api/users/delete/:id

    USER - UPDATE
     PUT || http://localhost:3000/api/users/update/:id   
     (enviar por body el nuevo rol que le quiero dar al usuario  ej:{"role": "admin"})


FILTROS 

    FILTROS UNIDOS CON EL PAGINADO
// GET || http://localhost:3000/api/products/forPage
(especificar si o si por query la pagina que se quiere mostrar y si se quiere aplicar un filtro agregarlo tambien por query, se pueden aplicar todos juntos)





