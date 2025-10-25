import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', () => {
      const users = [
        { id: 1, name: 'John', email: 'john@mail.com', role: 'admin' },
      ];
      mockUsersService.findAll.mockReturnValue(users);

      expect(controller.findAll()).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered users by role', () => {
      const users = [
        { id: 2, name: 'Jane', email: 'jane@mail.com', role: 'manager' },
      ];
      mockUsersService.findAll.mockReturnValue(users);

      expect(controller.findAll('manager')).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalledWith('manager');
    });
  });

  describe('findOne', () => {
    it('should return a single user', () => {
      const user = {
        id: 1,
        name: 'John',
        email: 'john@mail.com',
        role: 'admin',
      };
      mockUsersService.findOne.mockReturnValue(user);

      expect(controller.findOne(1)).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for invalid user', () => {
      mockUsersService.findOne.mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      expect(() => controller.findOne(999)).toThrow(NotFoundException);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a user', () => {
      const dto: CreateUserDto = {
        name: 'Alice',
        email: 'alice@mail.com',
        role: 'user',
      };
      const created = { id: 6, ...dto };
      mockUsersService.create.mockReturnValue(created);

      expect(controller.create(dto)).toEqual(created);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const updateDto = { name: 'Alice Smith' };
      const updated = {
        id: 6,
        name: 'Alice Smith',
        email: 'alice@mail.com',
        role: 'user',
      };
      mockUsersService.update.mockReturnValue(updated);

      expect(controller.update(6, updateDto)).toEqual(updated);
      expect(mockUsersService.update).toHaveBeenCalledWith(6, updateDto);
    });

    it('should return null if user not found', () => {
      const updateDto = { name: 'Bob' };
      mockUsersService.update.mockReturnValue(null);

      expect(controller.update(999, updateDto)).toBeNull();
      expect(mockUsersService.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a user', () => {
      const deleted = {
        id: 6,
        name: 'Alice',
        email: 'alice@mail.com',
        role: 'user',
      };
      mockUsersService.delete.mockReturnValue(deleted);

      expect(controller.delete(6)).toEqual(deleted);
      expect(mockUsersService.delete).toHaveBeenCalledWith(6);
    });

    it('should return null if user not found', () => {
      mockUsersService.delete.mockReturnValue(null);

      expect(controller.delete(999)).toBeNull();
      expect(mockUsersService.delete).toHaveBeenCalledWith(999);
    });
  });
});
