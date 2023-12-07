import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import { sendVerificationEmail } from '../controllers/mailer.js';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existence
    let exist = await UserModel.findOne({ username });

    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
 "username" : "example123",
"password" : "admin123",
"email": "example@gmail.com",
"firstName" : "bill",
"lastName": "william",
"mobile": 8009860560,
"address" : "Apt. 556, Kulas Light, Gwenborough",
"profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Check for existing users
    const existUsername = await UserModel.findOne({ username });
    const existEmail = await UserModel.findOne({ email });

    if (existUsername) {
      return res.status(400).send({ error: "Please use a unique username" });
    }

    if (existEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
    }

    // Save the user to the database
    const user = new UserModel({
      username,
      password: await bcrypt.hash(password, 10),
      profile: profile || '',
      email,
      isVerified: false, // Mark user as unverified initially
    });

    const result = await user.save();

    // Send verification email
    await sendVerificationEmail(email, result._id);

    // Send response to the frontend, indicating successful registration
    res.status(201).send({
      msg: "User Registered. Please check your email for verification.",
      userId: result._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** GET: http://localhost:8080/api/verifyEmail/:userId */
export async function verifyEmail(req, res) {
    const { userId } = req.params;
  
    try {
      // Find the user by userId
      const user = await UserModel.findById(userId);
  
      // Check if user exists
      if (!user) {
        return res.status(400).send({ error: "User not found" });
      }
  
      // Mark user as verified
      await UserModel.findByIdAndUpdate(userId, { isVerified: true });
  
      // Respond with a redirect URL to the login page
      const redirectUrl = '/login'; // Adjust the URL based on your frontend routes
  
      // Redirect the user to the login page
      res.redirect(redirectUrl);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
/** POST: http://localhost:8080/api/login 
 * @param: {
 "username" : "example123",
"password" : "admin123"
}
*/
export async function login(req, res) {

  const { username, password } = req.body;

  try {

    UserModel.findOne({ username })
      .then(user => {
        bcrypt.compare(password, user.password)
          .then(passwordCheck => {

            if (!passwordCheck) return res.status(400).send({ error: "Password does not match" });

            // create jwt token
            const token = jwt.sign({
              userId: user._id,
              username: user.username
            }, ENV.JWT_SECRET, { expiresIn: "24h" });

            console.log(token);

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              userId: user._id,
              token
            });

          })
          .catch(error => {
            return res.status(400).send({ error: "Password does not Match" })
          });
      })
      .catch(error => {
        return res.status(404).send({ error: "Username not Found" });
      });

  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
// Assuming you have a User model defined as UserModel

export async function getUser(req,res){
    
  const { username } = req.params;

  try {
      
      if(!username) return res.status(501).send({ error: "Invalid Username"});

      UserModel.findOne({ username }, function(err, user){
          if(err) return res.status(500).send({ err });
          if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

          /** remove password from user */
          // mongoose return unnecessary data with object so convert it into json
          const { password, ...rest } = Object.assign({}, user.toJSON());

          return res.status(201).send(rest);
      })

  } catch (error) {
      return res.status(404).send({ error : "Cannot Find User Data"});
  }

}

export async function getUserInfo(req, res) {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(400).json({ error: "Invalid Username" });
    }

    UserModel.findOne({ username }, { password: 0 }) // Exclude the password field
      .exec((err, user) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const { _id, username, email, mobile /* Add other fields as needed */ } = user;

        return res.status(200).json({
          _id,
          username,
          email,
          mobile
          // Add other fields as needed
        });
      });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
 "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {

    // const id = req.query.id;
    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      // update the data
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;

        return res.status(201).send({ msg: "Record Updated...!" });
      })

    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }

  } catch (error) {
    return res.status(401).send({ error });
  }
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession })
  }
  return res.status(440).send({ error: "Session expired!" })
}

// update the password when we have a valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {

    if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;

    try {

      UserModel.findOne({ username })
        .then(user => {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              UserModel.updateOne({ username: user.username },
                { password: hashedPassword }, function (err, data) {
                  if (err) throw err;
                  req.app.locals.resetSession = false; // reset session
                  return res.status(201).send({ msg: "Record Updated...!" })
                });
            })
            .catch(e => {
              return res.status(500).send({
                error: "Enable to hash password"
              })
            });
        })
        .catch(error => {
          return res.status(404).send({ error: "Username not Found" });
        })

    } catch (error) {
      return res.status(500).send({ error })
    }

  } catch (error) {
    return res.status(401).send({ error })
  }
}
