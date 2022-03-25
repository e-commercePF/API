const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../../models/users/User')
const { SECRET_KEY, AUTH_GOOGLE_CLIENT } = process.env;


// Google Login requirements
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(AUTH_GOOGLE_CLIENT)
 // Middleware that ckeck a token and returns type of access token has.




exports.authenticateJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    console.log(authHeader);


    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).send({message: 'Error verifying token', pos: 'Middleware'});
            }
            console.log(user)
            req.user = user; //store user in req.user to use next
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// Register a new User with credentials || NOT GOOGLE REGISTER!

exports.signup = async ( req, res) => {
    
    const { name, email, password, role} = req.body; // now username should be his email and name his username or sth like this
    console.log(req.body);
    if(!name || !email || !password){
        console.log({error: "Ops! It seems there are empty fields"});
        return res.status(400).json({error: "Ops! It seems there are empty fields"})
    }
    /*the body should came from the form of create user, where the form should 
    check all fields to be filled*/ 
    User.findOne({"email": email}).exec(async (err, user) => {
        console.log(err,user)
        if(user){
            return res.status(400).json({error: "User with this email already exists."})
        }
        let passwordHash = await bcrypt.hash(password, 10)
        let newUser = new User({name, email, passwordHash, role});
        newUser.save((err, success)=>{
            console.log(success)
            if(err){
                console.log("Error in signp: ", err);
                return res.status(401).json({error: err})
            }
            res.json({
                message: "Signup success!"
            })
        })
    })
}

// Log a User with credentials || NOT GOOGLE LOGIN!

exports.signin = async (req, res) => {
    
    const { body } = req;
    const { email, password } = body;
    const user = await User.findOne({ email });
    const passwordCheck = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if(!(user && passwordCheck)) { // if user and passwordCheck were true it wouldn't go into if.
        return res.status(200).json({
            error: 'Invalid user or password'
        })
    }

    const userToken = jwt.sign({
        _id: user._id,
        role: user.role
    }, SECRET_KEY) // and third parameter could be { expiresIn: '1h' }

    return res.send({
        tokenId: userToken
    })  //this parses into jwt 
}


exports.googlelogin = (req, res) => {
    const { tokenId } = req.body;
    console.log(tokenId);
    client.verifyIdToken({ idToken: tokenId, audience: AUTH_GOOGLE_CLIENT}).then(response=> {
        console.log(response.payload)    
        const { email_verified, name, email } = response.payload;
            if(email_verified){
                User.findOne({email}).exec(async (err,user)=>{
                    /*-------------START-------------*/
                    if(err){
                        return res.status(400).send({
                            error: "Something went wrong"
                        })
                    } else {
                        if(user){
                            const token = jwt.sign({
                                _id: user._id,
                                role: user.role
                            }, SECRET_KEY, {expiresIn: "7d"})
                            const {_id, name, email} = user;
                            console.log('Login as Google User without creating again ! ')
                            res.json({
                                tokenId: token
                            })
                        } else {
                            let password = email + SECRET_KEY;
                            let passwordHash = await bcrypt.hash(password, 10)
                            let newUser = new User({name , email, passwordHash});
                            newUser.save((err, data)=>{
                                 if(err){
                                    return res.status(400).send({
                                        error: "Something went wrong"
                                    })
                                 }
                                const googleToken = jwt.sign({
                                    _id: user._id,
                                    role: user.role
                                }, SECRET_KEY, {expiresIn: "7d"})
                                const {_id, name, email, role} = newUser;
                                 console.log('Created Google User ')
                                res.send({
                                    tokenId: googleToken
                                })

                            })
                        }
                    }
                }) /*-------------END-------------*/
            }
        })
    
}
