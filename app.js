const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

app.set("view engine", "html");
// app.engine("html", require("ejs").renderFile);
app.use("/assets", express.static("assets"));
// Initializing bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initializing the port
app.listen(3000, () => console.log("Port Init"));

app.get("/", (req, res, next) => {
  res.render("index.ejs");
});

app.post("/", (req, res, next) => {
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Specify what the email will look like
  const mailOpts = {
    from: "Your sender info here", // This is ignored by Gmail
    to: process.env.GMAIL_USER,
    subject: "New message from contact form at hamzashraf.com",
    text: `${req.body.name} (${req.body.email}) says: ${req.body.text}`,
  };

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      console.log(error); // Show a page indicating failure
    } else {
      res.render("index.ejs"); // Show a page indicating success
    }
  });
});
