"use strict";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { simpleParser } from "mailparser";

// Initialize AWS SES
const ses = new SESClient({ region: "us-east-1" });
const s3 = new S3Client();

export const handler = async (event) => {
  try {
    // Extract email addresses from the event payload
    const senderEmail = event.senderEmail || "hello@marcell.solutions";
    const recipientEmail = event.recipientEmail || "simabeats@gmail.com";

    // Extract SES event details
    const record = event.Records[0].ses;
    const messageId = record.mail.messageId;
    const subject = record.mail.commonHeaders.subject || "No Subject";

    const bucketName = "marcell-solutions-emails"; // S3 bucket for emails
    const objectKey = `${messageId}`; // email object key
    const input = { // GetObjectRequest
      Bucket: bucketName, 
      Key: objectKey,
    }
    const command = new GetObjectCommand(input);
    const emailContent = await s3.send(command);
    
    const parsedEmail = await simpleParser(emailContent);
    console.log("Tárgy:", parsedEmail.subject);
    console.log("Szöveges tartalom:", parsedEmail.text);
    console.log("HTML tartalom:", parsedEmail.html);
    console.log("Mellékletek:", parsedEmail.attachments);

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
            Data: emailContent,
          },
        },
      },
    };

    // Send the email via SES
    const sendingResult = await ses.send(new SendEmailCommand(params));

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
