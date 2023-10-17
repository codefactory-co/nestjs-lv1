import { ValidationArguments } from "class-validator";

export const lengthValidationMessage = (args: ValidationArguments) => {
    if(args.constraints.length === 2){
        return `${args.property} 값은 ${args.constraints[0]}글자 이상 ${args.constraints[1]}글자 이하로 입력 해주세요!`
    }else{
        return `${args.property} 값은 ${args.constraints[0]}글자 이상 입력해주세요!`
    }
}