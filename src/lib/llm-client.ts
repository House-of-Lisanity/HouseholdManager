// API connection commented out during development to save tokens.
// Uncomment the function body and remove the placeholder when ready to reconnect.

export async function generatePlanFromLLM(prompt: string): Promise<string> {
  throw new Error(
    "LLM API is disabled during development. Uncomment the API call in llm-client.ts to re-enable."
  );

  // const apiKey = process.env.PERPLEXITY_API_KEY;
  //
  // if (!apiKey) {
  //   throw new Error("PERPLEXITY_API_KEY is not set in environment variables");
  // }
  //
  // const response = await fetch("https://api.perplexity.ai/chat/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify({
  //     model: "sonar-pro",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           'You are a weekly planning assistant. You MUST respond with ONLY valid JSON, no other text. Your response must be a valid JSON object with this exact structure: {"weekPlan":{"Monday":{"breakfast":"dish name","lunch":"dish name","dinner":"dish name"},"Tuesday":{...}}} for all 7 days. Do not include any explanation, markdown formatting, or text outside the JSON object.',
  //       },
  //       {
  //         role: "user",
  //         content: prompt,
  //       },
  //     ],
  //     temperature: 0.7,
  //     max_tokens: 4000,
  //   }),
  // });
  //
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   console.error("Perplexity API error:", errorText);
  //   throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  // }
  //
  // const data = await response.json();
  //
  // if (!data.choices || !data.choices[0] || !data.choices[0].message) {
  //   throw new Error("Invalid response format from Perplexity API");
  // }
  //
  // return data.choices[0].message.content;
}
