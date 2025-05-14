console.log("Website loaded successfully!");
function openModal() {
    document.getElementById("demoModal").style.display = "block";
}

function closeModal() {
    document.getElementById("demoModal").style.display = "none";
}

// Optional: Close the modal when user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("demoModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

