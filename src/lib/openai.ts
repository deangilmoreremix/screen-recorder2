import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const CREATIVE_DIRECTOR_SYSTEM_PROMPT = `You are a creative director specializing in video production and social media content.
Your expertise spans multiple platforms including YouTube, TikTok, Instagram, and more.
You provide creative insights, editing suggestions, and content optimization strategies.
Always analyze the context and provide actionable recommendations for video enhancement.`;

export interface VideoAnalysisResult {
  summary: string;
  keyMoments: { timestamp: number; description: string }[];
  suggestedClips: { startTime: number; endTime: number; rationale: string }[];
  platformRecommendations: { platform: string; tips: string[] }[];
}

export interface TranscriptResult {
  transcript: string;
  timestamps: { time: number; text: string }[];
  language: string;
  confidence: number;
}

export interface ImageGenerationOptions {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'low' | 'medium' | 'high' | 'auto';
  style?: 'vivid' | 'natural';
  n?: number;
}

async function generateImage(options: ImageGenerationOptions): Promise<string[]> {
  const response = await openai.responses.create({
    model: 'gpt-4o',
    input: options.prompt,
    tools: [{
      type: 'image_generation',
      background: options.style === 'natural' ? 'auto' : 'opaque',
      size: options.size || '1024x1024',
      quality: options.quality || 'medium'
    }]
  });
  const output = (response as unknown as { output?: Array<{ result?: string }> }).output;
  return output?.map((item: { result?: string }) => item.result || '').filter(Boolean) || [];
}

