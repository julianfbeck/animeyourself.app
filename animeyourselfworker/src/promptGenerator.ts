/**
 * Prompt generator for AI image processing services
 */

interface StyleConfig {
	styleID: string;
	name: string;
	prompt: string;
	styleJson: string;
}

const STYLES: Record<string, StyleConfig> = {
	"anime-default-001": {
		styleID: "anime-default-001",
		name: "Anime Default",
		prompt: "turn this into a cinematic anime style animation",
		styleJson: `{
"reference": {
"color_composition": {
"palette": "Warm, earthy tones (e.g., browns, forest greens, navy, soft reds)",
"backgrounds": "Richly painted with a slight matte finish, vibrant but not harsh",
"skin_tones": "Soft, peachy, even-toned, blush only when needed",
"lighting": "Naturalistic with golden-hour hues and soft shadows",
"color_grading": "Nostalgic, cinematic feel with no harsh contrasts"
},
"line_art": {
"outline": "Clean, consistent, medium-thickness",
"style": "Slightly organic lines with subtle variation",
"shading": "Painted shadows and contours, minimal cross-hatching"
},
"character_design": {
"eyes": "Large, not exaggerated, simple reflective irises",
"eyebrows": "Expressive, softly shaped",
"mouths": "Small, softly curved",
"noses": "Minimal, often a line or shadow",
"hair": "Stylized, layered with 1-2 tone gradients, not glossy",
"proportions": "Realistic but stylized enough to feel animated"
},
"clothing_textures": {
"folds": "Minimal, soft shadows to suggest movement",
"materials": "Matte (cotton, wool, canvas), no shine",
"accessories": "Subtle, clear but simple detailing"
},
"animation_quirks": {
"expression": "Wind in hair, soft gestures, candid postures",
"moments": "Characters look mid-action or mid-sentence",
"emotion": "Slight blush or line detail to show warmth or embarrassment"
},
"backgrounds": {
"style": "Semi-realistic, soft-focus painting",
"depth": "Atmospheric perspective with lighter/bluer distant elements",
"interiors": "Warm, inviting, natural materials, soft lighting"
},
"context": 
CONTEXT_PLACEHOLDER
}
}`
	}
	// Additional styles to be added later:
	// "ghibli-inspired-002"
	// "cyberpunk-anime-003"
	// "chibi-kawaii-004"
	// "shonen-dynamic-005"
	// "shoujo-soft-006"
	// "onepiece-007"
	// "dragonball-008"
	// "naruto-009"
	// "titan-dark-010"
};

/**
 * Generates a prompt for the AI service based on the given style ID and context
 * 
 * @param styleID - The ID of the style to use
 * @param context - The context to insert into the prompt
 * @returns The complete prompt with style JSON
 */
export function generatePrompt(styleID: string, context: string): string {
	const style = STYLES[styleID];

	if (!style) {
		throw new Error(`Style ID ${styleID} not found`);
	}

	// Replace the placeholder with the actual context
	const styleJsonWithContext = style.styleJson.replace('CONTEXT_PLACEHOLDER', context);

	return `${style.prompt}\n\n<style.json>\n${styleJsonWithContext}\n</style.json>`;
}

