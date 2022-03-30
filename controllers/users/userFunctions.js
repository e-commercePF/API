const User = require("../../models/users/User");
const { transporter } = require('./mailer')

const getUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(users);
        }
    })
}

const getUsersById = (req, res) => {
    const { id } = req.params;
        User.findById(id)
        .then(users =>{
            if(users) {
                return res.json(users)
            } else {
                res.status(404).end()
            }
        })
}

const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(user);
        }
    })
}

// const updateUser = async (req, res) => { 
//     const { id } = req.params;
//     const actualization = req.body;

//     User.findByIdAndUpdate(
//         id, 
//         actualization,
//         {new: true}, // because by default it returns false (prev model, but we want the new model)
//         function async(err, product){
//             if(err) return err;
//             else {
//                 return res.status(200).send(product)
//     }})

// }

const updateUser= async (req,res)=>{
    const { id } = req.params;      // le paso el id para que ubique al usuario
    const updatedRole= req.body.role// le paso por body la propiedad que voy a cambiar
    
    
    // las siguientes dos variables son para sacar datos del usuario antes de cambiarlo y poder explicar en el res.send el rol viejo
    const user = await await User.findById(id) // me guardo el usuario en una variable para saber que tenia antes de hacerle el update
    const role = user.role // me guardo tambien el rol que tenia antes del update
    
    if (updatedRole == undefined) {
        res.send("ingrese un rol por body")
    }else if (updatedRole !== role ) {
        await User.updateOne({_id:id}, { // update one porque solo tiene que cambiar el valor de la propiedad de 1 solo user. 
                                            //si pongo update many cambiaria la propiedad en todos los usuarios
                                            // el _id es el id del usuario y el id es el id que busco del usuario para matchear
        $set: {
            "role": updatedRole
        }
        
    })
    const updatedUser = await User.findById(id)
    res.send("se cambio exitosamente el rol del usuario " + updatedUser.name + " y ahora es " + updatedRole)
    } else {
        res.send("el usuario ya era " + role)
    }
}

const adminVerify = (req, res) => {
    if(req.user.role === 'admin'){
        res.send(true)
    } else {
        res.status(401).send({message: " You don't have permission to do that"})
    }
}

const clientVerify = (req, res) => {
    if(req.user.role === 'client'){
        res.send(true)
    } else {
        res.status(401).send({message: " You don't have permission to do that"})
    }
}

module.exports = {
    getUsers,
    getUsersById,
    deleteUser,
    updateUser,
    adminVerify,
    clientVerify
}



