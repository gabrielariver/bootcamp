const BACKEND_URL = 'http://localhost:5501';
const y = document.getElementById('y'); y.textContent = new Date().getFullYear();
function setStatus(el, msg, ok = true) { el.textContent = msg; el.style.color = ok ? '#34d399' : '#f87171' }
async function postJSON(path, data) {
    const res = await fetch(`${BACKEND_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || 'Error');
    return json;
}

const leadForm = document.getElementById('leadForm');
const leadBtn = document.getElementById('leadBtn');
const leadMsg = document.getElementById('leadMsg');
leadForm.addEventListener('submit', async (e) => {
    e.preventDefault(); leadBtn.disabled = true; setStatus(leadMsg, 'Enviando…', true);
    const fd = new FormData(leadForm); const payload = Object.fromEntries(fd.entries());
    try { await postJSON('/api/contact', payload); leadForm.reset(); setStatus(leadMsg, '¡Gracias! Te contactaremos pronto.'); }
    catch (err) { setStatus(leadMsg, err.message || 'No se pudo enviar.', false); }
    finally { leadBtn.disabled = false; }
});

    // Recetas API 
async function cargarReceta() {
  const contenedor = document.getElementById('receta-contenedor');
  contenedor.innerHTML = 'Cargando...';

  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    const receta = data.meals[0];

    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingr = receta[`strIngredient${i}`];
      const cant = receta[`strMeasure${i}`];
      if (ingr && ingr.trim()) ingredientes.push(`${cant || ''} ${ingr}`.trim());
    }

    contenedor.innerHTML = `
      <article class="card" style="grid-column:1/-1">
        <h3>${receta.strMeal}</h3>
        <img src="${receta.strMealThumb}" alt="${receta.strMeal}" style="width:100%;border-radius:12px;margin:12px 0">
        <p><strong>Categoría:</strong> ${receta.strCategory}</p>
        <p><strong>Región:</strong> ${receta.strArea}</p>
        <p><strong>Ingredientes:</strong><br> ${ingredientes.map(i => `• ${i}`).join('<br>')}</p>
        <p style="margin-top:12px"><strong>Instrucciones:</strong><br>${receta.strInstructions}</p>
        ${receta.strYoutube ? `<p><a href="${receta.strYoutube}" target="_blank" class="btn secondary" style="margin-top:10px;display:inline-block">Ver en YouTube</a></p>` : ''}
      </article>
    `;
  } catch (error) {
    contenedor.innerHTML = `<p style="color:red">No se pudo cargar la receta. Intenta de nuevo.</p>`;
  }
}

document.getElementById('receta-btn')?.addEventListener('click', cargarReceta);
window.addEventListener('DOMContentLoaded', cargarReceta);
