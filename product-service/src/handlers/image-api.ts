import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuid } from "uuid";

const s3Client = new S3Client();

export const imageUploader = async (
    event: APIGatewayEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {
    // grab filename from queryString
    const file = event.queryStringParameters?.file;
    // give unique name of that file
    const fileName = `${uuid()}__${file}`;

    // create S3Params
    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        ContentType: 'image/jpeg',
    }
    // get signed URL
    const command = new PutObjectCommand(s3Params);

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('upload url:', s3Params, url);
    // give it back to client for uploade image

    return {
        statusCode: 200,
        body: JSON.stringify({
            url,
            key: fileName,
        }),
    };
};