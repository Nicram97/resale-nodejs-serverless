import twilio from 'twilio';

const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // add proper SID
const authToken = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // add proper auth token BUT DO NOT PUSH REAL DATA USE .env FOR THAT!
const client = twilio(accountSid, authToken);

export const SendVerificationCode = async (code: number, toPhoneNumber: string) => {
    const response = await client.messages.create({
        body: `Your verification code is ${code} it will expire in 30 minutes`,
        from: '+1234567890', // add Twilio phone number here
        to: toPhoneNumber.trim(),
    });

    return response;
};