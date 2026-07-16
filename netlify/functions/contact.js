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

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fieldRow(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 0;color:#5c684f;font-size:13px;width:140px;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#1f3317;font-size:15px;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
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
    'Green Wing Energy Solutions',
    'New website enquiry',
    '',
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
    '',
    'Reply directly to this email to respond to the enquirer.',
  ].filter((line) => line !== null);

  const html = `
    <div style="margin:0;padding:0;background:#f6f8f2;font-family:Arial,sans-serif;color:#1f3317;">
      <div style="max-width:680px;margin:0 auto;padding:28px 18px;">
        <div style="background:#1f3317;border-radius:16px 16px 0 0;padding:24px 28px;color:#ffffff;">
          <p style="margin:0 0 6px;color:#99cc33;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Green Wing Energy Solutions</p>
          <h1 style="margin:0;font-size:26px;line-height:1.2;">New website enquiry</h1>
          <p style="margin:10px 0 0;color:#dfe9d7;font-size:14px;">Energy saving solutions that do not cost the Earth.</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e1e8da;border-top:0;padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;">
            ${fieldRow('Name', name)}
            ${fieldRow('Email', email)}
            ${fieldRow('Phone', phone)}
            ${fieldRow('Company', company)}
            ${fieldRow('Estate size', estateSize)}
            ${fieldRow('Enquiry type', enquiryType)}
            ${fieldRow('Page', page)}
          </table>
          <div style="margin-top:18px;padding:18px;border-left:4px solid #99cc33;background:#f6f8f2;">
            <p style="margin:0 0 8px;color:#5c684f;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
            <p style="margin:0;color:#1f3317;font-size:16px;line-height:1.6;white-space:pre-line;">${escapeHtml(message)}</p>
          </div>
        </div>
        <div style="background:#eef4e8;border-radius:0 0 16px 16px;border:1px solid #e1e8da;border-top:0;padding:16px 28px;color:#5c684f;font-size:13px;">
          Reply directly to this email to respond to ${escapeHtml(name)}.
        </div>
      </div>
    </div>`;

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
      subject: `Green Wing website enquiry: ${enquiryType || name}`,
      text: lines.join('\n'),
      html,
    }),
  });

  if (!response.ok) {
    return json(502, {
      message: 'There was a problem sending the enquiry. Please email joncullum@greenwinguk.com directly.',
    });
  }

  return json(200, { message: 'Thank you. We will be in touch shortly.' });
};
