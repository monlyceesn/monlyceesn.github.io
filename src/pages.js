
/* ================= AFFICHAGE + ANIMATIONS ================= */
const COULEURS = ["bg-vert","bg-corail","bg-jaune"];
const NUM = {"Seconde":"2","Première":"1","Terminale":"T"};

let observateur = null;
function afficher(html){
  app.innerHTML = html;
  // Apparition progressive des éléments .rv au défilement
  if(observateur) observateur.disconnect();
  const els = app.querySelectorAll(".rv");
  if("IntersectionObserver" in window){
    observateur = new IntersectionObserver(es => es.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("vu"); observateur.unobserve(e.target); }
    }), {threshold:.12});
    els.forEach(el => observateur.observe(el));
  } else els.forEach(el => el.classList.add("vu"));
  // Compteurs animés
  app.querySelectorAll("[data-compte]").forEach(compter);
}

function compter(el){
  const fin = +el.dataset.compte, debut = performance.now(), duree = 1200;
  const pas = t => {
    const k = Math.min(1, (t - debut) / duree);
    el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
    if(k < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}

// En-tête sombre des pages internes
function entete(fil, titre, sous, extra = ""){
  return `<section class="entete"><div class="wrap">
    <div class="fil">${fil}</div>
    <div class="tribar"><i></i><i></i><i></i></div>
    <h1 class="display">${titre}</h1>
    ${sous ? `<p>${sous}</p>` : ""}${extra}
  </div></section>`;
}

/* ================= PAGES ================= */
function pageAccueil(){
  const dernier = memo.lire("dernier", null);
  let reprise = "";
  if(dernier){
    const c = trouverClasse(dernier.c), m = trouverMatiere(dernier.m);
    if(c && m) reprise = `<a class="reprendre rv" href="#${c.id}-${m.id}"><span class="rond">▶</span>
      <div><b>Reprendre là où tu t'es arrêté</b><br><small>${m.nom} · ${c.nom}</small></div></a>`;
  }
  afficher(`
    <section class="heros"><div class="wrap heros-grille">
      <div>
        <div class="badge"><i></i>Programme sénégalais · Série S</div>
        <h1 class="titre-heros display"><span class="l"><span>Réussis</span></span><span class="l"><span>ton bac</span></span></h1>
        <p class="sous-heros">Cours, exercices, quiz et orientation — au même endroit.</p>
        <div class="tribar"><i></i><i></i><i></i></div>
        <p class="lead">De la Seconde S à la Terminale, séries L1, L2, S1 et S2 : des cours clairs, des exercices corrigés avec indices, des quiz pour t'entraîner et tout pour réussir ton orientation sur Campusen.</p>
        <div class="ctas">
          <a class="btn jaune gros" href="#classes" data-defil="classes">Choisir ma classe →</a>
          <a class="btn clair gros" href="#orientation">Orientation</a>
          <button class="btn clair gros btn-installer" hidden onclick="installerAppli()">📲 Installer l'appli</button>
        </div>
      </div>
      <div class="scene" aria-hidden="true"><div class="logo-centre">${LOGO_GRAND}</div></div>
    </div>
    </section>
    <section class="section" id="classes"><div class="wrap">
      ${reprise}
      <input class="recherche rv" id="cherche" type="search" placeholder="🔍  Rechercher : « maths tle s2 », « philo l2 »…" autocomplete="off">
      <div id="res"></div>
      <div class="tete rv" style="margin-top:34px"><span class="eyebrow">Étape 1</span><h2>Choisis ta <span>classe</span></h2></div>
${NIVEAUX.map(n => `
      <h3 class="niveau rv">${n}</h3>
      <div class="grille">
        ${CLASSES.filter(c => c.niveau === n).map((c,i) => { const p = progressionClasse(c.id);
          return `<a class="carte carte-classe niv-${c.niveau} rv" style="--d:${i*.06}s" href="#${c.id}">
            <span class="fleche">→</span>
            <span class="display">${c.court}</span><small>${c.matieres.length} matières</small>${jauge(p)}</a>`; }).join("")}
      </div>`).join("")}
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="tete rv"><span class="eyebrow">Tes outils</span><h2>Travaille <span>malin</span></h2></div>
      <div class="grille">
        <a class="carte rv" href="#conseils"><span class="fleche">→</span><span class="rond bg-jaune">⏱️</span><b>Minuteur de révision</b><small>25 min de travail, 5 min de pause</small></a>
        <a class="carte rv" style="--d:.08s" href="#conseils"><span class="fleche">→</span><span class="rond bg-vert">💡</span><b>Méthodes de travail</b><small>Apprendre, réviser, réussir le bac</small></a>
        <a class="carte rv" style="--d:.16s" href="#orientation"><span class="fleche">→</span><span class="rond bg-corail">🧭</span><b>Orientation</b><small>Pistes et checklist Campusen</small></a>
        <a class="carte rv" style="--d:.24s" href="#concours"><span class="fleche">→</span><span class="rond bg-vert">🎯</span><b>Je prépare un concours</b><small>Concours après le bac et niveaux requis</small></a>
      </div>
    </div></section>`);
  const champ = document.getElementById("cherche"), res = document.getElementById("res");
  champ.addEventListener("input", () => {
    const mots = sansAccent(champ.value).split(/\s+/).filter(Boolean);
    if(!mots.length){ res.innerHTML = ""; return; }
    const trouves = [];
    CLASSES.forEach(c => matieresDe(c).forEach(m => {
      const texte = sansAccent(`${c.nom} ${c.court} ${c.niveau} ${c.id.replace("-"," ")} ${m.nom} ${m.alias}`);
      if(mots.every(w => texte.includes(w))) trouves.push({c, m});
    }));
    res.innerHTML = trouves.length
      ? `<div class="resultats">${trouves.slice(0,8).map(x => `<a href="#${x.c.id}-${x.m.id}">${x.m.ico} ${x.m.nom} — ${x.c.nom}</a>`).join("")}</div>`
      : `<p style="margin:10px 6px;color:var(--gris)">Aucun résultat.</p>`;
  });
  app.querySelectorAll("[data-defil]").forEach(a => a.addEventListener("click", ev => {
    ev.preventDefault();
    document.getElementById(a.dataset.defil).scrollIntoView({behavior:"smooth"});
  }));
}

function pageClasse(c){
  const p = progressionClasse(c.id);
  afficher(entete(`<a href="#accueil">Accueil</a> › ${c.nom}`, c.nom, "Choisis une matière.",
      p.total ? jauge(p) : "") + `
    <section class="section"><div class="wrap">
      <div class="grille">
        ${matieresDe(c).map((m,i) => {
          const d = donnees(c.id, m.id);
          const n = ["cours","exercices","quiz","conseils"].reduce((s,k) => s + liste(d,k).length, 0);
          const pm = progression(c.id, m.id);
          return `<a class="carte rv" style="--d:${i*.05}s" href="#${c.id}-${m.id}"><span class="fleche">→</span>
            <span class="rond ${COULEURS[i%3]}">${m.ico}</span><b>${m.nom}</b>
            ${n ? `<span class="statut ok">${pm.total ? `${pm.fait}/${pm.total} fait` : n + " ressource(s)"}</span>` : `<span class="statut bientot">Bientôt</span>`}
            ${jauge(pm)}</a>`;
        }).join("")}
      </div>
    </div></section>`);
}

const ONGLETS = {cours:"📘 Cours", exercices:"✏️ Exercices", quiz:"❓ Quiz", conseils:"💡 Conseils"};

function pageMatiere(c, m, onglet, garderDefil){
  memo.ecrire("dernier", {c:c.id, m:m.id});
  const d = donnees(c.id, m.id);
  const ong = onglet || memo.lire(`onglet:${c.id}-${m.id}`, "cours");
  memo.ecrire(`onglet:${c.id}-${m.id}`, ong);
  const p = progression(c.id, m.id);
  const y = window.scrollY;
  const idx = matieresDe(c).indexOf(m);
  afficher(entete(`<a href="#accueil">Accueil</a> › <a href="#${c.id}">${c.nom}</a> › ${m.nom}`,
      `<span class="rond ${COULEURS[idx%3]}">${m.ico}</span>${m.nom}`,
      `${c.nom}${p.total ? ` · progression : <b>${p.fait}/${p.total}</b>` : ""}`, jauge(p)) + `
    <section class="section" style="padding-top:26px"><div class="wrap">
      <div class="onglets">
        ${Object.keys(ONGLETS).map(k => `<button class="${k===ong?'actif':''}" data-o="${k}">${ONGLETS[k]}</button>`).join("")}
      </div>
      <div id="corps"></div>
    </div></section>`);
  if(garderDefil) window.scrollTo(0, y);
  app.querySelectorAll(".onglets button").forEach(b =>
    b.addEventListener("click", () => pageMatiere(c, m, b.dataset.o, true)));
  const corps = document.getElementById("corps");
  const items = liste(d, ong);
  if(!items.length){
    corps.innerHTML = `<div class="vide">📭 Pas encore de contenu ici.<br>Il arrive bientôt.</div>`; return;
  }
  if(ong === "exercices") return rendreExercices(corps, c, m, items);
  if(ong === "quiz") return rendreQuiz(corps, c, m, items);
  const ouverts = memo.lire(`ouverts:${c.id}-${m.id}`, items.length === 1 ? [0] : []);
  corps.innerHTML = items.map((x, i) => x.type === "fascicule" ? `
    <details class="boite-cours" data-i="${i}" ${ouverts.includes(i) ? "open" : ""}>
      <summary>
        <span class="rond-cours">${i + 1}</span>
        <span class="tete-cours"><b>${x.titre}</b><small>${x.lecons.length} ${x.credit ? "parties" : "leçons"} · ${x.pages} pages · ${x.credit ? x.credit : "Cours de " + x.auteur}</small></span>
      </summary>
      <div class="contenu-cours">
      <p style="color:var(--gris);font-size:.88rem">${x.auteur} · ${x.edition} · ${x.taille}</p>
      <div class="actions">
        <a class="btn plein" href="${x.pdf}" target="_blank" rel="noopener">📖 ${x.credit ? "Ouvrir le cours (PDF)" : "Ouvrir le fascicule"}</a>
        ${x.pdf.startsWith("http") ? "" : `<button class="btn" data-pdf="${x.pdf}" data-titre="${x.titre.replace(/"/g,"&quot;")}">${estTelecharge(x.pdf) && horsLignePossible() ? "✅ Disponible hors connexion" : "📥 Télécharger (" + x.taille + ")"}</button>`}
      </div>
      ${x.leger ? "" : `<p style="font-size:.8rem;color:var(--gris);margin-top:8px">⚠️ Fichier lourd : télécharge-le de préférence en Wi-Fi.</p>`}
      <h4 style="margin:16px 0 4px;font-size:.95rem">${x.credit ? "Sommaire — lis une partie directement ici" : "Sommaire — lis une leçon directement ici"}</h4>
      ${x.lecons.map(l => `<a class="ligne-lecon" href="#lecon-${x.id}-${l.n}">
        <span class="num-lecon">${l.n}</span><span>${l.titre}</span><small>p. ${l.debut === l.fin ? l.debut : l.debut + "–" + l.fin}</small></a>`).join("")}
      <p style="font-size:.8rem;color:var(--gris);margin-top:10px">${x.note || "Document partagé avec l'autorisation de son auteur, publié sans modification. L'auteur reste propriétaire de son cours."}</p>
      </div>
    </details>`
    : x.tpl ? `
    <div class="exo">
      <span class="tag">📘 Cours Mon Lycée SN</span>
      <h3 style="margin:.5em 0 .3em">${x.titre}</h3>
      <ul class="etapes">${x.plan.map((p,k) => `<li>${["I","II","III","IV","V"][k]}. ${p}</li>`).join("")}</ul>
      <div class="actions">
        <button class="btn plein" data-lire="${i}">📖 Lire le cours</button>
        ${x.pdf ? `<button class="btn" data-pdf="${x.pdf}" data-titre="${x.titre.replace(/"/g,"&quot;")} — ${c.court}">${estTelecharge(x.pdf) && horsLignePossible() ? "✅ Disponible hors connexion" : "📄 Télécharger le PDF"}</button>` : ""}
      </div>
      <div class="lecture" id="lecture${i}" hidden></div>
    </div>`
    : `<details><summary>${x.titre}</summary><div>${x.texte}</div></details>`).join("");
  corps.querySelectorAll("details.boite-cours").forEach(d => d.addEventListener("toggle", () => {
    const o = [...corps.querySelectorAll("details.boite-cours[open]")].map(e => +e.dataset.i);
    memo.ecrire(`ouverts:${c.id}-${m.id}`, o);
  }));
  corps.querySelectorAll("[data-pdf]").forEach(b => b.addEventListener("click", () => telechargerPdf(b)));
  corps.querySelectorAll("[data-lire]").forEach(b => b.addEventListener("click", () => {
    const x = items[+b.dataset.lire], zone = document.getElementById("lecture" + b.dataset.lire);
    if(zone.hidden){
      zone.innerHTML = document.getElementById(x.tpl).innerHTML;
      zone.hidden = false; b.textContent = "✖ Fermer le cours";
    } else { zone.hidden = true; b.textContent = "📖 Lire le cours"; }
  }));
}

/* ---------- Lecteur de leçon (pages d'un fascicule, sans tout télécharger) ----------
   Le PDF d'origine n'est pas modifié : PDF.js n'en lit que les morceaux nécessaires
   (requêtes « Range »), et seules les pages de la leçon sont affichées. */
function trouverFascicule(id){
  for(const cl of Object.values(CONTENU)) for(const d of Object.values(cl))
    for(const x of (d.cours || [])) if(x.type === "fascicule" && x.id === id) return x;
  return null;
}
let pdfjsPromesse = null;
function chargerPdfjs(){
  if(!pdfjsPromesse) pdfjsPromesse = new Promise((ok, ko) => {
    if(window.pdfjsLib) return ok(window.pdfjsLib);
    const sc = document.createElement("script");
    sc.src = "vendor/pdfjs/pdf.min.js";
    sc.onload = () => { pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs/pdf.worker.min.js"; ok(pdfjsLib); };
    sc.onerror = () => { pdfjsPromesse = null; ko(new Error("pdfjs")); };
    document.head.appendChild(sc);
  });
  return pdfjsPromesse;
}
const docsPdf = {};
function ouvrirPdf(url){
  if(!docsPdf[url]) docsPdf[url] = chargerPdfjs().then(lib => lib.getDocument({
    url, disableAutoFetch: true, disableStream: true, rangeChunkSize: 262144, isEvalSupported: false
  }).promise).catch(e => { delete docsPdf[url]; throw e; });
  return docsPdf[url];
}

function pageLecon(id, n){
  const f = trouverFascicule(id);
  const l = f && f.lecons.find(x => x.n === n);
  if(!f || !l) return pageAccueil();
  const c = trouverClasse(f.classe), m = trouverMatiere(f.matiere);
  memo.ecrire("derniereLecon", {id, n});
  const nb = l.fin - l.debut + 1;
  const prec = f.lecons.find(x => x.n === n - 1), suiv = f.lecons.find(x => x.n === n + 1);
  afficher(entete(`<a href="#accueil">Accueil</a> › <a href="#${c.id}">${c.nom}</a> › <a href="#${c.id}-${m.id}">${m.nom}</a> › ${f.lecons.length > 4 ? "Leçon " + n : "Partie " + n}`,
      `${f.lecons.length > 4 ? "Leçon " + n : f.titre}`, `${l.titre}<br><small>${f.credit || "Cours de " + f.auteur} · pages ${l.debut} à ${l.fin}</small>`) + `
    <section class="section" style="padding-top:18px"><div class="wrap">
      <div class="actions" style="justify-content:space-between;margin:0 0 14px">
        ${prec ? `<a class="btn" href="#lecon-${id}-${prec.n}">◀ ${f.lecons.length > 4 ? "Leçon " + prec.n : "Partie précédente"}</a>` : "<span></span>"}
        ${suiv ? `<a class="btn" href="#lecon-${id}-${suiv.n}">${f.lecons.length > 4 ? "Leçon " + suiv.n : "Partie suivante"} ▶</a>` : ""}
      </div>
      <p id="etatLecteur" style="color:var(--gris);font-size:.88rem;margin-bottom:10px">⏳ Chargement des ${nb} pages de la leçon…</p>
      <div id="pagesPdf">${Array.from({length: nb}, (_, k) => `
        <div class="page-pdf" data-p="${l.debut + k}"><span>Page ${l.debut + k}</span></div>`).join("")}</div>
      <div class="actions" style="justify-content:space-between;margin-top:14px">
        ${prec ? `<a class="btn" href="#lecon-${id}-${prec.n}">◀ ${f.lecons.length > 4 ? "Leçon " + prec.n : "Partie précédente"}</a>` : "<span></span>"}
        ${suiv ? `<a class="btn plein" href="#lecon-${id}-${suiv.n}">${f.lecons.length > 4 ? "Leçon " + suiv.n : "Partie suivante"} ▶</a>` : ""}
      </div>
      <p style="font-size:.78rem;color:var(--gris);margin-top:14px">${f.note || `Document de ${f.auteur}, partagé avec son autorisation et affiché sans modification.`}</p>
    </div></section>`);
  const etat = document.getElementById("etatLecteur");
  ouvrirPdf(f.pdf).then(doc => {
    etat.textContent = `📖 ${nb} page${nb > 1 ? "s" : ""} · seules les pages de cette ${f.lecons.length > 4 ? "leçon" : "partie"} sont chargées.`;
    const vues = new IntersectionObserver(es => es.forEach(e => {
      if(!e.isIntersecting) return;
      vues.unobserve(e.target);
      rendrePage(doc, e.target).catch(() => { e.target.innerHTML = "<span>Page indisponible (connexion ?)</span>"; });
    }), {rootMargin: "600px 0px"});
    document.querySelectorAll(".page-pdf").forEach(el => vues.observe(el));
  }).catch(() => {
    etat.innerHTML = `⚠️ Impossible d'afficher la leçon ici${navigator.onLine ? "" : " (pas de connexion, et le fascicule n'est pas téléchargé)"}.
      <a href="${f.pdf}" target="_blank" rel="noopener">Ouvrir le fascicule complet</a> (pages ${l.debut} à ${l.fin}).`;
  });
}

async function rendrePage(doc, el){
  const page = await doc.getPage(+el.dataset.p);
  const base = page.getViewport({scale: 1});
  const largeur = el.clientWidth || 360, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vue = page.getViewport({scale: largeur * dpr / base.width});
  const cv = document.createElement("canvas");
  cv.width = Math.floor(vue.width); cv.height = Math.floor(vue.height);
  await page.render({canvasContext: cv.getContext("2d"), viewport: vue}).promise;
  el.innerHTML = ""; el.appendChild(cv); el.classList.add("rendue");
}

/* ---------- Conseils + minuteur ---------- */
const minuteur = {duree:25*60, reste:25*60, mode:"travail", h:null};
function boiteProfil(p, i){
  return `<details class="boite-cours rv" id="profil-${p.id}" style="--d:${Math.min(i,6)*.04}s">
    <summary><span class="rond-cours" style="font-size:1.3rem">${p.ico}</span>
      <span class="tete-cours"><b>${p.titre}</b><small>${p.actions.length} conseils + un exemple</small></span></summary>
    <div class="contenu-cours">
      <p class="sous-titre-c">🔎 Tu te reconnais si…</p><p>${p.signe}</p>
      <p class="sous-titre-c">🤔 Pourquoi ça arrive</p><p>${p.pourquoi}</p>
      <p class="sous-titre-c">✅ Ce que tu peux faire</p>
      <ul class="etapes">${p.actions.map(l => `<li>${l}</li>`).join("")}</ul>
      <div class="encadre" style="margin-top:12px"><b>Exemple :</b> ${p.exemple}</div>
    </div></details>`;
}
function pageConseils(){
  const matieres = PROFILS_CONSEILS.filter(p => ["maths","pc","svt","francais","langues","hg"].includes(p.id));
  const habitudes = PROFILS_CONSEILS.filter(p => !matieres.includes(p));
  afficher(entete(`<a href="#accueil">Accueil</a> › Conseils`, "Conseils", "Choisis ta situation : des conseils adaptés à toi.") + `
    <section class="section"><div class="wrap">
      <h2 class="titre-bloc rv">Ma situation</h2>
      <p class="rv" style="color:var(--gris);margin-bottom:10px">Touche ce qui te ressemble, la bonne fiche s'ouvre.</p>
      <div class="puces rv">${PROFILS_CONSEILS.map(p => `<button class="puce" data-profil="${p.id}">${p.ico} ${p.titre.replace(/^J'ai du mal en /,"Difficultés en ")}</button>`).join("")}</div>
      <h3 class="niveau rv">📚 Difficultés dans une matière</h3>
      ${matieres.map(boiteProfil).join("")}
      <h3 class="niveau rv">🧠 Concentration, rythme et organisation</h3>
      ${habitudes.map(boiteProfil).join("")}
      <div class="minuteur rv" style="margin-top:26px">
        <span class="eyebrow" style="color:var(--jaune)">Minuteur de révision</span>
        <p style="margin-top:4px">25 minutes de travail concentré, puis 5 minutes de pause.</p>
        <div class="cercle" id="cercle"><div><span><b id="temps">25:00</b><small id="mode">Travail</small></span></div></div>
        <div class="actions" style="justify-content:center">
          <button class="btn plein" id="go">▶ Démarrer</button>
          <button class="btn" id="raz">↺ Remettre à zéro</button>
        </div>
      </div>
      <p class="rv" style="font-size:.8rem;color:var(--gris);margin-top:16px">Ces conseils sont des méthodes de travail générales. En cas de difficulté qui dure, parles-en à ton professeur principal ou à un adulte de confiance.</p>
    </div></section>`);
  app.querySelectorAll("[data-profil]").forEach(b => b.addEventListener("click", () => {
    const d = document.getElementById("profil-" + b.dataset.profil);
    d.open = true; d.classList.add("vu");
    d.scrollIntoView({behavior:"smooth", block:"start"});
  }));
  majMinuteur();
  document.getElementById("go").addEventListener("click", basculer);
  document.getElementById("raz").addEventListener("click", () => {
    clearInterval(minuteur.h); minuteur.h = null;
    Object.assign(minuteur, {duree:25*60, reste:25*60, mode:"travail"}); majMinuteur();
  });
}

/* ---------- Orientation : profil + pistes + checklist ---------- */
function pageOrientation(){
  const coches = memo.lire("campusen", []);
  const profil = memo.lire("profil-orient", {serie:"", moyenne:"", fortes:[]});
  afficher(entete(`<a href="#accueil">Accueil</a> › Orientation`, "Orientation",
      "Trouve des pistes selon tes matières fortes et tes notes, puis prépare Campusen.") + `
    <section class="section"><div class="wrap">
      <h2 class="titre-bloc rv">🧭 Mes pistes d'orientation</h2>
      <div class="carte-outil rv">
        <p class="sous-titre-c" style="margin-top:0">1. Ma série</p>
        <div class="puces" id="o-serie">${["S1","S2","L1","L2"].map(x => `<button class="puce ${profil.serie===x?"actif":""}" data-v="${x}">${x}</button>`).join("")}</div>
        <p class="sous-titre-c">2. Les matières où je suis à l'aise</p>
        <div class="puces" id="o-fortes">${MATIERES_ORIENT.map(([k,n]) => `<button class="puce ${profil.fortes.includes(k)?"actif":""}" data-v="${k}">${n}</button>`).join("")}</div>
        <p class="sous-titre-c">3. Ma moyenne générale actuelle</p>
        <div class="puces" id="o-moy">${[["moins10","Moins de 10"],["10-12","10 à 12"],["12-14","12 à 14"],["plus14","Plus de 14"]].map(([k,n]) => `<button class="puce ${profil.moyenne===k?"actif":""}" data-v="${k}">${n}</button>`).join("")}</div>
        <p style="font-size:.78rem;color:var(--gris);margin-top:10px">Tes réponses restent sur cet appareil. Rien n'est envoyé.</p>
      </div>
      <div id="o-resultat"></div>

      <details class="boite-cours rv" style="margin-top:18px"><summary><span class="rond-cours">🔀</span><span class="tete-cours"><b>En Seconde S : S1 ou S2 ?</b><small>Choisir sa série de Première</small></span></summary>
        <div class="contenu-cours"><ul class="etapes">
          <li><b>S1</b> : plus de poids sur les maths et la physique-chimie. Pour ceux qui sont très à l'aise en maths.</li>
          <li><b>S2</b> : plus d'équilibre, avec une place importante pour la SVT. Pour ceux qui aiment les sciences de la vie.</li>
          <li>Les deux séries mènent aux études scientifiques. Choisis selon tes notes <b>et</b> ce que tu aimes.</li>
          <li>Demande l'avis de ton professeur de maths et de ton professeur principal : ils connaissent les exigences.</li>
        </ul></div></details>

      <a class="carte rv" href="#concours" style="margin-top:18px"><span class="fleche">→</span><span class="rond bg-jaune">🎯</span><b>Je prépare un concours</b><small>EPT, ESP, ENSA, EMS, ENDSS… niveaux et dates</small></a>
      <h2 class="titre-bloc rv">🏛️ Campusen</h2>
      <div class="encadre rv"><b>Campusen, c'est quoi ?</b><br>
        La plateforme officielle d'orientation des nouveaux bacheliers vers les universités publiques et les ISEP
        (Instituts supérieurs d'enseignement professionnel) du Sénégal.<br>
        Site : <a href="https://orientation.campusen.sn">orientation.campusen.sn</a></div>
      <details class="rv"><summary>📅 Repères de l'année 2026</summary>
        <ul class="etapes"><li>Ouverture : 17 août 2026.</li><li>Date limite : 13 septembre 2026, 23h59.</li>
        <li>Jusqu'à 18 choix pour les universités publiques et 18 pour les ISEP.</li></ul></details>
      <div class="attention rv">⚠️ Les dates et règles changent chaque année. Vérifie toujours sur le site officiel de Campusen
        et les communiqués du ministère de l'Enseignement supérieur. Ne donne jamais ton mot de passe Campusen.</div>
      <h2 class="titre-bloc rv">Ma checklist Campusen <span id="compte" style="color:var(--corail)"></span></h2>
      <div class="jauge" style="margin-bottom:14px"><i id="jc"></i></div>
      <div id="liste">${ETAPES_CAMPUSEN.map((e,i) => `
        <label class="check rv ${coches.includes(i)?'coche':''}" style="--d:${i*.04}s"><input type="checkbox" data-i="${i}" ${coches.includes(i)?'checked':''}><span>${e}</span></label>`).join("")}
      </div>
      <h2 class="titre-bloc rv">Bien choisir ses vœux</h2>
      <ul class="etapes rv">
        <li>Classe tes choix par préférence réelle, pas par prestige.</li>
        <li>Mélange des formations très demandées et des formations plus accessibles qui t'intéressent.</li>
        <li>Les grandes écoles, CPGE et écoles spécialisées recrutent souvent en dehors de Campusen (concours, dossiers) : renseigne-toi dès le début de la Terminale.</li>
        <li>Avant de payer une école privée, vérifie que la formation est reconnue par l'État.</li>
      </ul>
      <h2 class="titre-bloc rv">Questions à te poser</h2>
      <ul class="etapes rv">
        <li>Quelles matières j'aime vraiment, même quand elles sont difficiles ?</li>
        <li>Je préfère des études longues ou un métier rapidement ?</li>
        <li>Je préfère la théorie, la pratique, ou le contact avec les gens ?</li>
        <li>Où est-ce que je peux étudier (ville, logement, coût) ?</li>
      </ul>
      <p class="rv" style="font-size:.8rem;color:var(--gris);margin-top:14px">Ces pistes sont des idées à explorer, pas une décision. Parle de ton projet avec ton professeur principal ou le conseiller d'orientation de ton lycée. Infos sur les CPGE et le concours EPT vérifiées en novembre 2026.</p>
    </div></section>`);

  const sauver = () => memo.ecrire("profil-orient", profil);
  const unique = (id, cle) => app.querySelectorAll(`#${id} .puce`).forEach(b => b.addEventListener("click", () => {
    profil[cle] = profil[cle] === b.dataset.v ? "" : b.dataset.v;
    app.querySelectorAll(`#${id} .puce`).forEach(x => x.classList.toggle("actif", x.dataset.v === profil[cle]));
    sauver(); resultat();
  }));
  unique("o-serie", "serie"); unique("o-moy", "moyenne");
  app.querySelectorAll("#o-fortes .puce").forEach(b => b.addEventListener("click", () => {
    const v = b.dataset.v;
    profil.fortes = profil.fortes.includes(v) ? profil.fortes.filter(x => x !== v) : [...profil.fortes, v];
    b.classList.toggle("actif"); sauver(); resultat();
  }));

  function resultat(){
    const zone = document.getElementById("o-resultat");
    if(!profil.fortes.length && !profil.moyenne){
      zone.innerHTML = `<div class="vide" style="margin-top:12px">👆 Choisis tes matières fortes et ta moyenne pour voir des pistes.</div>`; return;
    }
    const estL = profil.serie.startsWith("L");
    const pistes = PISTES_ORIENT.map(p => ({p, n: p.cles.filter(k => profil.fortes.includes(k)).length}))
      .filter(x => x.n > 0 || x.p.cles.length === 0)
      .sort((a,b) => b.n - a.n);
    const conseilMoy = CONSEILS_MOYENNE[profil.moyenne];
    zone.innerHTML = `
      ${profil.fortes.length ? `<h3 class="niveau">Pistes qui correspondent à tes matières fortes</h3>
      ${pistes.map(({p,n}) => `
        <details class="boite-cours">
          <summary><span class="rond-cours" style="font-size:1.3rem">${p.ico}</span>
            <span class="tete-cours"><b>${p.titre}</b><small>${p.cles.length ? `${n}/${p.cles.length} matières clés` : "Ouvert à tous les profils"}${estL && p.serieS ? " · souvent réservé aux séries S" : ""}</small></span></summary>
          <div class="contenu-cours">
            ${p.cles.length ? `<p class="sous-titre-c">Matières clés</p><p>${p.cles.map(k => MATIERES_ORIENT.find(m => m[0]===k)[1]).join(", ")}</p>` : ""}
            <p class="sous-titre-c">Exemples de formations</p><p>${p.exemples}</p>
            <p class="sous-titre-c">À savoir</p><ul class="etapes">${p.savoir.map(l => `<li>${l}</li>`).join("")}</ul>
            ${estL && p.serieS ? `<div class="attention" style="margin-top:10px">Ces formations demandent en général un bac scientifique. Vérifie les séries acceptées sur Campusen ou auprès de l'établissement.</div>` : ""}
          </div></details>`).join("")}` : ""}
      ${conseilMoy ? `<h3 class="niveau">Conseils selon ta moyenne</h3>
        <div class="encadre"><b>${conseilMoy.titre}</b><ul class="etapes" style="margin-top:8px">${conseilMoy.points.map(l => `<li>${l}</li>`).join("")}</ul></div>` : ""}`;
  }
  resultat();

  const maj = () => {
    const c = memo.lire("campusen", []);
    document.getElementById("compte").textContent = `${c.length}/${ETAPES_CAMPUSEN.length}`;
    document.getElementById("jc").style.width = `${100*c.length/ETAPES_CAMPUSEN.length}%`;
  };
  maj();
  app.querySelectorAll(".check input").forEach(cb => cb.addEventListener("change", () => {
    let c = memo.lire("campusen", []); const i = +cb.dataset.i;
    c = cb.checked ? [...new Set([...c, i])] : c.filter(x => x !== i);
    memo.ecrire("campusen", c);
    cb.parentElement.classList.toggle("coche", cb.checked);
    maj();
    if(c.length === ETAPES_CAMPUSEN.length) toast("Checklist complète, bravo ! 🎓");
  }));
}

/* ---------- Concours ---------- */
function pageConcours(){
  let filtre = memo.lire("filtre-concours", "tous");
  afficher(entete(`<a href="#accueil">Accueil</a> › Concours`, "Je prépare un concours",
      "Les concours accessibles avec le bac au Sénégal, le niveau demandé et comment s'y préparer.") + `
    <section class="section"><div class="wrap">
      <div class="encadre rv"><b>📅 Année scolaire 2026-2027</b><br>
        Au ${CONCOURS_MAJ}, les avis de la <b>session 2027</b> ne sont pas encore publiés. Les dates ci-dessous sont celles de 2026 : elles te donnent une idée de quand ça se passera, mais elles peuvent changer.</div>
      <div class="attention rv">⚠️ <b>Beaucoup d'inscriptions se font pendant la Terminale</b>, bien avant les résultats du bac (EMS et ENSOA dès janvier, EPT et ESP dès février).</div>
      <details class="boite-cours rv" style="margin-top:14px"><summary><span class="rond-cours">🗓️</span><span class="tete-cours"><b>Mon calendrier 2026-2027</b><small>Quand s'inscrire, mois par mois (prévision)</small></span></summary>
        <div class="contenu-cours" id="calendrier-concours"></div></details>
      <p class="sous-titre-c rv">Afficher les concours ouverts à ma série</p>
      <div class="puces rv" id="f-serie">${[["tous","Tous"],["S1","S1"],["S2","S2"],["L","L1 / L2"]].map(([k,n]) => `<button class="puce ${filtre===k?"actif":""}" data-v="${k}">${n}</button>`).join("")}</div>
      <div id="liste-concours"></div>
      <h2 class="titre-bloc rv">Comment se préparer</h2>
      <details class="boite-cours rv"><summary><span class="rond-cours">📝</span><span class="tete-cours"><b>Préparer les épreuves</b><small>Méthode sur plusieurs mois</small></span></summary>
        <div class="contenu-cours"><ul class="etapes">
          <li>Récupère les <b>sujets des années passées</b> du concours visé : c'est le meilleur entraînement. Les blocs marqués « 📄 sujets disponibles » en contiennent.</li>
          <li>Les concours scientifiques reprennent surtout le programme de Première et Terminale : maîtrise tes cours avant tout.</li>
          <li>Entraîne-toi au <b>QCM chronométré</b> si le concours en comporte : vitesse et précision comptent.</li>
          <li>N'oublie pas le français et l'anglais : ils sont souvent au programme et font la différence.</li>
          <li>Révise à plusieurs, en échangeant les exercices et les corrections.</li>
        </ul></div></details>
      <details class="boite-cours rv"><summary><span class="rond-cours">📂</span><span class="tete-cours"><b>Le dossier d'inscription</b><small>Ne pas rater l'étape administrative</small></span></summary>
        <div class="contenu-cours"><ul class="etapes">
          <li>Lis l'<b>avis officiel</b> en entier : séries acceptées, âge limite, pièces à fournir, date limite.</li>
          <li>Prépare tôt les pièces courantes : extrait de naissance, copies légalisées, photos, certificat de scolarité ou relevé du bac.</li>
          <li>Dépose ton dossier plusieurs jours avant la date limite : les plateformes saturent le dernier jour.</li>
          <li>Garde une copie de ton reçu et de ta convocation.</li>
          <li>Méfie-toi des intermédiaires payants : l'inscription se fait auprès de l'école ou sur sa plateforme officielle.</li>
        </ul></div></details>
      <details class="boite-cours rv"><summary><span class="rond-cours">🎯</span><span class="tete-cours"><b>Choisir ses concours</b><small>Ne pas tout miser sur un seul</small></span></summary>
        <div class="contenu-cours"><ul class="etapes">
          <li>Présente <b>plusieurs concours</b> proches de ton projet, et fais aussi tes vœux sur Campusen.</li>
          <li>Vérifie l'âge limite tôt : certains concours (EMS, EPT, ENSA) sont stricts.</li>
          <li>Renseigne-toi sur les engagements : les écoles militaires demandent un engagement dans l'armée.</li>
        </ul></div></details>
      <p class="rv" style="font-size:.8rem;color:var(--gris);margin-top:16px">Informations vérifiées le ${CONCOURS_MAJ} à partir des avis des sessions 2025 et 2026. Les conditions et les dates changent chaque année : vérifie toujours l'avis officiel de la session 2027 avant de t'inscrire.</p>
    </div></section>`);
  function liste(){
    const garde = c => filtre === "tous" || c.series.includes(filtre);
    document.getElementById("liste-concours").innerHTML = CONCOURS.map(g => {
      const l = g.liste.filter(garde);
      if(!l.length) return "";
      return `<h3 class="niveau">${g.groupe}</h3>` + l.map(c => `
        <details class="boite-cours">
          <summary><span class="rond-cours" style="font-size:1.3rem">${c.type === "Sur dossier" ? "📂" : "🎯"}</span>
            <span class="tete-cours"><b>${c.nom}</b><small>${c.type} · Niveau : ${c.niveau}${c.annales ? " · 📄 sujets disponibles" : ""}</small></span></summary>
          <div class="contenu-cours">
            <p class="statut-2027">${c.plusTard ? "Concours à passer après 2 ans d'études" : "Session 2027 : avis pas encore publié"}</p>
            ${c.infos.map(([t,v]) => `<p class="sous-titre-c">${t}</p><p>${v}</p>`).join("")}
            ${c.site ? `<p class="sous-titre-c">Où s'informer</p><p>Site officiel : <b>${c.site}</b></p>` : ""}
            ${c.annales ? `<p class="sous-titre-c">📄 Sujets des années passées</p>` + c.annales.map(a => `
              <div class="annale"><b>${a.titre}</b><small>${a.pages} pages · ${a.taille} · sujet sans corrigé</small>
                <div class="actions">
                  <a class="btn plein" href="${a.pdf}" target="_blank" rel="noopener">📖 Ouvrir le sujet</a>
                  <button class="btn" data-pdf="${a.pdf}" data-titre="${(c.nom.split(" — ")[0] + " : " + a.titre).replace(/"/g,"&quot;")}">${estTelecharge(a.pdf) && horsLignePossible() ? "✅ Disponible hors connexion" : "📥 Télécharger"}</button>
                </div></div>`).join("") : ""}
          </div></details>`).join("");
    }).join("");
    document.querySelectorAll("#liste-concours [data-pdf]").forEach(b => b.addEventListener("click", () => telechargerPdf(b)));
  }
  liste();
  const NOMS_MOIS = ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const ordre = [11,12,1,2,3,4,5,6,7,8,9,10];
  const tous = CONCOURS.flatMap(g => g.liste);
  document.getElementById("calendrier-concours").innerHTML =
    `<p style="margin-top:12px;color:var(--gris);font-size:.85rem">D'après les périodes d'inscription de 2026. Vérifie chaque avis officiel quand il sort.</p>` +
    ordre.map(m => {
      const l = tous.filter(c => c.mois.includes(m));
      const an = m >= 11 ? 2026 : 2027;
      return `<p class="sous-titre-c">${NOMS_MOIS[m]} ${an}</p>` +
        (l.length ? `<ul class="etapes">${l.map(c => `<li>${c.nom.split(" — ")[0]}</li>`).join("")}</ul>` : `<p style="color:var(--gris)">Pas d'inscription connue à cette période.</p>`);
    }).join("") +
    `<p class="sous-titre-c">Août – septembre 2027</p><p>Vœux sur Campusen (en 2026 : du 17 août au 13 septembre).</p>`;
  app.querySelectorAll("#f-serie .puce").forEach(b => b.addEventListener("click", () => {
    filtre = b.dataset.v; memo.ecrire("filtre-concours", filtre);
    app.querySelectorAll("#f-serie .puce").forEach(x => x.classList.toggle("actif", x === b));
    liste();
  }));
}

