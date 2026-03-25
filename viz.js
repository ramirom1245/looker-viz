// Looker Studio Community Visualization
// Tabla minimalista: Unidad de negocio | Horas | Barra de participación %

const COLORS = {
  blue:   '#4F6AF0',
  green:  '#2DBD9B',
  purple: '#A855F7',
  coral:  '#E84F6B'
};

function drawViz(data) {
  const container = document.getElementById('container') || document.body;
  container.innerHTML = '';

  // Leer datos de Looker Studio
  const rows = data.tables.DEFAULT;
  const styleConfig = data.style;

  const barColor = COLORS[styleConfig.barColor?.value] || COLORS.blue;

  // Calcular total de horas
  const totalHoras = rows.reduce((sum, row) => {
    return sum + (Number(row['metric'][0].value) || 0);
  }, 0);

  // Ordenar alfabéticamente por dimensión
  const sorted = [...rows].sort((a, b) => {
    const na = String(a['dimension'][0].value);
    const nb = String(b['dimension'][0].value);
    return na.localeCompare(nb, 'es');
  });

  // Estilos
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Google Sans', 'Roboto', sans-serif; background: transparent; }
    #wu-wrap { padding: 16px; }
    .wu-header {
      display: grid;
      grid-template-columns: 1fr 100px 160px;
      gap: 0 16px;
      padding: 0 0 8px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      margin-bottom: 2px;
    }
    .wu-header span {
      font-size: 10px;
      color: #888;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 500;
    }
    .wu-header span:nth-child(2),
    .wu-header span:nth-child(3) { text-align: right; }
    .wu-row {
      display: grid;
      grid-template-columns: 1fr 100px 160px;
      gap: 0 16px;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    .wu-row:last-of-type { border-bottom: none; }
    .wu-name { font-size: 13px; color: #202124; font-weight: 500; }
    .wu-hours { font-size: 13px; color: #5f6368; text-align: right; font-variant-numeric: tabular-nums; }
    .wu-bar-cell { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
    .wu-bar-track { flex: 1; height: 5px; background: rgba(0,0,0,0.08); border-radius: 99px; overflow: hidden; }
    .wu-bar-fill { height: 100%; border-radius: 99px; }
    .wu-pct { font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 500; min-width: 36px; text-align: right; }
    .wu-total {
      display: grid;
      grid-template-columns: 1fr 100px 160px;
      gap: 0 16px;
      padding: 10px 0 0;
      border-top: 1px solid rgba(0,0,0,0.15);
      margin-top: 2px;
    }
    .wu-total-label { font-size: 11px; color: #888; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
    .wu-total-hours { font-size: 13px; color: #202124; text-align: right; font-weight: 500; font-variant-numeric: tabular-nums; }
  `;
  document.head.appendChild(style);

  // Wrapper
  const wrap = document.createElement('div');
  wrap.id = 'wu-wrap';

  // Header
  const header = document.createElement('div');
  header.className = 'wu-header';
  header.innerHTML = `
    <span>Unidad de negocio</span>
    <span>Horas</span>
    <span>Participación</span>
  `;
  wrap.appendChild(header);

  // Filas
  sorted.forEach(row => {
    const nombre = String(row['dimension'][0].value);
    const horas  = Number(row['metric'][0].value) || 0;
    const pct    = totalHoras > 0 ? (horas / totalHoras * 100) : 0;

    const fila = document.createElement('div');
    fila.className = 'wu-row';
    fila.innerHTML = `
      <div class="wu-name">${nombre}</div>
      <div class="wu-hours">${horas.toLocaleString('es-AR')} h</div>
      <div class="wu-bar-cell">
        <div class="wu-bar-track">
          <div class="wu-bar-fill" style="width:${pct.toFixed(1)}%; background:${barColor};"></div>
        </div>
        <div class="wu-pct" style="color:${barColor};">${pct.toFixed(1)}%</div>
      </div>
    `;
    wrap.appendChild(fila);
  });

  // Total
  const total = document.createElement('div');
  total.className = 'wu-total';
  total.innerHTML = `
    <div class="wu-total-label">Total</div>
    <div class="wu-total-hours">${totalHoras.toLocaleString('es-AR')} h</div>
    <div></div>
  `;
  wrap.appendChild(total);

  container.appendChild(wrap);
}

// Entry point requerido por Looker Studio
dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
