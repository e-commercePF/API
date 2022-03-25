const User = require("../../models/users/User");

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

module.exports = {
    getUsers,
    getUsersById,
    deleteUser

}