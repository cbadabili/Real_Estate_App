
import { db } from '../server/db';
import { properties } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function verifyPropertyTypes() {
  try {
    console.log('Property type distribution:');
    
    const allProperties = await db.select({
      id: properties.id,
      title: properties.title,
      propertyType: properties.propertyType,
      description: properties.description
    }).from(properties);

    const typeCounts = allProperties.reduce((acc, prop) => {
      acc[prop.propertyType] = (acc[prop.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
    console.error('Error verifying property types:', error);
  }
}

verifyPropertyTypes();
