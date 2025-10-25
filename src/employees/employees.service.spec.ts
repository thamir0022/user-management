import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const mockDatabaseService = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEmployee = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'ENGINEER' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockEmployees = [
    mockEmployee,
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'ADMIN' as const,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'INTERN' as const,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: Prisma.EmployeeCreateInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'ENGINEER',
      };

      mockDatabaseService.employee.create.mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);

      expect(result).toEqual(mockEmployee);
      expect(mockDatabaseService.employee.create).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.employee.create).toHaveBeenCalledWith({
        data: createEmployeeDto,
      });
    });

    it('should handle creation with all possible fields', async () => {
      const createEmployeeDto: Prisma.EmployeeCreateInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'ADMIN',
      };

      const expectedEmployee = { ...mockEmployee, role: 'ADMIN' as const };
      mockDatabaseService.employee.create.mockResolvedValue(expectedEmployee);

      const result = await service.create(createEmployeeDto);

      expect(result).toEqual(expectedEmployee);
      expect(mockDatabaseService.employee.create).toHaveBeenCalledWith({
        data: createEmployeeDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all employees when no role is specified', async () => {
      mockDatabaseService.employee.findMany.mockResolvedValue(mockEmployees);

      const result = await service.findAll();

      expect(result).toEqual(mockEmployees);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith();
    });

    it('should return employees filtered by ENGINEER role', async () => {
      const engineerEmployees = mockEmployees.filter(
        (emp) => emp.role === 'ENGINEER',
      );
      mockDatabaseService.employee.findMany.mockResolvedValue(
        engineerEmployees,
      );

      const result = await service.findAll('ENGINEER');

      expect(result).toEqual(engineerEmployees);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith({
        where: { role: 'ENGINEER' },
      });
    });

    it('should return employees filtered by ADMIN role', async () => {
      const adminEmployees = mockEmployees.filter(
        (emp) => emp.role === 'ADMIN',
      );
      mockDatabaseService.employee.findMany.mockResolvedValue(adminEmployees);

      const result = await service.findAll('ADMIN');

      expect(result).toEqual(adminEmployees);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
      });
    });

    it('should return employees filtered by INTERN role', async () => {
      const internEmployees = mockEmployees.filter(
        (emp) => emp.role === 'INTERN',
      );
      mockDatabaseService.employee.findMany.mockResolvedValue(internEmployees);

      const result = await service.findAll('INTERN');

      expect(result).toEqual(internEmployees);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith({
        where: { role: 'INTERN' },
      });
    });

    it('should return empty array when no employees exist', async () => {
      mockDatabaseService.employee.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockDatabaseService.employee.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single employee by id', async () => {
      mockDatabaseService.employee.findUnique.mockResolvedValue(mockEmployee);

      const result = await service.findOne(1);

      expect(result).toEqual(mockEmployee);
      expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when employee is not found', async () => {
      mockDatabaseService.employee.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should handle different id values', async () => {
      const employee2 = { ...mockEmployee, id: 42 };
      mockDatabaseService.employee.findUnique.mockResolvedValue(employee2);

      const result = await service.findOne(42);

      expect(result).toEqual(employee2);
      expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
      });
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateEmployeeDto: Prisma.EmployeeUpdateInput = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const updatedEmployee = {
        ...mockEmployee,
        name: 'John Updated',
        email: 'john.updated@example.com',
        updatedAt: new Date('2024-01-15'),
      };

      mockDatabaseService.employee.update.mockResolvedValue(updatedEmployee);

      const result = await service.update(1, updateEmployeeDto);

      expect(result).toEqual(updatedEmployee);
      expect(mockDatabaseService.employee.update).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateEmployeeDto,
      });
    });

    it('should update only the role field', async () => {
      const updateEmployeeDto: Prisma.EmployeeUpdateInput = {
        role: 'ADMIN',
      };

      const updatedEmployee = {
        ...mockEmployee,
        role: 'ADMIN' as const,
        updatedAt: new Date('2024-01-15'),
      };

      mockDatabaseService.employee.update.mockResolvedValue(updatedEmployee);

      const result = await service.update(1, updateEmployeeDto);

      expect(result).toEqual(updatedEmployee);
      expect(mockDatabaseService.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateEmployeeDto,
      });
    });

    it('should update multiple fields at once', async () => {
      const updateEmployeeDto: Prisma.EmployeeUpdateInput = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'ADMIN',
      };

      const updatedEmployee = {
        ...mockEmployee,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'ADMIN' as const,
        updatedAt: new Date('2024-01-15'),
      };

      mockDatabaseService.employee.update.mockResolvedValue(updatedEmployee);

      const result = await service.update(1, updateEmployeeDto);

      expect(result).toEqual(updatedEmployee);
      expect(mockDatabaseService.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateEmployeeDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      mockDatabaseService.employee.delete.mockResolvedValue(mockEmployee);

      const result = await service.remove(1);

      expect(result).toEqual(mockEmployee);
      expect(mockDatabaseService.employee.delete).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.employee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should handle deletion of different employee ids', async () => {
      const employee3 = { ...mockEmployee, id: 3 };
      mockDatabaseService.employee.delete.mockResolvedValue(employee3);

      const result = await service.remove(3);

      expect(result).toEqual(employee3);
      expect(mockDatabaseService.employee.delete).toHaveBeenCalledWith({
        where: { id: 3 },
      });
    });

    it('should return the deleted employee data', async () => {
      const deletedEmployee = {
        id: 5,
        name: 'Deleted User',
        email: 'deleted@example.com',
        role: 'INTERN' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockDatabaseService.employee.delete.mockResolvedValue(deletedEmployee);

      const result = await service.remove(5);

      expect(result).toEqual(deletedEmployee);
    });
  });
});
