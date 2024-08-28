document.addEventListener('DOMContentLoaded', async function () {
    await loadWords(); // Load words when the page is loaded
});

document.getElementById('submitButton').addEventListener('click', async function () {
    const input = document.getElementById('wordInput');
    const word = input.value;

    if (word) {
        // Send the word to the server
        const response = await fetch('/api/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        });

        if (response.ok) {
            // Clear the input
            input.value = '';
            // Reload words to reflect the latest data
            await loadWords();
        } else {
            console.error('Failed to save the word');
        }
    }
});

// Function to load words from the server and update the ul
async function loadWords() {
    try {
        const response = await fetch('/api/words');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const words = await response.json();

        const wordList = document.getElementById('wordList');
        wordList.innerHTML = ''; // Clear the existing list

        // Append each word as a list item
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            wordList.appendChild(li);
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}