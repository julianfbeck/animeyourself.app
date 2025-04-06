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
    prompt: "transform this into a contemporary high-quality anime style with detailed characters. ITS IMPORTANT TO ONLY ADD CHARACTERS THAT ARE IN THE ORIGINAL IMAGE. NO COPYRIGHTED CHARACTERS!",
    styleJson: `<prompt>
  <style>Modern Anime</style>
  <characters>
    <description>Original characters with contemporary anime aesthetic</description>
    <features>
      <face>Angular jawlines with defined features, balance of realism and stylization</face>
      <eyes>Large, highly detailed with multiple highlights, reflections, and color gradients</eyes>
      <hair>Voluminous with complex coloring, shading, and individual strand detail</hair>
      <body>Realistic proportions with slight stylization, detailed anatomy</body>
      <skin>Smooth with subtle shading and occasional blush effects</skin>
    </features>
    <expressions>Dynamic and emotionally intense with exaggerated reaction potential</expressions>
    <clothing>
      <detail>High detail with realistic folds, textures, and material properties</detail>
      <style>Contemporary fashion with intricate accessories and layering</style>
      <shading>Multiple light sources with proper shadowing and material reflection</shading>
    </clothing>
  </characters>
  <artStyle>
    <technique>Digital painting with crisp linework and detailed coloring</technique>
    <colors>Vibrant palette with high contrast and color theory application</colors>
    <linework>Clean, varied weight lines with selective emphasis</linework>
    <shading>Cel-shading with additional gradient work for depth</shading>
    <effects>Selective bloom, lens flares, and particle effects</effects>
    <composition>Dynamic camera angles and perspective</composition>
  </artStyle>
  <background>
    <style>Blurred or simplified detail to focus on characters</style>
    <lighting>Dramatic lighting with emphasis on character illumination</lighting>
  </background>
  <postProcessing>
    <effects>Subtle color grading, vignetting, and atmospheric effects</effects>
    <quality>High resolution with clean anti-aliasing</quality>
  </postProcessing>
  <restrictions>
    <avoid>Adding additional Characters that are not in the original image</avoid>
  </restrictions>
</prompt>
`
  },
  "ghibli-inspired-002": {
    styleID: "ghibli-inspired-002",
    name: "Studio Ghibli",
    prompt: "transform this into a hand-painted animation style similar to Studio Ghibli films. ITS IMPORTANT TO ONLY ADD CHARACTERS THAT ARE IN THE ORIGINAL IMAGE. NO COPYRIGHTED CHARACTERS!",
    styleJson: `<prompt>
  <style>Studio Ghibli animation</style>
  <characters>
    <description>Original characters with the distinctive Ghibli aesthetic</description>
    <features>
      <face>Rounded with simple but expressive features, soft lines</face>
      <eyes>Large, detailed eyes with defined highlights and reflections</eyes>
      <hair>Flowing, detailed with individual strands but not over-rendered</hair>
      <body>Naturalistic proportions with slight stylization</body>
      <movement>Fluid, graceful with attention to weight and physics</movement>
    </features>
    <expressions>Subtle, nuanced emotional range with attention to micro-expressions</expressions>
    <clothing>Detailed fabrics with natural draping, often flowing in the wind</clothing>
  </characters>
  <artStyle>
    <technique>Hand-drawn appearance with watercolor-like textures</technique>
    <colors>Soft, natural palette with emphasis on greens, blues and earth tones</colors>
    <linework>Delicate, varied line weight with hand-painted appearance</linework>
    <lighting>Soft, diffused with attention to atmospheric perspective</lighting>
    <textures>Subtle watercolor washes and painterly details</textures>
  </artStyle>
  <background>
    <style>Impressionistic, painterly with attention to natural beauty</style>
  </background>
  <mood>
    <feeling>Peaceful, contemplative, nostalgic</feeling>
    <atmosphere>Sense of wonder and connection to nature</atmosphere>
  </mood>
  <restrictions>
    <avoid>Adding additional Characters that are not in the original image</avoid>
  </restrictions>
</prompt>`
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
  return `${context}\n\n${style.prompt}\n\n\n<style>\n${style.styleJson}\n</style>`;
}

