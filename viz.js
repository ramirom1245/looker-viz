(function() {
  const script = document.createElement('script');
  script.src = "https://ajax.googleapis.com/ajax/libs/dscc/0.3.11/dscc.min.js";
  script.onload = () => {
    
    function drawViz(data) {
      document.body.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; border: 2px solid #4285F4; border-radius: 8px;">
          <h3 style="color: #4285F4;">¡Conexión Exitosa!</h3>
          <p>La visualización está leyendo los datos de Looker Studio correctamente.</p>
          <pre>${JSON.stringify(data.tables.DEFAULT[0], null, 2)}</pre>
        </div>
      `;
    }

    dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
  };
  document.head.appendChild(script);
})();
