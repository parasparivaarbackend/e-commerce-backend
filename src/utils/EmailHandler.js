import dotenv from "dotenv";
import mailer from "nodemailer";

dotenv.config();

export function SendMail(item) {
  let mailtransporter = mailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.Auth_mail,
      pass: process.env.Auth_pass,
    },
  });

  let malingdetail = {
    from: process.env.Auth_mail,
    to: item?.email,
    subject: item?.Sub,
    text: item?.text,
  };
  mailtransporter.sendMail(malingdetail, function (err, data) {
    if (err) {
      console.log(err.message);
    }
  });
}


export function RecivedMail(item) {
  let mailtransporter = mailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.Auth_mail,
      pass: process.env.Auth_pass,
    },
  });

  let malingdetail = {
    from: process.env.Auth_mail,
    to: "parasjisco@gmail.com",
    subject: item?.sub,
    text: `greateing of the day !  \n  \n ${item.text}\n \n  name : ${item.name} \n E-mail : ${item.email} \n Contect No. : ${item.phone}  `,
  };
  mailtransporter.sendMail(malingdetail, function (err, data) {
    if (err) {
      console.log(err.message);
    }
  });
}

