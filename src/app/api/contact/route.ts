import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, subject, message } = body;

    // Resolve subject parameter
    const selectedSubject = projectType || subject || "General Inquiry";

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // SMTP configuration
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const toEmail = process.env.SMTP_TO || "ishmaelharrydeckor@gmail.com";

    // Email options
    const fromEmail = user || "noreply@samueladanuvo.com";
    const mailOptions = {
      from: `"${name}" <${fromEmail}>`,
      replyTo: email,
      to: toEmail,
      subject: `New Inquiry: ${selectedSubject} from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${selectedSubject}

Message:
${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #111111; border-bottom: 2px solid #D4A527; padding-bottom: 10px; margin-top: 0;">New Inquiry</h2>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #D4A527; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Subject:</strong> ${selectedSubject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D4A527; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap;"><strong>Message:</strong><br/><br/>${message}</p>
          </div>
        </div>
      `,
    };

    if (!host || !user || !pass) {
      console.warn("SMTP environment variables are not fully configured. Logging email to terminal.");
      console.log("----- DEV MODE EMAIL LOG -----");
      console.log(mailOptions.text);
      console.log("------------------------------");
      return NextResponse.json({ success: true, devMode: true });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    // Send mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to dispatch email." },
      { status: 500 }
    );
  }
}
