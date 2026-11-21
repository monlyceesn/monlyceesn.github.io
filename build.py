"""Construit l'appli dans docs/ (publiée par GitHub Pages) : page, PDF, fichiers PWA.

Usage : python3 build.py   (nécessite Python 3 et Playwright pour les PDF)
"""
import json, pathlib, html, shutil, os
from playwright.sync_api import sync_playwright

ici = pathlib.Path(__file__).parent
src = ici / "src"
dist = (ici / "apercu") if os.environ.get("ARTEFACT") else (ici / "docs")
dist.mkdir(exist_ok=True)

# ---------- Cours à publier ----------
# Chaque cours : fichier HTML, identifiant du modèle dans la page, PDF, titre, sous-titre, exercices.
proba = json.loads((src / "proba-tle-s2.json").read_text())
svt = json.loads((src / "svt-tle-s2.json").read_text())
COURS = [
    {"fichier": "cours-proba-tle-s2.html", "tpl": "tpl-proba-tle-s2", "pdf": "probabilites-tle-s2.pdf",
     "titre": "Probabilités", "sous": "Mathématiques · Terminale S2", "exercices": proba["exercices"]},
]
# SVT Tle S2 : le fascicule de M. Ndiaye remplace les cours rédigés par Claude (gardés dans src/ mais non publiés).
fascicule_svt = json.loads((src / "fascicule-svt-ts2.json").read_text())

# ---------- Site ----------
LOGO = ('<svg viewBox="0 0 100 100" aria-hidden="true">'
        '<path class="page-g" d="M50 46C38 38 22 38 10 42V86C22 82 38 82 50 90Z" fill="#ffffff"/>'
        '<path class="page-d" d="M50 46C62 38 78 38 90 42V86C78 82 62 82 50 90Z" fill="#d4d4d4"/>'
        '<g class="toque"><path d="M50 8L88 23L50 38L12 23Z" fill="#fbbf24"/>'
        '<path d="M80 26V42" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>'
        '<circle cx="80" cy="45" r="4" fill="#fbbf24"/></g></svg>')
js = "".join((src / f).read_text() for f in ["part1.js", "part2.js", "progression.js", "chapitres.js", "conseils.js", "pages.js", "part3.js", "part4.js", "demarrage.js"])
js = "const LOGO_GRAND = " + json.dumps(LOGO) + ";\n" + js
modeles = "".join(f'<template id="{c["tpl"]}">{(src / c["fichier"]).read_text()}</template>\n' for c in COURS)
site = (src / "head.html").read_text().replace("__LOGO__", LOGO)
site = site.replace('<template id="tpl-proba-tle-s2">__COURS_PROBA__</template>', modeles)
site += "<script>\n" + js + "\n</script>\n</body>\n</html>\n"
for e in proba["exercices"]: e["chap"] = "Probabilités"
site = site.replace("__PROBA_EX__", json.dumps(proba["exercices"], ensure_ascii=False))
for q in proba["quiz"]: q["chap"] = "Probabilités"
site = site.replace("__PROBA_QUIZ__", json.dumps(proba["quiz"], ensure_ascii=False))
if os.environ.get("ARTEFACT"):   # aperçu Claude : fichier trop lourd pour l'aperçu, on pointe vers GitHub
    fascicule_svt = dict(fascicule_svt, pdf="https://raw.githubusercontent.com/monlyceesn/monlyceesn.github.io/main/docs/" + fascicule_svt["pdf"])
svt_cours = [dict(fascicule_svt, type="fascicule", chap="Fascicule SVT", chaps=[ch["titre"] for ch in svt["chapitres"]])]
svt_ex = [dict(e, chap=ch["titre"], titre=f'{e["titre"]} <small style="color:var(--gris);font-weight:600">· {ch["titre"]}</small>')
          for ch in svt["chapitres"] for e in ch["exercices"]]
