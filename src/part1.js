/* ================= DONNÉES DU SITE =================
   Pour ajouter du contenu : remplir CONTENU[classe][matiere]
   avec les listes cours, exercices, quiz, conseils.          */

/* ---------- Catalogue des matières (une seule fois) ---------- */
const MATIERES = [
  {id:"maths", nom:"Mathématiques", ico:"📐", alias:"maths math"},
  {id:"physique", nom:"Physique", ico:"⚡", alias:"pc sciences physiques"},
  {id:"chimie", nom:"Chimie", ico:"🧪", alias:"pc sciences physiques"},
  {id:"scphy", nom:"Sciences physiques", ico:"⚗️", alias:"pc physique chimie scph"},
  {id:"svt", nom:"SVT", ico:"🌿", alias:"sciences vie terre bio biologie"},
  {id:"francais", nom:"Français", ico:"📖", alias:"francais"},
  {id:"philo", nom:"Philosophie", ico:"🤔", alias:"philo"},
  {id:"histoire", nom:"Histoire", ico:"📜", alias:"histo hg"},
  {id:"geographie", nom:"Géographie", ico:"🌍", alias:"geo hg"},
  {id:"anglais", nom:"Anglais", ico:"🇬🇧", alias:"english lv1"},
  {id:"lv2", nom:"Langue vivante 2", ico:"🗣️", alias:"lv2 espagnol arabe allemand portugais"},
  {id:"lanciennes", nom:"Latin / Grec", ico:"🏛️", alias:"latin grec langues anciennes"}
];

/* ---------- Matières par série (modifiable sans toucher au reste) ----------
   Pour ajouter une série : ajouter une ligne dans CLASSES avec sa liste de matières. */
const M_S   = ["maths","physique","chimie","svt","francais","histoire","geographie","anglais"];
const M_L1  = ["francais","histoire","geographie","anglais","lv2","lanciennes","maths"];
const M_L2  = ["francais","histoire","geographie","anglais","lv2","maths","svt","scphy"];
const avecPhilo = l => [...l.slice(0,1), "philo", ...l.slice(1)];

const NIVEAUX = ["Seconde","Première","Terminale"];
const CLASSES = [
  {id:"2nde-s", nom:"Seconde S",    court:"2nde S", niveau:"Seconde",   serie:"S",  matieres:M_S},
  {id:"1re-l1", nom:"Première L1",  court:"1re L1", niveau:"Première",  serie:"L1", matieres:M_L1},
  {id:"1re-l2", nom:"Première L2",  court:"1re L2", niveau:"Première",  serie:"L2", matieres:M_L2},
  {id:"1re-s1", nom:"Première S1",  court:"1re S1", niveau:"Première",  serie:"S1", matieres:M_S},
  {id:"1re-s2", nom:"Première S2",  court:"1re S2", niveau:"Première",  serie:"S2", matieres:M_S},
  {id:"tle-l1", nom:"Terminale L1", court:"Tle L1", niveau:"Terminale", serie:"L1", matieres:avecPhilo(M_L1)},
  {id:"tle-l2", nom:"Terminale L2", court:"Tle L2", niveau:"Terminale", serie:"L2", matieres:avecPhilo(M_L2)},
  {id:"tle-s1", nom:"Terminale S1", court:"Tle S1", niveau:"Terminale", serie:"S1", matieres:avecPhilo(M_S)},
  {id:"tle-s2", nom:"Terminale S2", court:"Tle S2", niveau:"Terminale", serie:"S2", matieres:avecPhilo(M_S)}
];
const matieresDe = c => c.matieres.map(id => MATIERES.find(m => m.id === id)).filter(Boolean);

const CONTENU = {
  "1re-s1": { "maths": { cours: __NDIAYE_1S1__, exercices: [], quiz: [], conseils: [] } },
  "1re-s2": { "maths": { cours: __NDIAYE_1S2__, exercices: [], quiz: [], conseils: [] } },
  "tle-s1": {
    "maths": {
      cours: [...__TLE1_COURS_S1__, ...__TLE_MORE_COURS__, ...__NDIAYE_TS1__],
      exercices: [...__TLE1_EX__, ...__TLE_MORE_EX__],
      quiz: [...__TLE1_QUIZ__, ...__TLE_MORE_QUIZ__],
      conseils: []
    }
  },
  "tle-s2": {
    "maths": {
      cours: [
        ...__TLE1_COURS_S2__,
        ...__TLE_MORE_COURS_S2__,
        {
          titre: "Probabilités — cours complet",
          chap: "Probabilités",
          desc: "Vocabulaire du hasard, calcul de probabilités, probabilités conditionnelles, schéma de Bernoulli, variable aléatoire.",
          tpl: "tpl-proba-tle-s2",
          pdf: "probabilites-tle-s2.pdf",
          plan: ["Le vocabulaire du hasard", "Calculer une probabilité", "Probabilités conditionnelles",
                 "Le schéma de Bernoulli", "Variable aléatoire"]
        },
        ...__NDIAYE_TS2__
      ],
      exercices: [...__TLE1_EX__, ...__TLE_MORE_EX__, ...__PROBA_EX__],
      quiz: [...__TLE1_QUIZ__, ...__TLE_MORE_QUIZ__, ...__PROBA_QUIZ__],
      conseils: []
    },
    "svt": {
      cours: __SVT_COURS__,
      exercices: __SVT_EX__,
      quiz: __SVT_QUIZ__,
      conseils: []
    }
  },
  "tle-l1": {
    "maths": {
      cours: __TLEL_COURS_L1__,
      exercices: __TLEL_EX__,
      quiz: __TLEL_QUIZ__,
      conseils: []
    }
  },
  "tle-l2": {
    "maths": {
      cours: __TLEL_COURS_L2__,
      exercices: __TLEL_EX__,
      quiz: __TLEL_QUIZ__,
      conseils: []
    }
  },
  "2nde-s": {
    "maths": {
      cours: __BARY_COURS__,
      exercices: __BARY_EX__,
      quiz: __BARY_QUIZ__,
      conseils: []
    },
    "histoire": {
      cours: __HIST2_COURS__,
      exercices: __HIST2_EX__,
      quiz: __HIST2_QUIZ__,
      conseils: []
    }
  }
};

/* ================= MÉMOIRE LOCALE (cet appareil) ================= */
const memo = {
  lire(k, d){ try{ const v = localStorage.getItem("mlsn:"+k); return v===null ? d : JSON.parse(v); }catch(e){ return d; } },
  ecrire(k, v){ try{ localStorage.setItem("mlsn:"+k, JSON.stringify(v)); }catch(e){} }
};

/* ================= OUTILS ================= */
const app = document.getElementById("app");
const trouverClasse = id => CLASSES.find(c => c.id === id);
const trouverMatiere = id => MATIERES.find(m => m.id === id);
const sansAccent = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const donnees = (cid, mid) => (CONTENU[cid]||{})[mid] || {};
const liste = (d, k) => d[k] || [];

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("vu");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("vu"), 2200);
}

