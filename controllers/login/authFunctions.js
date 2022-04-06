const bcrypt = require('bcrypt');
const _ = require('lodash')
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken')
const User = require('../../models/users/User')
const { SECRET_KEY, AUTH_GOOGLE_CLIENT, CLIENT_URL ,RESET_PASSWORD_KEY } = process.env;
const { transporter } = require('../users/mailer')


// Google Login requirements
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(AUTH_GOOGLE_CLIENT)
 // Middleware that ckeck a token and returns type of access token has.




exports.authenticateJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    console.log(authHeader);


    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token);
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
    
    const { name, email, password, role, newsLetter} = req.body; // now username should be his email and name his username or sth like this
    
    console.log(req.body);
    const  ExpRegEmail =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		
	if(email.match(ExpRegEmail)==null){
		return res.status(400).send({error:'Please, enter a valid email'})
	}
    if(!name || !email || !password){
        console.log({error: "Ops! It seems there are empty fields"});
        return res.status(400).send({error: "Ops! It seems there are empty fields"})
    }
    
    /*the body should came from the form of create user, where the form should 
    check all fields to be filled*/ 
    User.findOne({"email": email}).exec(async (err, user) => {
        console.log(err,user)
        if(user){
            return res.status(400).send({error: "User with this email already exists."})
        }

        const token = jwt.sign({name, email, password, newsLetter}, SECRET_KEY);

        const options = {
                from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                to: email , // list of receivers
                subject: "Account Activation Link", // Subject line
                html: `<h2>Please click on given link to activate your account :</h2>
                <p>http://localhost:4000/api/auth/email-activate/${token}</p>`
            }
            transporter.sendMail(options, function (error,info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message Sent: ' + info.response);
                }
            });  
            res.json({
                        message: "Email has been sent, kindly activate your account!" })
   })
}

exports.activateAccount = async (req, res) => {
    const {token} = req.params;
    

    if (token) {
        jwt.verify(token, SECRET_KEY, function (err, decodedToken) {
            if (err) {
                return res.status(400).json({ error: "Incorrect or expired link"})
            }
            const {name, email, password, role, newsLetter} = decodedToken;
            User.findOne({"email": email}).exec(async (err, user) => {
                console.log(err,user)
                if(user){
                    return res.status(400).json({error: "User with this email already exists."})
                }
                
         let passwordHash = await bcrypt.hash(password, 10)

         let newUser = new User({name, email, passwordHash, role, newsLetter});
         newUser.save((err, success)=>{
             console.log(success)
            if(err){
                console.log("Error in signup while account activation: ", err);
                return res.status(401).json({ Error: "error activating error"})
             } console.log(success.newsLetter)
             if(success.newsLetter === true){
                const options = {
                    from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                    to: success.email , // list of receivers
                    subject: "Newsletter", // Subject line
                    html: `<h2>Newsletter</h2>`
                }
                transporter.sendMail(options, function (error,info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message Sent: ' + info.response);
                    }
                });

             }
             
             res.json({
                 message: "Signup successfull!"
             })
         })
        })
         })
    } else {
        return res.json({error: "error"})
    }

}

exports.forgotPassword = (req, res) => {
    const {email} = req.body

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({error: "User with this email does not exist"})
        }

        const token = jwt.sign({_id: user._id}, RESET_PASSWORD_KEY);

        const options = {
                from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                to: email , // list of receivers
                subject: "Account Activation Link", // Subject line
                html: `<h2>Please click on given link to reset your password :</h2>
                <p>http://localhost:4000/resetpassword/${token}</p>`
        }

        return user.updateOne({resetLink: token}, function(err, success) {
            if (err) {
                return res.status(400).json({error: "reset password link error"})
            } else {
                transporter.sendMail(options, function (error,info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message Sent: ' + info.response);
                    }
                });  
                res.json({
                    message: "Email has been sent, follow the instructions" })
            }
        })


    })
}

exports.resetPassword = (req, res) => {
    const {resetLink, newPass} = req.body

    if (resetLink) {
        jwt.verify(resetLink, RESET_PASSWORD_KEY, function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect or expired token"
                })
            }
            User.findOne({resetLink}, async (err, user) => {
                if(err || !user) {
                    return res.status(400).json({error: "User with this token does not exist."})
                }
                let passwordHashed = await bcrypt.hash(newPass, 10)
                const obj = {
                    passwordHash: passwordHashed,
                    resetLink: ''
                }

                user = _.extend(user, obj)
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({error: "reset password error"})
                    }else {  
                        return res.status(200).json({message: "Your password has been changed" })
                    }
                })
            })
        })
    } else {
        return res.status(401).json({error: "Authentication error"})
        
    }
}

exports.forceResetPassword = (req, res) => {
    const { _id } = req.body;
    const { role } = req.user;
    if (role === 'admin') {
        const newPass = uniqid.process();
        console.log(newPass)
        const passwordHashed = bcrypt.hashSync(newPass, 10);
        console.log(passwordHashed)
        User.findByIdAndUpdate(_id, {passwordHash: passwordHashed}, {new: true},(err, user) => {
            if(err){
                return res.status(400).json({error: "error"})
            }
            else {
                console.log(user)
                const options = {
                    from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                    to: user.email , // list of receivers
                    subject: "Force Reset Password", // Subject line
                    html: `<h2>Your Password has been changed by an admin.</h2>
                    <p>Your new password is ${newPass}</p>`
                }
                transporter.sendMail(options, function (error,info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message Sent: ' + info.response);
                    }
                return res.status(200).json({message: "Your password has been changed", data: newPass, user})
            });

    }}) 
    } else {
        return res.status(401).json({error: "Authentication error"})
    }
}
    


// Log a User with credentials || NOT GOOGLE LOGIN!

exports.signin = async (req, res) => {
    
    const { body } = req;
    const { email, password } = body;
    const  ExpRegEmail =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		 if( !email || !password){
			 return res.status(400).send({error: "Please enter a valid email and password"});
		 } if(email.match(ExpRegEmail)==null){
			 return res.status(400).send({error: "Email is not valid"})
		 }
    const user = await User.findOne({ email });
    const passwordCheck = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if(!(user && passwordCheck)) { // if user and passwordCheck were true it wouldn't go into if.
        return res.status(400).json({
            error: 'Invalid user or password'
        })
    }
    const userToken = jwt.sign({
        _id: user._id,
        role: user.role,
        email: user.email
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
                                role: user.role,
                                email: user.email
                            }, SECRET_KEY, {expiresIn: "7d"})
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
                                    _id: data._id,
                                    role: data.role,
                                    email: data.email
                                }, SECRET_KEY, {expiresIn: "7d"})
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


exports.newsletter = async (req, res) => {
    const { title, body, email} = req.body

    if (!title || !body) {
        return res.status(400).send({error: "Ops! It seems there are empty fields"})
    }

    const options = {
        from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
        to: email , // list of receivers
        subject: title, // Subject line
        html: body   
    }

transporter.sendMail(options, function (error,info){
        if (error) {
            console.log(error);
        } else {
            console.log('Message Sent: ' + info.response);
            res.status(200).send({message: "Newsletter"})
        }
    });

}