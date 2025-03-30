import OpenAI from 'openai';

/**
 * OpenAI service for image analysis
 */
export class OpenAIService {
	private client: OpenAI;

	constructor(apiKey: string) {
		this.client = new OpenAI({
			apiKey: apiKey
		});
	}

	/**
	 * Analyzes an image and returns a description of its content
	 * 
	 * @param imageData - The image data as a buffer
	 * @returns A description of the image content
	 */
	async analyzeImage(imageData: ArrayBuffer): Promise<string> {
		try {
			// Convert ArrayBuffer to base64
			const base64Image = this.arrayBufferToBase64(imageData);

			const response = await this.client.chat.completions.create({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content: "You are an AI assistant that analyzes images and provides concise, detailed descriptions of their content, focusing on the main subjects, actions, and setting."
					},
					{
						role: "user",
						content: [
							{ type: "text", text: "Describe what you see in this image in detail." },
							{
								type: "image_url",
								image_url: {
									url: `data:image/jpeg;base64,${base64Image}`
								}
							}
						]
					}
				],
				max_tokens: 300
			});

			return response.choices[0].message.content || "No description available";
		} catch (error) {
			console.error("Error analyzing image with OpenAI:", error);
			throw new Error(`OpenAI image analysis failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Converts an ArrayBuffer to a base64 string
	 * 
	 * @param buffer - The ArrayBuffer to convert
	 * @returns A base64 encoded string
	 */
	private arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
		return btoa(binary);
	}
}

/**
 * Creates an OpenAI service instance using the provided API key
 * 
 * @param apiKey - OpenAI API key
 * @returns An OpenAI service instance
 */
export function createOpenAIService(apiKey: string): OpenAIService {
	if (!apiKey) {
		throw new Error('OpenAI API key is required');
	}

	return new OpenAIService(apiKey);
} 