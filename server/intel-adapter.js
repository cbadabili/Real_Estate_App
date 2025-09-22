import OpenAI from "openai";
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}) : null;
export async function intelSearch(req, res) {
    const q = String(req.body?.query || "").trim();
    if (!q)
        return res.json({ results: [] });
    if (!openai) {
        console.warn("OpenAI API key not configured");
        return res.json({ results: [] });
    }
    try {
        // Use regular chat completion instead of beta parse
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a real estate search assistant for Botswana. Return property results in JSON format with the following structure: {\"results\": [{\"id\": \"string\", \"title\": \"string\", \"price\": number, \"city\": \"string\", \"propertyType\": \"string\", \"bedrooms\": number, \"bathrooms\": number, \"description\": \"string\"}]}"
                },
                {
                    role: "user",
                    content: `Find properties in Botswana matching: "${q}". Return realistic sample properties in JSON format.`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });
        const content = response.choices[0].message.content;
        let json;
        try {
            json = JSON.parse(content || '{"results": []}');
        }
        catch (parseError) {
            console.warn("Failed to parse OpenAI response as JSON:", parseError);
            json = { results: [] };
        }
        console.log(`OpenAI search returned ${json.results?.length || 0} properties`);
        res.json(json);
    }
    catch (error) {
        console.warn("OpenAI search error:", error);
        res.json({ results: [] }); // soft-fail
    }
}
export async function intelSuggest(req, res) {
    const q = String(req.query.q || "").trim();
    if (!q)
        return res.json([]);
    if (!openai) {
        // Fallback suggestions for Botswana
        const fallbackSuggestions = ["Gaborone", "Francistown", "Phakalane", "Mogoditshane", "Lobatse", "Tlokweng"];
        const term = q.toLowerCase();
        return res.json(fallbackSuggestions.filter(s => s.toLowerCase().includes(term)).slice(0, 8));
    }
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Return 8 location suggestions for Botswana property search as a JSON array of strings."
                },
                {
                    role: "user",
                    content: `Suggest locations in Botswana related to: "${q}"`
                }
            ],
            temperature: 0.3,
            max_tokens: 200
        });
        const content = response.choices[0].message.content;
        let suggestions;
        try {
            suggestions = JSON.parse(content || '[]');
        }
        catch (parseError) {
            console.warn("Failed to parse suggestions:", parseError);
            suggestions = [];
        }
        res.json(Array.isArray(suggestions) ? suggestions.slice(0, 8) : []);
    }
    catch (error) {
        console.warn("OpenAI suggest error:", error);
        // Fallback suggestions for Botswana
        const fallbackSuggestions = ["Gaborone", "Francistown", "Phakalane", "Mogoditshane", "Lobatse", "Tlokweng"];
        const term = q.toLowerCase();
        res.json(fallbackSuggestions.filter(s => s.toLowerCase().includes(term)).slice(0, 8));
    }
}
