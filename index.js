
document.addEventListener('DOMContentLoaded', function () {
    // Assuming the counter number is initialized here
    const counterElement = document.querySelector('.counter-number');

    // Initially hide the counter number until it's fully loaded
    counterElement.style.display = 'none'; // Ensure it's hidden initially

    // Function to initialize the counter
    async function initializeCounter() {
        try {
            // Fetch the counter value from your API
            let response = await fetch("https://z4qype23yt4bd32v54kyt4pexu0mmpci.lambda-url.eu-west-2.on.aws/");
            let data = await response.json();

            // Update the counter element with fetched data
            counterElement.innerHTML = `Views: ${data}`;

            // Add the class to show the counter number
            counterElement.classList.add('is-visible'); // This class should handle the visibility via CSS

            // Set display to inline-block to make it visible now
            counterElement.style.display = 'inline-block'; // Show the counter after it is set
        } catch (error) {
            console.error('Error fetching the counter value:', error);
        }
    }

    // Call the initialization function
    initializeCounter();
});