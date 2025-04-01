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
      "style": "Use the backgroudn provide in the context and image above to create a background that is a good fit for the image",
    }
  }
}`
  },
  "ghibli-inspired-002": {
    styleID: "ghibli-inspired-002",
    name: "Studio Ghibli",
    prompt: "turn this into a cinematic anime style animation",
    styleJson: `{
    "reference": {
      "color_composition": {
        "palette": "Soft, pastel-dominant with vibrant accents for focal points",
        "technique": "Watercolor-inspired with visible brushstrokes and color blending",
        "lighting": "Natural, diffused light with gentle shadows and atmospheric perspective",
        "gradients": "Subtle sky transitions from horizon to zenith with atmospheric depth",
        "emphasis": "Rich saturation for story-important elements against softer backgrounds"
      },
      "line_art": {
        "quality": "Clean, confident linework with hand-drawn feel and varied weight",
        "outlines": "Strong for foreground characters, fading in backgrounds, absent in distant objects",
        "detail": "Economical approach with detailed focal points and simplified surroundings",
        "technique": "Ink-like definition for characters with softer edges for environmental elements",
        "consistency": "Precise linework for characters with looser, more painterly approach to backgrounds"
      },
      "character_design": {
        "faces": "Simplified yet expressive features with distinctive large eyes and minimalist noses",
        "proportions": "Realistic body ratios with slightly enlarged heads for younger characters",
        "expressions": "Subtle eye movements and mouth shapes conveying complex emotions",
        "hair": "Flowing, grouped strands with movement-sensitive animation and minimal individual lines",
        "silhouettes": "Distinctive, recognizable character shapes even at distance or in shadow"
      },
      "clothing_textures": {
        "folds": "Natural cloth physics with weight-appropriate draping and movement",
        "fabrics": "Textural hints rather than detailed patterns, favoring solid colors with subtle variations",
        "animation": "Responsive to movement, wind and character actions with believable physics",
        "details": "Selective embellishments only where story-significant or character-defining",
        "style": "Mix of traditional and fantastical elements with practical design considerations"
      },
      "animation_quirks": {
        "movement": "Weight-appropriate physics with naturalistic timing and thoughtful pauses",
        "effects": "Hand-painted rain, wind patterns in grass, and individually animated falling leaves",
        "transitions": "Lingering establishing shots followed by intimate character moments",
        "pacing": "Animated holds and micro-movements during quiet scenes, fluid action during dynamic sequences",
        "emphasis": "Attention to small details like food steam, dust motes, and water reflections"
      },
    }
  }`
  },
  "onepiece-007": {
    styleID: "onepiece-007",
    name: "One Piece Style",
    prompt: "turn this into a cinematic anime style animation",
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
      "style": "Use the backgroudn provide in the context and image above to create a background that is a good fit for the image",
    }
  }
}`
  },
  "naruto-009": {
    styleID: "naruto-009",
    name: "Naruto Style",
    prompt: "turn this into a cinematic anime style animation",
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
      "style": "Use the backgroudn provide in the context and image above to create a background that is a good fit for the image",
    }
  }
}`
  },
  "shonen-dynamic-005": {
    styleID: "shonen-dynamic-005",
    name: "Shonen Action",
    prompt: "turn this into a cinematic anime style animation",
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
      "style": "Use the backgroudn provide in the context and image above to create a background that is a good fit for the image",
    }
  }
}`
  },
  "dragonball-008": {
    styleID: "dragonball-008",
    name: "Dragon Ball Z",
    prompt: "turn this into a cinematic anime style animation",
    styleJson: `{
  "reference": {
    "color_composition": {
      "palette": "Vibrant, high-contrast colors (orange-blue for protagonists, purple-pink for antagonists)",
      "backgrounds": "Dramatic landscapes with crater impacts and energy disruptions",
      "skin_tones": "Varying from human tones to alien colors with muscular highlighting",
      "lighting": "Intense auras, energy effects, and power-up luminescence",
      "color_grading": "Bold with dramatic shifts during transformations"
    },
    "line_art": {
      "outline": "Bold, confident lines with emphasis on muscular definition",
      "style": "Dynamic with distinctive roundness to forms typical of 80s-90s manga style",
      "shading": "Strong muscle definition with dramatic shadows during power-ups"
    },
    "character_design": {
      "eyes": "Small, determined with white highlights during intense moments",
      "eyebrows": "Expressive, often absent during major transformations",
      "mouths": "Simple but highly expressive during screaming power-ups",
      "noses": "Minimal, often just a simple line or dot",
      "hair": "Distinctive spiky styles that change color and grow during transformations",
      "proportions": "Exaggerated musculature with impossible physiques during power-ups"
    },
    "clothing_textures": {
      "folds": "Dramatic with billowing martial arts clothing during power-ups and movement",
      "materials": "Training uniforms, battle armor with distinct color blocking",
      "accessories": "Weighted training gear, scanning devices, powerful accessories, power limiters"
    },
    "animation_quirks": {
      "expression": "Long power-up sequences, charging attacks, muscle flexing",
      "moments": "Extended battle cries, world-shaking power demonstrations",
      "emotion": "Veins bulging during exertion, dramatic sweat, glowing eyes"
    },
   "backgrounds": {
      "style": "Use the backgroudn provide in the context and image above to create a background that is a good fit for the image",
    }
  }
}`
  },
  // Additional styles to be added later:
  // "cyberpunk-anime-003"
  // "chibi-kawaii-004"
  // "shoujo-soft-006"
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

  // Context is now above the prompt, followed by the prompt, then style JSON without context
  return `${style.prompt}\n\n${context}\n\n<style>\n${style.styleJson}\n</style>`;
}