svt_quiz = [dict(q, chap=ch["titre"]) for ch in svt["chapitres"] for q in ch["quiz"]]
bary = json.loads((src / "barycentre-2nde-s.json").read_text())
bary_cours = [{"type": "fascicule", "id": "bary-2nde", "classe": "2nde-s", "matiere": "maths",
  "titre": "Le barycentre", "chap": "Barycentre", "auteur": "Mon Lycée SN", "credit": "Cours Mon Lycée SN", "edition": "Édition Mon Lycée SN",
  "pdf": "cours/barycentre-2nde-s.pdf", "taille": "0,35 Mo", "pages": 10, "leger": True,
  "note": "Cours avec explications simples (encadrés bleus), exemples corrigés, exercices et quiz.",
  "lecons": [{"n": 1, "titre": "Barycentre de deux points", "debut": 1, "fin": 5},
             {"n": 2, "titre": "Barycentre de trois points", "debut": 6, "fin": 7},
             {"n": 3, "titre": "Ensembles de points", "debut": 7, "fin": 8},
             {"n": 4, "titre": "Exercice corrigé de synthèse", "debut": 9, "fin": 10}]}]
vect = json.loads((src / "calcul-vectoriel-2nde-s.json").read_text())
bary_cours.append({"type": "fascicule", "id": "vect-2nde", "classe": "2nde-s", "matiere": "maths",
  "titre": "Le calcul vectoriel", "chap": "Calcul vectoriel", "auteur": "Mon Lycée SN", "credit": "Cours Mon Lycée SN", "edition": "Édition Mon Lycée SN",
  "pdf": "cours/calcul-vectoriel-2nde-s.pdf", "taille": "0,32 Mo", "pages": 9, "leger": True,
  "note": "Cours avec explications simples (encadrés bleus), exemples corrigés, exercices et quiz.",
  "lecons": [{"n": 1, "titre": "Addition de vecteurs", "debut": 1, "fin": 3},
             {"n": 2, "titre": "Multiplication par un réel, colinéarité", "debut": 3, "fin": 5},
             {"n": 3, "titre": "Base, repère et coordonnées", "debut": 6, "fin": 6},
             {"n": 4, "titre": "Vecteurs et figures (milieu, centre de gravité, Thalès)", "debut": 7, "fin": 9}]})
for e in vect["exercices"]: e["chap"] = "Calcul vectoriel"
for e in bary["exercices"]: e.setdefault("chap", "Barycentre")
for e in vect["exercices"]: e["titre"] += ' <small style="color:var(--gris);font-weight:600">· Calcul vectoriel</small>'
for e in bary["exercices"]:
    if "Barycentre</small>" not in e["titre"]: e["titre"] += ' <small style="color:var(--gris);font-weight:600">· Barycentre</small>'
bary["exercices"] = vect["exercices"] + bary["exercices"]
bary["quiz"] = [dict(q, chap="Calcul vectoriel") for q in vect["quiz"]] + [dict(q, chap="Barycentre") for q in bary["quiz"]]
tle1 = json.loads((src / "maths-tle-ch1.json").read_text())
def tle1_cours(classe):
    return [{"type": "fascicule", "id": f"maths-{classe}-ch1", "classe": classe, "matiere": "maths",
  "titre": "Chapitre 1 — Continuité, dérivabilité et primitives (rappels et compléments)", "chap": "Ch. 1 · Continuité, dérivabilité, primitives", "num": 1, "desc": tle1.get("note", ""), "auteur": "Mon Lycée SN", "credit": "Cours Mon Lycée SN", "edition": "Édition Mon Lycée SN",
  "pdf": "cours/maths-tle-ch1-continuite-derivabilite.pdf", "taille": "0,4 Mo", "pages": 9, "leger": True,
  "note": "Cours avec explications simples (encadrés bleus), exemples corrigés, exercices et quiz.",
  "lecons": [{"n": 1, "titre": "Continuité et théorème des valeurs intermédiaires", "debut": 1, "fin": 3},
             {"n": 2, "titre": "Dérivabilité, bijection et fonction réciproque", "debut": 3, "fin": 5},
             {"n": 3, "titre": "Rolle, accroissements finis, Cauchy", "debut": 5, "fin": 7},
             {"n": 4, "titre": "Rappels sur les primitives", "debut": 7, "fin": 8},
             {"n": 5, "titre": "L'essentiel à retenir et exercices corrigés", "debut": 8, "fin": 9}]}]
