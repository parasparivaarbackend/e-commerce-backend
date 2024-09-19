import dotenv from "dotenv";
import mailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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

export async function SendMailTemplate(item, template) {
  try {
    let mailtransporter = mailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.Auth_mail,
        pass: process.env.Auth_pass,
      },
    });
    console.log("item inside", item);

    // Recreate __dirname behavior in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, "templates", template.url);
    console.log(templatePath);

    const templatefile = fs.readFileSync(templatePath, "utf-8");

    const html = ejs.render(templatefile, template);

    let malingdetail = {
      from: process.env.Auth_mail,
      to: item?.email,
      subject: item?.Sub,
      html,
    };

    await mailtransporter.sendMail(malingdetail);
    console.log("Mail sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}
