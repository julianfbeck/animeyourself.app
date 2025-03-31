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
    "context": CONTEXT_PLACEHOLDER
  }
}`
	},
	"onepiece-007": {
		styleID: "onepiece-007",
		name: "One Piece Style",
		prompt: "transform this into a One Piece anime style character with exaggerated features and dynamic poses",
		styleJson: `{
  "reference": {
    "color_composition": {
      "palette": "Bold, vibrant colors with high saturation (blues, reds, yellows, greens)",
      "backgrounds": "Exaggerated landscapes, tropical settings, dramatic skies",
      "skin_tones": "Varied and expressive, often with dramatic lighting",
      "lighting": "High contrast with dramatic shadows and highlights",
      "color_grading": "Bright and punchy with strong color differentiation"
    },
    "line_art": {
      "outline": "Bold, varied thickness with emphasis on character silhouettes",
      "style": "Dynamic lines with exaggerated curves and angles",
      "shading": "Simplified, dramatic shadows with minimal gradients"
    },
    "character_design": {
      "eyes": "Small to medium, often with distinctive shapes for important characters",
      "eyebrows": "Highly expressive, often exaggerated during emotional moments",
      "mouths": "Wide range from tiny to extremely large during emotional scenes",
      "noses": "Distinctive and varied (from button noses to long, angular shapes)",
      "hair": "Wildly varied styles with impossible gravity-defying shapes and colors",
      "proportions": "Extremely exaggerated - tiny waists, broad shoulders, large hands"
    },
    "clothing_textures": {
      "folds": "Simple but dynamic, emphasizing movement",
      "materials": "Flat colors with minimal texture detail",
      "accessories": "Distinctive, character-defining items with bold shapes"
    },
    "animation_quirks": {
      "expression": "Over-the-top emotional reactions, comical tears, bulging veins",
      "moments": "Freeze frames for impact, speed lines, dramatic poses",
      "emotion": "Exaggerated facial expressions with visual metaphors (hearts in eyes, steam from anger)"
    },
    "backgrounds": {
      "style": "Fantastical environments with impossible geography",
      "depth": "Strong foreground/background separation",
      "interiors": "Detailed but stylized, emphasizing character over realism"
    },
    "context": CONTEXT_PLACEHOLDER
  }
}`
	},
	// Additional styles to be added later:
	// "ghibli-inspired-002"
	// "cyberpunk-anime-003"
	// "chibi-kawaii-004"
	// "shonen-dynamic-005"
	// "shoujo-soft-006"
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

