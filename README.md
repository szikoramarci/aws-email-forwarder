# AWS Email Forwarder

This project is an AWS Lambda function that forwards incoming emails from an S3 bucket to a specified recipient email address. It is designed to handle emails received on a custom domain by utilizing AWS Simple Email Service (SES) for receiving and sending emails. The system ensures that all incoming emails are saved to an S3 bucket, triggering the Lambda function to process and forward the email.

## How It Works

1. **Email Reception**: AWS SES is configured to receive emails for a specified domain and save them to an S3 bucket.
2. **S3 Trigger**: Each time an email is stored in the bucket, it triggers this Lambda function.
3. **Email Forwarding**: The Lambda function retrieves the email content from S3 using the file's ID and forwards it to a pre-configured email address using SES.

## Features

- **Custom Domain Integration**: Handles emails received for a specific domain.
- **S3 Storage**: Archives all incoming emails in an S3 bucket for backup and further processing.
- **Automatic Forwarding**: Forwards emails seamlessly to a specified recipient address.
- **Scalable and Serverless**: Built on AWS Lambda for a cost-efficient and scalable solution.

## Prerequisites

- AWS account with SES and S3 configured.
- Verified domain in SES for receiving emails.
- A verified sender and recipient email address for SES.
