import { IsString } from "class-validator";

// why string for SNS we will just stringify stuff and when needed can convert
export class OtpInput {
    @IsString()
    phone: string;

    @IsString()
    code: string;
}