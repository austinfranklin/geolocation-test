const button = document.getElementById("button");

if (button) {
    button.addEventListener("click", () => {
        console.log("Button clicked!");
        window.max.outlet("Works!")
    });
    } else {
console.error("Button with ID 'button' not found.");
}