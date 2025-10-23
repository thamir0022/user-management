import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type Role = 'admin' | 'manager' | 'user';

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users or /users?role=value
  @Get()
  findAll(@Query('role') role?: Role): User[] {
    return this.usersService.findAll(role);
  }

  // GET /users/:id
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): User | null {
    return this.usersService.findOne(id);
  }

  //POST /users
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  // PATCH /users/:id
  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Partial<User> | null {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): User | null {
    return this.usersService.delete(+id);
  }
}
