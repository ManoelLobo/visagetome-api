const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');
const htmlToText = require('html-to-text');
const {
  host, port, user, pass, secure, templatesPath,
} = require('../../config/mail');

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
  secureConnection: secure,
});

module.exports = ({ template, context, ...options }) => {
  let hbsTemplate;
  /* istanbul ignore else */
  if (template) {
    const file = fs.readFileSync(path.join(templatesPath, `${template}.hbs`), 'utf-8');
    hbsTemplate = hbs.compile(file)(context);
  }

  const mailHtml = hbsTemplate || /* istanbul ignore next */ options.html;
  return transport.sendMail({
    ...options,
    html: mailHtml,
    text: htmlToText.fromString(mailHtml).trim(),
  });
};
