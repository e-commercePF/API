const Newsletter = require ("../../models/users/Newsletter");
const User = require("../../models/users/User");
const { transporter } = require('../users/mailer');

// get emails to know who is suscribed
const getEmails =  async (req, res) => {

   const users = await  User.find({newsLetter: true});
   const emails = users.map(user=> {return user.email})
   if (!users) {
       res.status(400).send("No registered users")
   } else {

       res.status(200).send(emails)
   }
}

const getNewsLetter = async (req, res) => {
    const newsLetter = await Newsletter.find({});
    if (!newsLetter) {
        res.status(400).send("No registered users to the NewsLetter")
    } else {
        res.status(200).send(newsLetter)
    }
}
// recives body = { newsLetter: true || false }  && config = { headers: { Authorization: 'Bearer '+ token } }
const suscribe = async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id)
    let prueba = user.newsLetter
    if (prueba !== req.body.newsLetter) {
       User.findByIdAndUpdate(_id, req.body, (err, user)=> {
              if (err) {
                return res.status(400).send({error: "Error updating user"})
              }
               return res.status(200).send({message: "You've suscribed to the newsletter"})
       })
    } else {
        if(prueba){
            res.status(400).send({error: "Already suscribed"})
        } else {
            res.status(400).send({error:"You are not suscribed yet"})
        }
    }
    
}

// recives body = { title: "", content: "" } && config = { headers: { Authorization: 'Bearer '+ token } }
const sendNewsletter = async (req, res) => {
    const { title, content } = req.body;
    User.find({newsLetter: true}, (err, users)=> {
        if(err){
            return res.status(400).send({error: "Error"})
        }
        if(users.length){
            let emails = users.map(user=> {return user.email})
            const newsletter = new Newsletter({
                title,
                content,
                email: emails,
                date: new Date()
            })
            newsletter.save((err, newsletter)=> {
                if(err){
                    return res.status(400).send({error: "Error"})
                }
                console.log("Newsletter save", newsletter)
            }
            )
            const options = {
                from: '"Sports-Market" <sportsmarketnl@gmail.com>', // sender address
                to: emails.join(', ') , // list of receivers
                subject: title, // Subject line
                html: `
                <h1><strong>${title}</strong></h1>
                <h3>${content}</h3>`   
            }
        
            transporter.sendMail(options, function (error,info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message Sent: ' + info.response);
                    return res.status(200).send({message: "Mails sent successfully"})
                }
            });
        } else {
            return res.status(400).send({error: "No registered users"})
        }

        }
    );
    
}


module.exports = {
    getEmails,
    suscribe,
    sendNewsletter,
    getNewsLetter
}