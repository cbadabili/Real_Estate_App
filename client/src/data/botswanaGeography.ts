// Botswana geographical hierarchy data for auto-suggestion and population
export interface District {
  name: string;
  code: string;
  cities: City[];
}

export interface City {
  name: string;
  zipCodes: string[];
  wards?: string[];
}

export const botswanaDistricts: District[] = [
  {
    name: "South-East",
    code: "SE",
    cities: [
      {
        name: "Gaborone",
        zipCodes: ["0000", "0001", "0002", "0003"],
        wards: [
          "Broadhurst",
          "Extension 1", "Extension 2", "Extension 3", "Extension 4",
          "Extension 5", "Extension 6", "Extension 7", "Extension 8",
          "Extension 9", "Extension 10", "Extension 11", "Extension 12",
          "Extension 13", "Extension 14", "Extension 15", "Extension 16",
          "Extension 17", "Extension 18", "Extension 19", "Extension 20",
          "Gaborone West",
          "Mogoditshane",
          "Old Naledi",
          "Phakalane",
          "Tlokweng"
        ]
      },
      {
        name: "Lobatse",
        zipCodes: ["0100", "0101"],
        wards: ["Block A", "Block B", "Block C", "Peleng"]
      },
      {
        name: "Ramotswa",
        zipCodes: ["0200"],
        wards: ["Ramotswa Ward 1", "Ramotswa Ward 2"]
      }
    ]
  },
  {
    name: "Central",
    code: "CE",
    cities: [
      {
        name: "Serowe",
        zipCodes: ["0300", "0301"],
        wards: ["Serowe Ward 1", "Serowe Ward 2", "Serowe Ward 3"]
      },
      {
        name: "Palapye",
        zipCodes: ["0400"],
        wards: ["Palapye Ward 1", "Palapye Ward 2"]
      },
      {
        name: "Mahalapye",
        zipCodes: ["0500"],
        wards: ["Mahalapye Ward 1", "Mahalapye Ward 2"]
      }
    ]
  },
  {
    name: "North-East",
    code: "NE",
    cities: [
      {
        name: "Francistown",
        zipCodes: ["0600", "0601", "0602"],
        wards: [
          "Area A", "Area B", "Area C", "Area D",
          "Monarch", "Tati Siding", "Gerald Estate",
          "Tshesebe", "Copper Sunrise"
        ]
      },
      {
        name: "Selebi-Phikwe",
        zipCodes: ["0700"],
        wards: ["Boseja", "Selebi", "Phikwe"]
      }
    ]
  },
  {
    name: "North-West",
    code: "NW",
    cities: [
      {
        name: "Maun",
        zipCodes: ["0800"],
        wards: ["Boro", "Disaneng", "Mathiba", "Sexaxa"]
      },
      {
        name: "Shakawe",
        zipCodes: ["0900"],
        wards: ["Shakawe Ward 1", "Shakawe Ward 2"]
      }
    ]
  },
  {
    name: "Kgalagadi",
    code: "KG",
    cities: [
      {
        name: "Ghanzi",
        zipCodes: ["1000"],
        wards: ["Ghanzi Ward 1", "Ghanzi Ward 2"]
      },
      {
        name: "Tsabong",
        zipCodes: ["1100"],
        wards: ["Tsabong Ward 1"]
      }
    ]
  },
  {
    name: "Kgatleng",
    code: "KT",
    cities: [
      {
        name: "Mochudi",
        zipCodes: ["1200"],
        wards: ["Mochudi Ward 1", "Mochudi Ward 2", "Mochudi Ward 3"]
      }
    ]
  },
  {
    name: "Kweneng",
    code: "KW",
    cities: [
      {
        name: "Molepolole",
        zipCodes: ["1300"],
        wards: ["Molepolole Ward 1", "Molepolole Ward 2", "Molepolole Ward 3"]
      }
    ]
  },
  {
    name: "Southern",
    code: "SO",
    cities: [
      {
        name: "Kanye",
        zipCodes: ["1400"],
        wards: ["Kanye Ward 1", "Kanye Ward 2", "Kanye Ward 3"]
      },
      {
        name: "Jwaneng",
        zipCodes: ["1500"],
        wards: ["Units 1", "Units 2", "Units 3", "Units 4"]
      }
    ]
  },
  {
    name: "Chobe",
    code: "CH",
    cities: [
      {
        name: "Kasane",
        zipCodes: ["1600"],
        wards: ["Kasane Ward 1", "Kasane Ward 2"]
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

export const getZipCodesByCity = (cityName: string): string[] => {
  const result = getCityByName(cityName);
  return result ? result.city.zipCodes : [];
};

export const getWardsByCity = (cityName: string): string[] => {
  const result = getCityByName(cityName);
  return result ? result.city.wards || [] : [];
};

export const getAllCities = (): string[] => {
  return botswanaDistricts.flatMap(district => 
    district.cities.map(city => city.name)
  );
};

export const getAllDistricts = (): string[] => {
  return botswanaDistricts.map(district => district.name);
};