// JavaScript code for Udhar Detector

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get references to all the necessary elements
    const loginForm = document.getElementById("loginForm");
    const rateForm = document.getElementById("rateForm");
    const searchForm = document.getElementById("searchForm");
    const searchResults = document.getElementById("searchResults");
    const currentYear = document.getElementById("currentYear");

    // Update the footer with the current year
    currentYear.textContent = new Date().getFullYear();

    // Handle user login
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const userRole = document.getElementById("userRole").value;
        const userName = document.getElementById("userName").value;
        let userId = document.getElementById("userId").value.trim();

        if (!userId) {
            // Generate a unique ID for the new user
            userId = generateUniqueId();
            alert(`Welcome, ${userName}! Your Unique ID is ${userId}. Please save it for future logins.`);
        }

        // Store user information in localStorage
        const user = {
            role: userRole,
            name: userName,
            id: userId
        };
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert(`Login successful! Welcome, ${userName}.`);

        // Clear the form fields
        loginForm.reset();
    });

    // Handle rating submission
    rateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const borrowerName = document.getElementById("borrowerName").value;
        const borrowerId = document.getElementById("borrowerId").value;
        const rating = parseInt(document.getElementById("rating").value);

        // Get the current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (currentUser && currentUser.role === "seller") {
            // Get existing ratings from localStorage
            let ratings = JSON.parse(localStorage.getItem("ratings")) || {};

            // Initialize the borrower data if not present
            if (!ratings[borrowerId]) {
                ratings[borrowerId] = {
                    name: borrowerName,
                    totalRating: 0,
                    transactions: []
                };
            }

            // Add the new rating to the borrower
            ratings[borrowerId].totalRating += rating;
            ratings[borrowerId].transactions.push({
                sellerId: currentUser.id,
                rating: rating
            });

            // Save the updated ratings in localStorage
            localStorage.setItem("ratings", JSON.stringify(ratings));

            alert(`Rating of ${rating} points assigned to ${borrowerName}.`);

            // Clear the form fields
            rateForm.reset();
        } else {
            alert("Only sellers can assign ratings.");
        }
    });

    // Handle borrower search
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const searchQuery = document.getElementById("searchQuery").value.trim().toLowerCase();

        // Get ratings from localStorage
        const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
        let resultsHTML = "";

        // Search for borrowers by name or ID
        for (const borrowerId in ratings) {
            const borrower = ratings[borrowerId];
            if (borrower.name.toLowerCase().includes(searchQuery) || borrowerId.includes(searchQuery)) {
                resultsHTML += `
                    <div class="borrower">
                        <h3>${borrower.name} (ID: ${borrowerId})</h3>
                        <p>Total Rating: ${borrower.totalRating}</p>
                        <ul>
                            ${borrower.transactions.map(transaction => `
                                <li>Seller ID: ${transaction.sellerId}, Rating: ${transaction.rating}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
        }

        // Display search results
        searchResults.innerHTML = resultsHTML || "<p>No borrowers found.</p>";

        // Clear the search field
        searchForm.reset();
    });
});

// Function to generate a unique ID (for simplicity, we use a random number)
function generateUniqueId() {
    return 'ID-' + Math.floor(Math.random() * 1000000).toString();
}
