// DOM elements
const loadingSection = document.getElementById("loading")
const authRequiredSection = document.getElementById("auth-required")
const authenticatedSection = document.getElementById("authenticated")
const loginBtn = document.getElementById("login-btn")
const bookmarkBtn = document.getElementById("bookmark-btn")
const currentUrlDiv = document.getElementById("current-url")
const statusDiv = document.getElementById("status")

// API base URL
const API_BASE = "https://bookmarker.finxol.io"

// Current tab URL
let currentTabUrl = ""

// Initialize popup
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Get current tab URL
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        })
        currentTabUrl = tabs[0].url
        currentUrlDiv.textContent = currentTabUrl

        // Check authentication status
        await checkAuthStatus()
    } catch (error) {
        console.error("Error initializing popup:", error)
        showError("Failed to initialize extension")
    }
})

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.ok) {
            // User is authenticated
            showAuthenticatedView()
        } else {
            // User is not authenticated
            showAuthRequiredView()
        }
    } catch (error) {
        console.error("Error checking auth status:", error)
        // Assume not authenticated on error
        showAuthRequiredView()
    }
}

// Show authenticated view
function showAuthenticatedView() {
    loadingSection.classList.add("hidden")
    authRequiredSection.classList.add("hidden")
    authenticatedSection.classList.remove("hidden")
}

// Show auth required view
function showAuthRequiredView() {
    loadingSection.classList.add("hidden")
    authenticatedSection.classList.add("hidden")
    authRequiredSection.classList.remove("hidden")
}

// Show error message
function showError(message) {
    statusDiv.textContent = message
    statusDiv.className = "status error"
    statusDiv.style.display = "block"
}

// Show success message
function showSuccess(message) {
    statusDiv.textContent = message
    statusDiv.className = "status success"
    statusDiv.style.display = "block"
}

// Show info message
function showInfo(message) {
    statusDiv.textContent = message
    statusDiv.className = "status info"
    statusDiv.style.display = "block"
}

// Clear status message
function clearStatus() {
    statusDiv.style.display = "none"
    statusDiv.textContent = ""
    statusDiv.className = "status"
}

// Handle login button click
loginBtn.addEventListener("click", () => {
    // Open auth page in new tab
    browser.tabs.create({
        url: `${API_BASE}/auth/authorize`,
    })

    // Close popup
    window.close()
})

// Handle bookmark button click
bookmarkBtn.addEventListener("click", async () => {
    await bookmarkCurrentPage()
})

// Bookmark the current page
async function bookmarkCurrentPage() {
    if (!currentTabUrl) {
        showError("No URL to bookmark")
        return
    }

    // Disable button and show loading state
    bookmarkBtn.disabled = true
    bookmarkBtn.textContent = "Bookmarking..."
    clearStatus()

    try {
        const encodedUrl = encodeURIComponent(currentTabUrl)
        const response = await fetch(
            `${API_BASE}/bookmarks/add?url=${encodedUrl}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )

        if (response.ok) {
            showSuccess("Page bookmarked successfully!")
            // Auto-close popup after success
            setTimeout(() => {
                window.close()
            }, 1500)
        } else if (response.status === 401) {
            // User is no longer authenticated
            showAuthRequiredView()
            showError("Authentication required. Please log in again.")
        } else if (response.status === 409) {
            // Bookmark already exists
            showInfo("This page is already bookmarked!")
        } else {
            // Other error
            const errorText = await response.text()
            showError(`Failed to bookmark: ${errorText || "Unknown error"}`)
        }
    } catch (error) {
        console.error("Error bookmarking page:", error)
        showError("Network error. Please try again.")
    } finally {
        // Re-enable button
        bookmarkBtn.disabled = false
        bookmarkBtn.textContent = "Bookmark This Page"
    }
}

// Handle keyboard shortcuts
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (!authRequiredSection.classList.contains("hidden")) {
            loginBtn.click()
        } else if (!authenticatedSection.classList.contains("hidden")) {
            bookmarkBtn.click()
        }
    }

    if (event.key === "Escape") {
        window.close()
    }
})
