
console.log('app.js loaded');

const employees = []; // Array to store employee objects
let employeeNum = 0; // Initialize employee number
class Employee {
    constructor(id, name, email) {
        this.id = parseInt(id);
        this.name = name;
        this.email = email;
    }
};

const timeLogs = [];
class TimeLog {
    constructor(employeeId, date, timeIn12h, timeOut12h) {
        this.employeeId = parseInt(employeeId);
        this.date = date;
        this.timeIn = this.convertTo24HourFormat(timeIn12h);
        this.timeOut = this.convertTo24HourFormat(timeOut12h);
        this.total = this.calculateTotalHours(this.timeIn, this.timeOut);
    }
    convertTo24HourFormat(time12h) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    calculateTotalHours(timeIn, timeOut) {
        const timeInDate = new Date(`${this.date}T${timeIn}`);
        const timeOutDate = new Date(`${this.date}T${timeOut}`);
        const timeDiff = timeOutDate - timeInDate;
        const hoursWorked = timeDiff / (1000 * 60 * 60);
        const totalHours = hoursWorked - 1;
        return totalHours;
    }

    calculateOvertimeHours(totalHours) {
        const workHours = 8;
        const overtime = totalHours > workHours ? (totalHours - workHours) : 0;
        return overtime;
    }
};


// Initialize datepicker widget and timepicker dropdown
$(document).ready(() => {
    $('#dateTimeLog').datepicker({
        dateFormat: 'mm-dd-yy',
        minDate: new Date(2000, 1, 1),
        maxDate: '+1Y'
    })
});
// Show datepicker on focus or click
$(document).on('focus', '#dateTimeLog', function () {
    $(this).datepicker('show');
    console.log("#dateTimeLog focused");
});
// Initialize timepicker dropdowns
$('#timeInTimeLog, #timeOutTimeLog').timepicker({
    timeFormat: 'h:i A', // Format as 12-hour clock with AM/PM
    interval: 1, // Set the interval between times to 1 minute
    minTime: '12:00 AM',
    maxTime: '11:59 PM',
    startTime: '5:00 AM',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    forceRoundTime: true, // Ensures that the user cannot enter non-matching times
    step: 1 // Allows for 1-minute intervals
}).on('keydown keypress', function (e) {
    // Allow only numbers, colon, and control keys (backspace, arrow keys, etc.)
    const allowedKeys = [8, 37, 38, 39, 40, 46, 9, 16, 17, 18];
    if (allowedKeys.indexOf(e.which) === -1 && (e.which < 48 || e.which > 57) && e.which !== 58) {
        e.preventDefault();
    }
}).on('input', function () {
    // Enforce strict format HH:MM AM/PM
    let value = $(this).val().replace(/[^0-9:]/g, ''); // Remove invalid characters
    if (value.length > 5) {
        value = value.slice(0, 5); // Limit to HH:MM
    }
    $(this).val(value);
}).on('keydown', function (e) {
    // Check for 'a' or 'A' for AM, 'p' or 'P' for PM
    if (e.which === 65 || e.which === 97) { // 'a' or 'A'
        e.preventDefault();
        let currentValue = $(this).val();
        if (!currentValue.endsWith('AM')) {
            $(this).val(currentValue + ' AM');
        }
    } else if (e.which === 80 || e.which === 112) { // 'p' or 'P'
        e.preventDefault();
        let currentValue = $(this).val();
        if (!currentValue.endsWith('PM')) {
            $(this).val(currentValue + ' PM');
        }
    }
});


// Handle all modals
$(document).on("click", function (event) {
    // Time log modal handler
    if ($(event.target).is('#addTimeLogBtn')) {
        $('#timeLogModal').removeClass('hidden');
    }
    if (!$(event.target).closest("#timeLogModal").length &&
        !$(event.target).is("#addTimeLogBtn") &&
        !$('.ui-datepicker').is(':visible') &&
        !$(event.target).closest('.ui-timepicker-wrapper').length) {
        $("#timeLogModal").addClass("hidden");
    }
    // Add employee modal handler
    if ($(event.target).is('#addEmployeeBtn')) {
        $('#addEmployeeModal').removeClass('hidden');
    }
    if (!$(event.target).closest("#addEmployeeModal").length &&
        !$(event.target).is("#addEmployeeBtn")) {
        $("#addEmployeeModal").addClass("hidden");
    }
    // Delete employee modal handler
    if ($(event.target).is('#deleteSelectedBtn')) {
        $('#deleteEmployeeModal').removeClass('hidden');
    }
    if (!$(event.target).closest('#deleteEmployeeModal').length &&
        !$(event.target).is('#deleteSelectedBtn')) {
        $('#deleteEmployeeModal').addClass('hidden');
    }
    if ($(event.target).is('#cancelDeleteBtn')) {
        $('#deleteEmployeeModal').addClass('hidden');
    }
});

