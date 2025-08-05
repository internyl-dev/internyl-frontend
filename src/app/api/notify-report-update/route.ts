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
      notes, // Admin notes
      rejectionReason,
      resolvedAt,
      rejectedAt,

      // info report fields
      internship,
      incorrectInfoType,
      correctInfo,

      // bug report fields
      bugTitle,
      bugDescription,
      bugSteps,
      bugSeverity,

      // other report fields
      otherSubject,
      otherDescription,
    } = report;

    const safeReplace = (text?: string) =>
      text ? text.replace(/\n/g, "<br>") : "No details provided";

    // Compose specific HTML section for admins (same as your existing logic)
    let reportSpecificHtml = "";
    if (reportType === "info") {
      reportSpecificHtml = `
        <h3 style="color:#0052cc; border-bottom:1px solid #ccc; padding-bottom:4px;">Incorrect Information Report Details</h3>
        <p><strong>Internship:</strong> ${internship || "N/A"}</p>
        <p><strong>Incorrect Info Type:</strong> ${incorrectInfoType || "N/A"}</p>
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

    // Compose admin email body
    const adminHtmlBody = `
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
          Report Updated
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
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Resolved At:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${resolvedAt ? new Date(resolvedAt).toLocaleString() : "N/A"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Rejected At:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${rejectedAt ? new Date(rejectedAt).toLocaleString() : "N/A"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Admin Notes:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${safeReplace(notes)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Rejection Reason:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${safeReplace(rejectionReason)}</td>
            </tr>
          </tbody>
        </table>

        ${reportSpecificHtml}

        <footer style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
          <p>This is an automated message from Internyl.</p>
        </footer>
      </div>
    `;

    // Compose user notification email body (simple and friendly)
    const userHtmlBody = `
      <div style="
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.5;
        max-width: 600px;
        margin: auto;
        border: 1px solid #ddd;
        padding: 20px;
        background-color: #fff;
      ">
        <h2 style="color: #0052cc; border-bottom: 2px solid #0052cc; padding-bottom: 5px;">
          Your Report Has Been Updated
        </h2>

        <p>Hi,</p>
        <p>Your report (ID: <strong>${id}</strong>) submitted on <strong>${createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}</strong> has been updated by our admin team.</p>

        <p><strong>New Status:</strong> ${status}</p>

        ${
          status === "rejected"
            ? `<p><strong>Rejection Reason:</strong> ${safeReplace(rejectionReason)}</p>`
            : ""
        }

        ${
          notes
            ? `<p><strong>Admin Notes:</strong> ${safeReplace(notes)}</p>`
            : ""
        }

        <p>If you have any questions or need further assistance, feel free to reply to this email.</p>

        <p>Thank you for helping us improve Internyl!</p>

        <footer style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
          <p>This is an automated message from Internyl.</p>
        </footer>
      </div>
    `;

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // Send email to admins
    await transporter.sendMail({
      from: `"Internyl" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.NOTIFY_EMAILS?.split(",") || [],
      subject: `Report Updated: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report #${id}`,
      html: adminHtmlBody,
    });

    // Send email to user
    if (userEmail) {
      await transporter.sendMail({
        from: `"Internyl" <${process.env.ADMIN_EMAIL}>`,
        to: userEmail,
        subject: `Your Report #${id} Status Update`,
        html: userHtmlBody,
      });
    }

    return NextResponse.json({ message: "Update notifications sent." }, { status: 200 });
  } catch (err) {
    console.error("Failed to send update notification emails:", err);
    return NextResponse.json({ message: "Failed to send update notifications." }, { status: 500 });
  }
}
