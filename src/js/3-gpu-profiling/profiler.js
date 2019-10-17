import { getGPUTier } from 'detect-gpu';

const gpuTier = getGPUTier();

export const GRAPHICS_HIGH = 'GRAPHICS_HIGH';
export const GRAPHICS_NORMAL = 'GRAPHICS_NORMAL';

export default function graphicsMode() {
  switch (gpuTier.tier) {
    case 'GPU_DESKTOP_TIER_3':
    case 'GPU_DESKTOP_TIER_2':
      return GRAPHICS_HIGH;
    case 'GPU_DESKTOP_TIER_1':
    default:
      return GRAPHICS_NORMAL;
  }
}
