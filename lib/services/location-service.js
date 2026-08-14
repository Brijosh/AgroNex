/**
 * Open-Source Location & Geocoding Service
 * Powered by OpenStreetMap Nominatim API (100% free open-source, zero API key required).
 */

const FALLBACK_LOCATIONS = {
  "kochi": { locationName: "Kochi, Kerala", latitude: 9.9312, longitude: 76.2673, state: "Kerala", country: "India" },
  "ludhiana": { locationName: "Ludhiana, Punjab", latitude: 30.9010, longitude: 75.8573, state: "Punjab", country: "India" },
  "pune": { locationName: "Pune, Maharashtra", latitude: 18.5204, longitude: 73.8567, state: "Maharashtra", country: "India" },
  "default": { locationName: "Kochi, Kerala", latitude: 9.9312, longitude: 76.2673, state: "Kerala", country: "India" }
};

/**
 * Searches for location suggestions matching a text query using Nominatim API.
 * @param {string} query - Location text search (e.g., "Kochi", "Ludhiana")
 * @returns {Promise<Array<Object>>} Array of geocoded location objects
 */
async function searchLocation(query) {
  if (!query || query.trim().length < 2) return [FALLBACK_LOCATIONS["default"]];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "CropWise-Agricultural-Platform/1.0",
        "Accept": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Nominatim HTTP error: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return [getFallbackLocation(query)];
    }

    return data.map((item) => ({
      locationName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.village || item.name,
      state: item.address?.state || "",
      country: item.address?.country || "India",
      isLive: true,
    }));
  } catch (error) {
    console.warn("OpenStreetMap Nominatim call failed, using fallback:", error.message);
    return [getFallbackLocation(query)];
  }
}

/**
 * Reverse geocodes latitude/longitude coordinates to location details.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Location object
 */
async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "CropWise-Agricultural-Platform/1.0",
        "Accept": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Reverse Nominatim HTTP error: ${res.status}`);

    const data = await res.json();
    return {
      locationName: data.display_name || `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      latitude: parseFloat(data.lat) || latitude,
      longitude: parseFloat(data.lon) || longitude,
      city: data.address?.city || data.address?.town || data.address?.village || "Regional Hub",
      state: data.address?.state || "",
      country: data.address?.country || "India",
      isLive: true,
    };
  } catch (error) {
    return {
      locationName: `Farm at (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      latitude,
      longitude,
      city: "Detected Location",
      state: "Regional Area",
      country: "India",
      isLive: false,
    };
  }
}

function getFallbackLocation(query) {
  const key = Object.keys(FALLBACK_LOCATIONS).find((k) => query.toLowerCase().includes(k));
  return FALLBACK_LOCATIONS[key] || {
    ...FALLBACK_LOCATIONS["default"],
    locationName: query,
  };
}

module.exports = { searchLocation, reverseGeocode, FALLBACK_LOCATIONS };
