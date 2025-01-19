"use strict";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize AWS SES
const ses = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    // Extract email addresses from the event payload
    const senderEmail = event.senderEmail || "default@sender.com";
    const recipientEmail = event.recipientEmail || "default@recipient.com";

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
            Data: `You've received an email forwarded from SES.\n\nOriginal Message ID: ${messageId}\n\n`,
          },
        },
      },
    };
    console.log(params);
    // Send the email via SES
    const sendingResult = await ses.send(new SendEmailCommand(params));
    console.log(sendingResult);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfull sending.", messageId }),
    };
    
  } catch (error) {
    console.error("Error forwarding email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to forward email.", error }),
    };
  }
};
