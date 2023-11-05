import nodemailar from "nodemailer";

const sendMail = async (email,subject,url) => {
  try {
    const transporter = nodemailar.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.AuthEmail,
        pass: process.env.AuthPassword,
      },
    });

    transporter.verify((err, success) => {
      err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
    });
     console.log(url,"fsdfsfdsfsffg");
    const mailOptions = {
      from: process.env.AuthEmail,
      to: email,
      subject:subject,
      text:url
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error) {}
};

export default sendMail;