for e in tle1["exercices"]: e["chap"] = "Ch. 1 · Continuité, dérivabilité, primitives"
for e in tle1["exercices"]: e["titre"] += ' <small style="color:var(--gris);font-weight:600">· Chapitre 1</small>'
site = site.replace("__TLE1_COURS_S1__", json.dumps(tle1_cours("tle-s1"), ensure_ascii=False))
site = site.replace("__TLE1_COURS_S2__", json.dumps(tle1_cours("tle-s2"), ensure_ascii=False))
site = site.replace("__TLE1_EX__", json.dumps(tle1["exercices"], ensure_ascii=False))
for q in tle1["quiz"]: q["chap"] = "Ch. 1 · Continuité, dérivabilité, primitives"
site = site.replace("__TLE1_QUIZ__", json.dumps(tle1["quiz"], ensure_ascii=False))
tle_more_cours, tle_more_cours_s2, tle_more_ex, tle_more_quiz = [], [], [], []
for _n in range(2, 26):
    _d = json.loads((src / f"maths-tle-ch{_n}.json").read_text())
    _court = _d["titre"].split(" — ", 1)[-1].split(" (")[0]
    _chap = f"Ch. {_n} · {_court}"
    tle_more_cours.append({"type": "fascicule", "id": f"maths-tle-s1-ch{_n}", "classe": "tle-s1", "matiere": "maths",
      "titre": _d["titre"], "chap": _chap, "num": _n, "desc": _d.get("note", ""), "auteur": "Mon Lycée SN", "credit": "Cours Mon Lycée SN", "edition": "Édition Mon Lycée SN",
      "pdf": _d["pdf"], "taille": _d["taille"], "pages": _d["pages"], "leger": True,
      "note": "Cours avec explications simples (encadrés bleus), exemples corrigés, exercices et quiz.",
      "lecons": _d["lecons"]})
    tle_more_cours_s2.append({**tle_more_cours[-1], "id": f"maths-tle-s2-ch{_n}", "classe": "tle-s2"})
    for e in _d["exercices"]:
        e["chap"] = _chap
        e["titre"] += f' <small style="color:var(--gris);font-weight:600">· Chapitre {_n}</small>'
    tle_more_ex += _d["exercices"]
    tle_more_quiz += [dict(q, chap=_chap) for q in _d["quiz"]]
site = site.replace("__TLE_MORE_COURS__", json.dumps(tle_more_cours, ensure_ascii=False))
site = site.replace("__TLE_MORE_COURS_S2__", json.dumps(tle_more_cours_s2, ensure_ascii=False))
site = site.replace("__TLE_MORE_EX__", json.dumps(tle_more_ex, ensure_ascii=False))
site = site.replace("__TLE_MORE_QUIZ__", json.dumps(tle_more_quiz, ensure_ascii=False))
tlel_l1, tlel_l2, tlel_ex, tlel_quiz = [], [], [], []
for _n in range(1, 11):
    _d = json.loads((src / f"maths-tle-l-ch{_n}.json").read_text())
    _chap = f"Ch. {_n} · " + _d["titre"].split(" — ", 1)[-1]
    tlel_l1.append({"type": "fascicule", "id": f"maths-tle-l1-ch{_n}", "classe": "tle-l1", "matiere": "maths",
      "titre": _d["titre"], "chap": _chap, "num": _n, "desc": _d.get("note", ""), "auteur": "Mon Lycée SN", "credit": "Cours Mon Lycée SN", "edition": "Édition Mon Lycée SN",
      "pdf": _d["pdf"], "taille": _d["taille"], "pages": _d["pages"], "leger": True,
      "note": "Cours avec explications simples (encadrés bleus), exemples corrigés, exercices et quiz.",
      "lecons": _d["lecons"]})
    tlel_l2.append({**tlel_l1[-1], "id": f"maths-tle-l2-ch{_n}", "classe": "tle-l2"})
    for e in _d["exercices"]:
        e["chap"] = _chap
        e["titre"] += f' <small style="color:var(--gris);font-weight:600">· Chapitre {_n}</small>'
    tlel_ex += _d["exercices"]
    tlel_quiz += [dict(q, chap=_chap) for q in _d["quiz"]]
