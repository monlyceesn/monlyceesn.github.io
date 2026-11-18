/* ---------- Suivi de progression : chapitres, quiz, notions à revoir, historique ----------
   Tout est enregistré seulement sur l'appareil de l'élève (aucun compte, rien n'est envoyé). */
const hashQ = s => { let h = 5381; for(const ch of String(s)) h = ((h << 5) + h + ch.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };
const cleQ = (cid, mid, q) => `qr:${cid}-${mid}-${hashQ(q.q)}`;
const idCours = x => x.id || x.tpl || x.titre;
const estEtudie = x => memo.lire(`etudie:${idCours(x)}`, false);
const sansBalises = t => String(t).replace(/<[^>]+>/g, "").trim();
const titreCourt = t => sansBalises(t).replace(/^Chapitre (\d+) — /, "Ch. $1 · ").replace(/ \(.*\)$/, "").slice(0, 70);
let revoirQuiz = null;   // {c, m, chap} : rejouer seulement les questions ratées

function noterActivite(texte, lien, cle){
  const h = memo.lire("historique", []);
  if(h[0] && ((cle && h[0].cle === cle) || h[0].texte === texte)) h.shift();
  h.unshift({t: Date.now(), texte, lien, cle});
  memo.ecrire("historique", h.slice(0, 40));
}

function ilYa(t){
  const s = Math.round((Date.now() - t) / 1000);
  if(s < 60) return "à l'instant";
  if(s < 3600) return `il y a ${Math.round(s / 60)} min`;
  if(s < 86400) return `il y a ${Math.round(s / 3600)} h`;
  const j = Math.round(s / 86400);
  return j === 1 ? "hier" : `il y a ${j} jours`;
}

/* Questions ratées regroupées par chapitre, pour toutes les classes */
function notionsARevoir(){
  const res = [];
  CLASSES.forEach(c => matieresDe(c).forEach(m => {
    const groupes = {};
    liste(donnees(c.id, m.id), "quiz").forEach(q => {
      if(memo.lire(cleQ(c.id, m.id, q), null) !== 0) return;
      const chap = q.chap || m.nom;
      groupes[chap] = (groupes[chap] || 0) + 1;
    });
    Object.entries(groupes).forEach(([chap, n]) => res.push({c, m, chap, n}));
  }));
  return res.sort((a, b) => b.n - a.n);
}

function ouvrirRevision(c, m, chap){
  revoirQuiz = {c: c.id, m: m.id, chap};
  memo.ecrire(`onglet:${c.id}-${m.id}`, "quiz");
  if(location.hash === `#${c.id}-${m.id}`) pageMatiere(c, m, "quiz");
  else location.hash = `${c.id}-${m.id}`;
}

function pageProgression(){
  const actives = CLASSES.filter(c => progressionClasse(c.id).fait > 0);
  const revoir = notionsARevoir();
  const histo = memo.lire("historique", []).slice(0, 15);
  const blocMatiere = (c, m) => {
    const d = donnees(c.id, m.id), p = progression(c.id, m.id);
    if(!p.total) return "";
    const co = liste(d, "cours"), ex = liste(d, "exercices"), qz = liste(d, "quiz");
    const nbCo = co.filter(estEtudie).length;
    const nbEx = ex.filter((_, i) => memo.lire(`fait:${c.id}-${m.id}-${i}`, false)).length;
    const nbQ = qz.filter(q => memo.lire(cleQ(c.id, m.id, q), null) === 1).length;
    const meilleur = memo.lire(`quiz:${c.id}-${m.id}`, null);
    return `<div class="exo rv">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
        <h3 style="margin:0">${m.ico} ${m.nom}</h3><b style="font-size:1.4rem">${p.pct} %</b></div>
      ${jauge(p)}
      <ul class="etapes" style="margin-top:10px">
        ${co.length ? `<li>📘 Chapitres étudiés : <b>${nbCo} / ${co.length}</b></li>` : ""}
        ${ex.length ? `<li>✏️ Exercices réussis : <b>${nbEx} / ${ex.length}</b></li>` : ""}
        ${qz.length ? `<li>❓ Questions de quiz réussies : <b>${nbQ} / ${qz.length}</b>${meilleur !== null ? ` · meilleur quiz complet : <b>${meilleur}/${qz.length}</b>` : ""}</li>` : ""}
      </ul>
      ${co.length ? `<details style="margin-top:8px"><summary>Voir le suivi des chapitres</summary>
        <div>${co.map(x => `<div style="padding:4px 0">${estEtudie(x) ? "✅" : "⬜"} ${titreCourt(x.titre)}</div>`).join("")}</div></details>` : ""}
      <div class="actions"><a class="btn" href="#${c.id}-${m.id}">Continuer →</a></div>
    </div>`;
  };
  afficher(entete(`<a href="#accueil">Accueil</a> › Ma progression`, "Ma progression",
      "Ton suivi est enregistré seulement sur cet appareil.") + `
    <section class="section"><div class="wrap">
      ${actives.length ? actives.map(c => { const p = progressionClasse(c.id);
        return `<h2 class="titre-bloc rv">${c.nom} · ${p.pct} %</h2>${jauge(p)}
          ${matieresDe(c).map(m => blocMatiere(c, m)).join("")}`; }).join("")
      : `<div class="vide">📊 Rien pour l'instant.<br>Marque un chapitre comme étudié, réussis un exercice ou fais un quiz : ta progression apparaîtra ici.
          <div class="actions" style="justify-content:center"><a class="btn plein" href="#classes" onclick="location.hash='accueil'">Choisir ma classe →</a></div></div>`}

      <h2 class="titre-bloc rv">🎯 Notions à revoir</h2>
      ${revoir.length ? `<p class="rv" style="color:var(--gris);margin-bottom:8px">Les questions de quiz ratées, regroupées par chapitre. Une question réussie plus tard disparaît de la liste.</p>
        ${revoir.slice(0, 12).map((r, i) => `<div class="ligne-lecon rv" style="cursor:default">
          <span class="num-lecon">${r.n}</span>
          <span><b>${r.chap}</b><br><small>${r.m.nom} · ${r.c.court}</small></span>
          <button class="btn" data-revoir="${i}">Revoir</button></div>`).join("")}`
      : `<p class="rv" style="color:var(--gris)">Aucune notion à revoir pour l'instant. Les questions ratées dans les quiz apparaîtront ici.</p>`}

      <h2 class="titre-bloc rv">🕘 Dernières activités</h2>
      ${histo.length ? histo.map(h => `<a class="rv" href="${h.lien || "#progression"}" style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 2px;border-bottom:1px solid var(--bord);color:inherit;text-decoration:none">
          <span>${h.texte}</span><small style="color:var(--gris);white-space:nowrap">${ilYa(h.t)}</small></a>`).join("")
      : `<p class="rv" style="color:var(--gris)">Pas encore d'activité.</p>`}
    </div></section>`);
  app.querySelectorAll("[data-revoir]").forEach(btn => btn.addEventListener("click", () => {
    const r = revoir[+btn.dataset.revoir]; ouvrirRevision(r.c, r.m, r.chap);
  }));
}
