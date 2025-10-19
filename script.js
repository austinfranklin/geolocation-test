(() => {
  let watchId = null;
  let lastPos = null;
  let intervalId = null;
  let origin = null;

  const dot  = document.getElementById("dot");
  const info = document.getElementById("info");

  function updateDot(pos) {
    if (!origin)
      origin = { lat: pos.coords.latitude, lon: pos.coords.longitude };

    const dx = (pos.coords.longitude - origin.lon) * 100000;
    const dy = (pos.coords.latitude  - origin.lat) * -100000;

    const map = document.getElementById("map");
    const centerX = map.clientWidth / 2;
    const centerY = map.clientHeight / 2;

    dot.style.left = `${centerX + dx}px`;
    dot.style.top  = `${centerY + dy}px`;

    info.textContent =
      `Lat: ${pos.coords.latitude.toFixed(5)} ` +
      `Lon: ${pos.coords.longitude.toFixed(5)} ` +
      `Acc: ±${pos.coords.accuracy.toFixed(1)} m`;
  }

  function buildPayload(pos) {
    return {
      type: "geolocation",
      method: "poll",
      timestamp: new Date(pos.timestamp).toISOString(),
      coords: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        altitude: pos.coords.altitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed
      }
    };
  }

  function onSuccess(pos) {
    lastPos = pos;
    updateDot(pos);
  }

  function onError(err) {
    console.warn(`[geo] ${err.message}`);
  }

  async function start() {
    if (watchId !== null) return;

    if (!("geolocation" in navigator)) {
      console.error("[geo] not supported");
      return;
    }

    console.info("[geo] starting continuous watch…");
    info.textContent = "Tracking active — waiting for fix…";

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    });

    // Independent 5 s ticker
    intervalId = setInterval(() => {
      if (lastPos) {
        const payload = buildPayload(lastPos);
        console.log(JSON.stringify(payload));   // send this over DataChannel
      }
    }, 5000);
  }

  function stop() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    info.textContent = "Tracking stopped.";
    console.info("[geo] stopped");
  }

  window.GeoWatcher = { start, stop };
})();

document.getElementById("button_start")
  .addEventListener("click", () => GeoWatcher.start());
