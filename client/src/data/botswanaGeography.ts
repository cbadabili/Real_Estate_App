export interface District {
  name: string;
  code: string;
  towns: Town[];
}

export interface Town {
  name: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  postCode: string;
}

export const botswanaDistricts: District[] = [
  {
    name: "South-East",
    code: "SE",
    towns: [
      { name: "Gaborone", district: "South-East", coordinates: { lat: -24.6282, lng: 25.9231 }, postCode: "00000" },
      { name: "Lobatse", district: "South-East", coordinates: { lat: -25.2270, lng: 25.6689 }, postCode: "00001" },
      { name: "Ramotswa", district: "South-East", coordinates: { lat: -24.8667, lng: 25.8667 }, postCode: "00002" },
      { name: "Kanye", district: "South-East", coordinates: { lat: -24.9667, lng: 25.3333 }, postCode: "00003" },
      { name: "Molepolole", district: "South-East", coordinates: { lat: -24.4167, lng: 25.4833 }, postCode: "00004" },
      { name: "Mogoditshane", district: "South-East", coordinates: { lat: -24.6378, lng: 25.8661 }, postCode: "00005" },
      { name: "Tlokweng", district: "South-East", coordinates: { lat: -24.6667, lng: 25.9833 }, postCode: "00006" },
      { name: "Gabane", district: "South-East", coordinates: { lat: -24.6833, lng: 25.8167 }, postCode: "00007" },
      { name: "Mmopane", district: "South-East", coordinates: { lat: -24.5833, lng: 25.8167 }, postCode: "00008" },
      { name: "Kopong", district: "South-East", coordinates: { lat: -24.5000, lng: 25.8500 }, postCode: "00009" }
    ]
  },
  {
    name: "North-East",
    code: "NE", 
    towns: [
      { name: "Francistown", district: "North-East", coordinates: { lat: -21.1670, lng: 27.5080 }, postCode: "10000" },
      { name: "Selebi-Phikwe", district: "North-East", coordinates: { lat: -22.0000, lng: 27.8833 }, postCode: "10001" },
      { name: "Tonota", district: "North-East", coordinates: { lat: -21.4333, lng: 27.4667 }, postCode: "10002" },
      { name: "Tutume", district: "North-East", coordinates: { lat: -20.9833, lng: 27.2500 }, postCode: "10003" },
      { name: "Nata", district: "North-East", coordinates: { lat: -20.2167, lng: 26.1833 }, postCode: "10004" },
      { name: "Bobonong", district: "North-East", coordinates: { lat: -22.6500, lng: 27.2833 }, postCode: "10005" },
      { name: "Tati", district: "North-East", coordinates: { lat: -21.0833, lng: 27.4167 }, postCode: "10006" }
    ]
  },
  {
    name: "North-West",
    code: "NW",
    towns: [
      { name: "Maun", district: "North-West", coordinates: { lat: -19.9833, lng: 23.4167 }, postCode: "20000" },
      { name: "Kasane", district: "North-West", coordinates: { lat: -17.8167, lng: 25.1500 }, postCode: "20001" },
      { name: "Shakawe", district: "North-West", coordinates: { lat: -18.3667, lng: 21.8333 }, postCode: "20002" },
      { name: "Gumare", district: "North-West", coordinates: { lat: -19.3667, lng: 22.1667 }, postCode: "20003" },
      { name: "Nokaneng", district: "North-West", coordinates: { lat: -19.6667, lng: 21.4167 }, postCode: "20004" },
      { name: "Seronga", district: "North-West", coordinates: { lat: -18.8167, lng: 22.4000 }, postCode: "20005" },
      { name: "Tsau", district: "North-West", coordinates: { lat: -20.1667, lng: 22.4167 }, postCode: "20006" }
    ]
  },
  {
    name: "Central",
    code: "CE",
    towns: [
      { name: "Serowe", district: "Central", coordinates: { lat: -22.3833, lng: 26.7167 }, postCode: "30000" },
      { name: "Palapye", district: "Central", coordinates: { lat: -22.5500, lng: 27.1333 }, postCode: "30001" },
      { name: "Mahalapye", district: "Central", coordinates: { lat: -23.1000, lng: 26.7833 }, postCode: "30002" },
      { name: "Shoshong", district: "Central", coordinates: { lat: -23.0333, lng: 26.4833 }, postCode: "30003" },
      { name: "Boteti", district: "Central", coordinates: { lat: -20.4833, lng: 24.8833 }, postCode: "30004" },
      { name: "Orapa", district: "Central", coordinates: { lat: -21.3167, lng: 25.3833 }, postCode: "30005" },
      { name: "Letlhakane", district: "Central", coordinates: { lat: -21.4167, lng: 25.5833 }, postCode: "30006" }
    ]
  },
  {
    name: "Kweneng",
    code: "KW",
    towns: [
      { name: "Molepolole", district: "Kweneng", coordinates: { lat: -24.4167, lng: 25.4833 }, postCode: "40000" },
      { name: "Thamaga", district: "Kweneng", coordinates: { lat: -24.6500, lng: 25.5333 }, postCode: "40001" },
      { name: "Kumakwane", district: "Kweneng", coordinates: { lat: -24.5833, lng: 25.7333 }, postCode: "40002" },
      { name: "Letlhakeng", district: "Kweneng", coordinates: { lat: -24.1000, lng: 25.0167 }, postCode: "40003" },
      { name: "Mokatse", district: "Kweneng", coordinates: { lat: -24.3667, lng: 25.3000 }, postCode: "40004" }
    ]
  },
  {
    name: "Southern",
    code: "SO",
    towns: [
      { name: "Kanye", district: "Southern", coordinates: { lat: -24.9667, lng: 25.3333 }, postCode: "50000" },
      { name: "Jwaneng", district: "Southern", coordinates: { lat: -24.6000, lng: 24.7167 }, postCode: "50001" },
      { name: "Tshabong", district: "Southern", coordinates: { lat: -26.0167, lng: 22.4000 }, postCode: "50002" },
      { name: "Goodhope", district: "Southern", coordinates: { lat: -26.0333, lng: 21.1167 }, postCode: "50003" },
      { name: "Kang", district: "Southern", coordinates: { lat: -25.0167, lng: 23.0333 }, postCode: "50004" },
      { name: "Hukuntsi", district: "Southern", coordinates: { lat: -23.9833, lng: 21.7833 }, postCode: "50005" }
    ]
  },
  {
    name: "Kgatleng",
    code: "KL",
    towns: [
      { name: "Mochudi", district: "Kgatleng", coordinates: { lat: -24.4333, lng: 26.1500 }, postCode: "60000" },
      { name: "Artesia", district: "Kgatleng", coordinates: { lat: -24.5167, lng: 26.0333 }, postCode: "60001" },
      { name: "Oodi", district: "Kgatleng", coordinates: { lat: -24.3833, lng: 26.0833 }, postCode: "60002" }
    ]
  },
  {
    name: "Kgalagadi",
    code: "KG",
    towns: [
      { name: "Ghanzi", district: "Kgalagadi", coordinates: { lat: -21.6833, lng: 21.6333 }, postCode: "70000" },
      { name: "Tsabong", district: "Kgalagadi", coordinates: { lat: -26.0167, lng: 22.4000 }, postCode: "70001" },
      { name: "Hukuntsi", district: "Kgalagadi", coordinates: { lat: -23.9833, lng: 21.7833 }, postCode: "70002" },
      { name: "Kang", district: "Kgalagadi", coordinates: { lat: -25.0167, lng: 23.0333 }, postCode: "70003" }
    ]
  },
  {
    name: "Chobe",
    code: "CH",
    towns: [
      { name: "Kasane", district: "Chobe", coordinates: { lat: -17.8167, lng: 25.1500 }, postCode: "80000" },
      { name: "Kazungula", district: "Chobe", coordinates: { lat: -17.7833, lng: 25.2667 }, postCode: "80001" },
      { name: "Pandamatenga", district: "Chobe", coordinates: { lat: -18.5833, lng: 25.6167 }, postCode: "80002" }
    ]
  }
];

export const getAllTowns = (): Town[] => {
  return botswanaDistricts.flatMap(district => district.towns);
};

export const getTownsByDistrict = (districtName: string): Town[] => {
  const district = botswanaDistricts.find(d => d.name === districtName);
  return district ? district.towns : [];
};

export const getDistrictNames = (): string[] => {
  return botswanaDistricts.map(district => district.name);
};

export const getTownNames = (): string[] => {
  return getAllTowns().map(town => town.name);
};

export const findTownByName = (name: string): Town | undefined => {
  return getAllTowns().find(town => town.name.toLowerCase() === name.toLowerCase());
};

export const getNearbyTowns = (lat: number, lng: number, radiusKm: number = 50): Town[] => {
  const allTowns = getAllTowns();
  return allTowns.filter(town => {
    const distance = calculateDistance(lat, lng, town.coordinates.lat, town.coordinates.lng);
    return distance <= radiusKm;
  });
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};