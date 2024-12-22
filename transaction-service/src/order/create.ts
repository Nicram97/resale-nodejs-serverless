import { SQSEvent } from 'aws-lambda';

export const handler = async (evet: SQSEvent) => {
    console.log('SNS Topic Listener through SQS');
    console.log(evet);

    return {
        statusCode: 200,
        body: JSON.stringify('Listening to Queue'),
    };
};