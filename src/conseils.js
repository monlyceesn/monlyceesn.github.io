/* ================= CONTENU : CONSEILS PAR PROFIL + PISTES D'ORIENTATION =================
   Conseils pédagogiques généraux (pas des règles officielles).
   Les faits datés sur l'orientation (CPGE, concours EPT, Campusen) ont été vérifiés en novembre 2026
   et doivent être revérifiés chaque année. */

const PROFILS_CONSEILS = [
  { id:"maths", ico:"📐", titre:"J'ai du mal en maths",
    signe:"Tu comprends en classe mais tu bloques seul devant un exercice, ou tu as « décroché » depuis un chapitre.",
    pourquoi:"En maths, chaque chapitre s'appuie sur les précédents. Un trou dans les bases (fractions, calcul littéral, équations) fait tout tomber ensuite. Ce n'est presque jamais un problème de « don ».",
    actions:[
      "Repère le chapitre où tu as décroché et reprends <b>à partir de là</b>, même si c'est un cours de l'an passé.",
      "Apprends les définitions et propriétés <b>mot pour mot</b> : en maths, un mot change tout.",
      "Pour chaque exercice, écris d'abord : « Je cherche… / Je sais que… / J'utilise la propriété… ».",
      "Refais les exemples du cours <b>sans regarder</b> la solution avant d'attaquer les exercices.",
      "Cherche 15 minutes seul, puis utilise l'indice, et seulement après la correction.",
      "Garde un carnet d'erreurs : signe oublié, parenthèse mal développée… Relis-le avant chaque devoir.",
      "Fais un peu de maths <b>tous les jours</b> (20 min) plutôt que 3 heures la veille."],
    exemple:"Awa n'arrive pas à résoudre les équations du second degré. En reprenant, elle voit que c'est la factorisation qui coince. Elle refait 10 factorisations simples par jour pendant une semaine, et les équations deviennent faciles." },

  { id:"pc", ico:"⚗️", titre:"J'ai du mal en physique-chimie",
    signe:"Tu connais les formules mais tu ne sais pas laquelle utiliser, ou tu te perds dans les unités.",
    pourquoi:"La physique-chimie demande trois choses à la fois : comprendre le phénomène, choisir la bonne loi et faire le calcul. Souvent, c'est l'étape « choisir la loi » qui manque de méthode.",
    actions:[
      "Commence chaque exercice par un <b>schéma</b> et la liste des données avec leurs unités.",
      "Convertis tout en unités du système international (m, kg, s, mol…) <b>avant</b> de calculer.",
      "Fais une fiche par chapitre : chaque formule avec le sens de chaque lettre et son unité.",
      "Écris la formule littérale d'abord, remplace les nombres seulement à la fin.",
      "Vérifie si ton résultat est réaliste : une voiture à 3 000 km/h, c'est une erreur.",
      "Si les maths te bloquent (dérivées, vecteurs), travaille-les en parallèle : elles servent partout en physique."],
    exemple:"Moussa rate ses exercices de cinématique. En listant les données et unités avant de calculer, il découvre qu'il mélangeait km/h et m/s. Il gagne des points dès le devoir suivant." },

  { id:"svt", ico:"🧬", titre:"J'ai du mal en SVT",
    signe:"Il y a beaucoup à retenir, tu mélanges les notions, ou tu ne sais pas exploiter un document.",
    pourquoi:"La SVT mélange par cœur (vocabulaire, mécanismes) et raisonnement (analyser des documents, expériences). Il faut entraîner les deux.",
    actions:[
      "Apprends avec des <b>schémas</b> : refais-les de mémoire, avec la légende.",
      "Fais un lexique des mots-clés de chaque chapitre (ex : synapse, potentiel d'action).",
      "Pour un document : « Je vois… (décrire) → J'en déduis… (interpréter) → Donc… (conclure) ».",
      "Raconte un mécanisme comme une histoire, étape par étape, à voix haute.",
      "Entraîne-toi sur les sujets des années passées : les types de documents reviennent souvent."],
    exemple:"Fatou confond les étapes de la transmission nerveuse. Elle dessine chaque soir le schéma d'une synapse de mémoire. Au bout d'une semaine, elle peut l'expliquer sans notes." },

  { id:"francais", ico:"✍️", titre:"J'ai du mal en français ou en philosophie",
    signe:"Tu ne sais pas comment organiser une dissertation, un commentaire, ou tu manques d'idées.",
    pourquoi:"Ces épreuves notent surtout la <b>méthode</b> : comprendre le sujet, construire un plan, argumenter avec des exemples. Ça s'apprend comme une recette.",
    actions:[
      "Avant d'écrire, souligne les mots-clés du sujet et reformule-le avec tes mots.",
      "Fais toujours un <b>brouillon de plan</b> (2 ou 3 parties, 2 ou 3 arguments chacune).",
      "Chaque paragraphe : une idée → une explication → un exemple précis.",
      "Constitue un carnet de citations et d'exemples (auteurs, œuvres, faits de société) réutilisables.",
      "Lis un peu chaque jour (journal, roman) : le vocabulaire et l'orthographe s'améliorent tout seuls.",
      "Garde 10 minutes à la fin pour relire l'orthographe et les accords."],
    exemple:"Ibrahima rendait des copies sans plan. En s'obligeant à 15 minutes de brouillon avant d'écrire, ses idées s'enchaînent et sa note gagne plusieurs points." },

  { id:"langues", ico:"🌍", titre:"J'ai du mal en anglais ou en langues",
    signe:"Tu comprends un peu mais tu n'oses pas parler, ou tu manques de vocabulaire.",
    pourquoi:"Une langue s'apprend par contact régulier. Quelques minutes par jour valent mieux qu'une grosse séance.",
    actions:[
      "Apprends 5 mots nouveaux par jour, dans une phrase, pas seuls.",
      "Écoute des chansons, vidéos ou podcasts en anglais avec les sous-titres en anglais.",
      "Revois les temps de base (présent, passé, futur) jusqu'à les maîtriser parfaitement.",
      "Écris 3 phrases par jour sur ta journée : c'est un entraînement parfait.",
      "Parle avec un camarade en anglais 5 minutes, même avec des fautes."],
    exemple:"Khady regarde un épisode de série par semaine sous-titré en anglais et note 10 expressions. En trois mois, la compréhension écrite devient sa meilleure note." },

  { id:"hg", ico:"🗺️", titre:"J'ai du mal en histoire-géographie",
    signe:"Tu oublies les dates, les notions, ou tu ne sais pas rédiger une composition.",
    pourquoi:"L'histoire-géo demande des repères solides et une méthode de rédaction. Sans repères, on récite sans comprendre.",
    actions:[
      "Fais une <b>frise chronologique</b> par chapitre avec les dates clés.",
      "Pour chaque notion, apprends une définition courte et un exemple.",
      "Entraîne-toi à faire des croquis simples : légende organisée, titre, couleurs.",
      "Composition : introduction (contexte, problématique, plan) → parties → conclusion.",
      "Relie les événements entre eux : causes → faits → conséquences."],
    exemple:"Mamadou mélangeait les dates de la décolonisation. Avec une frise affichée au mur, il la voit chaque jour et la retient sans effort." },

  { id:"concentration", ico:"🎯", titre:"Je n'arrive pas à me concentrer en cours",
    signe:"Ton esprit part ailleurs, tu décroches au bout de quelques minutes, tu ne sais plus ce que le prof a dit.",
    pourquoi:"La fatigue, le téléphone, la faim, une place mal choisie ou un retard dans le cours rendent l'attention difficile. Parfois c'est aussi un problème de vue ou d'audition non détecté.",
    actions:[
      "Assieds-toi <b>devant</b>, loin des fenêtres et des camarades bavards.",
      "Prends des notes actives : abréviations, titres, flèches. Écrire aide à rester attentif.",
      "Pose une question quand tu décroches : c'est la meilleure façon de revenir dans le cours.",
      "Dors suffisamment et prends un petit-déjeuner : le cerveau a besoin d'énergie.",
      "Mets le téléphone en silencieux et hors de vue pendant le cours et les révisions.",
      "Chez toi, travaille avec le minuteur : 25 min concentré, 5 min de pause.",
      "Si tu vois flou au tableau ou entends mal, parles-en à tes parents : un contrôle de la vue peut tout changer."],
    exemple:"Aminata décroche toujours après la récréation. En changeant de place et en prenant des notes avec des couleurs, elle suit beaucoup mieux." },

  { id:"lent", ico:"🐢", titre:"Je mets plus de temps que les autres à comprendre",
    signe:"Tu finis par comprendre, mais toujours après les autres, et tu as peur de prendre du retard.",
    pourquoi:"Chacun a son rythme. Comprendre lentement n'empêche pas de comprendre <b>en profondeur</b>. Il faut juste s'organiser pour ne pas accumuler de retard.",
    actions:[
      "Lis le chapitre <b>avant</b> le cours : tu arrives en classe en ayant déjà vu les notions.",
      "Revois le cours le soir même, même 15 minutes : c'est là que tout se fixe.",
      "Découpe : une notion à la fois, avec un exemple, avant de passer à la suivante.",
      "N'hésite pas à demander au prof de réexpliquer, ou à un camarade après le cours.",
      "Utilise les leçons de l'appli à ton rythme : relis autant de fois que nécessaire.",
      "Ne te compare pas : compare-toi à toi-même d'il y a un mois."],
    exemple:"Cheikh mettait une semaine à comprendre un chapitre. En lisant le cours la veille de la leçon, il comprend dès la classe et rattrape son retard." },

  { id:"stress", ico:"😮‍💨", titre:"Je stresse pendant les devoirs et examens",
    signe:"Tu connais ton cours mais tu perds tes moyens le jour J, tu as un trou de mémoire.",
    pourquoi:"Le stress est normal. Il devient gênant quand on n'est pas habitué aux conditions de l'examen.",
    actions:[
      "Entraîne-toi en <b>conditions réelles</b> : sujet complet, temps limité, sans aide.",
      "Le jour J, lis tout le sujet et commence par l'exercice que tu maîtrises le mieux.",
      "Respire lentement : inspire 4 secondes, bloque 4 secondes, expire 4 secondes.",
      "Prépare ton matériel la veille et dors bien plutôt que réviser toute la nuit.",
      "Si le stress t'empêche de dormir ou de manger pendant longtemps, parles-en à un adulte de confiance."],
    exemple:"Ndèye perdait ses moyens en maths. Après trois sujets faits en temps réel à la maison, le jour du devoir lui a paru « normal »." },

  { id:"motivation", ico:"🔥", titre:"Je manque de motivation",
    signe:"Tu repousses toujours les révisions, tu ne vois pas à quoi ça sert.",
    pourquoi:"On se motive mieux avec un objectif clair et des petites victoires visibles.",
    actions:[
      "Fixe un objectif précis : « Avoir 12 en maths au prochain trimestre ».",
      "Commence par 10 minutes seulement : le plus dur, c'est de commencer.",
      "Coche tes leçons et exercices réussis dans l'appli : voir sa progression motive.",
      "Pense à ton projet après le bac : regarde la page Orientation.",
      "Travaille en groupe avec des camarades sérieux, une ou deux fois par semaine."],
    exemple:"Babacar ne révisait jamais. En visant une école précise et en se fixant 30 minutes par jour, il a vu ses notes monter et a eu envie de continuer." },

  { id:"conditions", ico:"🏠", titre:"Je travaille dans de mauvaises conditions",
    signe:"Maison bruyante, pas de bureau, coupures d'électricité, peu de connexion.",
    pourquoi:"Beaucoup d'élèves révisent sans conditions idéales. On peut s'adapter avec un peu d'organisation.",
    actions:[
      "Repère un lieu calme : bibliothèque, CDI du lycée, salle de classe après les cours, maison d'un ami.",
      "Profite des moments calmes : tôt le matin ou tard le soir.",
      "<b>Télécharge</b> tes cours dans l'appli quand tu as du réseau : tu pourras les lire sans connexion.",
      "Prépare des fiches papier pour réviser même sans électricité.",
      "Organise des séances de révision en groupe pour partager les ressources."],
    exemple:"Ousmane n'avait pas de connexion chez lui. Il télécharge ses leçons au lycée et révise le soir sans réseau." },

  { id:"organisation", ico:"🗓️", titre:"Je n'arrive pas à m'organiser",
    signe:"Tu révises au dernier moment, tu oublies des devoirs, tu ne sais pas par où commencer.",
    pourquoi:"Sans planning, tout semble urgent. Un emploi du temps simple soulage beaucoup.",
    actions:[
      "Note tous les devoirs et contrôles dans un agenda ou un cahier.",
      "Fais un planning de la semaine avec des créneaux courts (30 à 45 minutes).",
      "Revois le cours du jour le soir même, même 10 minutes.",
      "Garde un jour par semaine pour refaire des exercices.",
      "Commence par la tâche la plus importante, pas la plus facile.",
      "Avant le bac : fais au moins un sujet complet en temps réel par matière."],
    exemple:"Mariama oubliait ses contrôles. Avec un cahier de devoirs et un planning collé au mur, elle ne révise plus la veille au soir." }
];

