// Select all elements with the class 'pattern-node'
const nodes = document.querySelectorAll('.pattern-node');

// Initialize an array to keep track of the pattern nodes the user has selected
let pattern = [];

// Flag to track whether the mouse button is currently pressed down
let isMouseDown = false;

// Add event listeners to each pattern node
nodes.forEach(node => {
    // When the mouse button is pressed down on a node
    node.addEventListener('mousedown', (event) => {
        event.preventDefault(); // Prevent the default behavior (e.g., text selection)
        isMouseDown = true; // Set the flag indicating the mouse button is down
        handlePattern(node); // Handle the pattern logic for the current node
    });

    // When the mouse moves over a node
    node.addEventListener('mouseover', () => {
        // If the mouse button is still pressed down, handle the pattern logic
        if (isMouseDown) handlePattern(node);
    });

    // When the mouse button is released on a node
    node.addEventListener('mouseup', () => {
        isMouseDown = false; // Reset the flag indicating the mouse button is no longer down
        validatePattern(); // Validate the pattern the user has drawn
        resetPattern(); // Reset the pattern and visuals
    });
});

// Add an event listener to the document to handle mouse button release anywhere on the page
document.addEventListener('mouseup', () => {
    isMouseDown = false; // Reset the flag indicating the mouse button is no longer down
    resetPattern(); // Reset the pattern and visuals
});

// Function to handle the pattern logic for a node
function handlePattern(node) {
    // Get the 'data-node' attribute value of the current node
    const nodeId = node.getAttribute('data-node');

    // If this node hasn't been added to the pattern yet
    if (!pattern.includes(nodeId)) {
        pattern.push(nodeId); // Add the nodeId to the pattern array
        node.classList.add('active'); // Add the 'active' class to visually indicate selection

        // Find the icon within the current node
        const icon = node.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = 'adjust'; // Change the icon to "adjust" when the node is active
        }
    }
}

// Function to reset the pattern and visuals
function resetPattern() {
    // Loop through each pattern node
    nodes.forEach(node => {
        node.classList.remove('active'); // Remove the 'active' class to reset the visual indicator

        // Find the icon within the current node
        const icon = node.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = 'fiber_manual_record'; // Reset the icon text content to the original icon
        }
    });
    pattern = []; // Clear the pattern array
}

// Function to validate the user's pattern against the correct pattern
function validatePattern() {
    // Define the correct pattern for validation
    const correctPattern = ['1', '2', '3', '5', '7', '8']; // Example correct pattern

    // Check if the user's pattern matches the correct pattern
    if (JSON.stringify(pattern) === JSON.stringify(correctPattern)) {
        alert('CORRECT!'); // Notify the user if the pattern is correct
    } else {
        alert('INCORRECT!'); // Notify the user if the pattern is incorrect
    }
}
