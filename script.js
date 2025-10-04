document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  const micButton = document.getElementById("micButton");

  // First button — logs + sends to Max
  if (button) {
    button.addEventListener("click", () => {
      console.log("Button clicked!");
      if (window.max && window.max.outlet) {
        window.max.outlet("Works!");
      } else {
        console.warn("window.max not found; running outside Max environment.");
      }
    });
  } else {
    console.error("Button with ID 'button' not found.");
  }

  // Second button — activates microphone
  if (micButton) {
    micButton.addEventListener("click", async () => {
      console.log("Requesting microphone access...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted.");
        
        // Optional: connect to an audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(audioContext.destination); // direct passthrough (optional)

        if (window.max && window.max.outlet) {
          window.max.outlet("Microphone started");
        }
      } catch (err) {
        console.error("Microphone access denied:", err);
        if (window.max && window.max.outlet) {
          window.max.outlet("Microphone access denied");
        }
      }
    });
  } else {
    console.error("Button with ID 'micButton' not found.");
  }
});
