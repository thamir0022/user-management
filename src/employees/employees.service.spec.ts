import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call database.create with correct data', async () => {
      const dto: Prisma.EmployeeCreateInput = {
        name: 'John',
        email: 'john@mail.com',
        role: 'ENGINEER',
      };
      const expected = { id: 1, ...dto };
      mockDatabaseService.employee.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(mockDatabaseService.employee.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all employees if role is not provided', async () => {
      const employees = [{ id: 1, name: 'John', role: 'ENGINEER' }];
      mockDatabaseService.employee.findMany.mockResolvedValue(employees);

      const result = await service.findAll();
      expect(result).toEqual(employees);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith();
    });

    it('should filter employees by role', async () => {
      const role = 'INTERN';
      const employees = [{ id: 2, name: 'Jane', role }];
      mockDatabaseService.employee.findMany.mockResolvedValue(employees);

      const result = await service.findAll(role);
      expect(result).toEqual(employees);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith({
        where: { role },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single employee by id', async () => {
      const employee = { id: 1, name: 'John', role: 'ENGINEER' };
      mockDatabaseService.employee.findUnique.mockResolvedValue(employee);

      const result = await service.findOne(1);
      expect(result).toEqual(employee);
      expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update employee with given id', async () => {
      const dto: Prisma.EmployeeUpdateInput = { name: 'John Updated' };
      const updated = { id: 1, ...dto };
      mockDatabaseService.employee.update.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result).toEqual(updated);
      expect(mockDatabaseService.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should delete employee with given id', async () => {
      const deleted = { id: 1, name: 'John', role: 'ENGINEER' };
      mockDatabaseService.employee.delete.mockResolvedValue(deleted);

      const result = await service.remove(1);
      expect(result).toEqual(deleted);
      expect(mockDatabaseService.employee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
