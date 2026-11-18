/* ---------- Chapitres : SÉRIE → MATIÈRE → CHAPITRE → CONTENU ----------
   Liste des chapitres d'une matière et page de chapitre structurée.
   Chaque bloc (objectifs, définitions, « À retenir », exercices, quiz…) n'apparaît
   que si le contenu existe vraiment : rien n'est inventé. */
const lienChap = (cid, mid, i) => `#ch:${cid}:${mid}:${i}`;
const labelsChap = x => x.chaps || (x.chap ? [x.chap] : []);

function contenuChapitre(c, m, x){
  const d = donnees(c.id, m.id), labs = labelsChap(x);
  const ex = liste(d, "exercices").map((e, i) => ({e, i})).filter(o => labs.includes(o.e.chap));
  const qz = liste(d, "quiz").filter(q => labs.includes(q.chap));
  return {ex, qz};
}

function etatChapitre(c, m, x){
  const {ex, qz} = contenuChapitre(c, m, x);
  const parties = x.lecons ? x.lecons.length : 0;
  const lues = x.lecons ? x.lecons.filter(l => memo.lire(`lu:${x.id}-${l.n}`, false)).length : 0;
  const exF = ex.filter(o => memo.lire(`fait:${c.id}-${m.id}-${o.i}`, false)).length;
  const qOk = qz.filter(q => memo.lire(cleQ(c.id, m.id, q), null) === 1).length;
  const qRep = qz.filter(q => memo.lire(cleQ(c.id, m.id, q), null) !== null).length;
  const termine = estEtudie(x);
  const total = parties + ex.length + qz.length, fait = lues + exF + qOk;
  const pct = termine ? 100 : total ? Math.round(100 * fait / total) : 0;
  const commence = termine || fait > 0 || qRep > 0 || memo.lire(`ouvert:${idCours(x)}`, false);
  return {parties, lues, ex, exF, qz, qOk, termine, commence, pct};
}

const pastilleEtat = st => st.termine ? `<span class="etat fini">✅ Terminé</span>`
  : st.commence ? `<span class="etat encours">⏳ Commencé</span>` : `<span class="etat neuf">Non commencé</span>`;

/* Onglet « Chapitres » d'une matière */
function listeChapitres(corps, c, m, items){
  const d = donnees(c.id, m.id);
  const labs = new Set(items.flatMap(labelsChap));
  const restEx = liste(d, "exercices").filter(e => !labs.has(e.chap)).length;
  const restQ = liste(d, "quiz").filter(q => !labs.has(q.chap)).length;
  corps.innerHTML = `<p class="sous" style="margin-bottom:12px">${items.length} chapitre${items.length > 1 ? "s" : ""} · dans l'ordre du programme</p>` +
    items.map((x, i) => {
      const st = etatChapitre(c, m, x), num = x.num || i + 1;
      const infos = [x.lecons ? `${x.lecons.length} partie${x.lecons.length > 1 ? "s" : ""}` : x.tpl ? "Cours en ligne" : "",
        st.ex.length ? `${st.ex.length} exercice${st.ex.length > 1 ? "s" : ""}` : "",
        st.qz.length ? `${st.qz.length} question${st.qz.length > 1 ? "s" : ""} de quiz` : ""].filter(Boolean).join(" · ");
      return `<a class="chap-ligne" href="${lienChap(c.id, m.id, i)}">
        <span class="num-lecon">${num}</span>
        <span class="chap-txt"><b>${titreCourt(x.titre).replace(/^Ch\. \d+ · /, "")}</b>
          ${x.desc ? `<small>${x.desc}</small>` : ""}
          <small>${infos}</small>
          ${pastilleEtat(st)}${x.pdf && estTelecharge(x.pdf) && horsLignePossible() ? `<span class="etat neuf">📥 Hors connexion</span>` : ""}
          ${st.pct ? `<span class="jauge"><i style="width:${st.pct}%"></i></span>` : ""}</span>
        <span class="fleche-chap">→</span></a>`;
    }).join("") +
    (restEx || restQ ? `<div class="encadre" style="margin-top:16px">✏️ ${[restEx ? `${restEx} exercice${restEx > 1 ? "s" : ""}` : "", restQ ? `${restQ} question${restQ > 1 ? "s" : ""} de quiz` : ""].filter(Boolean).join(" et ")}
      de ${m.nom} ne sont pas encore rattachés à un chapitre : retrouve-les dans les onglets <b>Exercices</b> et <b>Quiz</b>.</div>` : "");
}

