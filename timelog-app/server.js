// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Read the data from the data.json file
// const getData = () => {
//     const dataPath = path.join(__dirname, 'data', 'data.json');
//     const jsonData = fs.readFileSync(dataPath, 'utf8');
//     return JSON.parse(jsonData);
// };

// // Write the data to the data.json file
// const saveData = (data) => {
//     const dataPath = path.join(__dirname, 'data', 'data.json');
//     fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
// };

// // GET route to retrieve all employees
// app.get('/employees', (req, res) => {
//     const employees = getData();
//     res.json(employees);
// });

// // POST route to add a new employee
// app.post('/employees', (req, res) => {
//     const employees = getData();
//     const newEmployee = req.body;
//     newEmployee.id = employees.length + 1;
//     employees.push(newEmployee);
//     saveData(employees);
//     res.status(201).json(newEmployee);
// });

// // PUT route to edit an existing employee
// app.put('/employees/:id', (req, res) => {
//     const employees = getData();
//     const id = parseInt(req.params.id);
//     const updatedEmployee = req.body;

//     const employeeIndex = employees.findIndex(emp => emp.id === id);
//     if (employeeIndex !== -1) {
//         employees[employeeIndex] = { id, ...updatedEmployee };
//         saveData(employees);
//         res.json(employees[employeeIndex]);
//     } else {
//         res.status(404).json({ message: 'Employee not found' });
//     }
// });

// // DELETE route to remove an employee
// app.delete('/employees/:id', (req, res) => {
//     const employees = getData();
//     const id = parseInt(req.params.id);

//     const updatedEmployees = employees.filter(emp => emp.id !== id);
//     if (employees.length !== updatedEmployees.length) {
//         saveData(updatedEmployees);
//         res.json({ message: 'Employee removed' });
//     } else {
//         res.status(404).json({ message: 'Employee not found' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });