
import { db } from '../server/db';
import { properties } from '../shared/schema';

async function verifyPropertyTypes() {
  try {
    console.log('Property type distribution:');
    
    const allProperties = await db.select({
      id: properties.id,
      title: properties.title,
      propertyType: properties.propertyType,
      description: properties.description
    }).from(properties);

    const typeCounts = allProperties.reduce<Record<string, number>>((acc, prop) => {
      const key = prop.propertyType ?? 'unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    console.log('\nType counts:', typeCounts);

    console.log('\nFarm properties:');
    allProperties
      .filter(p => p.propertyType === 'farm')
      .forEach(p => console.log(`- ${p.id}: ${p.title}`));

    console.log('\nLand plot properties:');
    allProperties
      .filter(p => p.propertyType === 'land_plot')
      .forEach(p => console.log(`- ${p.id}: ${p.title}`));

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error verifying property types:', message);
  }
}

verifyPropertyTypes();
