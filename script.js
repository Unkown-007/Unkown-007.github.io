"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ============ DATA (from the CV) ============ */
const SKILLS = [
  { name: "Pentest & audit", short: "Pentest", angle: 300, dist: .62,
    desc: "Audit de sécurité en entreprise (SPIE ICS), méthodologie et réglementation du test d'intrusion, CTF.",
    tools: ["Kali Linux", "Nmap", "Nikto", "John the Ripper", "WAF", "Injection SQL", "OSINT", "Cryptographie"] },
  { name: "Réseaux", short: "Réseaux", angle: 20, dist: .78,
    desc: "Bases réseaux et protocoles, équipements Cisco, sécurité des réseaux sans fil et mobiles. Deux certifications Cisco Networking Academy.",
    tools: ["TCP/IP", "Cisco IOS", "Protocoles", "Wi-Fi & mobile", "Détection des menaces"] },
  { name: "Développement", short: "Dev", angle: 85, dist: .5,
    desc: "Du C++ chez Cisco au Python chez SPIE ICS, plus des outils de sécurité maison comme un scanner de ports multithreadé.",
    tools: ["Python", "C", "C++", "C#", "Java", "JavaScript", "PHP", "SQL", "HTML/CSS", "Git", "API REST"] },
  { name: "Systèmes", short: "Systèmes", angle: 150, dist: .72,
    desc: "Administration système avancée et scripting, sécurité des systèmes, architecture des machines.",
    tools: ["Linux", "Windows", "Kali Linux", "Scripting", "Structures de données", "Support & tickets"] },
  { name: "Cloud & virtualisation", short: "Cloud", angle: 205, dist: .45,
    desc: "Labs virtualisés pour s'entraîner sans rien casser, conteneurs et notions de cloud computing.",
    tools: ["VMware", "VirtualBox", "Docker", "Cloud computing"] },
  { name: "Prototypage & 3D", short: "Hardware", angle: 250, dist: .84,
    desc: "Le côté matériel : concevoir, imprimer, souder, assembler. Utile pour comprendre l'embarqué.",
    tools: ["Arduino", "SolidWorks", "Blender", "Impression 3D", "Découpe laser", "Soudure", "Montage PC"] },
];

