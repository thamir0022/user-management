import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';

const mockEmployeesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EmployeesController', () => {
  let controller: EmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        { provide: EmployeesService, useValue: mockEmployeesService },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const dto: Prisma.EmployeeCreateInput = {
        name: 'John Doe',
        email: 'john@mail.com',
        role: 'ENGINEER',
      };
      const expected = { id: 1, ...dto };
      mockEmployeesService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
      expect(mockEmployeesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const employees = [{ id: 1, name: 'John', role: 'ENGINEER' }];
      mockEmployeesService.findAll.mockResolvedValue(employees);

      const result = await controller.findAll('127.0.0.1');
      expect(result).toEqual(employees);
      expect(mockEmployeesService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return employees filtered by role', async () => {
      const role = 'INTERN';
      const employees = [{ id: 2, name: 'Jane', role }];
      mockEmployeesService.findAll.mockResolvedValue(employees);

      const result = await controller.findAll('127.0.0.1', role);
      expect(result).toEqual(employees);
      expect(mockEmployeesService.findAll).toHaveBeenCalledWith(role);
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      const employee = { id: 1, name: 'John', role: 'ENGINEER' };
      mockEmployeesService.findOne.mockResolvedValue(employee);

      const result = await controller.findOne(1);
      expect(result).toEqual(employee);
      expect(mockEmployeesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const dto: Prisma.EmployeeUpdateInput = { name: 'John Updated' };
      const updated = { id: 1, ...dto };
      mockEmployeesService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updated);
      expect(mockEmployeesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      const deleted = { id: 1, name: 'John', role: 'ENGINEER' };
      mockEmployeesService.remove.mockResolvedValue(deleted);

      const result = await controller.remove(1);
      expect(result).toEqual(deleted);
      expect(mockEmployeesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