/* ---------- Orientation : pistes selon les matières ---------- */
const MATIERES_ORIENT = [
  ["maths","Maths"],["pc","Physique-Chimie"],["svt","SVT"],["francais","Français"],
  ["philo","Philosophie"],["hg","Histoire-Géo"],["langues","Anglais / langues"]
];

const PISTES_ORIENT = [
  { ico:"⚙️", titre:"Ingénierie et technologies", cles:["maths","pc"], serieS:true,
    exemples:"Écoles d'ingénieurs, classes préparatoires (CPGE), licences de sciences (maths, physique).",
    savoir:["Le concours d'entrée en 1re année de l'École polytechnique de Thiès (EPT) est ouvert aux élèves de Terminale scientifique : l'inscription se fait <b>pendant</b> l'année de Terminale (en 2026, jusqu'au 15 avril), donc avant les résultats du bac.",
      "Les CPGE du Sénégal (MPSI et PCSI, à Thiès) recrutent sur dossier les bacheliers S1, S2, S3 avec mention Bien ou Très bien (règle 2026).",
      "Un concours commun (DIC) permet aussi d'entrer dans plusieurs écoles d'ingénieurs à partir d'une Licence 2 de sciences."] },
  { ico:"💻", titre:"Informatique et numérique", cles:["maths"], serieS:false,
    exemples:"Licences d'informatique, filières numériques dans certains ISEP, écoles d'ingénieurs en informatique.",
    savoir:["La logique et les maths comptent plus que le fait de déjà savoir programmer.",
      "Commence à t'entraîner gratuitement (Scratch, Python) pour savoir si ça te plaît."] },
  { ico:"🩺", titre:"Santé (médecine, pharmacie, dentaire, paramédical)", cles:["svt","pc"], serieS:true,
    exemples:"Médecine, pharmacie, odontologie, écoles de sages-femmes et d'infirmiers.",
    savoir:["Études longues et exigeantes, très demandées : sur Campusen, le classement se fait surtout selon la moyenne au bac.",
      "Prévois toujours des choix de secours proches (biologie, chimie) dans tes vœux."] },
  { ico:"🌱", titre:"Biologie, agronomie, environnement", cles:["svt","pc"], serieS:true,
    exemples:"Licences de biologie, géologie, chimie, écoles d'agronomie, métiers de l'environnement et de l'eau.",
    savoir:["Secteurs utiles au Sénégal (agriculture, pêche, eau, climat).", "Bonne alternative si la santé ne passe pas."] },
  { ico:"🔬", titre:"Sciences fondamentales et enseignement", cles:["maths","pc","svt"], serieS:true,
    exemples:"Licences de maths, physique, chimie ; ensuite master, recherche ou concours de l'enseignement.",
    savoir:["Si tu aimes expliquer aux autres, l'enseignement des sciences recrute régulièrement."] },
  { ico:"📊", titre:"Économie, gestion, finance, statistique", cles:["maths","francais"], serieS:false,
    exemples:"Licences d'économie et de gestion, écoles de commerce, comptabilité, banque, statistique.",
    savoir:["Les maths y comptent beaucoup (statistiques, calculs financiers), même pour un bachelier L.",
      "Pour une école privée, vérifie que le diplôme est reconnu par l'État avant de payer."] },
  { ico:"⚖️", titre:"Droit et sciences politiques", cles:["francais","philo","hg"], serieS:false,
    exemples:"Licences de droit, sciences politiques, administration ; ensuite magistrature, avocat, fonction publique…",
    savoir:["Il faut beaucoup lire, rédiger et argumenter : ce sont les compétences de la dissertation."] },
  { ico:"📰", titre:"Lettres, langues, communication", cles:["francais","langues","philo"], serieS:false,
    exemples:"Lettres modernes, langues étrangères, traduction, journalisme, communication, tourisme.",
    savoir:["Une très bonne maîtrise de l'anglais ouvre aussi des portes dans tous les autres secteurs."] },
  { ico:"🏛️", titre:"Sciences humaines et sociales", cles:["hg","philo","francais"], serieS:false,
    exemples:"Histoire, géographie, sociologie, philosophie ; ensuite enseignement, urbanisme, ONG, recherche.",
    savoir:["La géographie mène aussi à des métiers techniques (cartographie, aménagement)."] },
  { ico:"🛠️", titre:"Formations professionnelles courtes", cles:[], serieS:false,
    exemples:"ISEP (via Campusen), BTS, formations techniques : un métier en 2 à 3 ans.",
    savoir:["Bon choix si tu veux travailler vite et apprendre par la pratique.",
      "Les ISEP sont proposés sur Campusen à côté des universités."] }
];

