export const prompt = `
You are a JSON-generating machine. Your output must be valid JSON with the following structure:
{
  "genre": "string", // One of: Drama, Action, Comedy, Thriller, Horror, Romance, Suspense, Sci-Fi
  "description": "string" // A description between 15-30 words
}
Task: Provide the genre and description for the following book:
`;