site = site.replace("__TLEL_COURS_L1__", json.dumps(tlel_l1, ensure_ascii=False))
site = site.replace("__TLEL_COURS_L2__", json.dumps(tlel_l2, ensure_ascii=False))
site = site.replace("__TLEL_EX__", json.dumps(tlel_ex, ensure_ascii=False))
site = site.replace("__TLEL_QUIZ__", json.dumps(tlel_quiz, ensure_ascii=False))
hist2 = json.loads((src / "histoire-lecon1-2nde.json").read_text())
hist2_cours = [{"type": "fascicule", "id": "hist-2nde-l1", "classe": "2nde-s", "matiere": "histoire",
  "titre": "Leçon 1 — L'histoire : définition, objet et importance", "chap": "Leçon 1", "auteur": "Mon Lycée SN", "credit": "Cours Mon Lycée SN", "edition": "Édition Mon Lycée SN",
  "pdf": "cours/histoire-lecon1-2nde.pdf", "taille": "0,2 Mo", "pages": 7, "leger": True,
  "note": "Cours avec explications simples (encadrés bleus), exemples corrigés, exercices et quiz.",
  "lecons": [{"n": 1, "titre": "Définition de l'histoire", "debut": 1, "fin": 2},
             {"n": 2, "titre": "L'objet de l'histoire (chronologie, périodes, sources)", "debut": 2, "fin": 4},
             {"n": 3, "titre": "L'importance de l'histoire et conclusion", "debut": 5, "fin": 5},
             {"n": 4, "titre": "L'essentiel à retenir et exercices corrigés", "debut": 6, "fin": 7}]}]
for e in hist2["exercices"]: e["chap"] = "Leçon 1"
for e in hist2["exercices"]: e["titre"] += ' <small style="color:var(--gris);font-weight:600">· Leçon 1</small>'
site = site.replace("__HIST2_COURS__", json.dumps(hist2_cours, ensure_ascii=False))
site = site.replace("__HIST2_EX__", json.dumps(hist2["exercices"], ensure_ascii=False))
for q in hist2["quiz"]: q["chap"] = "Leçon 1"
site = site.replace("__HIST2_QUIZ__", json.dumps(hist2["quiz"], ensure_ascii=False))
site = site.replace("__BARY_COURS__", json.dumps(bary_cours, ensure_ascii=False))
site = site.replace("__BARY_EX__", json.dumps(bary["exercices"], ensure_ascii=False))
site = site.replace("__BARY_QUIZ__", json.dumps(bary["quiz"], ensure_ascii=False))
site = site.replace("__SVT_COURS__", json.dumps(svt_cours, ensure_ascii=False))
site = site.replace("__SVT_EX__", json.dumps(svt_ex, ensure_ascii=False))
site = site.replace("__SVT_QUIZ__", json.dumps(svt_quiz, ensure_ascii=False))
assert "__" not in site.replace("__proto__", ""), "un marqueur n'a pas été remplacé"
(dist / "index.html").write_text(site)

