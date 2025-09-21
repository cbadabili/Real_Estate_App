import { db } from "./db";
import { districts, settlements, wards, plots } from "../shared/schema";
import { sql } from "drizzle-orm";

/**
 * Comprehensive Botswana Location Data Import
 * Based on 2022 Population and Housing Census Preliminary Results
 * 
 * Hierarchy: District → Settlement (City/Town/Village) → Ward → Plot
 */

export async function importLocationData() {
  console.log('🌍 Starting Botswana location data import...');

  try {
    // Import districts (28 Census Districts) with upserts for idempotency
    await importDistricts();
    console.log('✅ Imported/updated districts');

    // Import settlements (cities, towns, villages) with upserts
    await importSettlements();
    console.log('✅ Imported/updated settlements');

    // Import ward data where available with upserts
    await importWards();
    console.log('✅ Imported/updated wards');

    // Import basic plot structure for major areas with upserts
    await importBasicPlots();
    console.log('✅ Imported/updated basic plot structure');

    console.log('🎉 Location data import completed successfully!');
  } catch (error) {
    console.error('❌ Location data import failed:', error);
    throw error;
  }
}

async function importDistricts() {
  const districtsData = [
    // Cities
    { code: '01', name: 'Gaborone', type: 'city', region: 'Greater Gaborone', population: 244107, area_km2: 169 },
    { code: '02', name: 'Francistown', type: 'city', region: 'Northern', population: 102444, area_km2: 127 },

    // Towns
    { code: '03', name: 'Lobatse', type: 'town', region: 'Southern', population: 29457, area_km2: 21 },
    { code: '04', name: 'Selebi-Phikwe', type: 'town', region: 'Central', population: 41839, area_km2: 32 },
    { code: '05', name: 'Orapa', type: 'town', region: 'Mining Towns', population: 8614, area_km2: 15 },
    { code: '06', name: 'Jwaneng', type: 'town', region: 'Mining Towns', population: 18576, area_km2: 18 },
    { code: '07', name: 'Sowa Town', type: 'town', region: 'Mining Towns', population: 2901, area_km2: 8 },

    // Rural Districts - Southern Region
    { code: '10', name: 'Ngwaketse', type: 'rural_district', region: 'Southern', population: 140321, area_km2: 2899 },
    { code: '11', name: 'Barolong', type: 'rural_district', region: 'Southern', population: 58394, area_km2: 1312 },
    { code: '12', name: 'Ngwaketse West', type: 'rural_district', region: 'Southern', population: 23253, area_km2: 965 },
    { code: '20', name: 'South East', type: 'rural_district', region: 'Eastern', population: 111474, area_km2: 1780 },

    // Central Region Districts
    { code: '30', name: 'Kweneng East', type: 'rural_district', region: 'Central', population: 330442, area_km2: 4456 },
    { code: '31', name: 'Kweneng West', type: 'rural_district', region: 'Central', population: 57261, area_km2: 3187 },
    { code: '40', name: 'Kgatleng', type: 'rural_district', region: 'Eastern', population: 121411, area_km2: 7960 },
    { code: '50', name: 'Central Serowe-Palapye', type: 'rural_district', region: 'Central', population: 201775, area_km2: 8390 },
    { code: '51', name: 'Central Mahalapye', type: 'rural_district', region: 'Central', population: 130530, area_km2: 6421 },
    { code: '52', name: 'Central Bobonong', type: 'rural_district', region: 'Eastern', population: 76922, area_km2: 4897 },
    { code: '53', name: 'Central Boteti', type: 'rural_district', region: 'Central', population: 74099, area_km2: 4512 },
    { code: '54', name: 'Central Tutume', type: 'rural_district', region: 'Northern', population: 164228, area_km2: 8765 },
    { code: '60', name: 'North East', type: 'rural_district', region: 'Northern', population: 68910, area_km2: 5432 },

    // Northern Region Districts  
    { code: '70', name: 'Ngamiland East', type: 'rural_district', region: 'Northern', population: 120603, area_km2: 23456 },
    { code: '71', name: 'Ngamiland West', type: 'rural_district', region: 'Northern', population: 73122, area_km2: 19876 },
    { code: '72', name: 'Chobe', type: 'rural_district', region: 'Northern', population: 28388, area_km2: 20987 },
    { code: '73', name: 'Delta', type: 'rural_district', region: 'Northern', population: 2849, area_km2: 18543 },

    // Western Region Districts
    { code: '80', name: 'Ghanzi', type: 'rural_district', region: 'Western', population: 55396, area_km2: 117910 },
    { code: '81', name: 'CKGR', type: 'rural_district', region: 'Western', population: 488, area_km2: 52800 },

    // Southern Kalahari Districts
    { code: '90', name: 'Kgalagadi South', type: 'rural_district', region: 'Southern Kalahari', population: 35160, area_km2: 52632 },
    { code: '91', name: 'Kgalagadi North', type: 'rural_district', region: 'Southern Kalahari', population: 23215, area_km2: 43821 }
  ];

  // Calculate population density
  const districtsWithDensity = districtsData.map(district => ({
    ...district,
    population_density: district.population / district.area_km2
  }));

  await db.insert(districts).values(districtsWithDensity)
    .onConflictDoUpdate({
      target: districts.code,
      set: {
        name: sql`excluded.name`,
        type: sql`excluded.type`,
        region: sql`excluded.region`,
        population: sql`excluded.population`,
        area_km2: sql`excluded.area_km2`,
        population_density: sql`excluded.population_density`,
        updated_at: sql`now()`
      }
    });
}

