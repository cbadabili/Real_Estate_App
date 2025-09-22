import { db } from './db';
import { properties, users } from '../shared/schema';
import { inArray, asc } from 'drizzle-orm';
export async function seedProperties() {
    console.log('Seeding properties...');
    // Check if properties already exist
    try {
        const existingProperties = await db.query.properties?.findFirst();
        if (existingProperties) {
            console.log('✅ Properties already exist, skipping seeding...');
            return;
        }
    }
    catch (error) {
        console.log('No existing properties found, proceeding with seeding...');
    }
    // Get existing users for owner/agent IDs
    const eligibleUsers = await db.select({ id: users.id, userType: users.userType })
        .from(users)
        .where(inArray(users.userType, ['agent', 'fsbo', 'seller', 'buyer']))
        .orderBy(asc(users.id));
    if (eligibleUsers.length === 0) {
        console.log('❌ No eligible users found for property ownership');
        return;
    }
    console.log(`Found ${eligibleUsers.length} eligible users with IDs: ${eligibleUsers.map(u => u.id).join(', ')}`);
    const getOwnerId = (i) => eligibleUsers[i % eligibleUsers.length].id;
    const getAgentId = (i) => {
        const agents = eligibleUsers.filter(u => u.userType === 'agent');
        return agents.length > 0 ? agents[i % agents.length].id : eligibleUsers[i % eligibleUsers.length].id;
    };
    const sampleProperties = [
        {
            title: 'Modern Family Home in Gaborone',
            description: 'Beautiful 4-bedroom home with updated kitchen, hardwood floors, and large backyard. Perfect for families.',
            price: '2500000',
            address: '123 Tlokweng Road',
            city: 'Gaborone',
            state: 'South East',
            zipCode: '00267',
            latitude: '-24.6282',
            longitude: '25.9231',
            propertyType: 'house',
            listingType: 'fsbo',
            bedrooms: 4,
            bathrooms: '2.5',
            squareFeet: 2400,
            lotSize: '0.25',
            yearBuilt: 2010,
            status: 'active',
            images: JSON.stringify([
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
            ]),
            features: JSON.stringify(['Hardwood Floors', 'Updated Kitchen', 'Large Backyard', 'Two-Car Garage']),
            propertyTaxes: '8500',
            hoaFees: '0',
            ownerId: getOwnerId(0),
        },
        {
            title: 'Luxury Downtown Condo',
            description: 'Stunning high-rise condo with city views, modern amenities, and walking distance to everything downtown.',
            price: '3200000',
            address: '456 CBD Square',
            city: 'Gaborone',
            state: 'South East',
            zipCode: '00267',
            latitude: '-24.6282',
            longitude: '25.9231',
            propertyType: 'condo',
            listingType: 'agent',
            bedrooms: 2,
            bathrooms: '2.0',
            squareFeet: 1200,
            yearBuilt: 2020,
            status: 'active',
            images: JSON.stringify([
                'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
            ]),
            features: JSON.stringify(['City Views', 'Concierge', 'Rooftop Pool', 'Fitness Center']),
            propertyTaxes: '12000',
            hoaFees: '450',
            agentId: getAgentId(0),
        },
        {
            title: 'Cozy Suburban Townhouse',
            description: 'Well-maintained townhouse in family-friendly neighborhood with great schools and parks nearby.',
            price: '1800000',
            address: '789 Kgale View',
            city: 'Francistown',
            state: 'North East',
            zipCode: '00267',
            latitude: '-21.1670',
            longitude: '27.5084',
            propertyType: 'townhouse',
            listingType: 'agent',
            bedrooms: 3,
            bathrooms: '2.5',
            squareFeet: 1800,
            lotSize: '0.1',
            yearBuilt: 2015,
            status: 'active',
            images: JSON.stringify([
                'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
            ]),
            features: JSON.stringify(['Attached Garage', 'Patio', 'Master Suite', 'Open Floor Plan']),
            propertyTaxes: '6200',
            hoaFees: '180',
            agentId: getAgentId(1),
        },
        {
            title: 'Spacious Ranch Home',
            description: 'Single-story ranch home with open floor plan, large master suite, and beautiful landscaping.',
            price: '2100000',
            address: '321 Phakamisa Street',
            city: 'Maun',
            state: 'North West',
            zipCode: '00267',
            latitude: '-19.9833',
            longitude: '23.4167',
            propertyType: 'house',
            listingType: 'fsbo',
            bedrooms: 3,
            bathrooms: '2.0',
            squareFeet: 2100,
            lotSize: '0.3',
            yearBuilt: 2005,
            status: 'active',
            images: JSON.stringify([
                'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800'
            ]),
            features: JSON.stringify(['Open Floor Plan', 'Master Suite', 'Landscaping', 'Energy Efficient']),
            propertyTaxes: '7200',
            hoaFees: '0',
            ownerId: getOwnerId(1),
        },
        {
            title: 'Contemporary Loft',
            description: 'Industrial-style loft in converted warehouse with exposed brick, high ceilings, and modern finishes.',
            price: '2800000',
            address: '555 Riverside Drive',
            city: 'Kasane',
            state: 'North West',
            zipCode: '00267',
            latitude: '-17.8167',
            longitude: '25.1500',
            propertyType: 'condo',
            listingType: 'agent',
            bedrooms: 1,
            bathrooms: '1.0',
            squareFeet: 1100,
            yearBuilt: 2018,
            status: 'active',
            images: JSON.stringify([
                'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
            ]),
            features: JSON.stringify(['Exposed Brick', 'High Ceilings', 'Modern Finishes', 'Urban Location']),
            propertyTaxes: '9800',
            hoaFees: '275',
            agentId: getAgentId(2),
        },
        {
            title: 'Prime Land in Gaborone',
            description: 'Prime residential land for development in prestigious area',
            price: '500000',
            address: '123 Plot Area',
            city: 'Gaborone',
            state: 'South East',
            zipCode: '00267',
            latitude: '-24.6282',
            longitude: '25.9231',
            propertyType: 'land',
            listingType: 'fsbo',
            bedrooms: 0,
            bathrooms: '0',
            squareFeet: 0,
            lotSize: '1.0',
            yearBuilt: 0,
            status: 'active',
            images: JSON.stringify([]),
            features: JSON.stringify(['Prime Location', 'Development Ready']),
            propertyTaxes: '0',
            hoaFees: '0',
            ownerId: getOwnerId(2),
        },
        {
            title: 'Modern 3-Bedroom House in Mogoditshane',
            description: 'Beautiful modern house with garden and security',
            price: '850000',
            address: '123 Mogoditshane Road',
            city: 'Mogoditshane',
            state: 'South East',
            zipCode: '00267',
            latitude: '-24.6892',
            longitude: '25.8544',
            propertyType: 'house',
            listingType: 'sale',
            bedrooms: 3,
            bathrooms: '2',
            squareFeet: 180,
            lotSize: '0.25',
            yearBuilt: 2020,
            status: 'active',
            images: JSON.stringify([]),
            features: JSON.stringify(['Garden', 'Security', 'Modern Kitchen']),
            propertyTaxes: '5200',
            hoaFees: '0',
            ownerId: getOwnerId(3),
        },
        {
            title: 'Luxury Apartment in Phakalane',
            description: 'Spacious apartment with modern amenities and golf course views',
            price: '650000',
            address: '456 Phakalane Drive',
            city: 'Gaborone',
            state: 'South East',
            zipCode: '00267',
            latitude: '-24.5892',
            longitude: '25.9544',
            propertyType: 'apartment',
            listingType: 'sale',
            bedrooms: 2,
            bathrooms: '2',
            squareFeet: 120,
            lotSize: '0.15',
            yearBuilt: 2021,
            status: 'active',
            images: JSON.stringify([]),
            features: JSON.stringify(['Golf Course Views', 'Swimming Pool', 'Gym']),
            propertyTaxes: '4800',
            hoaFees: '300',
            ownerId: getOwnerId(4),
        },
        {
            title: 'Commercial Land in Francistown',
            description: 'Prime commercial land for development in business district',
            price: '1200000',
            address: 'Blue Jacket Street',
            city: 'Francistown',
            state: 'North East',
            zipCode: '00267',
            latitude: '-21.1670',
            longitude: '27.5084',
            propertyType: 'land',
            listingType: 'sale',
            bedrooms: 0,
            bathrooms: '0',
            squareFeet: 5000,
            lotSize: '1.0',
            yearBuilt: 0,
            status: 'active',
            images: JSON.stringify([]),
            features: JSON.stringify(['Commercial Zoning', 'Main Road Access']),
            propertyTaxes: '0',
            hoaFees: '0',
            ownerId: getOwnerId(0),
        },
        {
            title: 'Executive Villa in Village',
            description: 'Luxurious executive villa with pool and entertainment area',
            price: '1800000',
            address: '100 Executive Gardens',
            city: 'Village',
            state: 'South East',
            zipCode: '00267',
            latitude: '-24.5500',
            longitude: '25.9100',
            propertyType: 'house',
            listingType: 'sale',
            bedrooms: 5,
            bathrooms: '4',
            squareFeet: 350,
            lotSize: '0.5',
            yearBuilt: 2019,
            status: 'active',
            images: JSON.stringify([]),
            features: JSON.stringify(['Swimming Pool', 'Entertainment Area', 'Double Garage', 'Security']),
            propertyTaxes: '12000',
            hoaFees: '500',
            ownerId: getOwnerId(1),
        },
        {
            title: "Luxury Villa with Pool",
            description: "Stunning 5-bedroom villa with swimming pool and garden in prime location.",
            propertyType: "house",
            listingType: "agent",
            price: "4500000",
            bedrooms: 5,
            bathrooms: 4,
            squareFeet: 450,
            yearBuilt: 2018,
            city: "Gaborone",
            state: "South East",
            zipCode: "0000",
            status: "active",
            images: JSON.stringify(["/api/placeholder/600/400", "/api/placeholder/600/401", "/api/placeholder/600/402"]),
            features: JSON.stringify(["Swimming Pool", "Garden", "Garage", "Air Conditioning", "Security System"]),
            latitude: -24.6282,
            longitude: 25.9231,
            ownerId: 2,
            views: Math.floor(Math.random() * 500) + 50,
            createdAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 30) * 24 * 60 * 60,
            updatedAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7) * 24 * 60 * 60
        },
        {
            title: "Modern Family Home in Phakalane",
            description: "Beautiful 4-bedroom family home with modern amenities in sought-after Phakalane Estate.",
            propertyType: "house",
            listingType: "fsbo",
            price: "3200000",
            bedrooms: 4,
            bathrooms: 3,
            squareFeet: 320,
            yearBuilt: 2020,
            city: "Gaborone",
            state: "South East",
            zipCode: "0000",
            address: "Plot 123, Phakalane Estate",
            status: "active",
            images: JSON.stringify(["/api/placeholder/600/400", "/api/placeholder/600/401", "/api/placeholder/600/402"]),
            features: JSON.stringify(["Modern Kitchen", "Master En-suite", "Double Garage", "Solar Geyser", "Alarm System"]),
            latitude: -24.5974,
            longitude: 25.9063,
            ownerId: 1,
            views: Math.floor(Math.random() * 300) + 25,
            createdAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 20) * 24 * 60 * 60,
            updatedAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 5) * 24 * 60 * 60
        },
    ];
    try {
        console.log(`Adding ${sampleProperties.length} properties...`);
        const insertedProperties = await db.insert(properties).values(sampleProperties).returning();
        console.log(`✅ Successfully inserted ${insertedProperties.length} properties`);
    }
    catch (error) {
        console.error('❌ Properties seeding failed:', error);
        throw error;
    }
}
// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedProperties()
        .then(() => {
        console.log('Properties seeding completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Properties seeding failed:', error);
        process.exit(1);
    });
}
