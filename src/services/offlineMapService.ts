/**
 * AgriVision AI - Offline Map & Farm Plot Caching Service
 * Coordinates Service Worker tile caching and local storage persistence.
 */

import { FarmPlot } from '../types';
import { INITIAL_FARMS } from './mockData';

export const OFFLINE_FARMS_STORAGE_KEY = 'agrivision_farms_v1';
export const OFFLINE_MAP_METADATA_KEY = 'agrivision_map_offline_meta';

export interface OfflineMapMetadata {
  lastCachedAt: string;
  totalPlots: number;
  tilesCachedCount: number;
  version: string;
}

/**
 * Register Service Worker for offline GIS tile caching
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    console.log('🌱 AgriVision AI Service Worker registered successfully (scope: /)');
    return reg;
  } catch (err) {
    console.warn('Service Worker registration skipped or restricted in container:', err);
    return null;
  }
}

/**
 * Safe local storage getter that never throws in sandboxed iframes
 */
export function getCachedFarmPlots(): FarmPlot[] {
  if (typeof window === 'undefined') return INITIAL_FARMS;

  try {
    const raw = localStorage.getItem(OFFLINE_FARMS_STORAGE_KEY);
    if (!raw) return INITIAL_FARMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FARMS;
  } catch (err) {
    console.warn('Local storage read error, using initial farms:', err);
    return INITIAL_FARMS;
  }
}

/**
 * Save farm plots to local storage for instant offline access
 */
export function saveFarmPlotsOffline(farms: FarmPlot[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(OFFLINE_FARMS_STORAGE_KEY, JSON.stringify(farms));
    const meta: OfflineMapMetadata = {
      lastCachedAt: new Date().toISOString(),
      totalPlots: farms.length,
      tilesCachedCount: farms.length * 16,
      version: '1.2.0'
    };
    localStorage.setItem(OFFLINE_MAP_METADATA_KEY, JSON.stringify(meta));
    return true;
  } catch (err) {
    console.warn('Could not cache farm plots offline:', err);
    return false;
  }
}

/**
 * Get offline map metadata (last cached time, total cached plots)
 */
export function getOfflineMapMetadata(): OfflineMapMetadata | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(OFFLINE_MAP_METADATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Convert lat/long to OSM tile coordinates at a given zoom level
 */
function latLonToTile(lat: number, lon: number, zoom: number): { x: number; y: number } {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}

/**
 * Pre-cache OpenStreetMap tiles for a specific farm location across zooms 14-16
 * This allows farmers to pan/zoom their field with zero cell signal!
 */
export async function precacheTilesForFarm(farm: FarmPlot): Promise<{ success: boolean; count: number }> {
  const urls: string[] = [];
  const zooms = [14, 15, 16];

  for (const z of zooms) {
    const center = latLonToTile(farm.latitude, farm.longitude, z);
    // Cache 3x3 grid around center tile
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const x = center.x + dx;
        const y = center.y + dy;
        urls.push(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
      }
    }
  }

  // Also include polygon vertices
  if (farm.polygonCoords) {
    for (const [lat, lon] of farm.polygonCoords) {
      const tile = latLonToTile(lat, lon, 15);
      const url = `https://tile.openstreetmap.org/15/${tile.x}/${tile.y}.png`;
      if (!urls.includes(url)) urls.push(url);
    }
  }

  // Send message to Service Worker if active
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PRECACHE_TILES',
      urls
    });
  } else if (typeof window !== 'undefined' && 'caches' in window) {
    // Direct cache access fallback
    try {
      const cache = await caches.open('agrivision-map-tiles-v1');
      await Promise.all(
        urls.map(async (url) => {
          try {
            const hasMatch = await cache.match(url);
            if (!hasMatch) {
              const res = await fetch(url, { mode: 'cors' });
              if (res.ok) await cache.put(url, res);
            }
          } catch {}
        })
      );
    } catch (e) {
      console.warn('Direct CacheStorage fetch failed:', e);
    }
  }

  // Update offline metadata
  saveFarmPlotsOffline(getCachedFarmPlots());

  return { success: true, count: urls.length };
}
