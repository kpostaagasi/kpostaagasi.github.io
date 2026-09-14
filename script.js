const lang = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "tr";

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const setMeta = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.content = value;
};

fetch(`content-${lang}.json`)
  .then((r) => r.json())
  .then((data) => {
    document.documentElement.lang = lang;
    document.title = data.meta.title;
    setMeta('meta[name="description"]', data.meta.description);
    setMeta('meta[property="og:description"]', data.meta.description);
    setMeta('meta[name="twitter:description"]', data.meta.description);

    document.getElementById("name").textContent = data.name;
    document.querySelector(".masthead-nav").setAttribute("aria-label", data.meta.navLabel);

    for (const a of document.querySelectorAll("#lang a")) {
      if (a.getAttribute("hreflang") === lang) a.setAttribute("aria-current", "true");
    }

    const links = document.getElementById("links");
    for (const link of data.links) {
      const a = el("a", null, link.label);
      a.href = link.href;
      const li = el("li");
      li.append(a);
      links.append(li);
    }

    document.getElementById("intro").textContent = `${data.intro} `;

    const more = document.getElementById("more");
    const bio = document.getElementById("bio");
    if (data.bio && data.bio.length) {
      bio.append(...data.bio.map((p) => el("p", null, p)));
      more.textContent = data.meta.moreLabel;
      more.addEventListener("click", () => {
        const opening = bio.hidden;
        bio.hidden = !opening;
        more.setAttribute("aria-expanded", String(opening));
        more.textContent = opening ? data.meta.lessLabel : data.meta.moreLabel;
      });
    } else {
      more.remove();
    }

    const root = document.getElementById("sections");
    for (const section of data.sections) {
      if (!section.items || !section.items.length) continue;

      const sec = el("section");
      sec.id = section.id;
      const heading = el("h2", null, section.heading);
      heading.id = `heading-${section.id}`;
      sec.setAttribute("aria-labelledby", heading.id);
      sec.append(heading);

      const list = el("ul");
      for (const item of section.items) {
        const row = el("li", "row");
        const main = el("div", "row-main");

        const title = item.href ? el("a", "row-title", item.title) : el("span", "row-title", item.title);
        if (item.href) title.href = item.href;
        main.append(title);

        if (item.subtitle) main.append(el("span", "row-sub", item.subtitle));
        row.append(main);

        if (item.date) row.append(el("span", "row-date", item.date));
        list.append(row);
      }

      sec.append(list);
      root.append(sec);
    }
  })
  .catch(() => {
    document.getElementById("intro").textContent =
      "İçerik yüklenemedi. Sayfayı bir HTTP sunucusu üzerinden açın (python3 -m http.server). / Content failed to load; serve this page over HTTP.";
    document.getElementById("more").remove();
  });
