// Transparent Multi-Factor Route Scoring System for MARSWALK
// Model: 35% Safety + 25% Science Value + 20% Terrain + 10% Distance + 10% Environment

import { sounds } from './soundEffects.js';

export class RouteScoring {
  static WEIGHTS = {
    safety: 0.35,
    science: 0.25,
    terrain: 0.20,
    distance: 0.10,
    environment: 0.10
  };

  static calculateScore(factorScores) {
    const s = factorScores.safety * this.WEIGHTS.safety +
              factorScores.science * this.WEIGHTS.science +
              factorScores.terrain * this.WEIGHTS.terrain +
              factorScores.distance * this.WEIGHTS.distance +
              factorScores.environment * this.WEIGHTS.environment;
    return Math.round(s);
  }

  static renderScoreBreakdown(route) {
    const factors = [
      { key: 'safety', label: 'Safety (35%)', val: route.factorScores.safety, color: 'var(--safe-green)' },
      { key: 'science', label: 'Science Value (25%)', val: route.factorScores.science, color: 'var(--science-purple)' },
      { key: 'terrain', label: 'Terrain Ease (20%)', val: route.factorScores.terrain, color: 'var(--cyan-telemetry)' },
      { key: 'distance', label: 'Distance Efficiency (10%)', val: route.factorScores.distance, color: 'var(--mars-orange)' },
      { key: 'environment', label: 'Environmental Conditions (10%)', val: route.factorScores.environment, color: 'var(--alert-amber)' }
    ];

    return `
      <div class="score-breakdown-box" style="background: rgba(11, 15, 23, 0.7); border: 1px solid var(--border-glass); border-radius: 6px; padding: 12px; margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase;">
            SCORING MODEL BREAKDOWN
          </span>
          <span style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: ${route.recommended ? 'var(--safe-green)' : 'var(--text-highlight)'};">
            ${route.missionScore} / 100
          </span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${factors.map(f => `
            <div>
              <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; margin-bottom: 2px;">
                <span style="color: var(--text-secondary);">${f.label}</span>
                <span style="color: #fff; font-weight: 600;">${f.val}%</span>
              </div>
              <div style="height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;">
                <div style="width: ${f.val}%; height: 100%; background: ${f.color}; border-radius: 2px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  static renderComparisonModal(routes, activeRouteId, onSelectRoute) {
    let existingModal = document.getElementById('route-comparison-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'route-comparison-modal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(4, 6, 10, 0.85);
      backdrop-filter: blur(14px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.25s ease-out;
    `;

    const routesList = Object.values(routes);

    modal.innerHTML = `
      <div style="
        background: #0d131f;
        border: 1px solid var(--border-tech);
        border-radius: 10px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 28px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.15);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <div style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 1px;">
              MARSWALK ROUTE COMPARISON MATRIX
            </div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan-telemetry); margin-top: 3px;">
              EVA TRAVERSE OPTIMIZATION MODEL // JEZERO PALEOLAKE BASIN
            </div>
          </div>
          <button id="modal-close-btn" style="
            background: rgba(255,255,255,0.06);
            border: 1px solid var(--border-glass);
            color: var(--text-secondary);
            font-size: 16px;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
          ">✕</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          ${routesList.map(r => `
            <div style="
              background: ${r.id === activeRouteId ? 'rgba(16, 185, 129, 0.08)' : 'rgba(18, 26, 42, 0.6)'};
              border: 1px solid ${r.id === activeRouteId ? 'var(--safe-green)' : (r.recommended ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-glass)')};
              border-radius: 8px;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              position: relative;
            ">
              ${r.recommended ? `
                <div style="
                  position: absolute;
                  top: -10px;
                  right: 12px;
                  background: var(--safe-green);
                  color: #04080e;
                  font-family: var(--font-mono);
                  font-size: 9px;
                  font-weight: 700;
                  padding: 2px 8px;
                  border-radius: 4px;
                  letter-spacing: 1px;
                ">RECOMMENDED</div>
              ` : ''}

              <div>
                <div style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: ${r.color};">
                  ${r.code}
                </div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">
                  ${r.type}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: baseline; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 6px;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">MISSION SCORE</span>
                <span style="font-family: var(--font-display); font-size: 18px; font-weight: 800; color: ${r.recommended ? 'var(--safe-green)' : '#fff'};">
                  ${r.missionScore} / 100
                </span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 11px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;">
                  <span style="color: var(--text-muted);">Distance:</span>
                  <span style="color: #fff; font-weight: 600;">${r.distanceKm} km</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;">
                  <span style="color: var(--text-muted);">EVA Time:</span>
                  <span style="color: #fff; font-weight: 600;">${r.timeEva}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;">
                  <span style="color: var(--text-muted);">Elevation:</span>
                  <span style="color: #fff;">${r.elevationChange}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;">
                  <span style="color: var(--text-muted);">Terrain:</span>
                  <span style="color: ${r.terrainDiff.includes('High') ? 'var(--alert-amber)' : 'var(--safe-green)'};">${r.terrainDiff}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;">
                  <span style="color: var(--text-muted);">Risk Level:</span>
                  <span style="color: ${r.hazardLevel === 'Low' ? 'var(--safe-green)' : 'var(--alert-amber)'};">${r.hazardLevel}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;">
                  <span style="color: var(--text-muted);">Science Targets:</span>
                  <span style="color: var(--cyan-telemetry); font-weight: 600;">${r.scienceCount} Outcrops</span>
                </div>
              </div>

              <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; margin-top: auto; padding-top: 8px;">
                ${r.rationale}
              </p>

              <button class="btn-tech btn-sm modal-select-route-btn" data-route="${r.id}" style="
                width: 100%;
                justify-content: center;
                background: ${r.id === activeRouteId ? 'var(--safe-green)' : ''};
                color: ${r.id === activeRouteId ? '#04080e' : '#fff'};
              ">
                ${r.id === activeRouteId ? '✓ ACTIVE ROUTE' : 'SELECT THIS ROUTE'}
              </button>
            </div>
          `).join('')}
        </div>

        <div style="background: rgba(11, 15, 23, 0.85); padding: 14px; border-radius: 6px; border: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 11px; color: var(--text-secondary);">
            Scoring Formula: <strong>35% Safety</strong> + <strong>25% Science Value</strong> + <strong>20% Terrain Difficulty</strong> + <strong>10% Distance</strong> + <strong>10% Environment</strong>
          </div>
          <button class="btn-secondary btn-sm" id="modal-close-btn-bottom">CLOSE MATRIX</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event bindings
    const closeBtns = [document.getElementById('modal-close-btn'), document.getElementById('modal-close-btn-bottom')];
    closeBtns.forEach(b => {
      if (b) {
        b.addEventListener('click', () => {
          sounds.playClick();
          modal.remove();
        });
      }
    });

    modal.querySelectorAll('.modal-select-route-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const routeId = e.currentTarget.getAttribute('data-route');
        if (routeId && onSelectRoute) {
          sounds.playPing();
          onSelectRoute(routeId);
          modal.remove();
        }
      });
    });
  }
}
