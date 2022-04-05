const Newsletter = require ("../../models/users/Newsletter");
const User = require("../../models/users/User");

const getEmails =  async (req, res) => {

   const users = await  User.find({newsLetter: true});

   if (!users) {
       res.status(400).send("No registered users")
   } else {
       res.status(200).send(users)
   }
}


const suscribe = async (req, res) => {

    const {news, id} = req.query;
    const user = await User.findById(id)
    let prueba = user.newsLetter
    if (prueba == false && news) {
       await User.updateOne({
            _id: id,
        }, {
            $set: {newsLetter: true}
        })
        res.send("Newsletter ok")
    } else {
        res.send("Already suscribed")
    }
    
}


module.exports = {
    getEmails,
    suscribe
}