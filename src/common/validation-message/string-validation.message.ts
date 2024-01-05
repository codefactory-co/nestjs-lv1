import { ValidationArguments } from "class-validator";

export const stringValidationMessage = (args: ValidationArguments) => {
    return `${args.property}에 String을 입력해주세요!`
}