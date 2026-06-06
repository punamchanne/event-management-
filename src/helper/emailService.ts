import nodemailer from "nodemailer";

const getTransporter = () => {
  const email = process.env.SMTP_EMAIL?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  
  if (!email || !pass) {
    console.warn("SMTP_EMAIL or SMTP_PASSWORD is not configured in environment variables.");
  }
  
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: pass,
    },
  });
};

export async function sendProgramReminderEmail({
  to,
  studentName,
  programTitle,
  eventTitle,
  collegeName,
  venueName,
  blockName,
  startTime,
}: {
  to: string;
  studentName: string;
  programTitle: string;
  eventTitle: string;
  collegeName: string;
  venueName: string;
  blockName: string;
  startTime: string | Date;
}) {
  try {
    const transporter = getTransporter();
    const dateStr = new Date(startTime).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const mailOptions = {
      from: `"Opportune Events" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `⏰ Reminder: ${programTitle} starts tomorrow!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">Upcoming Program Reminder</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Opportune Student Festival Management</p>
          </div>
          <div style="padding: 30px; color: #1e293b;">
            <p style="font-size: 16px; margin-top: 0;">Hello <strong>${studentName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              This is a friendly reminder that the program you registered for is scheduled to start tomorrow. Please review the event details below to prepare:
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0; space-y: 12px;">
              <div style="margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; tracking-wide: 1px;">Program Name</span>
                <strong style="font-size: 16px; color: #4f46e5;">${programTitle}</strong>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; tracking-wide: 1px;">Festival / Event</span>
                <span style="font-size: 14px; font-weight: 600; color: #0f172a;">${eventTitle}</span>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; tracking-wide: 1px;">Host College</span>
                <span style="font-size: 14px; font-weight: 600; color: #0f172a;">${collegeName}</span>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; tracking-wide: 1px;">Start Time</span>
                <span style="font-size: 14px; font-weight: 600; color: #e11d48;">${dateStr}</span>
              </div>
              <div>
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; tracking-wide: 1px;">Venue Location</span>
                <strong style="font-size: 14px; color: #0f172a;">${venueName}</strong>
                <span style="font-size: 12px; color: #64748b; display: block;">${blockName}</span>
              </div>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              You can view your entry ticket pass and access coordinates directly on the student portal.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.BASE_URL}/student/dashboard" style="background-color: #4f46e5; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                Open Student Dashboard
              </a>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
            This is an automated reminder email from Opportune Student Portal. Please do not reply to this message.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Failed to send reminder email to ${to}:`, err);
    return { success: false, error: err };
  }
}

export async function sendCertificateAvailableEmail({
  to,
  studentName,
  programTitle,
  eventTitle,
  collegeName,
  certificateLink,
}: {
  to: string;
  studentName: string;
  programTitle: string;
  eventTitle: string;
  collegeName: string;
  certificateLink: string;
}) {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Opportune Events" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `🎓 Congratulations! Your Certificate for ${programTitle} is ready`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">Congratulations on Completion!</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Opportune Participation Certificate</p>
          </div>
          <div style="padding: 30px; color: #1e293b;">
            <p style="font-size: 16px; margin-top: 0;">Dear <strong>${studentName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Congratulations on completing the program <strong>${programTitle}</strong> organized under the festival <strong>${eventTitle}</strong> at <strong>${collegeName}</strong>. 
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Your official Certificate of Participation has been generated and is now available to claim and download from your student dashboard.
            </p>
            
            <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
              <span style="font-size: 12px; font-weight: 700; color: #b45309; display: block; margin-bottom: 6px; uppercase tracking-wider;">STATUS VERIFIED</span>
              <strong style="font-size: 18px; color: #78350f; font-family: serif; italic;">Certificate of Participation</strong>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${certificateLink}" target="_blank" style="background-color: #d97706; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.2);">
                View & Print Certificate
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; margin-top: 24px; line-height: 1.5;">
              If the button above does not work, copy and paste this link in your browser:<br/>
              <a href="${certificateLink}" style="color: #d97706; text-decoration: underline; word-break: break-all;">${certificateLink}</a>
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
            This is an automated certificate notification email from Opportune Student Portal.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Certificate notification email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Failed to send certificate email to ${to}:`, err);
    return { success: false, error: err };
  }
}