# ---------- PDF ----------
CSS = """
@page { size: A4; margin: 16mm 15mm 18mm; }
body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 10.5pt; color:#1d2521; line-height:1.45; }
.couv { background:#2563eb; color:#fff; padding:18px 20px; border-radius:10px; margin-bottom:14px; }
.couv h1 { margin:0; font-size:20pt; } .couv p { margin:4px 0 0; }
h2 { color:#2563eb; font-size:14pt; border-bottom:2px solid #e8efff; padding-bottom:3px; margin-top:18px; page-break-after:avoid; }
h3 { font-size:11.5pt; margin:12px 0 4px; page-break-after:avoid; }
.intro { font-style:italic; color:#5f6b65; }
.retenir { background:#e8efff; border-left:4px solid #2563eb; padding:8px 10px; border-radius:6px; margin:8px 0; page-break-inside:avoid; }
.exemple { background:#fff7e0; border-left:4px solid #f5b700; padding:8px 10px; border-radius:6px; margin:8px 0; page-break-inside:avoid; }
.encart { border:1px dashed #bbb; padding:8px 10px; border-radius:6px; margin:8px 0; page-break-inside:avoid; }
.attention { background:#fdecea; border-left:4px solid #c0392b; padding:8px 10px; border-radius:6px; margin:8px 0; page-break-inside:avoid; }
.formule { font-weight:bold; } .bar { text-decoration:overline; }
table { border-collapse:collapse; margin:6px 0; page-break-inside:avoid; } th,td { border:1px solid #ccc; padding:4px 8px; text-align:center; }
th { background:#e8efff; }
.fig { text-align:center; margin:10px 0; page-break-inside:avoid; } .fig svg { border:1px solid #ddd; border-radius:8px; }
.legende { font-size:9pt; color:#5f6b65; margin:3px 0 0; }
.exo { border:1px solid #dde3df; border-radius:8px; padding:6px 12px; margin:8px 0; page-break-inside:avoid; }
.saut { page-break-before:always; }
.pied { font-size:8.5pt; color:#777; margin-top:16px; }
"""

import re
def en_gris(texte):
    """Remplace chaque couleur #rgb / #rrggbb par le gris de même luminosité (impression noir et blanc)."""
    def conv(m):
        h = m.group(1)
        if len(h) == 3: h = "".join(x*2 for x in h)
        r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
        y = round(0.299*r + 0.587*g + 0.114*b)
        return "#%02x%02x%02x" % (y, y, y)
    return re.sub(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b", conv, texte)

def page_pdf(c):
    contenu = (src / c["fichier"]).read_text()
    exos = "".join(f'<div class="exo"><h3>Exercice {i+1} — {e["titre"]}</h3><p>{e["enonce"]}</p></div>'
                   for i, e in enumerate(c["exercices"]))
    corr = "".join(f'<div class="exo"><h3>Exercice {i+1}</h3><p>{e["correction"]}</p></div>'
                   for i, e in enumerate(c["exercices"]))
    page = f"""<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>{CSS}
.couv.nb {{ background:#fff; color:#000; border:2.5px solid #000; }}
h2 {{ color:#000; border-bottom-color:#000; }}
.retenir {{ border-left-color:#000; }}
</style></head><body>
<div class="couv"><h1>{c["titre"]}</h1><p>{c["sous"]} · Mon Lycée SN</p></div>
{contenu}
<h2 class="saut">Exercices</h2>{exos}
<h2>Corrigés</h2>{corr}
<p class="pied">Mon Lycée SN · Probabilités · Terminale S2</p>
</body></html>"""
    return en_gris(page).replace('class="couv"', 'class="couv nb"')

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    for c in COURS:
        h = dist / c["pdf"].replace(".pdf", ".html")
        h.write_text(page_pdf(c))
        pg.goto(h.as_uri())
        pied = html.escape(f'{c["titre"]} – {c["sous"]}')
        pg.pdf(path=str(dist / c["pdf"]), format="A4", print_background=True,
               display_header_footer=True, header_template="<span></span>",
               footer_template=f'<div style="font-size:8px;width:100%;text-align:center;color:#888">{pied} · page <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
               margin={"top": "16mm", "bottom": "18mm", "left": "15mm", "right": "15mm"})
    b.close()
# Fichiers de l'appli installable (service worker, manifeste, icônes, config)
shutil.copytree(ici / "public", dist, dirs_exist_ok=True)
(dist / ".nojekyll").write_text("")
for h in dist.glob("*.html"):
    if h.name != "index.html" and not h.name.startswith("google"): h.unlink()   # pages intermédiaires des PDF
print("OK", [c["pdf"] for c in COURS])