const PROJECTS = [
  { id: "ctf", title: "CTF CyberNight 2026", sub: "4/5 flags · CTFREI", meta: "Compétition CTFREI · 2026 · Web, système, OSINT",
    body: `<p>Une nuit de challenges. J'ai flaggé 4 épreuves sur 5 et publié un write-up complet : démarche, requêtes SQL, programmes en C.</p>
      <table><thead><tr><th>Challenge</th><th>Catégorie</th><th>Points</th><th>Statut</th></tr></thead><tbody>
      <tr><td>Alien Hatch 1 : Indigestion</td><td>Web</td><td>500</td><td class="ok">Flaggé</td></tr>
      <tr><td>Peindre l'espoir</td><td>OSINT</td><td>495</td><td class="ok">Flaggé</td></tr>
      <tr><td>RTFM</td><td>Système</td><td>427</td><td class="ok">Flaggé</td></tr>
      <tr><td>Le lundi au soleil !</td><td>OSINT</td><td>493</td><td class="ok">Flaggé</td></tr>
      <tr><td>Hell Yeahhhh !</td><td>OSINT</td><td>500</td><td class="ko">Non flaggé</td></tr></tbody></table>
      <ul class="points">
        <li><strong>Web</strong> : injection SQL UNION sur SQLite, énumération de <code>sqlite_master</code> jusqu'à la table <code>secrets</code>.</li>
        <li><strong>Système</strong> : mot de passe caché dans un commentaire roff d'une page <code>man</code>, puis un programme C qui appelle <code>libgetflag</code>.</li>
      </ul>
      <p class="lesson">Ce que j'en retiens : tester un vrai UNION SELECT avant de conclure à un filtre, et lire la réponse brute plutôt que l'interface.</p>
      <p style="margin-top:1.2rem"><a class="btn btn-ghost" href="https://github.com/Unkown-007/cybernight-2026-writeup" target="_blank" rel="noopener">Lire le write-up sur GitHub</a></p>` },
  { id: "nexus", title: "NexusPC", sub: "Boutique volontairement vulnérable", meta: "Projet ethical hacking EFREI · équipe de 4",
    body: `<p>Une boutique en ligne construite pour être attaquée : une application Flask avec une base SQLite, truffée de failles à exploiter pour s'entraîner.</p>
      <ul class="chips"><li>Flask</li><li>SQLite</li><li>Python</li><li>Injection SQL</li></ul>
      <ul class="points">
        <li>Ma partie : l'injection SQL, de la faille dans le code à son exploitation.</li>
        <li>Travail en équipe de 4, chacun responsable d'une famille de vulnérabilités.</li>
      </ul>
      <p class="lesson">Construire la faille soi-même est la meilleure façon de comprendre comment la corriger.</p>` },
  { id: "scan", title: "Scanner de ports", sub: "Python appliqué à la cyber", meta: "Projet EFREI · Python",
    body: `<p>Un scanner de ports TCP écrit en Python : connexions par sockets, scan parallélisé en multithreading, résultats exportés dans un rapport JSON.</p>
      <ul class="chips"><li>Python</li><li>socket</li><li>threading</li><li>JSON</li></ul>
      <p>Voici à quoi ressemble une exécution (simulation dans le navigateur, aucune requête réseau) :</p>
      <pre class="scan-demo" id="scan-demo" aria-live="polite"></pre>
      <button class="btn btn-ghost" type="button" id="scan-run">Lancer la simulation</button>` },
  { id: "nao", title: "Hackathon robot NAO", sub: "Cordées de la réussite · 2024", meta: "Lycée La Salle, ISEP et Aldebaran · déc. 2024 · thème éducation",
    body: `<p>Un hackathon autour du robot humanoïde NAO sur le thème de l'éducation.</p>
      <ul class="points">
        <li>Développement d'un algorithme d'IA pour aider les élèves en difficulté.</li>
        <li>Gestion de projet hebdomadaire.</li>
        <li>Présentation devant un jury et un large public.</li>
      </ul>
      <ul class="chips"><li>IA</li><li>Robotique</li><li>Gestion de projet</li><li>Prise de parole</li></ul>` },
  { id: "solar", title: "Suivi solaire automatisé", sub: "Projet de terminale STI2D", meta: "Lycée La Salle Saint-Nicolas · 2025",
    body: `<p>Construction et automatisation d'un système qui oriente un panneau pour suivre le soleil.</p>
      <ul class="points">
        <li>Prototypage avec Arduino et impression 3D.</li>
        <li>Fabrication de maquettes en atelier.</li>
      </ul>
      <ul class="chips"><li>Arduino</li><li>Électronique</li><li>Impression 3D</li><li>Automatisme</li></ul>` },
  { id: "games", title: "Jeux vidéo & 3D", sub: "Blender, C++, mods", meta: "Projet personnel",
    body: `<p>Quand je ne casse pas des applications, j'en construis d'autres : modélisation 3D, scripts et modifications de jeux.</p>
      <ul class="points">
        <li>Conception 3D d'objets avec Blender.</li>
        <li>Programmation de scripts en C++ sous Visual Studio Code.</li>
        <li>Réalisation et modification de mods pour jeux vidéo.</li>
      </ul>
      <ul class="chips"><li>Blender</li><li>C++</li><li>Modding</li><li>SolidWorks</li></ul>` },
];

