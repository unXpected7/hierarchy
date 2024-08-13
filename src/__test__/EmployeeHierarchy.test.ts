import EmployeeHierarchy from '../EmployeeHierarchy';
import Employee from '../Employee';
import * as fs from 'fs';

jest.mock('fs');

test('Load employees from file', () => {
    const hierarchy = new EmployeeHierarchy();
    const mockData = [
        { id: 1, name: 'root', managerId: null },
        { id: 2, name: 'child1', managerId: 1 },
        { id: 3, name: 'child2', managerId: 1 }
    ];

    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

    hierarchy.loadFromFile('path/to/mock/file');
    const root = hierarchy.findEmployee('root');
    const child1 = hierarchy.findEmployee('child1');
    const child2 = hierarchy.findEmployee('child2');

    expect(root).not.toBeNull();
    expect(child1).not.toBeNull();
    expect(child2).not.toBeNull();
});

test('Validate correct hierarchy', () => {
    const hierarchy = new EmployeeHierarchy();
    const root = new Employee(1, 'Root');
    const manager = new Employee(2, 'Manager');
    const employee = new Employee(3, 'Employee');
    hierarchy.addEmployee(root);
    hierarchy.addEmployee(manager);
    hierarchy.addEmployee(employee);
    manager.setManager(root);
    employee.setManager(manager);
    root.addDirectReport(manager);
    manager.addDirectReport(employee);

    expect(() => hierarchy.validateHierarchy()).not.toThrow();
});

test('Validate hierarchy with no root employee', () => {
    const hierarchy = new EmployeeHierarchy();
    const manager = new Employee(2, 'Manager');
    const employee = new Employee(3, 'Employee');
    hierarchy.addEmployee(manager);
    hierarchy.addEmployee(employee);
    employee.setManager(manager);
    manager.addDirectReport(employee);

    expect(() => hierarchy.validateHierarchy()).toThrow('Hierarchy is invalid: no root employee.');
});

test('Validate hierarchy with employee without hierarchy', () => {
    const hierarchy = new EmployeeHierarchy();
    const root = new Employee(1, 'Root');
    const manager = new Employee(2, 'Manager');
    const employee = new Employee(3, 'Employee');
    const orphan = new Employee(4, 'Orphan');
    hierarchy.addEmployee(root);
    hierarchy.addEmployee(manager);
    hierarchy.addEmployee(employee);
    hierarchy.addEmployee(orphan);
    manager.setManager(root);
    employee.setManager(manager);
    root.addDirectReport(manager);
    manager.addDirectReport(employee);

    expect(() => hierarchy.validateHierarchy()).toThrow('Unable to process employee hierarchy. Orphan not having hierarchy');
});

test('Validate hierarchy with employee having multiple managers', () => {
    const hierarchy = new EmployeeHierarchy();
    const root = new Employee(1, 'Root');
    const manager1 = new Employee(2, 'Manager1');
    const manager2 = new Employee(3, 'Manager2');
    const employee = new Employee(4, 'Employee');
    hierarchy.addEmployee(root);
    hierarchy.addEmployee(manager1);
    hierarchy.addEmployee(manager2);
    hierarchy.addEmployee(employee);
    manager1.setManager(root);
    manager2.setManager(root);
    root.addDirectReport(manager1);
    root.addDirectReport(manager2);
    manager1.addDirectReport(employee);
    manager2.addDirectReport(employee);

    expect(() => hierarchy.validateHierarchy()).toThrow('Unable to process employee tree. Employee has multiple managers');
});