// Function to add a new employee
function addEmployee(name, email) {
    employeeNum++;
    const employee = new Employee(employeeNum, name, email);
    employees.push(employee);

    // Append employee row to the table
    $('#tableEmployees').append(`
        <tr id="${employee.id}" class="bg-white">
            <td class="whitespace-nowrap"><input type="checkbox" class="form-checkbox"></td>
            <td class="employeeName whitespace-nowrap">${employee.name}</td>
            <td class="employeeEmail whitespace-nowrap">${employee.email}</td>
            <td class="employeeEdit whitespace-nowrap"><button class="editBtn text-zinc-400 hover:text-blue-500 hover:font-bold">edit</button></td>
        </tr>
    `);
    // Clear inputs and close modal
    $('#addEmployeeInput').val('');
    $('#addEmailInput').val('');
    $("#addEmployeeModal").addClass("hidden");
    console.log(`employeeNum is ${employeeNum}`);
}
// Event handler for adding a new employee
$(document).on('click', '#pushNewEmployeeBtn', () => {
    const name = $('#addEmployeeInput').val();
    const email = $('#addEmailInput').val();
    addEmployee(name, email);
});



// Function to delete an employee based on ID
function deleteEmployee(employeeId) {
    // Convert fetched employeeId to integer
    const id = parseInt(employeeId);

    // Find index of employee to delete
    const index = employees.findIndex(emp => emp.id === id);

    // Check if employee exists in employees array
    if (index !== -1) {
        // Remove employee from the array
        employees.splice(index, 1);

        // Remove employee row from the table
        $('#tableEmployees').find(`tr#${id}`).remove();
        // Remove employee option from employeeSelect
        $('#employeeSelect').find(`option[value="${id}"]`).remove();
    } else {
        alert(`Employee with ID ${id} not found.`);
    }
}


// Delete employee handler
// Delete employee handler
$(document).on('click', '#pushDeleteBtn', () => {
    // Get all checked checkboxes
    const checkedCheckboxes = $('#tableEmployees').find('input[type="checkbox"]:checked');

    if (checkedCheckboxes.length > 0) {
        // Array to store employee IDs to delete
        const employeeIds = [];

        // Iterate over checked checkboxes to collect employee IDs
        checkedCheckboxes.each(function () {
            // Find the nearest <tr> and get its ID
            const employeeId = $(this).closest('tr').attr('id');
            if (employeeId) {
                employeeIds.push(employeeId);
            }
        });

        // Iterate over collected employee IDs and delete each employee
        employeeIds.forEach(id => {
            deleteEmployee(id);
        });

        // Close the modal
        $("#deleteEmployeeModal").addClass("hidden");

    } else {
        // Show an alarm modal if no employees are selected
        alert('Please select at least one employee to delete.');
    }
});

$(document).on('click', '#employeeSelect', function () {
    const select = $(this);
    const table = $('#tableEmployees');
    const rows = table.find('tr');

    if (rows.length == 1) {
        alert('Please add an employee first')
    } else {
        select.empty(); // Clear the current options in the select element

        rows.each(function () {
            const id = $(this).attr('id');
            const name = $(this).find('.employeeName').text();

            if (id && name) {
                select.append(`<option value="${id}">${name}</option>`);
            }
        });
    }
});


// Function to add a new time log
function addNewTimeLog() {
    // Fetch selected employee ID from the dropdown
    const employeeId = parseInt($('#employeeSelect').val(), 10);
    const date = $('#dateTimeLog').val();
    const timeIn = $('#timeInTimeLog').val();
    const timeOut = $('#timeOutTimeLog').val();

    // Create new TimeLog object
    const timeLog = new TimeLog(employeeId, date, timeIn, timeOut);

    // Push the TimeLog object to the timeLogs array
    timeLogs.push(timeLog);
    console.log('timeLogs = ', timeLogs);

};

function resetTimeLogInputs() {
    // reset inputs
    $('#dateTimeLog').val('');
    $('#timeInTimeLog').val('');
    $('#timeOutTimeLog').val('');
};

function populateTimeLogTable() {
    $('#tableTimeLog tbody').empty();
    const employeeSelectValue = parseInt($('#employeeSelect').val(), 10);
    const filteredTimeLogs = timeLogs.filter(log => log.employeeId === employeeSelectValue);

    filteredTimeLogs.forEach(log => {
        $('#tableTimeLog tbody').append(`
            <tr>
                <td class="whitespace-nowrap">${log.date}</td>
                <td class="whitespace-nowrap">${log.timeIn}</td>
                <td class="whitespace-nowrap">${log.timeOut}</td>
                <td class="whitespace-nowrap">${log.calculateOvertimeHours(log.total).toFixed(2)}</td>
                <td class="whitespace-nowrap">${log.total.toFixed(2)}</td>
            </tr>
        `);
    });
};


$(document).on('click', '#pushTimeLogBtn', () => {
    addNewTimeLog();
    populateTimeLogTable();
    resetTimeLogInputs();
    $('#timeLogModal').addClass('hidden');
});

$(document).on('change', '#employeeSelect', () => {
    populateTimeLogTable();
    console.log('employees =' + employees);
    console.log('timeLogs =' + timeLogs);
});

//#employeeSelect