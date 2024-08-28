//HANDLES ALL POPULATE TABLES SCENARIOS
$(document).ready(function () {

    // fetch "Employees" data
    $.getJSON('data/data.json', function (data) {

        //populate on load
        renumberEmployees();
        populateTableEmployees();
        populateEmployeeSelect();
        populateTableTimeLog();

        //numbers employees array in data.JSON
        function renumberEmployees() {

            const employees = data.employees;
            employees.forEach((employee, index) => {
                employee.id = index + 1;
            });
            return employees;
        }

        function populateTableEmployees() {
            const employees = data.employees;
            console.log("employees: ", employees);

            // populates table (append row based on const employees)
            employees.forEach(function (employee) {
                $('#tableEmployees tbody').append(`
        <tr data-employee-id="${employee.id}">
            <td class="whitespace-nowrap"><input type="checkbox" class="form-checkbox"></td>
            <td class="whitespace-nowrap">${employee.name}</td>
            <td class="whitespace-nowrap">${employee.email}</td>
            <td class="whitespace-nowrap">
            <button class="editEmployeeTableBtn">Edit</button>
            <button class="deleteEmployeeTableBtn">Delete</button>
            </td>
        </tr>
        `);
                console.log("table appended");
            }); //END OF populate tableEmployees


            // END OF populate employeeSelect
        };

        // populates employeeSelect options
        function populateEmployeeSelect() {
            const employeesForSelect = data.employees;
            employeesForSelect.forEach(function (employee) {
                $('#employeeSelect').append(`
                <option value="${employee.id}">${employee.name}</option>`);
            });
        };



        function populateTableTimeLog() {
            const employeesForTimeLogs = data.employees;
            // console.log()
            // fetch employeeSelect value from DOM
            const employeeSelectValue = parseInt($('#employeeSelect').val(), 10);
            console.log("employeeSelectValue: ", employeeSelectValue);
            // look for employee(object) in employees array that matches employeeSelectValue
            const employee = employeesForTimeLogs.find(obj => obj.id === employeeSelectValue);
            // ALTERNATIVE FOR LOOK EMPLOYEE (explain arrow func)
            // const employee = employees.find() .find(function (obj) {
            //     return obj.id === parseInt(employeeSelectValue);
            // });
            console.log(`find val = ${employee}`);

            // populates tableTimeLog (append row based on select value)
            employee.timeLogs.forEach(tl => {
                $('#tableTimeLog tbody').append(`
                <tr data-time-log-id="${tl.log}">
                    <td class="whitespace-nowrap">${tl.date}</td>
                    <td class="whitespace-nowrap">${tl.timeIn}</td>
                    <td class="whitespace-nowrap">${tl.timeOut}</td>
                    <td class="whitespace-nowrap">${tl.ot}</td>
                    <td class="whitespace-nowrap">${tl.totalHours}</td>
                    <td class="whitespace-nowrap"><button class="editTimeLogTableBtn">Edit</button></td>
                </tr>
            `);
            });
        };

        function clearTableTimeLog() {
            $('#tableTimeLog tbody').empty();
        };



        //populate on change
        $('#employeeSelect').on('change', function () {
            clearTableTimeLog();
            populateTableTimeLog();
        });


        $('#addTimeLogBtn').on('click', function () {
            $('#timeLogModal').removeClass('hidden');
        });

        $('#addEmployeeBtn').on('click', function () {
            $('#addEmployeeModal').removeClass('hidden');
        });

        $('#deleteSelectedBtn').on('click', function () {
            $('#deleteEmployeeModal').removeClass('hidden');
        });

    }); //END OF get.JSON

}); //END OF ready

//HANDLE ALL MODALS
$(document).on("click", function (event) {
    if (!$(event.target).closest("#timeLogModal").length &&
        !$(event.target).is("#addTimeLogBtn")) {
        $("#timeLogModal").addClass("hidden");
    }
    if (!$(event.target).closest('#addEmployeeModal').length && !$(event.target).is('#addEmployeeBtn')) {
        $('#addEmployeeModal').addClass('hidden');
    }
    if (!$(event.target).closest('#deleteEmployeeModal').length && !$(event.target).is('#deleteSelectedBtn')) {
        $('#deleteEmployeeModal').addClass('hidden');
    }
});