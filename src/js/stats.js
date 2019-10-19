import RenderStats from './render-stats';

// Setup render stats and fps stats

const stats = require('@jam3/stats')();

stats.domElement.style.cssText = 'position:fixed;left:0;top:0;z-index:10000';

export const renderStats = new RenderStats();

if (document.body !== null) document.body.appendChild(renderStats.domElement);
