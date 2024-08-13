import Employee from '../Employee';

test('Employee direct reports count', () => {
    const manager = new Employee(1, 'Manager');
    const employee = new Employee(2, 'Employee');
    manager.addDirectReport(employee);

    expect(manager.countDirectReports()).toBe(1);
    expect(employee.countDirectReports()).toBe(0);
});

test('Employee indirect reports count', () => {
    const manager = new Employee(1, 'Manager');
    const employee = new Employee(2, 'Employee');
    const indirectReport = new Employee(3, 'Indirect Report');
    manager.addDirectReport(employee);
    employee.addDirectReport(indirectReport);

    expect(manager.countIndirectReports()).toBe(2);
    expect(employee.countIndirectReports()).toBe(1);
    expect(indirectReport.countIndirectReports()).toBe(0);
});

test('Employee managers list', () => {
    const root = new Employee(1, 'Root');
    const manager = new Employee(2, 'Manager');
    const employee = new Employee(3, 'Employee');
    manager.setManager(root);
    employee.setManager(manager);
    root.addDirectReport(manager);
    manager.addDirectReport(employee);

    expect(employee.getManagers()).toEqual(['Manager', 'Root']);
    expect(manager.getManagers()).toEqual(['Root']);
    expect(root.getManagers()).toEqual([]);
});
