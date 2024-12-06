import { Max, Min } from "class-validator";

export class VerificationInput {
    @Min(100000)
    @Max(999999)
    code: number;
}