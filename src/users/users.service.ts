import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type Role = 'admin' | 'manager' | 'user';

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

@Injectable()
export class UsersService {
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@mail.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@mail.com', role: 'manager' },
    { id: 3, name: 'Bob Johnson', email: 'bob@mail.com', role: 'user' },
    {
      id: 4,
      name: 'Jorthan Smith',
      email: 'jorthan@mail.com',
      role: 'manager',
    },
    { id: 5, name: 'Steve Jobs', email: 'steve@mail.com', role: 'user' },
  ];

  findAll(role?: Role): User[] {
    if (role && !['admin', 'manager', 'user'].includes(role))
      throw new NotFoundException(`Role ${role} is not valid!`);
    if (role) return this.users.filter((user) => user.role === role);
    return this.users;
  }

  findOne(id: number): User | null {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found!`);

    return user;
  }

  create(createUserDto: CreateUserDto): User {
    this.users.push({ id: this.users.length + 1, ...createUserDto });
    return this.users[this.users.length - 1];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updateUserDto };
    return this.users[index];
  }

  delete(id: number): User | null {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    const deletedUser = this.users.splice(index, 1);
    return deletedUser[0];
  }
}
