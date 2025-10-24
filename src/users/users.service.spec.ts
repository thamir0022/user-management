import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users when no role is provided', () => {
      const users = service.findAll();
      expect(users.length).toBeGreaterThan(0);
    });

    it('should filter users by role', () => {
      const role = 'manager';
      const filtered = service.findAll(role);
      expect(filtered.every((user) => user.role === role)).toBe(true);
    });

    it('should throw NotFoundException for invalid role', () => {
      expect(() => service.findAll('invalid' as any)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return user by id', () => {
      const user = service.findOne(1);
      expect(user?.id).toBe(1);
    });

    it('should throw NotFoundException if user not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const dto: CreateUserDto = {
        name: 'New User',
        email: 'new@mail.com',
        role: 'user',
      };
      const created = service.create(dto);
      expect(created).toMatchObject(dto);
      expect(created.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update existing user', () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const updated = service.update(1, dto);
      expect(updated?.name).toBe(dto.name);
    });

    it('should return null if user not found', () => {
      const result = service.update(999, { name: 'No User' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing user', () => {
      const user = service.delete(1);
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
    });

    it('should return null if user not found', () => {
      const result = service.delete(999);
      expect(result).toBeNull();
    });
  });
});
