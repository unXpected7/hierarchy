import Employee from './Employee';
import * as fs from 'fs';

class EmployeeHierarchy {
    private employees: Map<number, Employee> = new Map();

    addEmployee(employee: Employee): void {
        this.employees.set(employee.id, employee);
    }

    findEmployee(name: string): Employee | null {
        for (const employee of this.employees.values()) {
            if (employee.name === name) {
                return employee;
            }
        }
        return null;
    }

    loadFromFile(filePath: string): void {
        const data = fs.readFileSync(filePath, 'utf8');
        const employeesData = JSON.parse(data);

        // Create Employee instances and add to the map
        employeesData.forEach((empData: any) => {
            const employee = new Employee(empData.id, empData.name);
            this.addEmployee(employee);
        });

        // Set managers and direct reports
        employeesData.forEach((empData: any) => {
            const employee = this.employees.get(empData.id);
            if (employee && empData.managerId !== null) {
                const manager = this.employees.get(empData.managerId);
                if (manager) {
                    employee.setManager(manager);
                    manager.addDirectReport(employee);
                }
            }
        });
    }

    validateHierarchy(): void {
        const rootEmployees = Array.from(this.employees.values()).filter(emp => emp.manager === null);

        // Check if there is at least one root employee
        if (rootEmployees.length === 0) {
            throw new Error('Hierarchy is invalid: no root employee.');
        }

        // Check for employees without hierarchy
        const employeesWithoutHierarchy = Array.from(this.employees.values()).filter(emp => emp.manager === null && emp.directReports.length === 0);
        if (employeesWithoutHierarchy.length > 0) {
            const names = employeesWithoutHierarchy.map(emp => emp.name).join(', ');
            throw new Error(`Unable to process employee hierarchy. ${names} not having hierarchy`);
        }

        // Check for employees with multiple managers
        const managerCounts = new Map<number, Set<number>>();
        this.employees.forEach(employee => {
            employee.directReports.forEach(report => {
                if (managerCounts.has(report.id)) {
                    managerCounts.get(report.id)!.add(employee.id);
                } else {
                    managerCounts.set(report.id, new Set([employee.id]));
                }
            });
        });

        const employeesWithMultipleManagers = Array.from(managerCounts.entries()).filter(([_, managers]) => managers.size > 1);
        if (employeesWithMultipleManagers.length > 0) {
            const details = employeesWithMultipleManagers.map(([employeeId, managers]) => {
                const employee = this.employees.get(employeeId);
                return employee ? `${employee.name} has multiple managers: ${Array.from(managers).join(', ')}` : '';
            }).join('; ');
            throw new Error(`Unable to process employee tree. ${details}`);
        }
    }
}

export default EmployeeHierarchy;