/* Page d'un chapitre */
function pageChapitre(cid, mid, i){
  const c = trouverClasse(cid), m = trouverMatiere(mid);
  const cours = c && m ? liste(donnees(cid, mid), "cours") : [];
  const x = cours[i];
  if(!x) return pageAccueil();
  memo.ecrire("dernier", {c: cid, m: mid});
  memo.ecrire(`onglet:${cid}-${mid}`, "cours");
  memo.ecrire(`ouvert:${idCours(x)}`, true);
  const st = etatChapitre(c, m, x), num = x.num || i + 1;
  const titre = titreCourt(x.titre).replace(/^Ch\. \d+ · /, "");
  const prec = cours[i - 1], suiv = cours[i + 1];
  const blocs = [];

  const pres = [x.desc ? `<p>${x.desc}</p>` : "",
    x.objectifs ? `<h3>🎯 Objectifs</h3><ul class="etapes">${x.objectifs.map(o => `<li>${o}</li>`).join("")}</ul>` : "",
    x.intro ? `<h3>Introduction</h3><p>${x.intro}</p>` : ""].join("");
  if(pres) blocs.push({id: "pres", nom: "Présentation", html: `<div class="exo">${pres}</div>`});

  let coursHtml = "";
  if(x.lecons){
    const suite = x.lecons.find(l => !memo.lire(`lu:${x.id}-${l.n}`, false)) || x.lecons[0];
    coursHtml = `<div class="exo">
      <p style="color:var(--gris);font-size:.85rem">${x.credit || "Cours de " + x.auteur} · ${x.pages} pages · ${x.taille}</p>
      <h3 style="font-size:1rem;margin:12px 0 4px">Sommaire du chapitre</h3>
      ${x.lecons.map(l => { const lu = memo.lire(`lu:${x.id}-${l.n}`, false);
        return `<a class="ligne-lecon" href="#lecon-${x.id}-${l.n}"><span class="num-lecon">${lu ? "✓" : l.n}</span><span>${l.titre}</span>
          <small>p. ${l.debut === l.fin ? l.debut : l.debut + "–" + l.fin}</small></a>`; }).join("")}
      <div class="actions">
        <a class="btn plein" href="#lecon-${x.id}-${suite.n}">📖 ${st.lues ? (st.lues === x.lecons.length ? "Relire le cours" : "Continuer la lecture") : "Commencer la lecture"}</a>
        <a class="btn" href="${x.pdf}" target="_blank" rel="noopener">Ouvrir le PDF</a>
        ${x.pdf.startsWith("http") ? "" : `<button class="btn" data-pdf="${x.pdf}" data-titre="${x.titre.replace(/"/g, "&quot;")}">${estTelecharge(x.pdf) && horsLignePossible() ? "✅ Disponible hors connexion" : "📥 Télécharger (" + x.taille + ")"}</button>`}
      </div>
      ${x.leger ? "" : `<p style="font-size:.8rem;color:var(--gris);margin-top:8px">⚠️ Fichier lourd : télécharge-le de préférence en Wi-Fi.</p>`}
      <p style="font-size:.78rem;color:var(--gris);margin-top:10px">${x.note || "Document partagé avec l'autorisation de son auteur, publié sans modification."}</p></div>`;
  } else if(x.tpl){
    coursHtml = `<div class="exo">
      <ul class="etapes">${(x.plan || []).map((p, k) => `<li>${["I", "II", "III", "IV", "V", "VI", "VII"][k] || k + 1}. ${p}</li>`).join("")}</ul>
      <div class="actions">
        <button class="btn plein" id="lireTpl">📖 Lire le cours</button>
        ${x.pdf ? `<button class="btn" data-pdf="${x.pdf}" data-titre="${x.titre.replace(/"/g, "&quot;")} — ${c.court}">${estTelecharge(x.pdf) && horsLignePossible() ? "✅ Disponible hors connexion" : "📄 Télécharger le PDF"}</button>` : ""}
      </div>
      <div class="lecture lecture-chap" id="zoneTpl" hidden></div></div>`;
  } else if(x.texte){
    coursHtml = `<div class="exo lecture-chap">${x.texte}</div>`;
  }
  if(coursHtml) blocs.push({id: "cours", nom: "Cours", html: coursHtml});

  const essentiel = [
    x.definitions ? `<h3>📌 Définitions</h3>${x.definitions.map(dd => `<p><b>${dd.terme}</b> : ${dd.def}</p>`).join("")}` : "",
    x.formules ? `<h3>🧮 Formules et notions essentielles</h3><ul class="etapes">${x.formules.map(f => `<li>${f}</li>`).join("")}</ul>` : "",
    x.aRetenir ? `<div class="encadre"><b>À retenir</b><ul class="etapes">${x.aRetenir.map(r => `<li>${r}</li>`).join("")}</ul></div>` : ""].join("");
  if(essentiel) blocs.push({id: "essentiel", nom: "À retenir", html: `<div class="exo">${essentiel}</div>`});
  if(st.ex.length) blocs.push({id: "exos", nom: `Exercices (${st.exF}/${st.ex.length})`, html: `<div id="zoneExos"></div>`});
  if(st.qz.length) blocs.push({id: "quiz", nom: `Quiz (${st.qz.length})`, html: `<p class="sous" style="margin-bottom:10px">Réponds aux questions : la correction s'affiche après chaque réponse.</p><div id="zoneQuiz"></div>`});

  afficher(entete(`<a href="#accueil">Accueil</a> › <a href="#${c.id}">${c.nom}</a> › <a href="#${c.id}-${m.id}">${m.nom}</a> › Chapitre ${num}`,
      `Chapitre ${num}`, `${titre}<br>${pastilleEtat(st)}`, st.pct ? jauge({fait: st.pct, total: 100}) : "") + `
    <section class="section" style="padding-top:14px"><div class="wrap">
      ${blocs.length > 1 ? `<nav class="sommaire-chap" aria-label="Sommaire du chapitre">${blocs.map(bl => `<a href="#" data-aller="${bl.id}">${bl.nom}</a>`).join("")}</nav>` : ""}
      ${blocs.map(bl => `<section class="bloc-chap" id="bloc-${bl.id}"><h2>${bl.nom}</h2>${bl.html}</section>`).join("")}
      <div class="encadre" style="margin-top:26px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <span>${st.termine ? "✅ Tu as terminé ce chapitre." : "Tu as fini de travailler ce chapitre ?"}</span>
        <button class="btn ${st.termine ? "" : "plein"}" id="terminer">${st.termine ? "Marquer comme non terminé" : "✅ Marquer comme terminé"}</button>
      </div>
      <div class="nav-chap">
        ${prec ? `<a class="btn" href="${lienChap(cid, mid, i - 1)}">◀ Chapitre ${prec.num || i}</a>` : "<span></span>"}
        <a class="btn" href="#${c.id}-${m.id}">☰ Tous les chapitres</a>
        ${suiv ? `<a class="btn plein" href="${lienChap(cid, mid, i + 1)}">Chapitre ${suiv.num || i + 2} ▶</a>` : "<span></span>"}
      </div>
    </div></section>`);

  app.querySelectorAll("[data-aller]").forEach(a => a.addEventListener("click", ev => {
    ev.preventDefault();
    document.getElementById("bloc-" + a.dataset.aller).scrollIntoView({behavior: "smooth", block: "start"});
  }));
  app.querySelectorAll("[data-pdf]").forEach(bt => bt.addEventListener("click", () => telechargerPdf(bt)));
  const lire = document.getElementById("lireTpl");
  if(lire) lire.addEventListener("click", () => {
    const z = document.getElementById("zoneTpl");
    if(z.hidden){ z.innerHTML = document.getElementById(x.tpl).innerHTML; z.hidden = false; lire.textContent = "✖ Fermer le cours"; }
    else { z.hidden = true; lire.textContent = "📖 Lire le cours"; }
  });
  document.getElementById("terminer").addEventListener("click", () => {
    const k = `etudie:${idCours(x)}`, v = !memo.lire(k, false);
    memo.ecrire(k, v);
    if(v){ noterActivite(`📘 Chapitre terminé : ${titreCourt(x.titre)} (${m.nom} · ${c.court})`, lienChap(cid, mid, i)); toast("Chapitre terminé ✅"); }
    const y = window.scrollY; pageChapitre(cid, mid, i); window.scrollTo(0, y);
  });
  if(st.ex.length) rendreExosChapitre(document.getElementById("zoneExos"), c, m, st.ex, cid, mid, i);
  if(st.qz.length) rendreQuizChapitre(document.getElementById("zoneQuiz"), c, m, st.qz, x.chap);
}

