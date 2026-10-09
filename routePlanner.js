// MARSWALK Route Planner Engine
import { DEFAULT_ROUTES, MARS_LANDMARKS, SCIENCE_TARGETS } from './marsData.js';
import { RouteScoring } from './routeScoring.js';
import { sounds } from './soundEffects.js';

export class RoutePlanner {
  constructor(containerId, onRouteChanged) {
    this.container = document.getElementById(containerId);
    this.onRouteChanged = onRouteChanged;

    this.routes = { ...DEFAULT_ROUTES };
    this.activeRouteId = 'route_b'; // Default recommended
    this.customWaypoints = [];

    this.render();
  }

  getActiveRoute() {
    return this.routes[this.activeRouteId];
  }

  selectRoute(routeId) {
    if (this.routes[routeId]) {
      this.activeRouteId = routeId;
      sounds.playPing();
      this.render();
      this.updateBottomSummary();
      if (this.onRouteChanged) {
        this.onRouteChanged(this.getActiveRoute());
      }
    }
  }

  addScienceTargetToRoute(scienceTarget) {
    const route = this.getActiveRoute();
    if (!route.scienceTargetIds.includes(scienceTarget.id)) {
      route.scienceTargetIds.push(scienceTarget.id);
      route.scienceCount = route.scienceTargetIds.length;
      route.waypoints.splice(route.waypoints.length - 1, 0, {
        name: `ST: ${scienceTarget.name}`,
        x: scienceTarget.x,
        y: scienceTarget.y,
        lat: scienceTarget.lat,
        lon: scienceTarget.lon
      });
      route.distanceKm = +(route.distanceKm + 0.3).toFixed(1);
      route.factorScores.science = Math.min(100, route.factorScores.science + 4);
      route.missionScore = RouteScoring.calculateScore(route.factorScores);

      sounds.playPing();
      this.render();
      this.updateBottomSummary();
      if (this.onRouteChanged) {
        this.onRouteChanged(route);
      }
    }
  }

  updateBottomSummary() {
    const r = this.getActiveRoute();
    const elDist = document.querySelector('.summary-stat-item:nth-child(3) .summary-stat-val');
    const elTime = document.querySelector('.summary-stat-item:nth-child(4) .summary-stat-val');
    const elRisk = document.querySelector('.summary-stat-item:nth-child(5) .summary-stat-val');
    const elSci = document.querySelector('.summary-stat-item:nth-child(6) .summary-stat-val');
    const elScore = document.querySelector('.summary-stat-val.score');

    if (elDist) elDist.textContent = `${r.distanceKm} km`;
    if (elTime) elTime.textContent = r.timeEva;
    if (elRisk) {
      elRisk.textContent = r.hazardLevel.toUpperCase();
      elRisk.style.color = r.hazardLevel === 'Low' ? 'var(--safe-green)' : 'var(--alert-amber)';
    }
    if (elSci) elSci.textContent = `${r.scienceCount} Sites`;
    if (elScore) {
      elScore.textContent = `${r.missionScore} / 100`;
      elScore.style.color = r.recommended ? 'var(--safe-green)' : 'var(--cyan-telemetry)';
    }
  }

  render() {
    if (!this.container) return;

    const r = this.getActiveRoute();

    this.container.innerHTML = `
      <div class="panel-section-header">
        <span>Route Planner</span>
        <button class="btn-secondary btn-sm" id="btn-compare-routes" style="font-size: 10px; padding: 3px 8px;">
          📊 COMPARE ROUTES
        </button>
      </div>

      <!-- Start & Destination Selection -->
      <div style="background: rgba(18, 26, 42, 0.85); padding: 12px; border-radius: 6px; border: 1px solid var(--border-glass); margin-bottom: 14px;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); text-transform: uppercase;">
              START LOCATION
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: #fff;">
              <span style="color: var(--safe-green);">🚩</span> Octavia E. Butler Landing Site
            </div>
          </div>
          <div style="height: 1px; background: rgba(255,255,255,0.06);"></div>
          <div>
            <div style="font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); text-transform: uppercase;">
              DESTINATION TARGET
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: #fff;">
              <span style="color: var(--mars-orange);">🎯</span> Ancient River Delta (Hawksbill)
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Routes Selector List -->
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
        ${Object.values(this.routes).map(route => {
          const isAct = route.id === this.activeRouteId;
          return `
            <div class="route-select-card ${isAct ? 'active' : ''}" data-route="${route.id}" style="
              padding: 10px 12px;
              border-radius: 6px;
              background: ${isAct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(11, 15, 23, 0.6)'};
              border: 1px solid ${isAct ? (route.recommended ? 'var(--safe-green)' : 'var(--cyan-telemetry)') : 'var(--border-glass)'};
              cursor: pointer;
              transition: var(--transition-fast);
              position: relative;
            ">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-family: var(--font-display); font-size: 12px; font-weight: 700; color: ${route.color};">
                  ${route.code} ${route.recommended ? '★' : ''}
                </div>
                <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #fff;">
                  ${route.distanceKm} km • ${route.timeEva}
                </div>
              </div>

              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">
                ${route.type} • Elev: ${route.elevationChange}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-family: var(--font-mono); font-size: 10px;">
                <span style="color: ${route.hazardLevel === 'Low' ? 'var(--safe-green)' : 'var(--alert-amber)'};">
                  Risk: ${route.hazardLevel}
                </span>
                <span style="color: ${route.recommended ? 'var(--safe-green)' : '#fff'}; font-weight: 700;">
                  Score: ${route.missionScore} / 100
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- "Why this route?" Transparent Decision Explanation Card -->
      <div style="background: rgba(13, 20, 32, 0.85); border: 1px solid var(--border-tech); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
        <div style="font-family: var(--font-display); font-size: 11px; color: var(--cyan-telemetry); letter-spacing: 0.5px; margin-bottom: 6px;">
          WHY THIS ROUTE?
        </div>
        <p style="font-size: 11px; line-height: 1.45; color: var(--text-primary);">
          ${r.rationale}
        </p>
      </div>

      <!-- Mathematical Score Breakdown -->
      ${RouteScoring.renderScoreBreakdown(r)}

      <!-- Waypoint Sequence Tracker -->
      <div style="margin-top: 14px;">
        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
          TRAVERSE WAYPOINTS (${r.waypoints.length})
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; max-height: 130px; overflow-y: auto;">
          ${r.waypoints.map((wp, i) => `
            <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; background: rgba(0,0,0,0.25); padding: 4px 8px; border-radius: 4px;">
              <span style="color: var(--text-muted);">${i + 1}.</span>
              <span style="color: #fff; margin-left: 4px; flex: 1;">${wp.name}</span>
              <span style="color: var(--cyan-telemetry);">${wp.lat ? `${wp.lat.toFixed(3)}°N` : ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bind route card clicks
    this.container.querySelectorAll('.route-select-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-route');
        if (id) this.selectRoute(id);
      });
    });

    // Bind Compare Routes modal trigger
    const compareBtn = document.getElementById('btn-compare-routes');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        sounds.playClick();
        RouteScoring.renderComparisonModal(this.routes, this.activeRouteId, (newId) => {
          this.selectRoute(newId);
        });
      });
    }
  }
}