/* ============ NAME DECODE (single load moment) ============ */
(function decodeName() {
  const h1 = $("#name");
  const final = h1.dataset.text;
  if (reduceMotion) return;
  h1.setAttribute("aria-label", final);
  const glyphs = "#$%&*+<>/\\=?01ABCDEFX";
  const start = performance.now();
  const dur = 1100;
  (function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const solved = Math.floor(t * final.length);
    h1.textContent = [...final].map((ch, i) =>
      i < solved || ch === " " ? ch : glyphs[(Math.random() * glyphs.length) | 0]).join("");
    if (t < 1) requestAnimationFrame(frame); else { h1.textContent = final; h1.classList.add("run"); setTimeout(() => h1.classList.remove("run"), 1000); }
  })(start);
})();

/* ============ CODE RAIN (hero background) ============ */
(function codeRain() {
  const canvas = $("#rain");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  const chars = "01アイウエオカキクケコ0123456789ABCDEF<>{}[]#$";
  const fs = 15;
  let cols = [], visible = true, last = 0;
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    cols = Array.from({ length: Math.ceil(canvas.width / fs) }, () => Math.random() * -60);
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || now - last < 55) return; // ~18 fps is plenty for a backdrop
    last = now;
    // fade old glyphs to transparent so the page background stays visible
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.font = `${fs}px "JetBrains Mono", monospace`;
    cols.forEach((y, i) => {
      const ch = chars[(Math.random() * chars.length) | 0];
      ctx.fillStyle = Math.random() < .04 ? "rgba(61,245,166,.4)" : "rgba(34,211,238,.14)";
      ctx.fillText(ch, i * fs, y * fs);
      cols[i] = y * fs > canvas.height && Math.random() > .975 ? 0 : y + 1;
    });
  }
  window.addEventListener("resize", resize);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  resize();
  requestAnimationFrame(frame);
})();

