for (let zoomLevel = 1; zoomLevel <= 100; zoomLevel++) {
    const scale = 5 * Math.pow(2, Math.round(Math.log2(25 / zoomLevel)));
    console.log(`Zoom Level: ${zoomLevel}, Scale: ${scale}`);
  }
  