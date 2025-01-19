import * as AWS from "@aws-sdk/client-ses";

// Initialize AWS SES
const ses = new AWS.SES({ region: "REGION" });

export const handler = async (event) => {
  try {
    // Extract email addresses from the event payload
    const senderEmail = event.senderEmail || "default-sender@example.com";
    const recipientEmail = event.recipientEmail || "default-recipient@example.com";

    // Extract SES event details
    const record = event.Records[0].ses;
    const messageId = record.mail.messageId;
    const subject = record.mail.commonHeaders.subject || "No Subject";

    // Define email forwarding parameters
    const params = {
      Source: senderEmail, // Sender address
      Destination: {
        ToAddresses: [recipientEmail], // Recipient address
      },
      Message: {
        Subject: {
          Data: `Fwd: ${subject}`, // Forwarded email subject
        },
        Body: {
          Text: {
            Data: `You've received an email forwarded from SES.\n\nOriginal Message ID: ${messageId}`,
          },
        },
      },
    };

    // Send the email via SES
    await ses.sendEmail(params).promise();

    console.log(`Email forwarded successfully! Message ID: ${messageId}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email forwarded successfully!" }),
    };
  } catch (error) {
    console.error("Error forwarding email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to forward email.", error }),
    };
  }
};