/* ============ NETWORK MAP (skills) ============ */
const radar = (function () {
  const canvas = $("#radar");
  const ctx = canvas.getContext("2d");
  const TAU = Math.PI * 2, n = SKILLS.length;
  let size = 0, selected = 0, hover = -1, running = true, last = 0, pulse = 0;
  const packets = Array.from({ length: 16 }, (_, k) => ({ link: k % n, p: Math.random(), speed: .25 + Math.random() * .35, out: k % 2 === 0 }));
  const angleOf = (i) => -Math.PI / 2 + (i * TAU) / n;
  const pos = (i) => {
    if (i < 0) return [size / 2, size / 2];
    const r = size * .31, a = angleOf(i);
    return [size / 2 + Math.cos(a) * r, size / 2 + Math.sin(a) * r];
  };

  function hex(x, y, r) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (k * TAU) / 6;
      k ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }
  function line(a, b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = canvas.clientWidth;
    canvas.width = canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  }

  function draw(dt) {
    const C = pos(-1);
    ctx.clearRect(0, 0, size, size);

    // perimeter rings
    ctx.strokeStyle = "rgba(34,211,238,.10)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    [.2, .33, .46].forEach((k) => { ctx.beginPath(); ctx.arc(C[0], C[1], size * k, 0, TAU); ctx.stroke(); });

    // mesh between neighbours
    ctx.strokeStyle = "rgba(125,139,163,.22)";
    for (let i = 0; i < n; i++) line(pos(i), pos((i + 1) % n));
    ctx.setLineDash([]);

    // uplinks from the core
    for (let i = 0; i < n; i++) {
      const sel = i === selected;
      ctx.strokeStyle = sel ? "rgba(61,245,166,.9)" : "rgba(34,211,238,.28)";
      ctx.lineWidth = sel ? 1.8 : 1;
      if (sel) { ctx.shadowColor = "#3DF5A6"; ctx.shadowBlur = 10; }
      line(C, pos(i));
      ctx.shadowBlur = 0;
    }

    // data packets
    packets.forEach((pk) => {
      pk.p += pk.speed * dt;
      if (pk.p > 1) { pk.p = 0; pk.link = (Math.random() * n) | 0; pk.out = Math.random() < .5; }
      const [x2, y2] = pos(pk.link), t = pk.out ? pk.p : 1 - pk.p;
      const x = C[0] + (x2 - C[0]) * t, y = C[1] + (y2 - C[1]) * t;
      const sel = pk.link === selected;
      ctx.fillStyle = sel ? "#3DF5A6" : "rgba(34,211,238,.85)";
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.shadowBlur = 0;
    });

    // core node
    pulse = (pulse + dt * .6) % 1;
    ctx.strokeStyle = `rgba(34,211,238,${.5 * (1 - pulse)})`;
    hex(C[0], C[1], 30 + pulse * 26); ctx.stroke();
    ctx.fillStyle = "#0B1322"; ctx.strokeStyle = "#22D3EE"; ctx.lineWidth = 2;
    hex(C[0], C[1], 30); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 16px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("CB", C[0], C[1] + 1);

    // skill nodes
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i), a = angleOf(i);
      const sel = i === selected, hov = i === hover;
      ctx.fillStyle = sel ? "rgba(61,245,166,.16)" : "#0B1322";
      ctx.strokeStyle = sel ? "#3DF5A6" : hov ? "#E6EDF7" : "#22D3EE";
      ctx.lineWidth = sel ? 2 : 1.4;
      if (sel) { ctx.shadowColor = "#3DF5A6"; ctx.shadowBlur = 18; }
      hex(x, y, sel ? 21 : 17); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = sel ? "#3DF5A6" : "#22D3EE";
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1).padStart(2, "0"), x, y + 1);

      // label pushed outward from the core
      const ox = Math.cos(a), oy = Math.sin(a);
      ctx.textAlign = ox > .3 ? "left" : ox < -.3 ? "right" : "center";
      const k = Math.min(1, Math.max(.78, size / 500)); // shrink labels on small screens
      const lx = x + ox * 30 * k, ly = y + oy * 34 * k;
      ctx.fillStyle = sel ? "#FFFFFF" : "rgba(230,237,247,.8)";
      ctx.font = `600 ${Math.round(13 * k)}px 'JetBrains Mono', monospace`;
      ctx.fillText(SKILLS[i].short, lx, ly - 7);
      ctx.fillStyle = "rgba(125,139,163,.9)";
      ctx.font = `400 ${Math.round(10 * k)}px 'JetBrains Mono', monospace`;
      ctx.fillText(`10.0.0.${(i + 1) * 10}`, lx, ly + 8);
    }
  }

  function loop(now) {
    const dt = last ? Math.min(now - last, 64) / 1000 : 0;
    last = now;
    if (running) draw(dt);
    requestAnimationFrame(loop);
  }

  function hit(ev) {
    const r = canvas.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * size, py = ((ev.clientY - r.top) / r.height) * size;
    let best = -1, bestD = 32;
    for (let i = 0; i < n; i++) { const [x, y] = pos(i); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } }
    return best;
  }

  canvas.addEventListener("click", (e) => { const i = hit(e); if (i >= 0) select(i); });
  canvas.addEventListener("mousemove", (e) => { hover = hit(e); canvas.style.cursor = hover >= 0 ? "pointer" : "default"; if (reduceMotion) draw(0); });
  canvas.addEventListener("mouseleave", () => { hover = -1; if (reduceMotion) draw(0); });
  window.addEventListener("resize", resize);
  // stop animating when the map is off-screen
  new IntersectionObserver(([e]) => { running = e.isIntersecting && !reduceMotion; }).observe(canvas);
  if (document.fonts) document.fonts.ready.then(() => draw(0));

  function setSelected(i) { selected = i; draw(0); }
  resize();
  if (!reduceMotion) requestAnimationFrame(loop);
  return { setSelected };
})();

/* ============ READOUT + LEGEND ============ */
const legend = $("#legend");
SKILLS.forEach((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = s.name;
  b.addEventListener("click", () => select(i));
  legend.appendChild(b);
});