function rendreExosChapitre(zone, c, m, liste_, cid, mid, ic){
  zone.innerHTML = liste_.map(({e, i}, k) => {
    const fait = memo.lire(`fait:${c.id}-${m.id}-${i}`, false);
    return `<div class="exo ${fait ? "fait" : ""}" data-k="${k}">
      ${e.demo ? '<span class="tag">Exemple de démonstration</span>' : ''}
      <h3 style="margin:.4em 0">${k + 1}. ${e.titre.replace(/ <small[^>]*>· (Chapitre \d+|Calcul vectoriel|Barycentre|Leçon 1)<\/small>/, "")}</h3>
      <p>${e.enonce}</p>
      <div class="actions">
        ${e.indice ? `<button class="btn" data-a="indice">💡 Indice</button>` : ""}
        <button class="btn" data-a="corr">👀 Correction détaillée</button>
        <button class="btn ${fait ? "plein" : ""}" data-a="fait">${fait ? "✅ Réussi" : "☐ J'ai réussi"}</button>
      </div>
      <div class="zone"></div></div>`; }).join("");
  zone.querySelectorAll(".exo").forEach(bloc => {
    const {e, i} = liste_[+bloc.dataset.k], z = bloc.querySelector(".zone");
    bloc.querySelectorAll("[data-a]").forEach(bt => bt.addEventListener("click", () => {
      if(bt.dataset.a === "indice") z.innerHTML = `<div class="bulle indice">💡 ${e.indice}</div>`;
      if(bt.dataset.a === "corr") z.innerHTML = `<div class="bulle corr"><b>Correction</b><br>${e.correction}</div>`;
      if(bt.dataset.a === "fait"){
        const k = `fait:${c.id}-${m.id}-${i}`, v = !memo.lire(k, false);
        memo.ecrire(k, v);
        if(v){ toast("Bravo ! Exercice marqué comme réussi 🎉"); noterActivite(`✏️ Exercice réussi : ${titreCourt(e.titre)} (${m.nom} · ${c.court})`, lienChap(cid, mid, ic)); }
        bloc.classList.toggle("fait", v); bt.classList.toggle("plein", v); bt.textContent = v ? "✅ Réussi" : "☐ J'ai réussi";
      }
    }));
  });
}

