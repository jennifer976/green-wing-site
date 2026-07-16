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

function greenWingEmail({ eyebrow, title, intro, body, ctaUrl, ctaLabel, footer }) {
  return `
    <div style="margin:0;padding:0;background:#f6f8f2;font-family:Arial,sans-serif;color:#1f3317;">
      <div style="max-width:680px;margin:0 auto;padding:28px 18px;">
        <div style="background:#1f3317;border-radius:16px 16px 0 0;padding:24px 28px;color:#ffffff;">
          <p style="margin:0 0 6px;color:#99cc33;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0;font-size:26px;line-height:1.2;">${escapeHtml(title)}</h1>
          <p style="margin:10px 0 0;color:#dfe9d7;font-size:14px;">Energy saving solutions that do not cost the Earth.</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e1e8da;border-top:0;padding:24px 28px;">
          ${intro ? `<p style="margin:0 0 18px;color:#1f3317;font-size:16px;line-height:1.6;">${escapeHtml(intro)}</p>` : ''}
          ${body}
          ${ctaUrl ? `
            <p style="margin:24px 0 0;">
              <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#99cc33;color:#1f3317;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:999px;">${escapeHtml(ctaLabel || 'Open link')}</a>
            </p>` : ''}
        </div>
        <div style="background:#eef4e8;border-radius:0 0 16px 16px;border:1px solid #e1e8da;border-top:0;padding:16px 28px;color:#5c684f;font-size:13px;line-height:1.5;">
          ${footer}
        </div>
      </div>
    </div>`;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'joncullum@greenwinguk.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Green Wing Website <onboarding@resend.dev>';
  const siteUrl = (process.env.SITE_URL || 'https://greenwingenergysolutions.com').replace(/\/$/, '');
  const sampleAssessmentUrl =
    process.env.SAMPLE_ASSESSMENT_REPORT_URL ||
    process.env.SAMPLE_REPORT_URL ||
    `${siteUrl}/assets/docs/example-hotel-a-discovery-assessment-report.pdf`;
  const sampleRoadmapUrl =
    process.env.SAMPLE_ROADMAP_URL ||
    `${siteUrl}/assets/docs/example-hotel-a-discovery-roadmap.pdf`;

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
  const sampleRequested = /sample|report|roadmap/i.test(enquiryType);

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

  const html = greenWingEmail({
    eyebrow: 'Green Wing Energy Solutions',
    title: 'New website enquiry',
    body: `
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
      </div>`,
    footer: `Reply directly to this email to respond to ${escapeHtml(name)}.`,
  });

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

  if (sampleRequested) {
    const sampleText = [
      `Hi ${name},`,
      '',
      'Thank you for requesting the Green Wing example Discovery Assessment Report and Roadmap.',
      '',
      `Discovery Assessment Report: ${sampleAssessmentUrl}`,
      `Discovery Roadmap: ${sampleRoadmapUrl}`,
      '',
      'If you would like to discuss the documents, talk through your site, or book an energy audit, please reply to this email and we will get back to you within two working days.',
      '',
      'Green Wing Energy Solutions',
      'Energy saving solutions that do not cost the Earth.',
    ].join('\n');

    const sampleHtml = greenWingEmail({
      eyebrow: 'Green Wing Energy Solutions',
      title: 'Your example report',
      intro: `Hi ${name}, thank you for requesting the Green Wing example Discovery Assessment Report and Roadmap.`,
      body: `
        <p style="margin:0;color:#1f3317;font-size:16px;line-height:1.6;">You can open the example documents using the links below. They show the kind of practical, ranked output we use to move from site discovery to clear next steps.</p>
        <p style="margin:22px 0 0;">
          <a href="${escapeHtml(sampleAssessmentUrl)}" style="display:inline-block;background:#99cc33;color:#1f3317;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:999px;">Open the Assessment Report</a>
        </p>
        <p style="margin:12px 0 0;">
          <a href="${escapeHtml(sampleRoadmapUrl)}" style="display:inline-block;background:#1f3317;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:999px;">Open the Roadmap</a>
        </p>
        <div style="margin-top:18px;padding:18px;border-left:4px solid #99cc33;background:#f6f8f2;">
          <p style="margin:0;color:#5c684f;font-size:14px;line-height:1.6;">If you would like to discuss the documents, talk through your site, or book an energy audit, please reply to this email and we will get back to you within two working days.</p>
        </div>`,
      footer: `Green Wing Energy Solutions<br>Energy saving solutions that do not cost the Earth.`,
    });

    const sampleResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        reply_to: toEmail,
        subject: 'Your Green Wing example report',
        text: sampleText,
        html: sampleHtml,
      }),
    });

    if (!sampleResponse.ok) {
      return json(502, {
        message: 'We received your enquiry, but there was a problem sending the example report. Please email joncullum@greenwinguk.com directly.',
      });
    }

    return json(200, { message: 'Thank you. The example report has been emailed to you.' });
  }

  return json(200, { message: 'Thank you. We will be in touch shortly.' });
};