function select(i) {
  const s = SKILLS[i];
  $("#readout-coord").textContent = `[+] nœud ${String(i + 1).padStart(2, "0")} · 10.0.0.${(i + 1) * 10} · ${s.tools.length} outils`;
  $("#readout-title").textContent = s.name;
  $("#readout-desc").textContent = s.desc;
  $("#readout-tools").innerHTML = s.tools.map((t) => `<li>${esc(t)}</li>`).join("");
  [...legend.children].forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
  const r = $("#readout");
  r.classList.remove("flash"); void r.offsetWidth; r.classList.add("flash");
  radar.setSelected(i);
}
select(0);

/* ============ PROJECTS (tabs) ============ */
const tabs = $("#project-tabs"), panel = $("#project-panel");
let scanTimer = null;
PROJECTS.forEach((p, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("role", "tab");
  b.id = `tab-${p.id}`;
  b.setAttribute("aria-controls", "project-panel");
  b.innerHTML = `<strong>${esc(p.title)}</strong><span>${esc(p.sub)}</span>`;
  b.addEventListener("click", () => openProject(i));
  b.addEventListener("keydown", (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (i + k + PROJECTS.length) % PROJECTS.length;
    openProject(n); tabs.children[n].focus();
  });
  tabs.appendChild(b);
});

