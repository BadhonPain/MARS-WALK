import { MarsGlobe } from './marsGlobe.js';
import { MarsMap } from './marsMap.js';
import { LayerControl } from './layerControl.js';
import { RoutePlanner } from './routePlanner.js';
import { sounds } from './soundEffects.js';
import { MARS_LANDMARKS, SCIENCE_TARGETS, HAZARDS } from './marsData.js';

class MarsWalkApp {
  constructor() {
    this.currentView = 'landing';
    this.globe = null;
    this.marsMap = null;
    this.layerControl = null;
    this.routePlanner = null;
    this.init();
  }

  init() {
    this.initTelemetryClock();
    this.initNavigation();
    this.initSoundToggle();
    this.initGlobe();
    this.initMapAndLayers();
    this.initQuickActions();
  }

  initTelemetryClock() {
    const updateClocks = () => {
      const now = new Date();
      // UTC Clock
      const utcString = now.toUTCString().split(' ')[4] + ' UTC';
      const elUtc = document.getElementById('hud-utc-time');
      if (elUtc) elUtc.textContent = utcString;

      // Martian Sol calculation (Reference Sol 421)
      const baseMs = new Date('2026-01-01T00:00:00Z').getTime();
      const currentMs = now.getTime();
      const marsSolDays = 421 + Math.floor((currentMs - baseMs) / (88775.244 * 1000));
      const elSol = document.getElementById('hud-sol-counter');
      if (elSol) elSol.textContent = `SOL ${marsSolDays}`;
    };

    updateClocks();
    setInterval(updateClocks, 1000);
  }

  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const viewId = e.currentTarget.getAttribute('data-view');
        if (viewId) {
          sounds.playClick();
          this.switchView(viewId);
        }
      });
    });

    // Brand logo returns to landing
    const brand = document.getElementById('brand-home-btn');
    if (brand) {
      brand.addEventListener('click', () => {
        sounds.playClick();
        this.switchView('landing');
      });
    }

    // Sidebar tabs in Planner
    const tabButtons = document.querySelectorAll('.sidebar-tab-btn');
    tabButtons.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        sounds.playClick();
        tabButtons.forEach((t) => t.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const targetPane = e.currentTarget.getAttribute('data-pane');
        const panes = document.querySelectorAll('.tab-pane');
        panes.forEach((p) => p.classList.remove('active'));
        const activePane = document.getElementById(`pane-${targetPane}`);
        if (activePane) activePane.classList.add('active');
      });
    });
  }

  switchView(viewId) {
    this.currentView = viewId;

    // Update nav links active state
    document.querySelectorAll('.nav-item').forEach((item) => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update view containers
    document.querySelectorAll('.view-container').forEach((vc) => {
      vc.classList.remove('active-view');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // If entering planner, play telemetry chirp and resize map
    if (viewId === 'planner') {
      sounds.playPing();
      if (this.marsMap) {
        setTimeout(() => {
          this.marsMap.resize();
        }, 50);
      }
    }
  }

  initSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isEnabled = sounds.toggle();
      btn.innerHTML = isEnabled ? '🔊' : '🔇';
      btn.title = isEnabled ? 'Mute Mission Audio' : 'Unmute Mission Audio';
      if (isEnabled) sounds.playPing();
    });
  }

  initGlobe() {
    try {
      this.globe = new MarsGlobe('mars-hero-canvas');
    } catch (e) {
      console.warn('Canvas 3D globe initialization error:', e);
    }
  }

  initMapAndLayers() {
    // 1. Initialize LayerControl
    this.layerControl = new LayerControl('layer-control-container', 'map-legend-container', (layers) => {
      // Map re-renders automatically via animate() loop reading layerControl state
    });

    // 2. Initialize Interactive MarsMap
    this.marsMap = new MarsMap('mars-main-map-canvas', this.layerControl, (entity) => {
      this.updateTargetInspector(entity);
    });

    // 3. Initialize RoutePlanner
    this.routePlanner = new RoutePlanner('route-planner-container', (activeRoute) => {
      if (this.marsMap) {
        this.marsMap.setActiveRoute(activeRoute);
      }
    });

    // Set initial active route in MarsMap
    if (this.routePlanner && this.marsMap) {
      this.marsMap.setActiveRoute(this.routePlanner.getActiveRoute());
      this.routePlanner.updateBottomSummary();
    }

    // Set initial target inspector
    if (SCIENCE_TARGETS.length > 0) {
      this.updateTargetInspector(SCIENCE_TARGETS[0]);
    }
  }

  updateTargetInspector(entity) {
    const card = document.getElementById('target-inspector-card');
    const statusBadge = document.getElementById('inspector-data-status');
    if (!card) return;

    if (entity.priority) {
      // It's a Science Target
      if (statusBadge) {
        statusBadge.textContent = 'HIGH-PRIORITY SCIENCE';
        statusBadge.style.color = 'var(--cyan-telemetry)';
      }
      card.innerHTML = `
        <div style="background: rgba(18, 26, 42, 0.9); border-radius: 8px; padding: 14px; border: 1px solid rgba(168, 85, 247, 0.4); margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <div style="font-family: var(--font-display); font-size: 15px; color: #fff;">
              ${entity.name}
            </div>
            <span style="font-family: var(--font-mono); font-size: 10px; color: #c084fc; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); padding: 2px 6px; border-radius: 4px;">
              ${entity.code}
            </span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan-telemetry); margin-bottom: 10px;">
            TYPE: ${entity.type} • SCORE: ${entity.valueScore} / 100
          </div>

          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
            ${entity.interest}
          </p>

          <div style="display: flex; flex-direction: column; gap: 6px; font-family: var(--font-mono); font-size: 11px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>DATA SOURCE:</span>
              <span style="color: #fff;">${entity.source}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>COORDINATES:</span>
              <span style="color: var(--cyan-telemetry);">${entity.lat.toFixed(3)}°N, ${entity.lon.toFixed(3)}°E</span>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">
              SUGGESTED SCIENTIFIC ACTIONS:
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${entity.actions ? entity.actions.map(act => `
                <div style="font-size: 11px; color: var(--text-primary); background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-glass);">
                  ${act}
                </div>
              `).join('') : ''}
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn-tech btn-sm" id="btn-add-science-target" style="flex: 1; justify-content: center;">
              + ADD TO MISSION
            </button>
            <button class="btn-secondary btn-sm" id="btn-view-target-data" style="justify-content: center;">
              VIEW DATA
            </button>
          </div>
        </div>
      `;

      const addBtn = document.getElementById('btn-add-science-target');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          sounds.playPing();
          if (this.routePlanner) {
            this.routePlanner.addScienceTargetToRoute(entity);
          }
          addBtn.textContent = '✓ INCLUDED IN ROUTE';
          addBtn.style.background = 'rgba(16, 185, 129, 0.4)';
        });
      }
    } else if (entity.severity) {
      // It's a Hazard
      if (statusBadge) {
        statusBadge.textContent = 'TERRAIN HAZARD WARNING';
        statusBadge.style.color = 'var(--alert-red)';
      }
      card.innerHTML = `
        <div style="background: rgba(18, 26, 42, 0.9); border-radius: 8px; padding: 14px; border: 1px solid rgba(239, 68, 68, 0.4); margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <div style="font-family: var(--font-display); font-size: 15px; color: var(--alert-red);">
              ⚠️ ${entity.name}
            </div>
            <span style="font-family: var(--font-mono); font-size: 10px; color: #fca5a5; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); padding: 2px 6px; border-radius: 4px;">
              ${entity.code} // ${entity.severity}
            </span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--alert-amber); margin-bottom: 10px;">
            CLASSIFICATION: ${entity.type} • GRADIENT: ${entity.gradient}
          </div>

          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
            ${entity.desc}
          </p>

          <div style="background: rgba(239, 68, 68, 0.08); padding: 8px; border-radius: 6px; border-left: 2px solid var(--alert-red); margin-bottom: 12px;">
            <div style="font-family: var(--font-mono); font-size: 10px; color: #fca5a5; text-transform: uppercase;">
              RECOMMENDED MITIGATION PROTOCOL:
            </div>
            <div style="font-size: 11px; color: #fff; margin-top: 3px;">
              ${entity.mitigation}
            </div>
          </div>

          <button class="btn-secondary btn-sm" id="btn-hazard-bypass" style="width: 100%; justify-content: center;">
            CALCULATE BYPASS TRAVERSE
          </button>
        </div>
      `;

      const bypassBtn = document.getElementById('btn-hazard-bypass');
      if (bypassBtn) {
        bypassBtn.addEventListener('click', () => {
          sounds.playPing();
          if (this.routePlanner) {
            this.routePlanner.selectRoute('route_b');
          }
          const routeTab = document.querySelector('.sidebar-tab-btn[data-pane="routes"]');
          if (routeTab) routeTab.click();
        });
      }
    } else {
      // Landmark / Base
      if (statusBadge) {
        statusBadge.textContent = 'EXPLORATION LANDMARK';
        statusBadge.style.color = 'var(--safe-green)';
      }
      card.innerHTML = `
        <div style="background: rgba(18, 26, 42, 0.9); border-radius: 8px; padding: 14px; border: 1px solid var(--border-glass); margin-bottom: 14px;">
          <div style="font-family: var(--font-display); font-size: 15px; color: var(--mars-orange); margin-bottom: 4px;">
            ${entity.name}
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan-telemetry); margin-bottom: 10px;">
            STATUS: ${entity.status || 'VERIFIED'}
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
            ${entity.desc}
          </p>
          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
            <span>COORDINATES:</span>
            <span style="color: #fff;">${entity.lat ? entity.lat.toFixed(3) : 0}°N, ${entity.lon ? entity.lon.toFixed(3) : 0}°E</span>
          </div>
          <button class="btn-tech btn-sm" id="btn-focus-landmark" style="width: 100%; justify-content: center;">
            CENTER ON LANDMARK
          </button>
        </div>
      `;

      const focusBtn = document.getElementById('btn-focus-landmark');
      if (focusBtn) {
        focusBtn.addEventListener('click', () => {
          sounds.playPing();
          if (this.marsMap) {
            this.marsMap.panToPoint(entity.x, entity.y);
          }
        });
      }
    }
  }

  initQuickActions() {
    // Hero Start Mission Button
    const startBtn = document.getElementById('hero-start-mission-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        sounds.playPing();
        this.switchView('planner');
      });
    }

    // Hero Explore Mars Button
    const exploreBtn = document.getElementById('hero-explore-mars-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        sounds.playClick();
        this.switchView('planner');
      });
    }

    // Demo Flow Trigger Button
    const demoBtn = document.getElementById('start-demo-flow-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        sounds.playPing();
        this.switchView('planner');
      });
    }

    // Globe popover card Target Site button
    const globePlanBtn = document.getElementById('globe-card-plan-btn');
    if (globePlanBtn) {
      globePlanBtn.addEventListener('click', () => {
        sounds.playPing();
        this.switchView('planner');
      });
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.marsWalkApp = new MarsWalkApp();
});
