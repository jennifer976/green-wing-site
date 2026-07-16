const MAX_FIELD_LENGTH = 2000;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function clean(value, maxLength = MAX_FIELD_LENGTH) {
  return String(value || '').trim().slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'joncullum@greenwinguk.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Green Wing Website <onboarding@resend.dev>';

  if (!apiKey) {
    return json(503, {
      message: 'The enquiry form is being connected. Please email joncullum@greenwinguk.com directly for now.',
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { message: 'Invalid request.' });
  }

  if (clean(payload.companyWebsite, 200)) {
    return json(200, { message: 'Thank you. We will be in touch shortly.' });
  }

  const submittedAt = Number(payload.submittedAt || 0);
  if (submittedAt && Date.now() - submittedAt < 2500) {
    return json(400, { message: 'Please take a moment to complete the form before sending.' });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const phone = clean(payload.phone, 80);
  const company = clean(payload.company, 160);
  const estateSize = clean(payload.estateSize, 160);
  const enquiryType = clean(payload.enquiryType, 160);
  const message = clean(payload.message);
  const page = clean(payload.page, 300);

  if (!name || !email || !message) {
    return json(400, { message: 'Please add your name, email and message.' });
  }

  if (!isEmail(email)) {
    return json(400, { message: 'Please add a valid email address.' });
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    estateSize ? `Estate size: ${estateSize}` : null,
    enquiryType ? `Enquiry type: ${enquiryType}` : null,
    page ? `Page: ${page}` : null,
    '',
    'Message:',
    message,
  ].filter((line) => line !== null);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: lines.join('\n'),
    }),
  });

  if (!response.ok) {
    return json(502, {
      message: 'There was a problem sending the enquiry. Please email joncullum@greenwinguk.com directly.',
    });
  }

  return json(200, { message: 'Thank you. We will be in touch shortly.' });
};
