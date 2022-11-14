const User = require("../models/userModel");
const mongoose = require("mongoose");
const me = "6284d203e313af05096598a3";
const bcrypt = require("bcrypt");
const { generateToken } = require("../auth/jwtTokens");
const {
  AuthCallsCredentialListMappingContext,
} = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authCallsMapping/authCallsCredentialListMapping");

//default get user function
exports.defaultGetUser = (req, res) => {
  console.log("func fired, get default user ");
  User.findById(me).then((doc) => {
    console.log("default user is...", doc);
    res.status(200).json({
      _id: doc._id,
      accountType: doc.accountType,
      firstName: doc.firstName,
      lastName: doc.lastName,
      title: doc.title,
      email: doc.email,
      mobile: doc.mobile,
      location: doc.location,
      socials: doc.socials,
      otherWebsites: doc.otherWebsites,
      profilePic: doc.profilePic,
      signupDate: doc.signupDate,
      aboutUser: doc.aboutUser,
      workExperience: doc.workExperience,
      messagesReceived: doc.messagesReceived,
      projects: doc.projects,
      files: {
        cv: doc.files.cv,
        references: doc.files.references,
        qualifications: doc.files.qualifications,
      },
    });
  });
  console.log("default user function fired");

  //return user information without the Password and other sensitive information.
};
//Admin Login
exports.adminLogin = (req, res) => {
  try {
    const email = req.body.loginDetails.email;
    const password = req.body.loginDetails.password;

    User.findOne({ email: email }).then((result) => {
      console.log("result from adminLogin...", result);

      if (result !== null) {
        const dbPassword = result.password;
        bcrypt.compare(password, dbPassword, (err, passMatch) => {
          if (passMatch === true) {
            const userId = result._id;
            const userToken = generateToken(userId); //jwt comes from here
            req.token = userToken; //present

            res.status(200).json({
              auth: true,
              msg: "Welcome",
              token: userToken,
            });
          } else {
            res.status(200).json({
              auth: false,
              user: "",
              msg: "access denied",
            });
          }
        });
      } else {
        res.status(200).json({ msg:"userName or password incorrect" });
      }
    });
  } catch (error) {
    throw error;
  }
};

//--------------------- SendEWhatsapp Msg-------------------
exports.sendWhatsappMsg = (req, res) => {
  const accountSid = process.env.SENDGRID_ACCOUNT_SID;
  const authToken = process.env.SENDGRID_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  console.log(accountSid, authToken, client);

  const { message, author, email, company } = req.body.msgDetails;
  client.messages
    .create({
      body: `
        From: ${author} 
        Company Name: ${company}.
        Message: ${message}
        Contact email: ${email}`,
      from: "whatsapp:+14155238886",
      to: "whatsapp:+491782822679",
    })
    .then((message) => {
      console.log("BE: Msg sent", message);
      User.findOneAndUpdate(
        { _id: me },
        { $push: { messagesReceived: req.body.msgDetails } }
      ).then(console.log("message has been saved to Jeremiah's message list"));
      res.status(200).json({ msg: " your message was successfully sent" });
    })
    .done();
};

// get CV
