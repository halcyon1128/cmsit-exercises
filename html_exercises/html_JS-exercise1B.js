

let modalAddNewIsOpen = false;
let modalEditIsOpen = false;
let modalDeleteIsOpen = false;

// Get form inputs ; RETURNS {userName, userEmail}
function getFormInputs() {
    const userName = document.getElementById('userNameInput').value;
    const userEmail = document.getElementById('userEmailInput').value;
    const editName = document.getElementById('userNameEditInput').value;
    const editEmail = document.getElementById('userEmailEditInput').value;
    return { userName, userEmail, editName, editEmail };
    console.log('getFormInputs called')
}

// Get table contents ; RETURNS tableContents
function getTableContents() {
    // Get all the text content from the table
    const getTableContents = document.getElementById('myTable').textContent;
    const tableContents = getTableContents.trim();
    return tableContents;
    console.log(`$(tableContents)`);
    console.log('getTableContents called');
}

//clears input fields in modalAddNew
function clearUserInputs() {
    // Get the input elements by their IDs
    const userNameInput = document.getElementById('userNameInput');
    const userEmailInput = document.getElementById('userEmailInput');

    // Clear their values
    if (userNameInput) userNameInput.value = '';
    if (userEmailInput) userEmailInput.value = '';

    console.log('clearUserInputs called')
}
// removes boilerplate row
function removeBoilerplate() {
    // Select the row by ID
    const rowBoilerplate = document.getElementById('boilerplateRow');
    if (!rowBoilerplate) return; // chatGPT: If the row doesn't exist, exit the function
    // Get text of username/email
    const userName = rowBoilerplate.querySelector('#userName').textContent;
    const userEmail = rowBoilerplate.querySelector('#userEmail').textContent;
    // function proper: removes boilerplate
    if (userName.includes('Name') || userEmail.includes('example@example.com')) {
        rowBoilerplate.remove(); // Remove the row
    }

    console.log('removeBoilerplate called')
}
//close modal outside of modal
function activateCloseModalDiv() {
    document.getElementById('closeModalDiv').classList.remove('hidden');
}
function deactivateCloseModalDiv() {
    document.getElementById('closeModalDiv').classList.add('hidden');
}

//OPENS/CLOSES ADD NEW BUTTON
// Hide ADD NEW button
function hideButtonAddNew() {
    document.getElementById('buttonAddNew').classList.add('hidden');
}
// Show ADD NEW button
function revealButtonAddNew() {
    document.getElementById('buttonAddNew').classList.remove('hidden');
}


//MODAL FOR ADD NEW INFO
// Show modal Add New Info
function openModalAddNew() {
    document.getElementById('modalAddNew').classList.remove('hidden');
    console.log('add new modal opened')

}
function closeModalAddNew() {
    document.getElementById('modalAddNew').classList.add('hidden');
    console.log('add new modal closed')

}

//MODAL FOR EDIT
// Show modal Edit Info
function openModalEditInfo() {
    document.getElementById('modalEditInfo').classList.remove('hidden');
    console.log('edit modal opened')
}
// Hide modal Edit Info
function closeModalEditInfo() {
    document.getElementById('modalEditInfo').classList.add('hidden');
    console.log('edit modal closed')
}

//MODAL FOR DELETE
// Show modal Delete Row   
function openModalDeleteRow() {
    document.getElementById('modalDeleteRow').classList.remove('hidden');
    console.log('delete modal opened')
}
// Hide modal Delete Row
function closeModalDeleteRow() {
    document.getElementById('modalDeleteRow').classList.add('hidden');
    console.log('delete modal closed')
}

function addInfo(button) {

    activateCloseModalDiv();

    document.getElementById('addInfoButton').addEventListener('click', (event) => {
        // Extract values from table and addNewModal form inputs 
        const { userName, userEmail } = getFormInputs();
        const tableContents = getTableContents();
        console.log('addInfo function called')
        // Check userName or userEmail if it's already in the table
        if (!userName || !userEmail) {
            alert('Please enter a name and email.');
            console.log('username/email not entered')
        }
        else if (tableContents.includes(userName) || tableContents.includes(userEmail)) {
            // alert('Name or Email already in table');
            alert('Name or Email is already used. Please try again.');
            console.log('username/email already in table')
        }

        else {
            // Add new row to table
            const tableBody = document.getElementById('myTable');
            const newRow = document.createElement('tr');

            // Generate a random id for the new row
            const randomId = 'row-' + Math.floor(Math.random() * 1000000);

            // Set the id attribute of the new row
            newRow.setAttribute('id', randomId);

            newRow.innerHTML = `
                <td id="${userName.replace(/\s+/g, '-').trim()}" class="border px-4 py-2">${userName.trim()}</td>
                <td id="${userEmail.replace(/\s+/g, '-').trim()}" class="border px-4 py-2">${userEmail.trim()}</td>
                <td class="border px-4 py-2"><button id="editButton" onclick="activateCloseModalDiv(); editInfo(this); openModalEditInfo(); hideButtonAddNew(); closeModalAddNew();">edit</button></td>
                <td class="border px-4 py-2"><button id="deleteButton" onclick="activateCloseModalDiv(); deleteRow(this); openModalDeleteRow(); hideButtonAddNew(); closeModalAddNew();">delete</button></td>
            `;

            tableBody.appendChild(newRow);
            console.log('new row added to table')
            clearFormFields();
            deactivateCloseModalDiv();
        }
    }, { once: true });
}

