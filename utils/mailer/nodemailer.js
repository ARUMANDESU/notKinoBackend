const nodemailer = require("nodemailer");
const ejs = require("ejs");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD,
    },
});

class mailer {
    constructor(transporter, sender) {
        this.transporter = transporter;
        this.sender = sender;
    }

    async sendEmail(recipient, subject, html) {
        await this.transporter.sendMail({
            from: this.sender,
            to: recipient,
            subject,
            html,
        });
        return;
    }

    sendActivationMail(recipient, confirm_link, data) {
        const subject = "Welcome to Not Kino";
        ejs.renderFile("./utils/mailer/templates/user_welcome-activation.ejs", {
            username: data.username,
            confirm_link,
        }).then((html) => {
            this.sendEmail(recipient, subject, html);
        });

        return;
    }
}

module.exports = new mailer(transporter, process.env.MAILER_USERNAME);
