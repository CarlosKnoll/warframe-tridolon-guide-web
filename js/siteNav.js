// siteNav.js — renders the two-tier site nav (category switcher + branch
// sub-nav) into a single mount point, so nav markup/copy lives in exactly
// one file instead of being hand-copied into every page.
//
// Usage: <div id="site-nav" data-branch="eidolons" data-page="inicio" data-base=""></div>
// then call initSiteNav() from main.js. No other markup changes needed.
//
// data-branch: which branch is active ("eidolons" | "orb-mothers")
// data-page:   which page within that branch is active (see BRANCHES below)
// data-base:   relative path prefix from the current page back to the site
//              root ("" at root, "../" one level down, "../../" two, ...)

const BRANCHES = {
  eidolons: {
    label: "Guia de Eidolons",
    switcherLabel: "Eidolons",
    pages: [
      { key: "inicio", label: "Início", path: "index.html" },
      { key: "como-funciona", label: "Como funciona?", path: "eidolons/como-funciona.html" },
      { key: "equipamentos", label: "Equipamentos", path: "eidolons/equipamentos.html" },
      { key: "modo-iniciante", label: "Modo Iniciante", path: "eidolons/modo-iniciante.html" },
      { key: "demonstracoes", label: "Demonstrações", path: "eidolons/demonstracoes.html" },
    ],
  },
  "profit-taker": {
    label: "Guia da Beneficiária",
    switcherLabel: "Beneficiária",
    pages: [
      { key: "inicio", label: "Início", path: "profit-taker/index.html" },
      { key: "como-funciona", label: "Como funciona?", path: "profit-taker/paginas/como-funciona.html" },
      { key: "equipamentos", label: "Equipamentos", path: "profit-taker/paginas/equipamentos.html" },
      { key: "modo-iniciante", label: "Modo Iniciante", path: "profit-taker/paginas/modo-iniciante.html" },
      { key: "demonstracoes", label: "Demonstrações", path: "profit-taker/paginas/demonstracoes.html" },
    ],
  },
  // "exploiter-orb": {
  //   label: "Guia da Usurpadora",
  //   switcherLabel: "Usurpadora",
  //   pages: [
  //     { key: "inicio", label: "Início", path: "exploiter-orb/index.html" },
  //     { key: "como-funciona", label: "Como funciona?", path: "exploiter-orb/paginas/como-funciona.html" },
  //     { key: "equipamentos", label: "Equipamentos", path: "exploiter-orb/paginas/equipamentos.html" },
  //     { key: "modo-iniciante", label: "Modo Iniciante", path: "exploiter-orb/paginas/modo-iniciante.html" },
  //     { key: "demonstracoes", label: "Demonstrações", path: "exploiter-orb/paginas/demonstracoes.html" },
  //   ],
  // },
};

export function initSiteNav(selector = "#site-nav") {
  const mount = document.querySelector(selector);
  if (!mount) return;

  const activeBranchKey = mount.dataset.branch;
  const activePageKey = mount.dataset.page;
  const base = mount.dataset.base ?? "";

  const activeBranch = BRANCHES[activeBranchKey];
  if (!activeBranch) return;

  const header = document.createElement("header");
  header.className = "site-header";

  // --- Category switcher (Eidolons / Orb-Mothers) ---
  const switcher = document.createElement("nav");
  switcher.className = "category-nav";
  switcher.setAttribute("aria-label", "Escolher categoria");

  const switcherList = document.createElement("ul");
  switcherList.className = "category-nav__list";

  Object.entries(BRANCHES).forEach(([key, branch]) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "category-nav__link";
    a.href = base + branch.pages[0].path;
    a.textContent = branch.switcherLabel;
    if (key === activeBranchKey) a.setAttribute("aria-current", "true");
    li.appendChild(a);
    switcherList.appendChild(li);
  });

  switcher.appendChild(switcherList);
  header.appendChild(switcher);

  // --- Branch sub-nav (Início / Como funciona? / ...) ---
  const nav = document.createElement("nav");
  nav.className = "site-nav";

  const brand = document.createElement("a");
  brand.className = "site-nav__brand";
  brand.href = base + activeBranch.pages[0].path;
  brand.textContent = activeBranch.label;
  nav.appendChild(brand);

  const list = document.createElement("ul");
  list.className = "site-nav__links";

  activeBranch.pages.forEach((page) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = base + page.path;
    a.textContent = page.label;
    if (page.key === activePageKey) a.setAttribute("aria-current", "page");
    li.appendChild(a);
    list.appendChild(li);
  });

  nav.appendChild(list);
  header.appendChild(nav);

  mount.replaceWith(header);
}