function rendreQuizChapitre(zone, c, m, qs, lab){
  let rep = 0, bons = 0;
  const session = "quizch-" + Date.now();
  zone.innerHTML = qs.map((q, k) => `<div class="qcm" data-k="${k}">
      ${memo.lire(cleQ(c.id, m.id, q), null) === 1 ? '<span class="tag" style="margin-bottom:6px">✅ Déjà réussie</span><br>' : ""}
      <b>${k + 1}. ${q.q}</b>
      <div class="choix">${q.choix.map((ch, j) => `<button data-j="${j}">${ch}</button>`).join("")}</div>
      <div class="zone"></div></div>`).join("") + `<div class="finq"></div>`;
  zone.querySelectorAll(".qcm").forEach(bloc => {
    const q = qs[+bloc.dataset.k];
    bloc.querySelectorAll(".choix button").forEach(btn => btn.addEventListener("click", () => {
      if(bloc.dataset.fini) return;
      bloc.dataset.fini = 1; rep++;
      const ok = +btn.dataset.j === q.bonne;
      if(ok) bons++;
      memo.ecrire(cleQ(c.id, m.id, q), ok ? 1 : 0);
      noterActivite(`❓ Quiz ${titreCourt(lab)} (${m.nom} · ${c.court}) : ${bons} bonne(s) réponse(s) sur ${rep}`, location.hash, session);
      btn.classList.add(ok ? "bon" : "faux");
      bloc.querySelectorAll(".choix button")[q.bonne].classList.add("bon");
      bloc.querySelector(".zone").innerHTML = `<div class="bulle ${ok ? "corr" : "indice"}">${ok ? "✅ Bonne réponse !" : "❌ Pas tout à fait."} ${q.explication || ""}</div>`;
      if(rep === qs.length){
        zone.querySelector(".finq").innerHTML = `<div class="encadre"><span class="score">Score : ${bons}/${qs.length}</span>
          ${bons === qs.length ? " — Parfait ! 🏆" : " — Les questions ratées t'attendent dans « Ma progression › Notions à revoir »."}
          <div class="actions"><button class="btn plein" data-rejouer>🔁 Recommencer le quiz</button></div></div>`;
        zone.querySelector("[data-rejouer]").addEventListener("click", () => rendreQuizChapitre(zone, c, m, qs, lab));
        toast(`Quiz terminé : ${bons}/${qs.length}`);
      }
    }));
  });
}
