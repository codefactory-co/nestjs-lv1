import { IsBoolean, IsNumber, IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsNumber()
  chatId: number;
}
