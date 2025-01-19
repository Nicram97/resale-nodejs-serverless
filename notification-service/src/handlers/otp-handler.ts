import { SQSEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { OtpInput } from "../dto/otp.dto";
import { AppValidationError } from "../utils/errors";
import { SendVerificationCode } from "../providers/sms";

export const CustomerOtpHandler = async (event: SQSEvent) => {
    const response: Record<string, unknown>[] = [];

    const promisses = event.Records.map(async (record) => {
        const input = plainToClass(OtpInput, JSON.parse(record.body));

        const errors = await AppValidationError(input);

        console.log('ERRORS: ', JSON.stringify(errors));

        if (!errors) {
            const { phone, code } = input;
            await SendVerificationCode(Number(code), phone.trim());
        }
    });

    await Promise.all(promisses);

    console.log('SQS response: ', response);

    return { response };
}