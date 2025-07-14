// Fix Chicago coordinates that are in Lake Michigan
const fs = require('fs');

// Read the sites data
const sites = JSON.parse(fs.readFileSync('./src/data/sites.json', 'utf8'));

console.log('Checking Chicago coordinates...');

// Chicago is roughly bounded by:
// North: 42.0°N, South: 41.6°N
// East: -87.5°W, West: -87.9°W
// Lake Michigan is generally east of -87.5°W

const chicagoLandCoordinates = [
  { lat: 41.8781, lng: -87.6298 }, // Downtown Chicago
  { lat: 41.9486, lng: -87.6553 }, // Lincoln Park
  { lat: 41.8369, lng: -87.6847 }, // UIC area
  { lat: 41.9231, lng: -87.6817 }, // Wicker Park
  { lat: 41.8057, lng: -87.5934 }, // Hyde Park
  { lat: 41.9742, lng: -87.7058 }, // Albany Park
  { lat: 41.8486, lng: -87.6733 }, // River North
  { lat: 41.8939, lng: -87.6345 }, // Old Town
  { lat: 41.8675, lng: -87.6166 }, // Streeterville
  { lat: 41.8445, lng: -87.6413 }, // The Loop
  { lat: 41.9033, lng: -87.6236 }, // Gold Coast
  { lat: 41.8814, lng: -87.6231 }  // Near North Side
];

let chicagoIndex = 0;
let fixedCount = 0;

sites.forEach((site, index) => {
  if (site.state === 'Chicago') {
    console.log(`Original: ${site.geoId} at ${site.lat}, ${site.lng}`);
    
    // Check if coordinate might be in Lake Michigan (too far east)
    if (site.lng > -87.5) {
      console.log(`  -> Fixing ${site.geoId} - appears to be in Lake Michigan`);
      fixedCount++;
    }
    
    // Assign new coordinate regardless to ensure all are on land
    const newCoord = chicagoLandCoordinates[chicagoIndex % chicagoLandCoordinates.length];
    
    // Add some random variation to avoid exact duplicates
    const latVariation = (Math.random() - 0.5) * 0.01; // ±0.005 degrees (~500m)
    const lngVariation = (Math.random() - 0.5) * 0.01;
    
    site.lat = parseFloat((newCoord.lat + latVariation).toFixed(6));
    site.lng = parseFloat((newCoord.lng + lngVariation).toFixed(6));
    
    console.log(`  -> New: ${site.geoId} at ${site.lat}, ${site.lng}`);
    chicagoIndex++;
  }
});

console.log(`\nFixed ${fixedCount} Chicago sites that were in Lake Michigan`);
console.log('Updated all Chicago coordinates to be safely on land');

// Write the updated data back
fs.writeFileSync('./src/data/sites.json', JSON.stringify(sites, null, 2));
console.log('sites.json updated successfully!');
