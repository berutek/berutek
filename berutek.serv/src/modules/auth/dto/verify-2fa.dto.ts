import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

export class Verify2faDto {
  @IsString()
  challengeToken: string;

  // TOTP codes are 6 digits, recovery codes are XXXX-XXXX-XXXX (14 chars)
  @IsString()
  @Length(6, 14)
  code: string;

  @IsOptional()
  @IsBoolean()
  isRecoveryCode?: boolean;
}
