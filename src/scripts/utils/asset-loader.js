/**
 * ==========================================================================
 * ASSET LOADER UTILITY
 * Loads 3D models and audio buffers from local assets with fallback support
 * ==========================================================================
 */

window.AssetLoader = (function () {
  'use strict';

  const ASSET_PATHS = {
    'm-track': 'assets/models/track.glb',
    'm-rider': 'assets/models/rider.glb',
    'm-t1': 'assets/models/tree1.glb',
    'm-t2': 'assets/models/tree2.glb',
    'm-t3': 'assets/models/tree3.glb',
    'm-t4': 'assets/models/tree4.glb',
    'a-day': 'assets/audio/day.mp3',
    'a-night': 'assets/audio/night.mp3',
    'a-birds': 'assets/audio/birds.mp3',
    'a-wheel': 'assets/audio/wheel.mp3',
    'a-horn': 'assets/audio/horn.mp3'
  };

  /**
   * Retrieves ArrayBuffer for a given asset ID
   * @param {string} id
   * @returns {Promise<ArrayBuffer>}
   */
  async function getBuffer(id) {
    const url = ASSET_PATHS[id];
    if (url) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return await response.arrayBuffer();
        }
      } catch (err) {
        console.warn(`[AssetLoader] Fetch for ${url} failed, checking inline fallback:`, err.message);
      }
    }

    // Fallback if embedded DOM element exists
    const el = document.getElementById(id);
    if (el) {
      const bin = atob(el.textContent.trim());
      const u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        u[i] = bin.charCodeAt(i);
      }
      return u.buffer;
    }

    throw new Error(`Asset not found: ${id}`);
  }

  /**
   * Loads and parses a GLTF model using THREE.GLTFLoader
   * @param {THREE.GLTFLoader} loader
   * @param {string} id
   * @returns {Promise<any>}
   */
  function loadModel(loader, id) {
    return new Promise((resolve, reject) => {
      getBuffer(id)
        .then((buf) => {
          loader.parse(
            buf,
            '',
            (gltf) => resolve(gltf),
            (err) => reject(new Error(`Failed to parse model ${id}: ${err.message || err}`))
          );
        })
        .catch((err) => reject(new Error(`Failed to load model ${id}: ${err.message || err}`)));
    });
  }

  return {
    ASSET_PATHS,
    getBuffer,
    loadModel
  };
})();

