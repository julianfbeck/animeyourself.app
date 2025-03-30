/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/**
 * Cloudflare Worker that accepts image processing requests and puts them into a queue named "gemini"
 * for asynchronous processing.
 */

// Define the structure of the incoming request body
interface ImageData {
	data: string;
	mime_type: string;
}

interface RequestBody {
	image: ImageData;
	styleID: string;
	userID: string;
}

// Define the structure of messages we'll put in the queue
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
	// Define the gemini queue binding
	GEMINI: Queue;
	// Define the R2 bucket binding
	IMAGES: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Generate a unique ID for this request
		const requestId = crypto.randomUUID();

		// Check if the path is correct
		const url = new URL(request.url);
		if (url.pathname !== '/v1/new') {
			return new Response(JSON.stringify({
				success: false,
				message: "Not Found - Invalid endpoint",
				requestId
			}), {
				headers: {
					'Content-Type': 'application/json',
					'X-Request-ID': requestId
				},
				status: 404 // Not Found
			});
		}

		// Only allow POST requests
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({
				success: false,
				message: "Only POST requests are accepted",
				requestId
			}), {
				headers: {
					'Content-Type': 'application/json',
					'X-Request-ID': requestId
				},
				status: 405 // Method Not Allowed
			});
		}

		try {
			// Parse the request body
			const requestData: RequestBody = await request.json();

			// Validate the required fields
			if (!requestData.image || !requestData.image.data || !requestData.image.mime_type) {
				return new Response(JSON.stringify({
					success: false,
					message: "Missing required image data",
					requestId
				}), {
					headers: {
						'Content-Type': 'application/json',
						'X-Request-ID': requestId
					},
					status: 400 // Bad Request
				});
			}

			if (!requestData.styleID) {
				return new Response(JSON.stringify({
					success: false,
					message: "Missing required styleID",
					requestId
				}), {
					headers: {
						'Content-Type': 'application/json',
						'X-Request-ID': requestId
					},
					status: 400 // Bad Request
				});
			}

			if (!requestData.userID) {
				return new Response(JSON.stringify({
					success: false,
					message: "Missing required userID",
					requestId
				}), {
					headers: {
						'Content-Type': 'application/json',
						'X-Request-ID': requestId
					},
					status: 400 // Bad Request
				});
			}

			// Decode base64 image data
			const imageData = requestData.image.data.split(',')[1] || requestData.image.data;
			const binaryData = atob(imageData);
			const uint8Array = new Uint8Array(binaryData.length);
			for (let i = 0; i < binaryData.length; i++) {
				uint8Array[i] = binaryData.charCodeAt(i);
			}

			// Generate a unique key for the image in R2
			const imageKey = `${requestData.userID}/${requestId}`;

			// Upload the image to R2
			await env.IMAGES.put(imageKey, uint8Array, {
				httpMetadata: {
					contentType: requestData.image.mime_type
				}
			});

			// Create the message to be queued
			const message: QueueMessage = {
				image: {
					key: imageKey,
					mime_type: requestData.image.mime_type
				},
				styleID: requestData.styleID,
				userID: requestData.userID,
				timestamp: Date.now(),
				requestId
			};

			// Add the message to the gemini queue
			await env.GEMINI.send(message);

			// Return a success response with the request ID
			return new Response(JSON.stringify({
				success: true,
				message: "Image processing request queued successfully",
				requestId,
				imageKey
			}), {
				headers: {
					'Content-Type': 'application/json',
					'X-Request-ID': requestId
				},
				status: 202 // Accepted
			});
		} catch (error) {
			// Handle any errors
			console.error(`Error processing request: ${error}`);

			return new Response(JSON.stringify({
				success: false,
				message: "Failed to queue image processing request",
				error: error instanceof Error ? error.message : String(error),
				requestId
			}), {
				headers: {
					'Content-Type': 'application/json',
					'X-Request-ID': requestId
				},
				status: 500
			});
		}
	}
};