export const aiImage = {
  generateYouTubeThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a vibrant YouTube thumbnail for a video at ${videoUrl}, bold text, engaging colors, faces showing emotions` });
    return urls[0] || '';
  },
  generateTikTokThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a TikTok thumbnail for a video at ${videoUrl}, vertical format, bold text, trending style` });
    return urls[0] || '';
  },
  generateInstagramThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an Instagram thumbnail for a video at ${videoUrl}, square format, aesthetic design, minimalist` });
    return urls[0] || '';
  },
  generateFacebookThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a Facebook thumbnail for a video at ${videoUrl}, social media friendly, clear messaging` });
    return urls[0] || '';
  },
  generateTwitterThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a Twitter thumbnail for a video at ${videoUrl}, horizontal, bold text, modern design` });
    return urls[0] || '';
  },
  generateLinkedInThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a LinkedIn thumbnail for a video at ${videoUrl}, professional, corporate style, clean design` });
    return urls[0] || '';
  },
  generateVimeoThumbnail: async (videoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a Vimeo thumbnail for a video at ${videoUrl}, artistic, cinematic, film-like quality` });
    return urls[0] || '';
  },
  generateThumbnail: async (videoUrl: string, platform?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a thumbnail for a video at ${videoUrl}, ${platform || 'general'} platform, high quality` });
    return urls[0] || '';
  },
  generateCustomThumbnail: async (prompt: string): Promise<string> => {
    const urls = await generateImage({ prompt });
    return urls[0] || '';
  },
  generateSocialMediaBanner: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a social media banner for ${platform}, wide format, professional design` });
    return urls[0] || '';
  },
  generateProfileBanner: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a profile banner for ${platform}, personal brand style` });
    return urls[0] || '';
  },
  generateCoverImage: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a cover image for ${platform}, eye-catching, professional` });
    return urls[0] || '';
  },
  generateHeroImage: async (platform: string, topic: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a hero image for ${platform} about ${topic}, bold, engaging` });
    return urls[0] || '';
  },
  generateCTAImage: async (platform: string, action: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a call-to-action image for ${platform} with ${action}, button style, motivational` });
    return urls[0] || '';
  },
  generateLogo: async (brandName: string, style?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a logo for ${brandName}, ${style || 'modern minimal'} style, clean design` });
    return urls[0] || '';
  },
  generateIcon: async (theme: string, iconType: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${iconType} icon with ${theme} theme, simple, recognizable` });
    return urls[0] || '';
  },
  generateBadge: async (platform: string, achievement: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${achievement} badge for ${platform}, award style, shiny` });
    return urls[0] || '';
  },
  generateBorder: async (style: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a decorative border with ${style} style, seamless pattern` });
    return urls[0] || '';
  },
  generateOverlay: async (effect: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an overlay effect for ${effect}, semi-transparent, subtle` });
    return urls[0] || '';
  },
  generateWatermark: async (text: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a watermark with "${text}", transparent background, elegant` });
    return urls[0] || '';
  },
  generateTimestampMarker: async (seconds: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a timestamp marker for ${seconds} seconds, small, visible indicator` });
    return urls[0] || '';
  },
  generateProgressIndicator: async (progress: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a progress indicator at ${progress}%, circular or bar style` });
    return urls[0] || '';
  },
  generateLoadingSpinner: async (color: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a loading spinner with ${color}, animated style` });
    return urls[0] || '';
  },
  generateErrorIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an error icon, red colors, warning symbol` });
    return urls[0] || '';
  },
  generateSuccessIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a success icon, green colors, checkmark symbol` });
    return urls[0] || '';
  },
  generateWarningIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a warning icon, yellow/orange colors, triangle symbol` });
    return urls[0] || '';
  },
  generateInfoIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an info icon, blue colors, information symbol` });
    return urls[0] || '';
  },
  generateLogoOverlay: async (logoUrl: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a logo overlay based on ${logoUrl}, transparent, positioned top-left` });
    return urls[0] || '';
  },
  generateCaptionBackground: async (caption: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a background for caption "${caption}", subtle, readable` });
    return urls[0] || '';
  },
  generateEmojiSticker: async (emoji: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${emoji} sticker, transparent background, cute style` });
    return urls[0] || '';
  },
  generateReactionOverlay: async (reaction: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${reaction} reaction overlay, animated style` });
    return urls[0] || '';
  },
  generateSubscriptionButton: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a subscribe button for ${platform}, red/white, clickable style` });
    return urls[0] || '';
  },
  generateShareButton: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a share button for ${platform}, arrow icon, blue style` });
    return urls[0] || '';
  },
  generateLikeButton: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a like button for ${platform}, heart icon, red style` });
    return urls[0] || '';
  },
  generateCommentButton: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a comment button for ${platform}, bubble icon, gray style` });
    return urls[0] || '';
  },
  generateDownloadButton: async (platform: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a download button for ${platform}, arrow icon, green style` });
    return urls[0] || '';
  },
  generateFullscreenButton: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a fullscreen toggle button, expand/collapse icons` });
    return urls[0] || '';
  },
  generatePlayButton: async (style?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a play button, ${style || 'standard'} style, triangle icon` });
    return urls[0] || '';
  },
  generatePauseButton: async (style?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a pause button, ${style || 'standard'} style, two bars` });
    return urls[0] || '';
  },
  generateStopButton: async (style?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a stop button, ${style || 'standard'} style, square icon` });
    return urls[0] || '';
  },
  generateRewindButton: async (seconds: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a rewind ${seconds}s button, curved arrow` });
    return urls[0] || '';
  },
  generateForwardButton: async (seconds: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a forward ${seconds}s button, curved arrow` });
    return urls[0] || '';
  },
  generateSkipPrevious: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a skip previous button, double left arrow` });
    return urls[0] || '';
  },
  generateSkipNext: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a skip next button, double right arrow` });
    return urls[0] || '';
  },
  generateVolumeIcon: async (level?: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a volume icon${level ? ` at ${level}%` : ''}, speaker design` });
    return urls[0] || '';
  },
  generateMuteIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a mute icon, crossed out speaker` });
    return urls[0] || '';
  },
  generateSettingsGear: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a settings gear icon, detailed, clickable` });
    return urls[0] || '';
  },
  generateSpeedControl: async (speed: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a playback speed ${speed}x icon, speedometer style` });
    return urls[0] || '';
  },
  generateQualitySwitch: async (quality: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a quality switch icon for ${quality}p, HD badge style` });
    return urls[0] || '';
  },
  generateAspectRatioIcon: async (ratio: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an aspect ratio ${ratio} icon, frame outline` });
    return urls[0] || '';
  },
  generateFormatIcon: async (format: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${format.toUpperCase()} format icon, file type design` });
    return urls[0] || '';
  },
  generateCodecIcon: async (codec: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${codec} codec icon, technical badge` });
    return urls[0] || '';
  },
  generateResolutionIcon: async (resolution: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${resolution} resolution icon, pixel grid` });
    return urls[0] || '';
  },
  generateFpsIcon: async (fps: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an ${fps}fps icon, refresh symbol` });
    return urls[0] || '';
  },
  generateDurationIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a duration/time icon, clock symbol` });
    return urls[0] || '';
  },
  generateSizeIcon: async (size: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${size} file size icon, scale indicator` });
    return urls[0] || '';
  },
  generateBitrateIcon: async (bitrate: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${bitrate}kbps bitrate icon, data flow` });
    return urls[0] || '';
  },
  generateAudioChannelsIcon: async (channels: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${channels} channels icon, speaker array` });
    return urls[0] || '';
  },
  generateSampleRateIcon: async (rate: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${rate}Hz sample rate icon, audio wave` });
    return urls[0] || '';
  },
  generateCompressionIcon: async (type: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${type} compression icon, zipper or shrink symbol` });
    return urls[0] || '';
  },
  generateColorSpaceIcon: async (space: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${space} color space icon, color palette` });
    return urls[0] || '';
  },
  generateGammaIcon: async (gamma: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a gamma ${gamma} icon, brightness curve` });
    return urls[0] || '';
  },
  generateWhiteBalanceIcon: async (temp: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${temp}K white balance icon, temperature symbol` });
    return urls[0] || '';
  },
  generateSharpnessIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a sharpness/focus icon, lens symbol` });
    return urls[0] || '';
  },
  generateNoiseReductionIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a noise reduction icon, dampening waves` });
    return urls[0] || '';
  },
  generateStabilizationIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a stabilization icon, steady camera` });
    return urls[0] || '';
  },
  generateZoomIcon: async (level?: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a zoom${level ? ` ${level}x` : ''} icon, magnifying glass` });
    return urls[0] || '';
  },
  generatePanIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a pan icon, directional arrows` });
    return urls[0] || '';
  },
  generateCropIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a crop icon, square selection` });
    return urls[0] || '';
  },
  generateRotateIcon: async (degrees?: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a rotate${degrees ? ` ${degrees}°` : ''} icon, circular arrow` });
    return urls[0] || '';
  },
  generateFlipIcon: async (axis?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a flip ${axis || ''} icon, mirror reflection` });
    return urls[0] || '';
  },
  generateMirrorIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a mirror icon, symmetrical reflection` });
    return urls[0] || '';
  },
  generateResizeIcon: async (scale?: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a resize${scale ? ` ${scale}%` : ''} icon, corner handles` });
    return urls[0] || '';
  },
  generateScaleIcon: async (scale: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a scale ${scale}% icon, proportional scaling` });
    return urls[0] || '';
  },
  generateTranslateIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a translate/move icon, four-direction arrows` });
    return urls[0] || '';
  },
  generateSkewIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a skew icon, parallelogram shape` });
    return urls[0] || '';
  },
  generateTransformIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a transform icon, bounding box manipulation` });
    return urls[0] || '';
  },
  generatePerspectiveIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a perspective icon, 3D cube view` });
    return urls[0] || '';
  },
  generateDistortIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a distort icon, warped grid` });
    return urls[0] || '';
  },
  generateWarpIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a warp icon, flexible transformation` });
    return urls[0] || '';
  },
  generateDistortionIcon: async (type: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${type} distortion icon, wave effect` });
    return urls[0] || '';
  },
  generateDeformationIcon: async (type: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${type} deformation icon, shape change` });
    return urls[0] || '';
  },
  generateMorphIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a morph icon, shape transition` });
    return urls[0] || '';
  },
  generateTransitionIcon: async (type: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${type} transition icon, smooth effect` });
    return urls[0] || '';
  },
  generateFadeIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a fade transition icon, opacity gradient` });
    return urls[0] || '';
  },
  generateWipeIcon: async (direction?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a wipe${direction ? ` ${direction}` : ''} transition icon, bar movement` });
    return urls[0] || '';
  },
  generateSlideIcon: async (direction?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a slide${direction ? ` ${direction}` : ''} transition icon, panel shift` });
    return urls[0] || '';
  },
  generatePushIcon: async (direction?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a push${direction ? ` ${direction}` : ''} transition icon, block push` });
    return urls[0] || '';
  },
  generateCoverIcon: async (direction?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a cover${direction ? ` ${direction}` : ''} transition icon, overlapping panels` });
    return urls[0] || '';
  },
  generateRevealIcon: async (direction?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a reveal${direction ? ` ${direction}` : ''} transition icon, uncover effect` });
    return urls[0] || '';
  },
  generateCutIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a cut transition icon, sharp scissors` });
    return urls[0] || '';
  },
  generateDissolveIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a dissolve transition icon, blending effect` });
    return urls[0] || '';
  },
  generateIrisIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an iris transition icon, circular reveal` });
    return urls[0] || '';
  },
  generateMatrixIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a matrix transition icon, grid pattern` });
    return urls[0] || '';
  },
  generateCubeIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a cube transition icon, 3D rotation` });
    return urls[0] || '';
  },
  generateBookIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a book transition icon, page flip` });
    return urls[0] || '';
  },
  generateDoorIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a door transition icon, door opening` });
    return urls[0] || '';
  },
  generateVortexIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a vortex transition icon, swirl effect` });
    return urls[0] || '';
  },
  generateWaterfallIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a waterfall transition icon, cascading bars` });
    return urls[0] || '';
  },
  generatePixelateIcon: async (blocks?: number): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a pixelate${blocks ? ` ${blocks}x` : ''} transition icon, block effect` });
    return urls[0] || '';
  },
  generateRadialIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a radial transition icon, circular reveal` });
    return urls[0] || '';
  },
  generateHBlurIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an H blur transition icon, horizontal blur` });
    return urls[0] || '';
  },
  generateVBlurIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a V blur transition icon, vertical blur` });
    return urls[0] || '';
  },
  generateCheckerboardIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a checkerboard transition icon, alternating pattern` });
    return urls[0] || '';
  },
  generateStarIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a star transition icon, starburst effect` });
    return urls[0] || '';
  },
  generateSnowIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a snow transition icon, snowfall effect` });
    return urls[0] || '';
  },
  generateBurstIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a burst transition icon, explosion effect` });
    return urls[0] || '';
  },
  generateMosaicIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a mosaic transition icon, tile pattern` });
    return urls[0] || '';
  },
  generateBlindsIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a blinds transition icon, venetian blinds` });
    return urls[0] || '';
  },
  generateBowTieIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a bowtie transition icon, diagonal split` });
    return urls[0] || '';
  },
  generateCurtainIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a curtain transition icon, theater curtain` });
    return urls[0] || '';
  },
  generatePushPullIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a push-pull transition icon, competing forces` });
    return urls[0] || '';
  },
  generatePinwheelIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a pinwheel transition icon, spinning blades` });
    return urls[0] || '';
  },
  generateSwapIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a swap transition icon, exchange positions` });
    return urls[0] || '';
  },
  generateBarrelIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a barrel transition icon, curved stretch` });
    return urls[0] || '';
  },
  generateBrightnessIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a brightness icon, sun symbol` });
    return urls[0] || '';
  },
  generateContrastIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a contrast icon, gradient slider` });
    return urls[0] || '';
  },
  generateSaturationIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a saturation icon, rainbow spectrum` });
    return urls[0] || '';
  },
  generateHueIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a hue icon, color wheel` });
    return urls[0] || '';
  },
  generateOpacityIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an opacity icon, transparent square` });
    return urls[0] || '';
  },
  generateExposureIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an exposure icon, camera aperture` });
    return urls[0] || '';
  },
  generateHighlightsIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a highlights icon, bright spot` });
    return urls[0] || '';
  },
  generateShadowsIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a shadows icon, dark area` });
    return urls[0] || '';
  },
  generateWhitesIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a whites icon, white balance slider` });
    return urls[0] || '';
  },
  generateBlacksIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a blacks icon, black level slider` });
    return urls[0] || '';
  },
  generateTemperatureIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a temperature icon, warm/cool dial` });
    return urls[0] || '';
  },
  generateTintIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a tint icon, color tinting control` });
    return urls[0] || '';
  },
  generateColorBoostIcon: async (color?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${color || ''} boost icon, enhanced vibrance` });
    return urls[0] || '';
  },
  generateVibranceIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a vibrance icon, color intensity` });
    return urls[0] || '';
  },
  generateSaturationBoostIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a saturation boost icon, intensified colors` });
    return urls[0] || '';
  },
  generateSkinToneIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a skin tone icon, human skin palette` });
    return urls[0] || '';
  },
  generateTeethIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a teeth icon, smile enhancement` });
    return urls[0] || '';
  },
  generateEyeIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an eye icon, iris enhancement` });
    return urls[0] || '';
  },
  generateLipIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a lip icon, color enhancement` });
    return urls[0] || '';
  },
  generateEyebrowIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create an eyebrow icon, shape definition` });
    return urls[0] || '';
  },
  generateHairIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a hair icon, volume/thickness` });
    return urls[0] || '';
  },
  generateFaceIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a face icon, facial feature control` });
    return urls[0] || '';
  },
  generateBodyIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a body icon, body shaping` });
    return urls[0] || '';
  },
  generateSlimmingIcon: async (area?: string): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a ${area || ''} slimming icon, waist/figure reduction` });
    return urls[0] || '';
  },
  generateFaceTrackingIcon: async (): Promise<string> => {
    const urls = await generateImage({ prompt: `Create a face tracking icon, facial recognition` });
    return urls[0] || '';
  }
};

