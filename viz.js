// Carga dinámica de la librería DSCC de Google
(function() {
  const script = document.createElement('script');
  script.src = "https://ajax.googleapis.com/ajax/libs/dscc/0.3.11/dscc.min.js";
  script.onload = () => {
    
    const COLORS = {
      blue:   '#4F6AF0',
      green:  '#2DBD9B',
      purple: '#A855F7',
      coral:  '#E84F6B'
    };

    function drawViz(data) {
      const container = document.body;
      container.innerHTML = '';

      const rows = data.tables.DEFAULT;
      const styleConfig = data.style;
      const barColor = COLORS[styleConfig.barColor?.value] || COLORS.blue;

      const totalHoras = rows.reduce((sum, row) => {
        return sum + (Number(row['metric'][0]) || 0);
      }, 0);

      const sorted = [...rows].sort((a, b) => {
        const na = String(a['dimension'][0]);
        const nb = String(b['dimension'][0]);
        return na.localeCompare(nb, 'es');
      });

      const style = document.createElement('style');
      style.textContent = `
        body { font-family: sans-serif; margin: 0; padding: 10px; }
        .wu-row { display: grid; grid-template-columns: 1fr 80px 120px; gap: 10px; padding: 8px 0; border-bottom: 1px solid #eee; align-items: center; }
        .wu-name { font-size: 13px; font-weight: 500; }
        .wu-hours { text-align: right; font-size: 13px; color: #666; }
        .wu-bar-track { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; flex-grow: 1; }
        .wu-bar-fill { height: 100%; border-radius: 3px; }
        .wu-bar-cell { display: flex; align-items: center; gap: 8px; }
        .wu-pct { font-size: 11px; min-width: 35px; text-align: right; font-weight: bold; }
      `;
      document.head.appendChild(style);

      sorted.forEach(row => {
        const nombre = row['dimension'][0];
        const horas  = Number(row['metric'][0]) || 0;
        const pct    = totalHoras > 0 ? (horas / totalHoras * 100) : 0;

        const fila = document.createElement('div');
        fila.className = 'wu-row';
        fila.innerHTML = `
          <div class="wu-name">${nombre}</div>
          <div class="wu-hours">${horas.toLocaleString('es-AR')} h</div>
          <div class="wu-bar-cell">
            <div class="wu-bar-track"><div class="wu-bar-fill" style="width:${pct}%; background:${barColor};"></div></div>
            <div class="wu-pct" style="color:${barColor}">${pct.toFixed(1)}%</div>
          </div>
        `;
        container.appendChild(fila);
      });
    }

    dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
  };
  document.head.appendChild(script);
})();
