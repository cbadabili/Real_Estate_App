// Botswana geographical hierarchy data for auto-suggestion and population
export interface District {
  name: string;
  code: string;
  cities: City[];
}

export interface City {
  name: string;
  wards: string[];
}

export const botswanaDistricts: District[] = [
  {
    name: "South-East",
    code: "SE",
    cities: [
      {
        name: "Gaborone",
        wards: [
          // Central Gaborone
          "Broadhurst",
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5", 
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          
          // Extensions
          "Extension 1", "Extension 2", "Extension 3", "Extension 4",
          "Extension 5", "Extension 6", "Extension 7", "Extension 8",
          "Extension 9", "Extension 10", "Extension 11", "Extension 12",
          "Extension 13", "Extension 14", "Extension 15", "Extension 16",
          "Extension 17", "Extension 18", "Extension 19", "Extension 20",
          
          // Modern Areas
          "Gaborone West",
          "CBD (Central Business District)",
          "Fairgrounds",
          "Government Enclave",
          "Village",
          "The Mall",
          "Old Naledi",
          "White City",
          "Bontleng",
          "Sebele",
          
          // Peri-urban Areas
          "Mogoditshane",
          "Gabane",
          "Tlokweng",
          "Mmopane",
          "Kumakwane",
          
          // Upmarket Areas
          "Phakalane",
          "Phakalane Estates",
          "Phakalane Golf Estate",
          "River Walk",
          "Masa Centre",
          "Gaborone North",
          "Ledumang",
          "Tawana",
          
          // Industrial Areas
          "Gaborone International Commerce Park",
          "Block 3 Industrial",
          "Block 5 Industrial",
          "Broadhurst Industrial"
        ]
      },
      {
        name: "Lobatse",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Peleng",
          "Lobatse Central",
          "Industrial Area",
          "New Stands"
        ]
      },
      {
        name: "Ramotswa",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Ramotswa Central",
          "New Layout"
        ]
      }
    ]
  },
  {
    name: "Central",
    code: "CE",
    cities: [
      {
        name: "Serowe",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Serowe Central",
          "Boiteko",
          "Sekgoma",
          "Motswasele",
          "New Layout"
        ]
      },
      {
        name: "Palapye",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Palapye Central",
          "Lotsane",
          "New Stands",
          "Industrial Area"
        ]
      },
      {
        name: "Mahalapye",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Mahalapye Central",
          "Shoshong Road",
          "New Layout"
        ]
      }
    ]
  },
  {
    name: "North-East",
    code: "NE",
    cities: [
      {
        name: "Francistown",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Area A", "Area B", "Area C", "Area D",
          "Monarch",
          "Tati Siding",
          "Gerald Estate",
          "Tshesebe",
          "Copper Sunrise",
          "Donga",
          "Kgaphamadi",
          "Francistown Central",
          "Industrial Area",
          "New Layout",
          "Tonota Road",
          "Blue Jacket Street",
          "Nyangabgwe",
          "Riverside"
        ]
      },
      {
        name: "Selebi-Phikwe",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Boseja",
          "Selebi",
          "Phikwe",
          "Central",
          "New Layout"
        ]
      }
    ]
  },
  {
    name: "North-West",
    code: "NW",
    cities: [
      {
        name: "Maun",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Boro",
          "Disaneng",
          "Mathiba",
          "Sexaxa",
          "Maun Central",
          "Boseja",
          "Matlapaneng",
          "Chanoga",
          "Sedie"
        ]
      },
      {
        name: "Shakawe",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Shakawe Central",
          "New Layout"
        ]
      }
    ]
  },
  {
    name: "Kgalagadi",
    code: "KG",
    cities: [
      {
        name: "Ghanzi",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Ghanzi Central",
          "New Layout"
        ]
      },
      {
        name: "Tsabong",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Tsabong Central"
        ]
      }
    ]
  },
  {
    name: "Kgatleng",
    code: "KT",
    cities: [
      {
        name: "Mochudi",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Mochudi Central",
          "Segwagwa",
          "Mmakgodumo",
          "New Layout"
        ]
      }
    ]
  },
  {
    name: "Kweneng",
    code: "KW",
    cities: [
      {
        name: "Molepolole",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Molepolole Central",
          "Ntlhantlhe",
          "Mmopane",
          "New Layout"
        ]
      }
    ]
  },
  {
    name: "Southern",
    code: "SO",
    cities: [
      {
        name: "Kanye",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Kanye Central",
          "Selokolela",
          "Mmankgodi",
          "New Layout"
        ]
      },
      {
        name: "Jwaneng",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Units 1", "Units 2", "Units 3", "Units 4",
          "Extensions",
          "New Stands"
        ]
      }
    ]
  },
  {
    name: "Chobe",
    code: "CH",
    cities: [
      {
        name: "Kasane",
        wards: [
          "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
          "Block 6", "Block 7", "Block 8", "Block 9",
          "Phase 1", "Phase 2", "Phase 3", "Phase 4",
          "Kasane Central",
          "Kazungula",
          "New Layout"
        ]
      }
    ]
  }
];

// Helper functions for geographical auto-population
export const getDistrictByName = (name: string): District | undefined => {
  return botswanaDistricts.find(district => 
    district.name.toLowerCase() === name.toLowerCase()
  );
};

export const getCityByName = (cityName: string): { city: City; district: District } | undefined => {
  for (const district of botswanaDistricts) {
    const city = district.cities.find(c => 
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (city) {
      return { city, district };
    }
  }
  return undefined;
};

export const getWardsByCity = (cityName: string): string[] => {
  const result = getCityByName(cityName);
  return result ? result.city.wards : [];
};

export const getAllCities = (): string[] => {
  return botswanaDistricts.flatMap(district => 
    district.cities.map(city => city.name)
  );
};

export const getAllDistricts = (): string[] => {
  return botswanaDistricts.map(district => district.name);
};