const button = document.getElementById("button");

if (button) {
    button.addEventListener("click", () => {
        console.log("Button clicked!");
    });
    } else {
console.error("Button with ID 'button' not found.");
}