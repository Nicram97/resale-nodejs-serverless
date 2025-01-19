import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

const createSendEmailCommand = (toAddress: string, fromAddress: string, message: string) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: message,
          },
          Text: {
            Charset: "UTF-8",
            Data: message,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Test subject",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

export const SendEmailUsingSES = async (to: string, message: string) => {
    const sesClient = new SESClient({ region: 'eu-west-1' });
    // normaly there is from and to but i'm sending to myself :D
    const sendEmailCommand = createSendEmailCommand(
        to,
        to,
        message
      );
    
      try {
        return await sesClient.send(sendEmailCommand);
      } catch(e) {
        console.log(e);
        throw e;
      } 
}

//  USAGE OF SENDGRID!
// import sendgrid from '@sendgrid/mail';

// const SENDGRID_API_KEY = 'SG.Xxxxxxxxxxxxxxx';

// // this is "Authenticated Sender Email Id, can be configured in sengrid settings section"
// const FROM_EMAIL = 'support@resale-nodejs-serverless.com';
// const TEMP_ORDER_CONFIRMATION = '';

// sendgrid.setApiKey(SENDGRID_API_KEY);

// export interface EmailTemplate {
//     to: string;
//     from: string;
//     templateId: string;
//     dynamic_template_data: Record<string, unknown>;
// }

// export const ORDER_CONFIRMATION = (
//     email: string,
//     firstName: string,
//     orderNumber: string,
// ): EmailTemplate => {

//     return {
//         from: FROM_EMAIL,
//         to: email,
//         dynamic_template_data: {
//             name: firstName,
//             orderNumber: orderNumber,
//         },
//         templateId: TEMP_ORDER_CONFIRMATION,
//     };
// }

// export const SendEmail = async (template: EmailTemplate) => {
//     try {
//         await sendgrid.send(template);

//         return true
//     } catch(e) {
//         console.log(e);
//         return false;
//     }
// }