function openProject(i) {
  const p = PROJECTS[i];
  clearInterval(scanTimer);
  [...tabs.children].forEach((b, j) => { b.setAttribute("aria-selected", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
  panel.setAttribute("aria-labelledby", `tab-${p.id}`);
  panel.innerHTML = `<p class="meta">${esc(p.meta)}</p><h3>${esc(p.title)}</h3>${p.body}`;
  panel.classList.remove("enter"); void panel.offsetWidth; panel.classList.add("enter");
  const run = $("#scan-run");
  if (run) run.addEventListener("click", runScanDemo);
}
openProject(0);

function runScanDemo() {
  const out = $("#scan-demo");
  const lines = [
    "$ python3 scanner.py 192.168.56.101 -p 1-1024 -t 100",
    "[*] Cible : 192.168.56.101 (lab VirtualBox)",
    "[*] 1024 ports, 100 threads",
    "[+] 22/tcp   ouvert   ssh",
    "[+] 80/tcp   ouvert   http",
    "[+] 443/tcp  ouvert   https",
    "[+] 3306/tcp ouvert   mysql",
    "[*] Scan terminé en 2.31 s",
    "[*] Rapport écrit : rapport_192.168.56.101.json",
  ];
  clearInterval(scanTimer);
  out.textContent = "";
  let n = 0;
  scanTimer = setInterval(() => {
    out.textContent += lines[n++] + "\n";
    if (n >= lines.length) clearInterval(scanTimer);
  }, reduceMotion ? 0 : 260);
}

/* ============ TERMINAL ============ */
const termOut = $("#term-out"), termIn = $("#term-input"), termForm = $("#term-form");
const cmdHistory = [];
let hIdx = 0;

const CMDS = {
  help: () => `Commandes disponibles :
  <span class="hl">whoami</span>        qui je suis
  <span class="hl">dispo</span>         ce que je recherche et quand
  <span class="hl">competences</span>   mes domaines techniques
  <span class="hl">parcours</span>      expériences et formation
  <span class="hl">projets</span>       projets et CTF
  <span class="hl">contact</span>       me joindre
  <span class="hl">cv</span>            télécharger mon CV
  <span class="hl">nmap clement</span>  scanner le candidat
  <span class="hl">clear</span>         effacer l'écran
Astuce : <span class="ice">Tab</span> complète, <span class="ice">↑ ↓</span> parcourt l'historique.`,
  whoami: () => `<span class="hl">Clément Berton</span>, étudiant en 2e année de Bachelor Ingénierie & Cybersécurité à l'EFREI.
Passionné par la sécurité informatique, les réseaux et l'automatisation.
Basé à Sèvres (92). Saxophoniste depuis 10 ans.`,
  dispo: () => `<span class="ok">● disponible</span>
Stage      : 6 semaines à temps plein, du 7 juin au 16 juillet 2027
Alternance : analyste cybersécurité junior, dès septembre 2027
Rythme     : 2 semaines en entreprise / 1 semaine à l'école`,
  competences: () => SKILLS.map((s) => `<span class="hl">${esc(s.name.padEnd(24))}</span>${esc(s.tools.slice(0, 6).join(", "))}`).join("\n"),
  parcours: () => `<span class="ice">2026</span>  Stage cybersécurité & réseaux · SPIE ICS (2 mois)
<span class="ice">2026</span>  CTF CyberNight · 4/5 challenges
<span class="ice">2025</span>  Bachelor Ingénierie & Cybersécurité · EFREI (en cours)
<span class="ice">2025</span>  Bac STI2D · La Salle Saint-Nicolas
<span class="ice">2024</span>  Hackathon robot NAO · ISEP & Aldebaran
<span class="ice">2023</span>  Stage développeur · Cisco France`,
  projets: () => PROJECTS.map((p) => `<span class="hl">${esc(p.title.padEnd(26))}</span>${esc(p.sub)}`).join("\n") + `\n\nDétails dans la section <a href="#projets">Projets</a>.`,
  contact: () => `email    <a href="mailto:clement.berton@efrei.net">clement.berton@efrei.net</a>
linkedin <a href="https://www.linkedin.com/in/clement-berton92/" target="_blank" rel="noopener">linkedin.com/in/clement-berton92</a>
github   <a href="https://github.com/Unkown-007" target="_blank" rel="noopener">github.com/Unkown-007</a>`,
  cv: () => { const a = document.createElement("a"); a.href = "assets/CV_Clement_Berton.pdf"; a.download = ""; a.click(); return `<span class="ok">Téléchargement de CV_Clement_Berton.pdf lancé.</span>`; },
  github: () => { window.open("https://github.com/Unkown-007", "_blank", "noopener"); return "Ouverture de github.com/Unkown-007…"; },
  linkedin: () => { window.open("https://www.linkedin.com/in/clement-berton92/", "_blank", "noopener"); return "Ouverture de LinkedIn…"; },
  nmap: (args) => args[0] !== "clement" ? `Usage : nmap clement` :
`Starting Nmap scan on clement.berton (EFREI)
PORT      STATE  SERVICE
22/tcp    <span class="ok">open</span>   linux-admin
80/tcp    <span class="ok">open</span>   web-security (sqli, owasp)
443/tcp   <span class="ok">open</span>   cryptographie
1337/tcp  <span class="ok">open</span>   ctf-player
3306/tcp  <span class="ok">open</span>   sql
8080/tcp  <span class="ok">open</span>   python / c / c++
9000/tcp  <span class="hl">filtered</span> alternance (en attente de votre offre)
Service Info: OS: Kali Linux, Windows; motivation: élevée
Nmap done: 1 candidat scanné, 0 vulnérabilité critique`,
  ls: () => `cv.pdf  flag.txt  projets/  write-ups/`,
  cat: (args) => args[0] === "flag.txt" ? `<span class="ok">BERTON{m3rc1_d3_v0tr3_v1s1t3}</span>\nBravo, vous avez trouvé le flag. Prochaine étape : <a href="#contact">me contacter</a>.`
    : args[0] === "cv.pdf" ? `Fichier binaire. Essayez plutôt la commande <span class="hl">cv</span>.`
    : `cat: ${esc(args[0] || "")}: aucun fichier de ce type`,
  sudo: (args) => args.join(" ") === "hire clement"
    ? `[sudo] autorisation accordée.\n<span class="ok">Excellente décision.</span> Redirection vers le formulaire de contact…`
    : `visiteur n'est pas dans le fichier sudoers. Cet incident sera signalé.\n(indice : <span class="hl">sudo hire clement</span>)`,
  date: () => new Date().toLocaleString("fr-FR"),
  echo: (args) => esc(args.join(" ")),
  history: () => cmdHistory.map((h, i) => `${String(i + 1).padStart(3)}  ${esc(h)}`).join("\n") || "(vide)",
  exit: () => `Il n'y a pas d'issue. Sauf <a href="#contact">celle-ci</a>.`,
};

function print(cmd, html) {
  const c = document.createElement("div");
  c.className = "cmd";
  c.innerHTML = `<b>visiteur@berton-sec:~$</b> `;
  c.append(cmd); // user text, never parsed as HTML
  termOut.append(c);
  if (html) {
    const r = document.createElement("div");
    r.className = "res";
    r.innerHTML = html;
    termOut.append(r);
  }
  termOut.scrollTop = termOut.scrollHeight;
}

function run(raw) {
  const line = raw.trim();
  if (!line) { print("", ""); return; }
  cmdHistory.push(line); hIdx = cmdHistory.length;
  const [name, ...args] = line.split(/\s+/);
  const key = name.toLowerCase();
  if (key === "clear") { termOut.innerHTML = ""; return; }
  const fn = CMDS[key];
  print(line, fn ? fn(args) : `<span class="err">commande introuvable : ${esc(name)}</span>. Tapez <span class="hl">help</span>.`);
  if (key === "sudo" && args.join(" ") === "hire clement") setTimeout(() => $("#contact").scrollIntoView(), 1200);
}

termForm.addEventListener("submit", (e) => { e.preventDefault(); run(termIn.value); termIn.value = ""; });
termIn.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && cmdHistory.length) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); termIn.value = cmdHistory[hIdx]; }
  else if (e.key === "ArrowDown") { e.preventDefault(); hIdx = Math.min(cmdHistory.length, hIdx + 1); termIn.value = cmdHistory[hIdx] || ""; }
  else if (e.key === "Tab" && termIn.value) {
    const m = Object.keys(CMDS).concat("clear").filter((k) => k.startsWith(termIn.value.toLowerCase()));
    if (m.length === 1) { e.preventDefault(); termIn.value = m[0] + " "; }
    else if (m.length > 1) { e.preventDefault(); print(termIn.value, m.join("  ")); }
  }
});
$("#term").addEventListener("click", (e) => { if (!e.target.closest("a,button") && !window.getSelection().toString()) termIn.focus({ preventScroll: true }); });

