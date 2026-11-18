function progression(cid, mid){
  const d = donnees(cid, mid);
  const co = liste(d,"cours"), ex = liste(d,"exercices"), qz = liste(d,"quiz");
  const total = co.length + ex.length + qz.length;
  const fait = co.filter(estEtudie).length
    + ex.filter((_,i) => memo.lire(`fait:${cid}-${mid}-${i}`, false)).length
    + qz.filter(q => memo.lire(cleQ(cid, mid, q), null) === 1).length;
  return {fait, total, pct: total ? Math.round(100 * fait / total) : 0};
}
function progressionClasse(cid){
  let f=0,t=0; matieresDe(trouverClasse(cid)).forEach(m => { const p = progression(cid, m.id); f+=p.fait; t+=p.total; });
  return {fait:f, total:t, pct: t ? Math.round(100 * f / t) : 0};
}
const jauge = p => p.total ? `<div class="jauge"><i style="width:${Math.round(100*p.fait/p.total)}%"></i></div>` : "";

