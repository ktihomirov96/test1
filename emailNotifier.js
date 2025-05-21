
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

// Настройка на SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'youremail@gmail.com',
    pass: process.env.MAIL_PASS || 'yourpassword'
  }
});

function checkDeadlinesAndSendEmails() {
  const today = new Date();
  db.all("SELECT * FROM offers", [], (err, rows) => {
    if (err) return console.error("DB error", err);
    rows.forEach(offer => {
      const due = new Date(offer.dueDate);
      const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      if (diff === 3 && offer.email) {
        const mailOptions = {
          from: 'Оферти <no-reply@platform.com>',
          to: offer.email,
          subject: `Оставащ срок за оферта #${offer.project}`,
          text: `Здравейте,

Остават 3 дни до крайния срок на офертата "${offer.description}".
Срок: ${offer.dueDate}

Поздрави,
Екип Технически изделия`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.log('Email error:', error);
          else console.log('Email sent:', info.response);
        });
      }
    });
  });
}
checkDeadlinesAndSendEmails();
