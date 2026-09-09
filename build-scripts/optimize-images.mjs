/**
 * Build script: Convert JPEG frames to WebP and create profile thumbnail
 * Run with: node build-scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, resolve } from 'path';

const FRAMES_DIR = resolve('Assets/Media/frames');
const WEBP_DIR = resolve('Assets/Media/frames-webp');
const IMAGES_DIR = resolve('Assets/Media/images');
const WEBP_QUALITY = 80;
const THUMBNAIL_SIZE = 80;

async function convertFramesToWebP() {
  console.log('=== Converting frames to WebP ===');
  
  await mkdir(WEBP_DIR, { recursive: true });
  
  const files = (await readdir(FRAMES_DIR))
    .filter(f => f.endsWith('.jpg'))
    .sort();
  
  console.log(`Found ${files.length} JPEG frames`);
  
  let totalJpeg = 0;
  let totalWebp = 0;
  const BATCH_SIZE = 16;
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (file) => {
      const inputPath = join(FRAMES_DIR, file);
      const outputName = file.replace('.jpg', '.webp');
      const outputPath = join(WEBP_DIR, outputName);
      
      const jpegStat = await stat(inputPath);
      totalJpeg += jpegStat.size;
      
      await sharp(inputPath)
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(outputPath);
      
      const webpStat = await stat(outputPath);
      totalWebp += webpStat.size;
    }));
    
    console.log(`  Converted ${Math.min(i + BATCH_SIZE, files.length)}/${files.length}`);
  }
  
  const savingMB = ((totalJpeg - totalWebp) / (1024 * 1024)).toFixed(1);
  const pctSaved = ((1 - totalWebp / totalJpeg) * 100).toFixed(1);
  console.log(`\n  JPEG total: ${(totalJpeg / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`  WebP total: ${(totalWebp / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`  Saved: ${savingMB} MB (${pctSaved}%)\n`);
}

async function createProfileThumbnail() {
  console.log('=== Creating profile thumbnail ===');
  
  const inputPath = join(IMAGES_DIR, 'my-image.jpg');
  const outputPath = join(IMAGES_DIR, 'my-image-thumb.jpg');
  
  const inputStat = await stat(inputPath);
  
  await sharp(inputPath)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
  
  const outputStat = await stat(outputPath);
  
  console.log(`  Original: ${(inputStat.size / 1024).toFixed(1)} KB (3098x3098)`);
  console.log(`  Thumbnail: ${(outputStat.size / 1024).toFixed(1)} KB (${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE})`);
  console.log(`  Saved: ${((1 - outputStat.size / inputStat.size) * 100).toFixed(1)}%\n`);
}

async function main() {
  console.log('\n🚀 Portfolio Image Optimization\n');
  
  await convertFramesToWebP();
  await createProfileThumbnail();
  
  console.log('✅ All optimizations complete!\n');
}

main().catch(console.error);