export const openaiResponses = {
  analyzeVideo: async (videoUrl: string): Promise<VideoAnalysisResult> => {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: `Analyze this video and provide: summary, key moments with timestamps, suggested clips, and platform recommendations. Video URL: ${videoUrl}`,
      tools: [{ type: 'image_generation' }]
    });
    const output = (response as unknown as { output?: Array<{ content?: unknown }> }).output;
    const content = output?.[0]?.content || '{}';
    return JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
  },

  transcribeMedia: async (url: string): Promise<TranscriptResult> => {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: `Transcribe this media. Media URL: ${url}`,
      tools: [{ type: 'image_generation' }]
    });
    const output = (response as unknown as { output?: Array<{ content?: unknown }> }).output;
    const content = output?.[0]?.content || '{}';
    return JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
  },

  generateMetadata: async (url: string): Promise<{ title?: string; description?: string; tags?: string[] }> => {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: `Generate SEO-friendly title, description, and tags for this video. Video URL: ${url}`,
      tools: [{ type: 'image_generation' }]
    });
    const output = (response as unknown as { output?: Array<{ content?: unknown }> }).output;
    const content = output?.[0]?.content || '{}';
    return JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
  },

  generateEditingSuggestions: async (videoUrl: string): Promise<string[]> => {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: `Provide editing suggestions for this video. Video URL: ${videoUrl}`,
      tools: [{ type: 'image_generation' }]
    });
    const output = (response as unknown as { output?: Array<{ content?: unknown }> }).output;
    const content = output?.[0]?.content || '[]';
    return JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
  },

  chatCompletion: async (messages: Array<Record<string, unknown>>): Promise<unknown> => {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: messages as unknown as string,
      tools: [{ type: 'image_generation' }]
    });
    const output = (response as unknown as { output?: unknown }).output;
    return output ?? response;
  }
};

export { generateImage };