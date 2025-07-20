import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const report = await req.json();

    const {
      id,
      userId,
      userEmail,
      reportType,
      reportDetails,
      createdAt,
      status,
      // For info reports
      internship,
      incorrectInfoType,
      correctInfo,
      comments,
      // For bug reports
      bugTitle,
      bugDescription,
      bugSteps,
      bugSeverity,
      // For other reports
      otherSubject,
      otherDescription,
    } = report;

    const safeReplace = (text?: string) =>
      text ? text.replace(/\n/g, "<br>") : "No details provided";

    let reportSpecificHtml = "";

    if (reportType === "info") {
      reportSpecificHtml = `
        <h3 style="color:#0052cc; border-bottom:1px solid #ccc; padding-bottom:4px;">Incorrect Information Report Details</h3>
        <p><strong>Internship:</strong> ${internship || "N/A"}</p>
        <p><strong>Incorrect Info Type:</strong> ${incorrectInfoType || "N/A"}</p>
        <p><strong>Current Info on Card:</strong> ${safeReplace(comments)}</p>
        <p><strong>Correct Info:</strong> ${safeReplace(correctInfo)}</p>
        <p><strong>Additional Comments:</strong> ${safeReplace(reportDetails)}</p>
      `;
    } else if (reportType === "bug") {
      reportSpecificHtml = `
        <h3 style="color:#0052cc; border-bottom:1px solid #ccc; padding-bottom:4px;">Bug Report Details</h3>
        <p><strong>Bug Title:</strong> ${bugTitle || "N/A"}</p>
        <p><strong>Description:</strong> ${safeReplace(bugDescription)}</p>
        <p><strong>Steps to Reproduce:</strong> ${safeReplace(bugSteps)}</p>
        <p><strong>Severity:</strong> ${bugSeverity || "N/A"}</p>
      `;
    } else if (reportType === "other") {
      reportSpecificHtml = `
        <h3 style="color:#0052cc; border-bottom:1px solid #ccc; padding-bottom:4px;">Other Report Details</h3>
        <p><strong>Subject:</strong> ${otherSubject || "N/A"}</p>
        <p><strong>Description:</strong> ${safeReplace(otherDescription)}</p>
      `;
    }

    const htmlBody = `
      <div style="
        font-family: Arial, sans-serif; 
        color: #333; 
        line-height: 1.6; 
        max-width: 600px; 
        margin: auto; 
        border: 1px solid #ddd; 
        padding: 20px; 
        background-color: #fafafa;
      ">
        <h2 style="color: #0052cc; border-bottom: 2px solid #0052cc; padding-bottom: 5px;">
          New Report Submitted
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Report ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">User ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${userId || "N/A"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">User Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${userEmail || "N/A"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Report Type:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reportType}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Status:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${status}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Created At:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                ${createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        ${reportSpecificHtml}

        <footer style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
          <p>This is an automated message from Internyl.</p>
        </footer>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Your App Name" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.NOTIFY_EMAILS?.split(",") || [],
      subject: `New Report Submitted: ${reportType}`,
      html: htmlBody,
    });

    return NextResponse.json({ message: "Email sent to admins." }, { status: 200 });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ message: "Failed to send email." }, { status: 500 });
  }
}