const CONSEILS_MOYENNE = {
  "moins10": { titre:"Moyenne actuelle sous 10", points:[
      "Ta priorité, c'est d'<b>obtenir le bac</b> : concentre-toi sur les matières à gros coefficient de ta série.",
      "Travaille avec les sujets des années passées : les mêmes types d'exercices reviennent.",
      "Repère 2 ou 3 chapitres « faciles à gagner » par matière et maîtrise-les parfaitement.",
      "Il te reste du temps : une moyenne de trimestre n'est pas la note du bac.",
      "Pour l'orientation, renseigne-toi déjà sur les formations professionnelles courtes et les ISEP."] },
  "10-12": { titre:"Moyenne entre 10 et 12", points:[
      "Sur Campusen, les candidats sont surtout classés selon leur moyenne au bac : chaque point gagné compte.",
      "Utilise bien tes choix : mélange des formations très demandées et des formations moins demandées qui t'intéressent.",
      "Pense aux ISEP et aux licences moins demandées liées à tes matières fortes.",
      "Les concours (comme celui de l'EPT) reposent sur des épreuves écrites : une bonne préparation peut compenser une moyenne moyenne."] },
  "12-14": { titre:"Moyenne entre 12 et 14", points:[
      "Tu as un bon dossier : vise les formations qui te plaisent vraiment, mais garde des choix de sécurité.",
      "Une mention Bien au bac ouvre l'accès aux CPGE (séries S, règle 2026) : vise-la si l'ingénierie t'attire.",
      "Inscris-toi aux concours qui t'intéressent pendant ta Terminale.",
      "Travaille les matières clés de la filière visée pour arriver à l'aise en 1re année."] },
  "plus14": { titre:"Moyenne au-dessus de 14", points:[
      "Avec une mention Bien ou Très bien en série S, tu peux candidater aux CPGE du Sénégal (règle 2026).",
      "Tente les concours des grandes écoles et cherche les bourses d'excellence.",
      "Ne mets pas que des formations prestigieuses : choisis surtout ce qui te correspond.",
      "Reste régulier jusqu'au bout : la mention se joue sur les notes du bac, pas sur les bulletins."] }
};
