import EmployeeHierarchy from './EmployeeHierarchy';
import * as path from 'path';

const hierarchy = new EmployeeHierarchy();

// Load data from files
try {
    hierarchy.loadFromFile(path.join(__dirname, 'data/correct-employees.json'));
    console.log('Hierarchy loaded successfully.');
    
    // Validate the hierarchy
    hierarchy.validateHierarchy();
    console.log('Hierarchy validated successfully.');
} catch (error: any) {
    console.error(`Error: ${error.message}`);
}

// Search for an employee and display details
const employeeName = 'evelina';
const employee = hierarchy.findEmployee(employeeName);
if (employee) {
    console.log(`Employee: ${employee.name}`);
    console.log(`Managers: ${employee.getManagers().join(', ')}`);
    console.log(`Direct Reports: ${employee.countDirectReports()}`);
    console.log(`Indirect Reports: ${employee.countIndirectReports()}`);
} else {
    console.log(`Employee ${employeeName} not found.`);
}
