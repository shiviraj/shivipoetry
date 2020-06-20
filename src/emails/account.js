const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

sgMail.setApiKey(
  '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 '
);

sgMail.send({
  to: 'raj.shiviraj@gmail.com',
  from: 'indianjets@gmail.com',
  subject: '$hivipoetry, Account Verification',
  html: `<strong>Welcome to the $hivipoetry.</strong><br />
        Please verify your account.<br / >
        
        Thanks for joining!!!<br /><br /><b>$hivipoetry</b>`,
});

const sendVerificationMail = async (email, name, username) => {
  const verificationLink = bcrypt.hash(`p${email}soiy${name}hevr${email}ti`, 8);
  await sgMail.send({
    to: email,
    from: 'indianjets@gmail.com',
    subject: '$hivipoetry, Account Verification',
    text: '',
    html: `<strong>Welcome to the $hivipoetry.</strong><br />
          Please verify your account.<br / >
          <a
          href="https://shivipoetry.herokuapp.com/poet/verifyAccount/${username}/${verificationLink}"
          target="_blank">Verify Now</a>
          Thanks for joining!!!<br /><br /><b>$hivipoetry</b>`,
  });
};

module.exports = { sendVerificationMail };
