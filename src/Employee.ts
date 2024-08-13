class Employee {
    id: number;
    name: string;
    manager: Employee | null = null;
    directReports: Employee[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    addDirectReport(employee: Employee): void {
        this.directReports.push(employee);
    }

    setManager(manager: Employee): void {
        this.manager = manager;
    }

    getManagers(): string[] {
        const managers: string[] = [];
        let current = this.manager;
        while (current) {
            managers.push(current.name);
            current = current.manager;
        }
        return managers;
    }

    countDirectReports(): number {
        return this.directReports.length;
    }

    countIndirectReports(): number {
        let count = 0;
        const queue: Employee[] = [...this.directReports];
        while (queue.length > 0) {
            const current = queue.shift()!;
            count++;
            queue.push(...current.directReports);
        }
        return count;
    }
}

export default Employee;
