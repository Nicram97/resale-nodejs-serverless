import aws from 'aws-sdk';

export const GenerateVerificationCode = () => {
    const code = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { code, expiry };
}

export const SendVerificationCodeToSNS = async (code: number, toPhoneNumber: string) => {
        // send data to SNS topic to create Order [Transaction MS] => email to user
        const params = {
            Message: JSON.stringify({
                phone: toPhoneNumber,
                code,
            }),
            TopicArn: process.env.NOTIFY_TOPIC,
            MessageAttributes: {
                actionType: {
                    DataType: "String",
                    StringValue: "customer_otp"
                }
            }
        }
        const sns = new aws.SNS();
        const response = await sns.publish(params).promise();
        console.log(response)
};