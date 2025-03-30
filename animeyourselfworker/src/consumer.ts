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
	// Define any other necessary bindings (e.g., AI service, output storage, etc.)
}

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

			// TODO: Process the image with your AI service
			// This is where you would:
			// 1. Send the image to your AI service with the specified styleID
			// 2. Get the processed image back
			// 3. Save the result to storage
			// 4. Notify the user that their image is ready (e.g., through a webhook or websocket)

			// Example pseudo-code:
			// const processedImage = await aiService.processImage({
			//     image: imageData,
			//     styleId: message.body.styleID
			// });

			// await storage.put(`processed/${message.body.userID}/${message.body.requestId}`, processedImage);

			// await notifyUser({
			//     userId: message.body.userID,
			//     requestId: message.body.requestId,
			//     status: 'completed'
			// });

			console.log(`Processed request ${message.body.requestId}`);
			console.log(imageData.byteLength);

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