async function importSettlements() {
  // Get district IDs for foreign keys
  const districtRecords = await db.select().from(districts);
  const districtMap = new Map(districtRecords.map(d => [d.name, d.id]));

  // Create a mapping from census district names to our district names
  const censusDistrictMapping = {
    'Gaborone City': 'Gaborone',
    'Francistown City': 'Francistown', 
    'Lobatse Town': 'Lobatse',
    'Selebi-Phikwe Town': 'Selebi-Phikwe',
    'Jwaneng Town': 'Jwaneng',
    'Orapa Town': 'Orapa',
    'Sowa Town': 'Sowa Town',
    'Goodhope': 'Barolong',
    'Kanye': 'Ngwaketse', 
    'Moshupa': 'Ngwaketse',
    'Mabutsane': 'Ngwaketse West',
    'Kweneng East': 'Kweneng East',
    'Letlhakeng': 'Kweneng West',
    'Mogoditshane': 'Kweneng East',
    'Kgatleng': 'Kgatleng',
    'North-East': 'North East',
    'Tutume': 'Central Tutume',
    'Tonota': 'Central Tutume',
    'Palapye': 'Central Serowe-Palapye',
    'Mahalapye': 'Central Mahalapye',
    'Serowe (Central)': 'Central Serowe-Palapye',
    'Boteti': 'Central Boteti',
    'Okavango': 'Ngamiland West',
    'North-West': 'Ngamiland East',
    'Chobe': 'Chobe',
    'Ghanzi': 'Ghanzi',
    'Charleshill': 'Ghanzi',
    'Kgalagadi North': 'Kgalagadi North',
    'Kgalagadi South': 'Kgalagadi South'
  };

  // Comprehensive census data from 2022 Population and Housing Census
  const censusData = [
    // Cities and Towns (from census file)
    ['Gaborone City', 'Gaborone'],
    ['Francistown City', 'Francistown'],
    ['Lobatse Town', 'Lobatse'],
    ['Selebi-Phikwe Town', 'Selebi-Phikwe'],
    ['Jwaneng Town', 'Jwaneng'],
    ['Orapa Town', 'Orapa'],
    ['Sowa Town', 'Sowa'],
    
    // Goodhope District Localities
    ['Goodhope', 'Goodhope'],
    ['Goodhope', 'Mabule'],
    ['Goodhope', 'Pitsane'],
    ['Goodhope', 'Metlojane'],
    ['Goodhope', 'Madingwane'],
    ['Goodhope', 'Logagane'],
    ['Goodhope', 'Hebron'],
    ['Goodhope', 'Ramatlabama'],
    ['Goodhope', 'Tswaanyaneng'],
    ['Goodhope', 'Mogobewakgomo'],
    ['Goodhope', 'Mogwalale'],
    ['Goodhope', 'Borobadilepe'],
    ['Goodhope', 'Matasalalo'],
    ['Goodhope', 'Papatlo'],
    ['Goodhope', 'Makokwe'],
    ['Goodhope', 'Phihetswane'],
    ['Goodhope', 'Marojane'],
    ['Goodhope', 'Kgoro'],
    ['Goodhope', 'Gamokoto'],
    ['Goodhope', 'Dinatshana'],
    ['Goodhope', 'Bethele'],
    ['Goodhope', 'Pitsane Potlokwe'],
    ['Goodhope', 'Malokaganyane'],
    ['Goodhope', 'Mmathethe'],
    ['Goodhope', 'Molapowabojang'],
    ['Goodhope', 'Digawana'],
    ['Goodhope', 'Lejwana'],
    ['Goodhope', 'Rakhuna'],
    ['Goodhope', 'Metlobo'],
    
    // Kanye District Localities
    ['Kanye', 'Kanye'],
    ['Kanye', 'Selokolela'],
    ['Kanye', 'Gasita'],
    ['Kanye', 'Lorolwane'],
    ['Kanye', 'Masoke'],
    ['Kanye', 'Maunyele'],
    ['Kanye', 'Gasethebe'],
    ['Kanye', 'Letlapana'],
    
    // Moshupa District Localities  
    ['Moshupa', 'Moshupa'],
    ['Moshupa', 'Manyana'],
    ['Moshupa', 'Lotlhakane West'],
    ['Moshupa', 'Ralekgetho'],
    ['Moshupa', 'Pitseng'],
    ['Moshupa', 'Seherelela'],
    ['Moshupa', 'Sesung'],
    ['Moshupa', 'Bikwe'],
    ['Moshupa', 'Ranaka (Ntlhantlhe)'],
    ['Moshupa', 'Lekgolobotlo'],
    ['Moshupa', 'Kgomokasitwa'],
    ['Moshupa', 'Magotlhwane'],
    ['Moshupa', 'Mogonye'],
    ['Moshupa', 'Moshaneng'],
    ['Moshupa', 'Diabo'],
    ['Moshupa', 'Dipotsana'],
    ['Moshupa', 'Segwagwa'],
    
    // Mabutsane District Localities
    ['Mabutsane', 'Mabutsane'],
    ['Mabutsane', 'Sekoma'],
    ['Mabutsane', 'Khakhea'],
    ['Mabutsane', 'Kokong'],
    ['Mabutsane', 'Keng'],
    ['Mabutsane', 'Morwamosu'],
    ['Mabutsane', 'Samane'],
    ['Mabutsane', 'Mahotshwane'],
    ['Mabutsane', 'Kanaku'],
    ['Mabutsane', 'Kutuku'],
    ['Mabutsane', 'Itholoke'],
    ['Mabutsane', 'Khonkhwa'],
    ['Mabutsane', 'Tsonyane'],
    ['Mabutsane', 'Betesankwe'],
    ['Mabutsane', 'Maokane'],
    ['Mabutsane', 'Sese'],
    
    // Kweneng East District Localities
    ['Kweneng East', 'Molepolole'],
    ['Kweneng East', 'Gabane'],
    ['Kweneng East', 'Kopong'],
    ['Kweneng East', 'Thamaga'],
    ['Kweneng East', 'Mmankgodi'],
    ['Kweneng East', 'Boatlaname'],
    ['Kweneng East', 'Lentsweletau'],
    ['Kweneng East', 'Lephepe'],
    ['Kweneng East', 'Sojwe'],
    ['Kweneng East', 'Shadishadi'],
    ['Kweneng East', 'Ditshukudu'],
    ['Kweneng East', 'Medie'],
    ['Kweneng East', 'Kgope'],
    ['Kweneng East', 'Dikgatlhong'],
    ['Kweneng East', 'Mahetlwe'],
    ['Kweneng East', 'Mogonono'],
    ['Kweneng East', 'Sorilatholo'],
    ['Kweneng East', 'Malwelwe'],
    ['Kweneng East', 'Ngware'],
    ['Kweneng East', 'Diphuduhudu'],
    ['Kweneng East', 'Mantshwabisi'],
    
    // Letlhakeng District Localities
    ['Letlhakeng', 'Letlhakeng'],
    ['Letlhakeng', 'Maboane'],
    ['Letlhakeng', 'Takatokwane'],
    ['Letlhakeng', 'Dutlwe'],
    ['Letlhakeng', 'Tshwaane'],
    ['Letlhakeng', 'Khekhenye'],
    ['Letlhakeng', 'Motokwe'],
    ['Letlhakeng', 'Tsetseng'],
    ['Letlhakeng', 'Ditshegwane'],
    ['Letlhakeng', 'Sesung'],
    ['Letlhakeng', 'Khudumelapye'],
    ['Letlhakeng', 'Salajwe'],
    ['Letlhakeng', 'Kaudwane'],
    ['Letlhakeng', 'Monwane'],
    ['Letlhakeng', 'Metsibotlhoko'],
    ['Letlhakeng', 'Xaxa (remote)'],
    
    // Mogoditshane District Localities
    ['Mogoditshane', 'Mogoditshane'],
    ['Mogoditshane', 'Mmopane'],
    ['Mogoditshane', 'Metsimotlhabe'],
    
    // Kgatleng District Localities  
    ['Kgatleng', 'Mochudi'],
    ['Kgatleng', 'Oodi'],
    ['Kgatleng', 'Bokaa'],
    ['Kgatleng', 'Artesia'],
    ['Kgatleng', 'Modipane'],
    ['Kgatleng', 'Mmathubudukwane'],
    ['Kgatleng', 'Malolwane'],
    ['Kgatleng', 'Matebeleng'],
    ['Kgatleng', 'Dikgonnye'],
    ['Kgatleng', 'Dikwididi'],
    ['Kgatleng', 'Kgomodiatshaba'],
    ['Kgatleng', 'Khurutshe'],
    ['Kgatleng', 'Leshibitse'],
    ['Kgatleng', 'Mabalane'],
    ['Kgatleng', 'Malotwana Siding'],
    ['Kgatleng', 'Morwa'],
    ['Kgatleng', 'Pilane'],
    ['Kgatleng', 'Ramonaka'],
    ['Kgatleng', 'Ramotlabaki'],
    ['Kgatleng', 'Rasesa'],
    ['Kgatleng', 'Sikwane'],
    ['Kgatleng', 'Oliphant\'s Drift'],
    
    // North-East District Localities
    ['North-East', 'Masunga'],
    ['North-East', 'Mapoka'],
    ['North-East', 'Botalaote'],
    ['North-East', 'Moroka'],
    ['North-East', 'Nlakhwane'],
    ['North-East', 'Tshesebe'],
    ['North-East', 'Jackalas No.1'],
    ['North-East', 'Jackalas No.2'],
    ['North-East', 'Themashanga'],
    ['North-East', 'Senyawe'],
    ['North-East', 'Siviya'],
    ['North-East', 'Pole (Tshamataka)'],
    ['North-East', 'Sekakangwe'],
    ['North-East', 'Kalakamati'],
    ['North-East', 'Gulubane'],
    ['North-East', 'Mbalambi'],
    ['North-East', 'Mabudzane'],
    ['North-East', 'Masingwaneng'],
    ['North-East', 'Makaleng'],
    ['North-East', 'Tati Siding'],
    ['North-East', 'Matshelagabedi'],
    ['North-East', 'Matsiloje'],
    ['North-East', 'Ditladi'],
    ['North-East', 'Patayamatebele'],
    ['North-East', 'Ramokgwebana'],
    ['North-East', 'Mowana (Mupane)'],
    ['North-East', 'Mulambakwena'],
    ['North-East', 'Gungwe'],
    ['North-East', 'Gambule'],
    ['North-East', 'Masukwane (Sechele)'],
    ['North-East', 'Vukwi'],
    ['North-East', 'Zwenshambe'],
    
    // Tutume District Localities
    ['Tutume', 'Tutume'],
    ['Tutume', 'Maitengwe'],
    ['Tutume', 'Nkange'],
    ['Tutume', 'Nata'],
    ['Tutume', 'Maposa'],
    ['Tutume', 'Sepako'],
    ['Tutume', 'Manxotae'],
    ['Tutume', 'Gweta'],
    ['Tutume', 'Zoroga'],
    ['Tutume', 'Tsokatshaa'],
    ['Tutume', 'Dukwi'],
    ['Tutume', 'Makalaka'],
    ['Tutume', 'Mosetse'],
    ['Tutume', 'Majwaneng (Goshwe)'],
    ['Tutume', 'Mathangwane'],
    
    // Tonota District Localities
    ['Tonota', 'Tonota'],
    ['Tonota', 'Shashe Bridge'],
    ['Tonota', 'Mandunyane'],
    ['Tonota', 'Chadibe'],
    ['Tonota', 'Borolong'],
    ['Tonota', 'Mathangwane'],
    ['Tonota', 'Makobo'],
    ['Tonota', 'Natale'],
    ['Tonota', 'Mabesekwa'],
    ['Tonota', 'Semotswane'],
    ['Tonota', 'Makaleng'],
    ['Tonota', 'Matenge'],
    ['Tonota', 'Masingwaneng'],
    ['Tonota', 'Gulubane'],
    ['Tonota', 'Marapong'],
    
    // Palapye District Localities
    ['Palapye', 'Palapye'],
    ['Palapye', 'Malaka'],
    ['Palapye', 'Lecheng'],
    ['Palapye', 'Radisele'],
    ['Palapye', 'Maunatlala'],
    ['Palapye', 'Lerala'],
    ['Palapye', 'Mogapi'],
    ['Palapye', 'Pilikwe'],
    ['Palapye', 'Kalamare'],
    ['Palapye', 'Topisi'],
    ['Palapye', 'Moreomabele'],
    ['Palapye', 'Khurumela'],
    
    // Mahalapye District Localities
    ['Mahalapye', 'Mahalapye'],
    ['Mahalapye', 'Shoshong'],
    ['Mahalapye', 'Sefhare'],
    ['Mahalapye', 'Ramokgonami'],
    ['Mahalapye', 'Pilikwe'],
    ['Mahalapye', 'Kalamare'],
    ['Mahalapye', 'Mookane'],
    ['Mahalapye', 'Otse (Mahalapye)'],
    ['Mahalapye', 'Tewane'],
    ['Mahalapye', 'Mogorosi'],
    ['Mahalapye', 'Thabala'],
    ['Mahalapye', 'Moiyabana'],
    ['Mahalapye', 'Lorogorogoro (tiny)'],
    
    // Serowe (Central) District Localities
    ['Serowe (Central)', 'Serowe'],
    ['Serowe (Central)', 'Paje'],
    ['Serowe (Central)', 'Mmashoro'],
    ['Serowe (Central)', 'Mabeleapodi'],
    ['Serowe (Central)', 'Tshimoyapula'],
    ['Serowe (Central)', 'Majwanaadipitse'],
    ['Serowe (Central)', 'Moiyabana'],
    ['Serowe (Central)', 'Damuchojenaa'],
    ['Serowe (Central)', 'Dichwe'],
    ['Serowe (Central)', 'Malatswai'],
    
    // Boteti District Localities
    ['Boteti', 'Boteti (Rakops)'],
    ['Boteti', 'Letlhakane'],
    ['Boteti', 'Khumaga'],
    ['Boteti', 'Rakops'],
    ['Boteti', 'Mopipi'],
    ['Boteti', 'Xhumo'],
    ['Boteti', 'Mokoboxane'],
    ['Boteti', 'Kedia'],
    ['Boteti', 'Xere'],
    ['Boteti', 'Mmatshumo'],
    ['Boteti', 'Mmea'],
    ['Boteti', 'Mokubilo'],
    ['Boteti', 'Makgaba'],
    ['Boteti', 'Mosu'],
    ['Boteti', 'Moreomaoto'],
    ['Boteti', 'Motopi'],
    ['Boteti', 'Phuduhudu'],
    ['Boteti', 'Toromoja'],
    ['Boteti', 'Mmadikola'],
    ['Boteti', 'Malatswai'],
    ['Boteti', 'Orapa (town)'],
    ['Boteti', 'Makalamabedi'],
    
    // Okavango District Localities
    ['Okavango', 'Gumare'],
    ['Okavango', 'Shakawe'],
    ['Okavango', 'Etsha 6'],
    ['Okavango', 'Etsha 13'],
    ['Okavango', 'Ngarange'],
    ['Okavango', 'Seronga'],
    ['Okavango', 'Beetsha'],
    ['Okavango', 'Gudigwa'],
    ['Okavango', 'Gunotsoga'],
    ['Okavango', 'Eretsha'],
    ['Okavango', 'Kauxwi'],
    ['Okavango', 'Mbiroba (Xakao)'],
    ['Okavango', 'Mogotho'],
    ['Okavango', 'Sekondomboro'],
    ['Okavango', 'Tubu'],
    ['Okavango', 'Habu'],
    ['Okavango', 'Nxamasere'],
    ['Okavango', 'Mohembo East'],
    ['Okavango', 'Mohembo West'],
    ['Okavango', 'Ndundu'],
    ['Okavango', 'Xaxaba'],
    ['Okavango', 'Ditshiping'],
    ['Okavango', 'Xakanaxa'],
    
    // North-West District Localities
    ['North-West', 'Maun'],
    ['North-West', 'Sehithwa'],
    ['North-West', 'Toteng'],
    ['North-West', 'Kareng'],
    ['North-West', 'Tsao'],
    ['North-West', 'Nxaraga'],
    ['North-West', 'Komana'],
    ['North-West', 'Chanoga'],
    ['North-West', 'Khwai'],
    ['North-West', 'Mababe'],
    ['North-West', 'Sankuyo'],
    ['North-West', 'Phuduhudu (to Boteti)'],
    ['North-West', 'Pandamatenga (to Chobe)'],
    
    // Chobe District Localities
    ['Chobe', 'Kasane'],
    ['Chobe', 'Kazungula'],
    ['Chobe', 'Pandamatenga'],
    ['Chobe', 'Kachikau'],
    ['Chobe', 'Kavimba'],
    ['Chobe', 'Parakarungu'],
    ['Chobe', 'Satau'],
    ['Chobe', 'Mabele'],
    ['Chobe', 'Lesoma'],
    
    // Ghanzi District Localities
    ['Ghanzi', 'Ghanzi'],
    ['Ghanzi', 'D\\'Kar'],
    ['Ghanzi', 'Kuke'],
    ['Ghanzi', 'Qabo'],
    ['Ghanzi', 'Grootlaagte'],
    ['Ghanzi', 'New Xade'],
    ['Ghanzi', 'East Hanahai'],
    ['Ghanzi', 'West Hanahai'],
    ['Ghanzi', 'Kacgae'],
    ['Ghanzi', 'Bere'],
    ['Ghanzi', 'Metsiamanong (CKGR)'],
    ['Ghanzi', 'Molapo (CKGR)'],
    ['Ghanzi', 'Mothomelo (CKGR)'],
    ['Ghanzi', 'Gugamma (CKGR)'],
    
    // Charleshill District Localities
    ['Charleshill', 'Charles Hill'],
    ['Charleshill', 'Ncojane'],
    ['Charleshill', 'Karakubis'],
    ['Charleshill', 'Kole'],
    ['Charleshill', 'Makunda'],
    ['Charleshill', 'New Xanagas'],
    ['Charleshill', 'Xanagas'],
    ['Charleshill', 'Kalkfontein'],
    ['Charleshill', 'Chobokwane'],
    ['Charleshill', 'West Hanahai'],
    ['Charleshill', 'Metsimantle'],
    
    // Kgalagadi North District Localities
    ['Kgalagadi North', 'Hukuntsi'],
    ['Kgalagadi North', 'Lehututu'],
    ['Kgalagadi North', 'Tshane'],
    ['Kgalagadi North', 'Lokgwabe'],
    ['Kgalagadi North', 'Monong'],
    ['Kgalagadi North', 'Khawa'],
    
    // Kgalagadi South District Localities
    ['Kgalagadi South', 'Tsabong'],
    ['Kgalagadi South', 'Werda'],
    ['Kgalagadi South', 'Makopong'],
    ['Kgalagadi South', 'Middlepits'],
    ['Kgalagadi South', 'Bokspits'],
    ['Kgalagadi South', 'Vaalhoek'],
    ['Kgalagadi South', 'Struizendam'],
    ['Kgalagadi South', 'Khuis'],
    ['Kgalagadi South', 'Omaweneno'],
    ['Kgalagadi South', 'Gachibana'],
    ['Kgalagadi South', 'Ukwi']
  ];

  const settlementsData = [
    // GABORONE DISTRICT SETTLEMENTS
    { district: 'Gaborone', name: 'Gaborone', type: 'city', population: 244107, latitude: -24.6282, longitude: 25.9231, post_code: '00000', is_major: true },
    
    // FRANCISTOWN DISTRICT SETTLEMENTS  
    { district: 'Francistown', name: 'Francistown', type: 'city', population: 102444, latitude: -21.1670, longitude: 27.5080, post_code: '10000', is_major: true },
    { district: 'Francistown', name: 'Tati Siding', type: 'village', population: 12340, latitude: -21.0833, longitude: 27.4167, post_code: '10006', is_major: true },

    // TOWN DISTRICTS
    { district: 'Lobatse', name: 'Lobatse', type: 'town', population: 29457, latitude: -25.2270, longitude: 25.6689, post_code: '00001', is_major: true },
    { district: 'Selebi-Phikwe', name: 'Selebi-Phikwe', type: 'town', population: 41839, latitude: -22.0000, longitude: 27.8833, post_code: '10001', is_major: true },
    { district: 'Orapa', name: 'Orapa', type: 'town', population: 8614, latitude: -21.2500, longitude: 25.3833, post_code: '20010', is_major: true },
    { district: 'Jwaneng', name: 'Jwaneng', type: 'town', population: 18576, latitude: -24.6000, longitude: 24.7000, post_code: '30000', is_major: true },
    { district: 'Sowa Town', name: 'Sowa Town', type: 'town', population: 2901, latitude: -20.5667, longitude: 26.1167, post_code: '20005', is_major: false },

    // SOUTHERN DISTRICT SETTLEMENTS (Ngwaketse)
    { district: 'Ngwaketse', name: 'Kanye', type: 'village', population: 48030, latitude: -24.9667, longitude: 25.3333, post_code: '00003', is_major: true },
    { district: 'Ngwaketse', name: 'Moshupa', type: 'village', population: 23857, latitude: -24.5000, longitude: 25.0667, post_code: '00010', is_major: true },
    { district: 'Ngwaketse', name: 'Molapowabojang', type: 'village', population: 8730, latitude: -25.3333, longitude: 25.5000, post_code: '00011', is_major: true },
    { district: 'Ngwaketse', name: 'Sese', type: 'village', population: 6802, latitude: -24.8667, longitude: 24.5000, post_code: '00012', is_major: true },
    { district: 'Ngwaketse', name: 'Lotlhakane', type: 'village', population: 6049, latitude: -24.5500, longitude: 25.1500, post_code: '00013', is_major: true },

    // BAROLONG SETTLEMENTS
    { district: 'Barolong', name: 'Good Hope', type: 'village', population: 5669, latitude: -25.9000, longitude: 25.7500, post_code: '00020', is_major: true },
    { district: 'Barolong', name: 'Mmathethe', type: 'village', population: 5422, latitude: -25.7500, longitude: 25.6000, post_code: '00021', is_major: true },

    // SOUTH EAST DISTRICT SETTLEMENTS
    { district: 'South East', name: 'Tlokweng', type: 'village', population: 55517, latitude: -24.6667, longitude: 25.9833, post_code: '00006', is_major: true },
    { district: 'South East', name: 'Ramotswa', type: 'village', population: 33275, latitude: -24.8667, longitude: 25.8667, post_code: '00002', is_major: true },
    { district: 'South East', name: 'Otse', type: 'village', population: 6967, latitude: -24.7333, longitude: 25.9167, post_code: '00030', is_major: true },
    { district: 'South East', name: 'Ramotswa Station', type: 'village', population: 6287, latitude: -24.8833, longitude: 25.8833, post_code: '00031', is_major: true },

    // KWENENG EAST SETTLEMENTS
    { district: 'Kweneng East', name: 'Mogoditshane', type: 'village', population: 88098, latitude: -24.6378, longitude: 25.8661, post_code: '00005', is_major: true },
    { district: 'Kweneng East', name: 'Molepolole', type: 'village', population: 74719, latitude: -24.4167, longitude: 25.4833, post_code: '00004', is_major: true },
    { district: 'Kweneng East', name: 'Mmopane', type: 'village', population: 25355, latitude: -24.5833, longitude: 25.8167, post_code: '00008', is_major: true },
    { district: 'Kweneng East', name: 'Thamaga', type: 'village', population: 25319, latitude: -24.6000, longitude: 25.5333, post_code: '00040', is_major: true },
    { district: 'Kweneng East', name: 'Gabane', type: 'village', population: 20018, latitude: -24.6833, longitude: 25.8167, post_code: '00007', is_major: true },
    { district: 'Kweneng East', name: 'Kopong', type: 'village', population: 13820, latitude: -24.5000, longitude: 25.8500, post_code: '00009', is_major: true },
    { district: 'Kweneng East', name: 'Metsimotlhabe', type: 'village', population: 11597, latitude: -24.4833, longitude: 25.7000, post_code: '00041', is_major: true },
    { district: 'Kweneng East', name: 'Mmankgodi', type: 'village', population: 7399, latitude: -24.5167, longitude: 25.6000, post_code: '00042', is_major: true },
    { district: 'Kweneng East', name: 'Kumakwane', type: 'village', population: 6823, latitude: -24.4500, longitude: 25.8000, post_code: '00043', is_major: true },
    { district: 'Kweneng East', name: 'Lentsweletau', type: 'village', population: 6656, latitude: -24.3833, longitude: 25.6333, post_code: '00044', is_major: true },

    // KWENENG WEST SETTLEMENTS
    { district: 'Kweneng West', name: 'Letlhakeng', type: 'village', population: 8292, latitude: -24.1000, longitude: 25.0333, post_code: '00050', is_major: true },

    // KGATLENG SETTLEMENTS
    { district: 'Kgatleng', name: 'Mochudi', type: 'village', population: 49845, latitude: -24.4333, longitude: 26.1500, post_code: '50000', is_major: true },
    { district: 'Kgatleng', name: 'Oodi', type: 'village', population: 10258, latitude: -24.4000, longitude: 26.0500, post_code: '50001', is_major: true },
    { district: 'Kgatleng', name: 'Bokaa', type: 'village', population: 9143, latitude: -24.4667, longitude: 26.0833, post_code: '50002', is_major: true },
    { district: 'Kgatleng', name: 'Modipane', type: 'village', population: 7942, latitude: -24.3833, longitude: 26.0167, post_code: '50003', is_major: true },
    { district: 'Kgatleng', name: 'Rasesa', type: 'village', population: 5969, latitude: -24.5167, longitude: 26.1833, post_code: '50004', is_major: true },
    { district: 'Kgatleng', name: 'Morwa', type: 'village', population: 5009, latitude: -24.5500, longitude: 26.2167, post_code: '50005', is_major: true },

    // CENTRAL SEROWE-PALAPYE SETTLEMENTS
    { district: 'Central Serowe-Palapye', name: 'Serowe', type: 'village', population: 55484, latitude: -22.3833, longitude: 26.7167, post_code: '60000', is_major: true },
    { district: 'Central Serowe-Palapye', name: 'Palapye', type: 'village', population: 52398, latitude: -22.5500, longitude: 27.1167, post_code: '60001', is_major: true },
    { district: 'Central Serowe-Palapye', name: 'Lerala', type: 'village', population: 7171, latitude: -22.6833, longitude: 26.4833, post_code: '60002', is_major: true },

    // CENTRAL MAHALAPYE SETTLEMENTS
    { district: 'Central Mahalapye', name: 'Mahalapye', type: 'village', population: 47726, latitude: -23.1000, longitude: 26.8167, post_code: '61000', is_major: true },
    { district: 'Central Mahalapye', name: 'Shoshong', type: 'village', population: 8827, latitude: -23.1667, longitude: 26.5833, post_code: '61001', is_major: true },
    { district: 'Central Mahalapye', name: 'Sefhare', type: 'village', population: 5368, latitude: -23.2167, longitude: 26.9167, post_code: '61002', is_major: true },

    // CENTRAL BOBONONG SETTLEMENTS
    { district: 'Central Bobonong', name: 'Bobonong', type: 'village', population: 21001, latitude: -22.6500, longitude: 27.2833, post_code: '10005', is_major: true },
    { district: 'Central Bobonong', name: 'Mmadinare', type: 'village', population: 13087, latitude: -22.2000, longitude: 27.5000, post_code: '62001', is_major: true },
    { district: 'Central Bobonong', name: 'Sefhophe', type: 'village', population: 5968, latitude: -22.1000, longitude: 27.6833, post_code: '62002', is_major: true },
    { district: 'Central Bobonong', name: 'Tsetsebjwe', type: 'village', population: 5224, latitude: -22.7333, longitude: 27.5833, post_code: '62003', is_major: true },

    // CENTRAL BOTETI SETTLEMENTS
    { district: 'Central Boteti', name: 'Letlhakane', type: 'village', population: 36078, latitude: -21.4167, longitude: 25.5833, post_code: '20011', is_major: true },
    { district: 'Central Boteti', name: 'Rakops', type: 'village', population: 7367, latitude: -21.0333, longitude: 24.4000, post_code: '63001', is_major: true },

    // CENTRAL TUTUME SETTLEMENTS
    { district: 'Central Tutume', name: 'Tonota', type: 'village', population: 23007, latitude: -21.4333, longitude: 27.4667, post_code: '10002', is_major: true },
    { district: 'Central Tutume', name: 'Tutume', type: 'village', population: 18490, latitude: -20.9833, longitude: 27.2500, post_code: '10003', is_major: true },
    { district: 'Central Tutume', name: 'Nata', type: 'village', population: 7713, latitude: -20.2167, longitude: 26.1833, post_code: '10004', is_major: true },
    { district: 'Central Tutume', name: 'Chadibe', type: 'village', population: 7407, latitude: -21.1167, longitude: 27.4000, post_code: '64001', is_major: true },
    { district: 'Central Tutume', name: 'Borolong', type: 'village', population: 6770, latitude: -21.2000, longitude: 27.3500, post_code: '64002', is_major: true },
    { district: 'Central Tutume', name: 'Mathangwane', type: 'village', population: 5913, latitude: -21.0167, longitude: 27.3167, post_code: '64003', is_major: true },
    { district: 'Central Tutume', name: 'Maitengwe', type: 'village', population: 5864, latitude: -20.8833, longitude: 27.2167, post_code: '64004', is_major: true },
    { district: 'Central Tutume', name: 'Shashe Mooke', type: 'village', population: 5850, latitude: -21.0500, longitude: 27.5000, post_code: '64005', is_major: true },
    { district: 'Central Tutume', name: 'Gweta', type: 'village', population: 5529, latitude: -20.5667, longitude: 25.2333, post_code: '64006', is_major: true },

    // NORTH EAST SETTLEMENTS
    { district: 'North East', name: 'Masunga', type: 'village', population: 6108, latitude: -20.6500, longitude: 27.8000, post_code: '65001', is_major: true },

    // NGAMILAND EAST SETTLEMENTS
    { district: 'Ngamiland East', name: 'Maun', type: 'village', population: 85293, latitude: -19.9833, longitude: 23.4167, post_code: '20000', is_major: true },

    // NGAMILAND WEST SETTLEMENTS
    { district: 'Ngamiland West', name: 'Gumare', type: 'village', population: 11395, latitude: -19.3667, longitude: 22.1667, post_code: '20003', is_major: true },
    { district: 'Ngamiland West', name: 'Shakawe', type: 'village', population: 10492, latitude: -18.3667, longitude: 21.8333, post_code: '20002', is_major: true },

    // CHOBE SETTLEMENTS
    { district: 'Chobe', name: 'Kasane', type: 'village', population: 9013, latitude: -17.8167, longitude: 25.1500, post_code: '80000', is_major: true },
    { district: 'Chobe', name: 'Kazungula', type: 'village', population: 8642, latitude: -17.7833, longitude: 25.2667, post_code: '80001', is_major: true },

    // GHANZI SETTLEMENTS  
    { district: 'Ghanzi', name: 'Ghanzi', type: 'village', population: 18723, latitude: -21.6977, longitude: 21.6444, post_code: '70000', is_major: true },
    { district: 'Ghanzi', name: 'Charles Hill', type: 'village', population: 5111, latitude: -21.8333, longitude: 22.0167, post_code: '70001', is_major: true },

    // KGALAGADI SOUTH SETTLEMENTS
    { district: 'Kgalagadi South', name: 'Tsabong', type: 'village', population: 11577, latitude: -26.0500, longitude: 22.4167, post_code: '90000', is_major: true },

    // KGALAGADI NORTH SETTLEMENTS  
    { district: 'Kgalagadi North', name: 'Kang', type: 'village', population: 6608, latitude: -23.9667, longitude: 22.7833, post_code: '91000', is_major: true },
    { district: 'Kgalagadi North', name: 'Hukuntsi', type: 'village', population: 5184, latitude: -23.9833, longitude: 21.7667, post_code: '91001', is_major: true }
  ];

  // Add all census localities to settlements data
  const censusSettlements = [];
  for (const [censusDistrict, locality] of censusData) {
    const mappedDistrictName = censusDistrictMapping[censusDistrict];
    if (mappedDistrictName && districtMap.has(mappedDistrictName)) {
      // Skip if already exists in manual data
      const existsInManual = settlementsData.some(s => 
        s.district === mappedDistrictName && s.name === locality
      );
      
      if (!existsInManual) {
        censusSettlements.push({
          district: mappedDistrictName,
          name: locality,
          type: 'village',
          population: null, // Will be updated with actual census data later
          latitude: null,
          longitude: null,
          post_code: null,
          is_major: false
        });
      }
    }
  }
  
  // Combine manual and census data
  const allSettlements = [...settlementsData, ...censusSettlements];

  // Convert settlement data with district foreign keys
  const settlementsWithDistrictIds = allSettlements.map(settlement => ({
    district_id: districtMap.get(settlement.district)!,
    name: settlement.name,
    type: settlement.type,
    population: settlement.population,
    growth_rate: null, // Can be calculated later if needed
    latitude: settlement.latitude,
    longitude: settlement.longitude,
    post_code: settlement.post_code,
    is_major: settlement.is_major
  }));

  await db.insert(settlements).values(settlementsWithDistrictIds)
    .onConflictDoUpdate({
      target: [settlements.district_id, settlements.name],
      set: {
        type: sql`excluded.type`,
        population: sql`excluded.population`,
        growth_rate: sql`excluded.growth_rate`,
        latitude: sql`excluded.latitude`,
        longitude: sql`excluded.longitude`,
        post_code: sql`excluded.post_code`,
        is_major: sql`excluded.is_major`,
        updated_at: sql`now()`
      }
    });
}

async function importWards() {
  // Get settlement IDs for foreign keys
  const settlementRecords = await db.select().from(settlements);
  const settlementMap = new Map(settlementRecords.map(s => [s.name, s.id]));

  // Sample ward data for major cities and towns
  const wardsData = [
    // Gaborone Wards (simplified)
    { settlement: 'Gaborone', name: 'Central Business District', ward_number: 'Ward 1', constituency: 'Gaborone Central' },
    { settlement: 'Gaborone', name: 'Village', ward_number: 'Ward 2', constituency: 'Gaborone Central' },
    { settlement: 'Gaborone', name: 'Extension 2', ward_number: 'Ward 3', constituency: 'Gaborone Central' },
    { settlement: 'Gaborone', name: 'Broadhurst', ward_number: 'Ward 4', constituency: 'Gaborone North' },
    { settlement: 'Gaborone', name: 'Phase 1', ward_number: 'Ward 5', constituency: 'Gaborone North' },
    { settlement: 'Gaborone', name: 'Block 6', ward_number: 'Ward 6', constituency: 'Gaborone West' },
    { settlement: 'Gaborone', name: 'Block 7', ward_number: 'Ward 7', constituency: 'Gaborone West' },
    { settlement: 'Gaborone', name: 'Block 8', ward_number: 'Ward 8', constituency: 'Gaborone West' },
    { settlement: 'Gaborone', name: 'Block 9', ward_number: 'Ward 9', constituency: 'Gaborone West' },
    { settlement: 'Gaborone', name: 'Block 10', ward_number: 'Ward 10', constituency: 'Gaborone West' },

    // Francistown Wards
    { settlement: 'Francistown', name: 'Monarch', ward_number: 'Ward 1', constituency: 'Francistown East' },
    { settlement: 'Francistown', name: 'Blue Jacket', ward_number: 'Ward 2', constituency: 'Francistown East' },
    { settlement: 'Francistown', name: 'Tashaya', ward_number: 'Ward 3', constituency: 'Francistown West' },
    { settlement: 'Francistown', name: 'Aerial', ward_number: 'Ward 4', constituency: 'Francistown West' },
    { settlement: 'Francistown', name: 'Cumberland', ward_number: 'Ward 5', constituency: 'Francistown West' },

    // Mogoditshane Wards (major settlement)
    { settlement: 'Mogoditshane', name: 'Block 1', ward_number: 'Ward 1', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 2', ward_number: 'Ward 2', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 3', ward_number: 'Ward 3', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 4', ward_number: 'Ward 4', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 5', ward_number: 'Ward 5', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 6', ward_number: 'Ward 6', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 7', ward_number: 'Ward 7', constituency: 'Mogoditshane' },
    { settlement: 'Mogoditshane', name: 'Block 8', ward_number: 'Ward 8', constituency: 'Mogoditshane' },

    // Maun Wards (major northern settlement)
    { settlement: 'Maun', name: 'Boseja South', ward_number: 'Ward 1', constituency: 'Maun East' },
    { settlement: 'Maun', name: 'Boseja North', ward_number: 'Ward 2', constituency: 'Maun East' },
    { settlement: 'Maun', name: 'Disaneng', ward_number: 'Ward 3', constituency: 'Maun West' },
    { settlement: 'Maun', name: 'Sedie', ward_number: 'Ward 4', constituency: 'Maun West' },
    { settlement: 'Maun', name: 'Matshwane', ward_number: 'Ward 5', constituency: 'Maun West' },

    // Molepolole Wards  
    { settlement: 'Molepolole', name: 'Lekgaba', ward_number: 'Ward 1', constituency: 'Molepolole North' },
    { settlement: 'Molepolole', name: 'Tshimoyapula', ward_number: 'Ward 2', constituency: 'Molepolole North' },
    { settlement: 'Molepolole', name: 'Makoba', ward_number: 'Ward 3', constituency: 'Molepolole South' },
    { settlement: 'Molepolole', name: 'Lephoi', ward_number: 'Ward 4', constituency: 'Molepolole South' }
  ];

  // Convert ward data with settlement foreign keys
  const wardsWithSettlementIds = wardsData.map(ward => ({
    settlement_id: settlementMap.get(ward.settlement)!,
    name: ward.name,
    ward_number: ward.ward_number,
    constituency: ward.constituency,
    population: null, // Will be populated by future census data
    area_description: null
  }));

  await db.insert(wards).values(wardsWithSettlementIds)
    .onConflictDoUpdate({
      target: [wards.settlement_id, wards.name],
      set: {
        ward_number: sql`excluded.ward_number`,
        constituency: sql`excluded.constituency`,
        population: sql`excluded.population`,
        area_description: sql`excluded.area_description`,
        updated_at: sql`now()`
      }
    });
}

async function importBasicPlots() {
  // Get ward and settlement IDs for foreign keys
  const wardRecords = await db.select().from(wards);
  const settlementRecords = await db.select().from(settlements);
  
  const wardMap = new Map(wardRecords.map(w => [`${w.name}`, w]));
  const settlementMap = new Map(settlementRecords.map(s => [s.name, s.id]));

  // Sample plot data for major areas
  const plotsData = [
    // Gaborone CBD plots
    { ward: 'Central Business District', street: 'The Mall', address: 'The Mall, Central Business District, Gaborone', latitude: -24.6544, longitude: 25.9206 },
    { ward: 'Central Business District', street: 'Independence Avenue', address: 'Independence Avenue, CBD, Gaborone', latitude: -24.6556, longitude: 25.9194 },
    
    // Broadhurst plots
    { ward: 'Broadhurst', street: 'Broadhurst Mall', address: 'Broadhurst Mall, Broadhurst, Gaborone', latitude: -24.6736, longitude: 25.9089 },
    { ward: 'Broadhurst', street: 'Lobatse Road', address: 'Lobatse Road, Broadhurst, Gaborone', latitude: -24.6789, longitude: 25.9123 },

    // Block 8 plots (popular area)
    { ward: 'Block 8', street: 'Block 8 Shopping Centre', address: 'Shopping Centre, Block 8, Gaborone', latitude: -24.6422, longitude: 25.9664 },
    { ward: 'Block 8', street: 'Block 8 Extension', address: 'Extension Area, Block 8, Gaborone', latitude: -24.6456, longitude: 25.9678 },

    // Mogoditshane Block 5 (very popular)
    { ward: 'Block 5', settlement: 'Mogoditshane', street: 'Block 5 Shopping', address: 'Shopping Area, Block 5, Mogoditshane', latitude: -24.6289, longitude: 25.8734 },
    { ward: 'Block 5', settlement: 'Mogoditshane', street: 'Block 5 Residential', address: 'Residential Area, Block 5, Mogoditshane', latitude: -24.6323, longitude: 25.8756 },

    // Francistown areas
    { ward: 'Blue Jacket', street: 'Blue Jacket Square', address: 'Blue Jacket Square, Francistown', latitude: -21.1589, longitude: 27.5167 },
    { ward: 'Tashaya', street: 'Tashaya Shopping', address: 'Tashaya Shopping Centre, Francistown', latitude: -21.1633, longitude: 27.5089 },
  ];

  // Convert plot data with foreign keys
  const plotsWithIds = plotsData.map(plot => {
    let ward_id = null;
    let settlement_id = null;

    if (plot.ward) {
      const wardRecord = wardMap.get(plot.ward);
      if (wardRecord) {
        ward_id = wardRecord.id;
        settlement_id = wardRecord.settlement_id;
      }
    } else if (plot.settlement) {
      settlement_id = settlementMap.get(plot.settlement)!;
    }

    return {
      ward_id,
      settlement_id,
      plot_number: null,
      street_name: plot.street,
      street_number: null,
      block_name: null,
      full_address: plot.address,
      latitude: plot.latitude,
      longitude: plot.longitude
    };
  });

  await db.insert(plots).values(plotsWithIds)
    .onConflictDoUpdate({
      target: [plots.settlement_id, plots.full_address],
      set: {
        ward_id: sql`excluded.ward_id`,
        plot_number: sql`excluded.plot_number`,
        street_name: sql`excluded.street_name`,
        street_number: sql`excluded.street_number`,
        block_name: sql`excluded.block_name`,
        latitude: sql`excluded.latitude`,
        longitude: sql`excluded.longitude`,
        updated_at: sql`now()`
      }
    });
}

// Run import if called directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  importLocationData()
    .then(() => {
      console.log('✅ Location data import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Location data import failed:', error);
      process.exit(1);
    });
}