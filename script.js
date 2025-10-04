const button = document.getElementById("button");

if (window.max) {
    console.log("This webpage is loaded in Max, from a jweb object");
} else {
    console.log("This webpage is not loaded in Max.")
}

if (button) {
    button.addEventListener("click", () => {
        console.log("Button clicked!");
        window.max.outlet("Works!")
    });
    } else {
console.error("Button with ID 'button' not found.");
}