const suggest = $("#term-suggest");
["help", "whoami", "dispo", "nmap clement", "projets", "cat flag.txt"].forEach((c) => {
  const b = document.createElement("button");
  b.type = "button"; b.textContent = c;
  b.addEventListener("click", () => run(c));
  suggest.appendChild(b);
});
termOut.innerHTML = `<div class="res">Bienvenue sur le terminal de <span class="hl">Clément Berton</span>.
Tapez <span class="hl">help</span> ou cliquez sur une commande ci-dessous.</div>`;

/* ============ PHONE REVEAL (keeps the number out of plain HTML for scrapers) ============ */
$("#phone").addEventListener("click", function () {
  if (this.classList.contains("done")) return;
  const num = atob(this.dataset.p);
  const glyphs = "0123456789#*";
  let step = 0;
  const steps = reduceMotion ? 1 : 14;
  const t = setInterval(() => {
    step++;
    const solved = Math.floor((step / steps) * num.length);
    this.textContent = [...num].map((ch, i) => i < solved || ch === " " ? ch : glyphs[(Math.random() * glyphs.length) | 0]).join("");
    if (step >= steps) {
      clearInterval(t);
      const a = document.createElement("a");
      a.href = "tel:" + num.replace(/\s/g, "");
      a.textContent = num;
      this.replaceWith(a);
    }
  }, 45);
});

/* ============ SCROLL SPY ============ */
const navLinks = [...document.querySelectorAll(".nav ul a")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
["competences", "parcours", "projets", "console", "contact"].forEach((id) => spy.observe(document.getElementById(id)));
