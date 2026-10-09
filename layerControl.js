// Layer Control System for MARSWALK 12-Layer GIS Architecture
import { sounds } from './soundEffects.js';

export class LayerControl {
  constructor(containerId, legendContainerId, onLayerToggle) {
    this.container = document.getElementById(containerId);
    this.legendContainer = document.getElementById(legendContainerId);
    this.onLayerToggle = onLayerToggle;

    this.layers = [
      { id: 'terrain', name: 'Mars Terrain Basemap', icon: '🏔️', active: true, desc: 'High-contrast shaded relief' },
      { id: 'elevation', name: 'Elevation Contours', icon: '📈', active: true, desc: 'MOLA Topographic contours' },
      { id: 'orbital', name: 'Orbital Imagery (HiRISE)', icon: '🛰️', active: true, desc: '25cm/px sub-meter mosaic' },
      { id: 'traverses', name: 'Rover Traverses', icon: '🐾', active: true, desc: 'Perseverance ground track' },
      { id: 'roverLocation', name: 'Rover Position & Telemetry', icon: '🟠', active: true, desc: 'Active rover beacon' },
      { id: 'geology', name: 'Geological Units', icon: '🟨', active: true, desc: 'Delta & volcanic formations' },
      { id: 'waterIce', name: 'Water / Ice Evidence', icon: '🔵', active: true, desc: 'Paleolake clays & hydrology' },
      { id: 'minerals', name: 'Mineral Indicators', icon: '💎', active: true, desc: 'Carbonate & silica deposits' },
      { id: 'craters', name: 'Impact Craters & Rim', icon: '⭕', active: true, desc: 'Jezero & Belva rims' },
      { id: 'weather', name: 'Dust & Weather Front', icon: '🌪️', active: true, desc: 'Wind vectors & dust opacity' },
      { id: 'radiation', name: 'Radiation Exposure Zone', icon: '☢️', active: false, desc: 'Cosmic ray risk heatmap' },
      { id: 'scienceTargets', name: 'Science Targets', icon: '🟣', active: true, desc: 'High-value sampling sites' }
    ];

    this.render();
    this.renderLegend();
  }

  isLayerActive(id) {
    const layer = this.layers.find((l) => l.id === id);
    return layer ? layer.active : false;
  }

  toggleLayer(id) {
    const layer = this.layers.find((l) => l.id === id);
    if (layer) {
      layer.active = !layer.active;
      sounds.playClick();
      this.updateUI();
      if (this.onLayerToggle) {
        this.onLayerToggle(this.layers);
      }
    }
  }

