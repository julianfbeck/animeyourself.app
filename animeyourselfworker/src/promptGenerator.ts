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
	"naruto-009": {
		styleID: "naruto-009",
		name: "Naruto Style",
		prompt: "transform this into a Naruto anime style character with ninja-like features and dynamic ninja poses",
		styleJson: `{
  "reference": {
    "color_composition": {
      "palette": "Earth tones with vibrant accents (oranges, blues, greens, reds)",
      "backgrounds": "Blend of traditional Japanese scenery and fantasy elements",
      "skin_tones": "Consistent pale to medium tones with dramatic shadowing during action",
      "lighting": "Dynamic with chakra-based glows and dramatic shadows during battles",
      "color_grading": "Semi-muted with sharp contrasts during emotional or action moments"
    },
    "line_art": {
      "outline": "Sharp, clean lines with thickness variation for impact",
      "style": "Angular with speed lines during action sequences",
      "shading": "Flat cell shading with occasional gradient for special effects"
    },
    "character_design": {
      "eyes": "Large, expressive with distinct pupil shapes (especially for doujutsu)",
      "eyebrows": "Thin but expressive, often furrowed during conflict",
      "mouths": "Simple lines that expand dramatically during emotional outbursts",
      "noses": "Minimal, often just a short line or small triangle",
      "hair": "Spiky, gravity-defying styles with distinctive silhouettes",
      "proportions": "Athletic builds with exaggerated poses during action"
    },
    "clothing_textures": {
      "folds": "Dynamic with flowing movement during action sequences",
      "materials": "Simplified ninja gear, headbands, mesh undershirts",
      "accessories": "Distinctive clan symbols, weapon pouches, scrolls, ninja tools"
    },
    "animation_quirks": {
      "expression": "Intense close-ups on eyes, dramatic pose freezes",
      "moments": "Flashbacks with monochrome or sepia effects, hand signs in sequence",
      "emotion": "Comical chibi-style for humor, veins/sweat drops for frustration"
    },
    "backgrounds": {
      "style": "Blend of natural landscapes and Japanese-inspired architecture",
      "depth": "Panoramic views of villages nestled in dramatic landscapes",
      "interiors": "Sparse, traditional Japanese elements with ninja motifs"
    },
    "context": CONTEXT_PLACEHOLDER
  }
}`
	},
	"shonen-dynamic-005": {
		styleID: "shonen-dynamic-005",
		name: "Shonen Action",
		prompt: "transform this into a dynamic shonen anime style character with heroic features and powerful battle poses",
		styleJson: `{
  "reference": {
    "color_composition": {
      "palette": "Bold primary colors with high contrast (reds, blues, yellows)",
      "backgrounds": "Dynamic environments that emphasize action and scale",
      "skin_tones": "Consistent with dramatic shadowing during power-ups or intense moments",
      "lighting": "Dramatic with energy auras, power effects, and impact flashes",
      "color_grading": "Vibrant with heightened saturation during key battle moments"
    },
    "line_art": {
      "outline": "Strong, confident lines with variable thickness for emphasis",
      "style": "Dynamic with motion lines and impact frames",
      "shading": "Bold shadows that emphasize musculature and power poses"
    },
    "character_design": {
      "eyes": "Determined, intense with dramatic highlights during emotional moments",
      "eyebrows": "Thick, expressive, often furrowed in concentration or anger",
      "mouths": "Range from gritted teeth to wide battle cries",
      "noses": "Simple but defined, especially in profile shots",
      "hair": "Distinctive, gravity-defying styles that may change color during power-ups",
      "proportions": "Athletic to muscular builds with heroic stances"
    },
    "clothing_textures": {
      "folds": "Dynamic with dramatic billowing during power-ups or movement",
      "materials": "Durable battle gear, training uniforms, or school clothes with personal flair",
      "accessories": "Power-indicating items, weapons, or symbolic accessories that represent character growth"
    },
    "animation_quirks": {
      "expression": "Power-up sequences, training montages, rival staredowns",
      "moments": "Mid-battle internal monologues, flashbacks to motivational memories",
      "emotion": "Visible battle auras, dramatic tears of determination, gritted teeth"
    },
    "backgrounds": {
      "style": "Varied settings from training grounds to tournament arenas to apocalyptic battlefields",
      "depth": "Dramatic perspectives that emphasize the scale of conflicts",
      "interiors": "Simple but functional spaces that highlight character interactions"
    },
    "context": CONTEXT_PLACEHOLDER
  }
}`
	},
	// Additional styles to be added later:
	// "ghibli-inspired-002"
	// "cyberpunk-anime-003"
	// "chibi-kawaii-004"
	// "shoujo-soft-006"
	// "dragonball-008"
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

