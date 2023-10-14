import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

// Replace with your Gmail email and password
const GMAIL_EMAIL = 'your@gmail.com';
const GMAIL_PASSWORD = 'your_password';

let nodeConfig = {
    service: "gmail",
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "your@gmail.com",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // Body of the email
    var email = {
        body: {
            name: username,
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: GMAIL_EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    // Send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us." })
        })
        .catch(error => res.status(500).send({ error }))
}