/* ================= NAVIGATION, EN-TÊTE, INTRO ================= */
const nav = document.getElementById("nav"), burger = document.getElementById("burger");
burger.addEventListener("click", () => {
  const o = !nav.classList.contains("ouvert");
  nav.classList.toggle("ouvert", o); burger.classList.toggle("ouvert", o); document.body.classList.toggle("bloque", o);
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("ouvert"); burger.classList.remove("ouvert"); document.body.classList.remove("bloque");
}));

const enTete = document.getElementById("haut");
window.addEventListener("scroll", () => {
  enTete.classList.toggle("defile", scrollY > 30);
}, {passive:true});

function router(){
  const h = location.hash.replace("#","") || "accueil";
  if(h === "classes"){ pageAccueil(); document.getElementById("classes").scrollIntoView(); return; }
  window.scrollTo(0,0);
  document.querySelectorAll("nav.top a").forEach(a => a.classList.toggle("actif", a.dataset.n === h));
  if(h === "accueil") return pageAccueil();
  if(h === "conseils") return pageConseils();
  if(h === "orientation") return pageOrientation();
  if(h === "concours") return pageConcours();
  if(h === "telechargements") return pageTelechargements();
  const ml = h.match(/^lecon-(.+)-(\d+)$/);
  if(ml) return pageLecon(ml[1], +ml[2]);
  const c = trouverClasse(h);
  if(c) return pageClasse(c);
  for(const cl of CLASSES){
    if(h.startsWith(cl.id + "-")){
      const m = trouverMatiere(h.slice(cl.id.length + 1));
      if(m && cl.matieres.includes(m.id)) return pageMatiere(cl, m);
      if(m) return pageClasse(cl);
    }
  }
  pageAccueil();
}