  setLayer(id, state) {
    const layer = this.layers.find((l) => l.id === id);
    if (layer) {
      layer.active = state;
      this.updateUI();
      if (this.onLayerToggle) {
        this.onLayerToggle(this.layers);
      }
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="layer-control-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-family: var(--font-display); font-size: 13px; color: var(--mars-orange); letter-spacing: 1px;">
          GIS DATA LAYERS
        </span>
        <span class="brand-badge" id="active-layers-count">
          ${this.getActiveCount()} / 12 ACTIVE
        </span>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="btn-secondary btn-sm" id="btn-layers-all" style="flex: 1; justify-content: center; font-size: 10px;">ALL ON</button>
        <button class="btn-secondary btn-sm" id="btn-layers-clear" style="flex: 1; justify-content: center; font-size: 10px;">MINIMAL</button>
      </div>

      <div class="layer-items-list" style="display: flex; flex-direction: column; gap: 6px;">
        ${this.layers.map((l) => `
          <div class="layer-item-row ${l.active ? 'active' : ''}" data-layer="${l.id}" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            background: ${l.active ? 'rgba(226, 88, 62, 0.12)' : 'rgba(15, 23, 38, 0.5)'};
            border: 1px solid ${l.active ? 'rgba(226, 88, 62, 0.35)' : 'var(--border-glass)'};
            border-radius: 5px;
            cursor: pointer;
            transition: var(--transition-fast);
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${l.icon}</span>
              <div>
                <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: ${l.active ? '#fff' : 'var(--text-muted)'};">
                  ${l.name}
                </div>
                <div style="font-size: 10px; color: var(--text-muted); line-height: 1.2;">
                  ${l.desc}
                </div>
              </div>
            </div>
            <div class="layer-toggle-switch" style="
              width: 32px;
              height: 18px;
              border-radius: 9px;
              background: ${l.active ? 'var(--mars-rust)' : 'rgba(255,255,255,0.1)'};
              position: relative;
              transition: var(--transition-fast);
            ">
              <div style="
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #fff;
                position: absolute;
                top: 2px;
                left: ${l.active ? '16px' : '2px'};
                transition: var(--transition-fast);
                box-shadow: 0 1px 3px rgba(0,0,0,0.4);
              "></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Bind event listeners
    this.container.querySelectorAll('.layer-item-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-layer');
        if (id) this.toggleLayer(id);
      });
    });

    const btnAll = document.getElementById('btn-layers-all');
    if (btnAll) {
      btnAll.addEventListener('click', () => {
        sounds.playClick();
        this.layers.forEach((l) => (l.active = true));
        this.updateUI();
        if (this.onLayerToggle) this.onLayerToggle(this.layers);
      });
    }

    const btnClear = document.getElementById('btn-layers-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        sounds.playClick();
        this.layers.forEach((l) => (l.active = ['terrain', 'traverses', 'scienceTargets'].includes(l.id)));
        this.updateUI();
        if (this.onLayerToggle) this.onLayerToggle(this.layers);
      });
    }
  }

  getActiveCount() {
    return this.layers.filter((l) => l.active).length;
  }

  updateUI() {
    const countEl = document.getElementById('active-layers-count');
    if (countEl) countEl.textContent = `${this.getActiveCount()} / 12 ACTIVE`;

    this.container.querySelectorAll('.layer-item-row').forEach((row) => {
      const id = row.getAttribute('data-layer');
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        row.style.background = layer.active ? 'rgba(226, 88, 62, 0.12)' : 'rgba(15, 23, 38, 0.5)';
        row.style.borderColor = layer.active ? 'rgba(226, 88, 62, 0.35)' : 'var(--border-glass)';
        const title = row.querySelector('div > div:first-child');
        if (title) title.style.color = layer.active ? '#fff' : 'var(--text-muted)';
        const toggle = row.querySelector('.layer-toggle-switch');
        if (toggle) {
          toggle.style.background = layer.active ? 'var(--mars-rust)' : 'rgba(255,255,255,0.1)';
          const knob = toggle.querySelector('div');
          if (knob) knob.style.left = layer.active ? '16px' : '2px';
        }
      }
    });

    this.renderLegend();
  }

  renderLegend() {
    if (!this.legendContainer) return;

    this.legendContainer.innerHTML = `
      <div style="
        background: rgba(11, 15, 23, 0.88);
        border: 1px solid var(--border-glass);
        border-radius: 6px;
        padding: 10px 14px;
        backdrop-filter: var(--glass-blur);
      ">
        <div style="font-family: var(--font-display); font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;">
          MAP LEGEND & SYMBOLOGY
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-family: var(--font-mono); font-size: 11px;">
          <div style="display: flex; align-items: center; gap: 6px; color: var(--mars-orange);">
            <span>🟠</span> Rover Position
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: var(--cyan-telemetry);">
            <span>🔵</span> Water/Ice Evidence
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: var(--science-purple);">
            <span>🟣</span> Science Target
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: var(--alert-red);">
            <span>🔴</span> Hazard / Scarp
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: var(--safe-green);">
            <span>🟢</span> Planned Route
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: var(--alert-amber);">
            <span>🟨</span> Geological Unit
          </div>
        </div>
      </div>
    `;
  }
}
