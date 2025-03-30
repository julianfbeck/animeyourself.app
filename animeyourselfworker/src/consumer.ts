interface QueueMessage {
	image: {
		key: string;  // R2 object key
		mime_type: string;
	};
	styleID: string;
	userID: string;
	timestamp: number;
	requestId: string;
}

export interface Env {
	// Define the R2 bucket binding
	IMAGES: R2Bucket;
	// OpenAI API key for image analysis
	OPENAI_API_KEY: string;
}

// Import the promptGenerator and OpenAI service
import { generatePrompt } from './promptGenerator';
import { createOpenAIService } from './openaiService';

export async function processQueue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
	// Process each message in the batch
	for (const message of batch.messages) {
		try {
			console.log(`Processing request ${message.body.requestId}`);

			// Fetch the image from R2
			const imageObject = await env.IMAGES.get(message.body.image.key);
			if (!imageObject) {
				console.error(`Image not found in R2: ${message.body.image.key}`);
				message.ack();
				continue;
			}

			// Get the image data as an ArrayBuffer
			const imageData = await imageObject.arrayBuffer();

			// Create OpenAI service
			const openAIService = createOpenAIService(env.OPENAI_API_KEY);

			// Analyze the image to get its context
			console.log(`Analyzing image for request ${message.body.requestId}...`);
			const imageContext = await openAIService.analyzeImage(imageData);
			console.log(`Image analysis result: ${imageContext.substring(0, 100)}...`);

			// Generate the appropriate prompt based on styleID and image context
			const prompt = generatePrompt(message.body.styleID, imageContext);

			console.log(`Using prompt: ${prompt.substring(0, 100)}...`); // Log the first part of the prompt

			// Example pseudo-code for AI service integration:
			// const processedImage = await aiService.processImage({
			//     image: imageData,
			//     styleId: message.body.styleID,
			//     prompt: prompt
			// });

			// await storage.put(`processed/${message.body.userID}/${message.body.requestId}`, processedImage);

			// await notifyUser({
			//     userId: message.body.userID,
			//     requestId: message.body.requestId,
			//     status: 'completed'
			// });

			console.log(`Processed request ${message.body.requestId}`);
			console.log(`Image size: ${imageData.byteLength} bytes`);

			// Acknowledge the message after successful processing
			message.ack();
		} catch (error) {
			console.error(`Error processing message ${message.body.requestId}:`, error);

			// If there's an error, acknowledge the message
			// The queue system will handle retries automatically based on your configuration
			message.ack();

			// TODO: Notify the user about the failure
			// await notifyUser({
			//     userId: message.body.userID,
			//     requestId: message.body.requestId,
			//     status: 'failed',
			//     error: error instanceof Error ? error.message : 'Unknown error'
			// });
		}
	}
} 