import { writeFileSync } from 'fs';
import { resolve } from 'path';
const spec = {
    openapi: "3.0.3",
    info: {
        title: "BeeDab Real Estate API",
        version: "1.0.0",
        description: "Comprehensive real estate platform API for Botswana market"
    },
    servers: [
        {
            url: "/api",
            description: "API base path"
        }
    ],
    paths: {
        "/health": {
            get: {
                summary: "Health check",
                tags: ["System"],
                responses: {
                    "200": {
                        description: "Service is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: { type: "string", example: "ok" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/properties": {
            get: {
                summary: "List properties",
                tags: ["Properties"],
                parameters: [
                    {
                        name: "location",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by location"
                    },
                    {
                        name: "type",
                        in: "query",
                        schema: { type: "string", enum: ["house", "apartment", "townhouse", "commercial", "land", "farm"] },
                        description: "Property type filter"
                    },
                    {
                        name: "minPrice",
                        in: "query",
                        schema: { type: "number" },
                        description: "Minimum price filter"
                    },
                    {
                        name: "maxPrice",
                        in: "query",
                        schema: { type: "number" },
                        description: "Maximum price filter"
                    }
                ],
                responses: {
                    "200": {
                        description: "List of properties",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            title: { type: "string" },
                                            price: { type: "string" },
                                            location: { type: "string" },
                                            type: { type: "string" },
                                            bedrooms: { type: "number" },
                                            bathrooms: { type: "number" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/search": {
            get: {
                summary: "Unified property search",
                tags: ["Search"],
                parameters: [
                    {
                        name: "query",
                        in: "query",
                        schema: { type: "string" },
                        description: "Natural language search query"
                    },
                    {
                        name: "location",
                        in: "query",
                        schema: { type: "string" },
                        description: "Location filter"
                    }
                ],
                responses: {
                    "200": {
                        description: "Search results",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        properties: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Property" }
                                        },
                                        total: { type: "number" },
                                        hasMore: { type: "boolean" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/services": {
            get: {
                summary: "List service providers",
                tags: ["Services"],
                responses: {
                    "200": {
                        description: "List of service providers",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/ServiceProvider" }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/users/login": {
            post: {
                summary: "User login",
                tags: ["Authentication"],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", minLength: 6 }
                                },
                                required: ["email", "password"]
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        token: { type: "string" },
                                        user: { $ref: "#/components/schemas/User" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Invalid credentials" }
                }
            }
        },
        "/users/register": {
            post: {
                summary: "User registration",
                tags: ["Authentication"],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", minLength: 6 },
                                    name: { type: "string" },
                                    userType: { type: "string", enum: ["buyer", "seller", "agent", "fsbo"] }
                                },
                                required: ["email", "password", "name", "userType"]
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Registration successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        token: { type: "string" },
                                        user: { $ref: "#/components/schemas/User" }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Validation error" },
                    "409": { description: "Email already exists" }
                }
            }
        }
    },
    components: {
        schemas: {
            Property: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    title: { type: "string" },
                    description: { type: "string" },
                    price: { type: "string" },
                    location: { type: "string" },
                    type: { type: "string" },
                    bedrooms: { type: "number" },
                    bathrooms: { type: "number" },
                    squareMeters: { type: "number" },
                    images: { type: "array", items: { type: "string" } },
                    features: { type: "array", items: { type: "string" } },
                    coordinates: {
                        type: "object",
                        properties: {
                            lat: { type: "number" },
                            lng: { type: "number" }
                        }
                    }
                }
            },
            User: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    email: { type: "string", format: "email" },
                    name: { type: "string" },
                    userType: { type: "string" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            ServiceProvider: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    category: { type: "string" },
                    description: { type: "string" },
                    rating: { type: "number", minimum: 0, maximum: 5 },
                    contact: {
                        type: "object",
                        properties: {
                            phone: { type: "string" },
                            email: { type: "string", format: "email" }
                        }
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    }
};
const outputPath = resolve(__dirname, '../openapi.json');
writeFileSync(outputPath, JSON.stringify(spec, null, 2));
console.log(`✅ Generated OpenAPI spec at: ${outputPath}`);
