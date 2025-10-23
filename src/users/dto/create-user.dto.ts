import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'manager', 'user'], {
    message: 'Valid role is required: admin, manager, user',
  })
  role: 'admin' | 'manager' | 'user';
}
