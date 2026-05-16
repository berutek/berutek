import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  @MaxLength(255)
  email: string;

  // Enforce strong passwords: 12+ chars, mixed case, number, special char.
  // Length matters more than complexity (NIST SP 800-63B), so 12 is the floor.
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  @MaxLength(128)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;
}