//edits User Info on Table


function editInfo(button) {
    console.log('editInfo function called');
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');

    // Get the name and email cells
    const nameCell = cells[0];
    const emailCell = cells[1];

    //populate modal with current values
    document.getElementById('userNameEditInput').placeholder = nameCell.textContent.trim();
    document.getElementById('userEmailEditInput').placeholder = emailCell.textContent.trim();
    document.getElementById('userNameEditInput').classList.add("text-gray-400");
    document.getElementById('userEmailEditInput').classList.add("text-gray-400");


    // Extract current values
    const currentName = nameCell.textContent.trim();
    const currentEmail = emailCell.textContent.trim();


    // Extract form input values
    document.getElementById('editInfoButton').addEventListener('click', () => {


        const { editName, editEmail } = getFormInputs(); // INPUTS GO HERE
        const tableBody = document.getElementById('myTable'); // Get all table contents current row
        let tableContents = ''; //placeholder Array for contrasting with ROW BEING EDITED

        Array.from(tableBody.getElementsByTagName('tr')).forEach(tr => {
            if (tr !== row) { // SKIP ROW BEING EDITED
                tableContents += tr.textContent;
            }
        });

        // Redundancy check
        if (!editName) {
            alert('Please enter a name.');
            console.log('user name not entered');
        }
        if (!editEmail) {
            alert('Please enter an email.');
            console.log('user email not entered');
        }
        if (tableContents.includes(editName) || tableContents.includes(editEmail)) {
            alert('Name or Email is already used. Please try again.');
            console.log('username/email already in table');
        }

        {
            // Replace Name and Email cells in row
            nameCell.textContent = editName.trim();
            emailCell.textContent = editEmail.trim();

            // Optionally update the IDs of the cells if needed
            nameCell.setAttribute('id', editName.replace(/\s+/g, '-').trim());
            emailCell.setAttribute('id', editEmail.replace(/\s+/g, '-').trim());

            console.log('row is updated');
            closeModalEditInfo();
            revealButtonAddNew();
            clearFormFields();
            deactivateCloseModalDiv();
        }
    }, { once: true });

    //remove placeholder text for userNameEditInput
    document.getElementById('userNameEditInput').addEventListener('click', () => {
        document.getElementById('userNameEditInput').placeholder = '';
        document.getElementById('userNameEditInput').classList.remove("text-gray-400");
    }, { once: true });

    //remove placeholder text for userEmailEditInput
    document.getElementById('userEmailEditInput').addEventListener('click', () => {
        document.getElementById('userEmailEditInput').placeholder = '';
        document.getElementById('userEmailEditInput').classList.remove("text-gray-400");
    }, { once: true });
}

function deleteRow(button) {

    // Get the parent row of the clicked button
    const row = button.parentNode.parentNode;

    // proceeds with Delete Row if deleteRowButton is clicked
    document.getElementById('deleteRowButton').addEventListener('click', (event) => {
        console.log('deleteRowButton clicked')
        row.remove(); // Remove the row from the table
        console.log('row deleted');
        closeModalDeleteRow();
        revealButtonAddNew();
        deactivateCloseModalDiv();
    })
}

function clearFormFields() {
    // Get the form inputs by their IDs
    const userNameInput = document.getElementById('userNameInput');
    const userEmailInput = document.getElementById('userEmailInput');
    const userNameEditInput = document.getElementById('userNameEditInput');
    const userEmailEditInput = document.getElementById('userEmailEditInput');

    // Clear the values of the form inputs
    userNameInput.value = '';
    userEmailInput.value = '';
    userNameEditInput.value = '';
    userEmailEditInput.value = '';

    console.log('Form fields cleared');
}



