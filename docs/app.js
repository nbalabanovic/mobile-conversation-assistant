/* Step engine for the EE mobile flow.
   Adds to the base engine: a call context (provider card, segment) captured by
   option clicks, a battle-card node that renders from that context, and panels
   that render lists, PIC tables or objection pairs. */

(function () {
  const view = document.getElementById("view");
  const rail = document.getElementById("stageRail");
  const backBtn = document.getElementById("backBtn");
  const restartBtn = document.getElementById("restartBtn");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayBody = document.getElementById("overlayBody");
  const overlayClose = document.getElementById("overlayClose");
  const ctxBar = document.getElementById("ctxBar");

  const STORE_KEY = "ee-call-assistant-state";
  const BLANK = { nodeId: "start", history: [], ctx: { card: null, segment: null } };

  let state = load() || clone(BLANK);
  if (!DATA.tree[state.nodeId]) state = clone(BLANK);
  if (!state.ctx) state.ctx = { card: null, segment: null };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)); }
    catch { return null; }
  }

  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function go(nodeId, set) {
    state.history.push({ nodeId: state.nodeId, ctx: clone(state.ctx) });
    if (set) Object.assign(state.ctx, set);
    state.nodeId = nodeId;
    save();
    render();
  }

  function back() {
    const prev = state.history.pop();
    if (!prev) return;
    state.nodeId = prev.nodeId;
    state.ctx = prev.ctx;
    save();
    render();
  }

  function restart() {
    state = clone(BLANK);
    save();
    render();
  }

  /* ---------- helpers ---------- */

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  const SEGMENT_LABEL = { sme: "SME", corporate: "Corporate", unknown: "Segment TBC" };

  function renderCtxBar() {
    ctxBar.innerHTML = "";
    const card = state.ctx.card ? DATA.cards[state.ctx.card] : null;
    if (card && state.ctx.card !== "unknown") {
      ctxBar.appendChild(el("span", "ctx-chip", card.name));
    }
    if (state.ctx.segment) {
      ctxBar.appendChild(el("span", "ctx-chip subtle", SEGMENT_LABEL[state.ctx.segment]));
    }
  }

  function renderRail(stageIndex) {
    rail.innerHTML = "";
    DATA.stages.forEach((name, i) => {
      const step = el("div", "rail-step", name);
      if (i < stageIndex) step.classList.add("done");
      if (i === stageIndex) step.classList.add("current");
      rail.appendChild(step);
    });
  }

  function sayCard(label, text, eyebrow) {
    const card = el("div", "say-card");
    if (eyebrow) card.appendChild(el("div", "eyebrow", eyebrow));
    if (label) card.appendChild(el("div", "variant-label", label));
    card.appendChild(el("p", "say-text", text));
    return card;
  }

  function renderOptions(container, options, label) {
    const wrap = el("div", "options");
    wrap.appendChild(el("div", "options-label", label || "Next"));
    options.forEach((opt, i) => {
      const btn = el("button", "option-btn" + (opt.primary ? " primary" : ""));
      const main = el("span", "option-main");
      main.appendChild(el("span", "key-hint", String(i + 1)));
      main.appendChild(el("span", null, opt.label));
      btn.appendChild(main);
      btn.appendChild(el("span", "arrow", "→"));
      btn.addEventListener("click", () => go(opt.to, opt.set));
      wrap.appendChild(btn);
    });
    container.appendChild(wrap);
  }

  function tipCard(text) {
    const tip = el("div", "tip-card");
    tip.appendChild(el("span", null, text));
    return tip;
  }

  /* ---------- node renderers ---------- */

  function renderProbe(node) {
    const head = el("div", "probe-head");
    head.appendChild(el("span", "step-num", node.step));
    head.appendChild(el("h1", "step-title", node.title));
    view.appendChild(head);

    view.appendChild(sayCard(null, node.ask, "Ask"));
    if (node.why) view.appendChild(el("p", "angle", node.why));
    if (node.tip) view.appendChild(tipCard(node.tip));

    renderOptions(view, node.options, node.optionsLabel);
  }

  function renderScript(node) {
    view.appendChild(el("h1", "step-title", node.title));

    const cards = el("div", "cards");
    let lines = node.say;
    if (node.segmentSay) {
      const seg = state.ctx.segment || "unknown";
      lines = [node.segmentSay[seg] || node.segmentSay.unknown];
    }
    lines.forEach((variant, i) => {
      cards.appendChild(sayCard(lines.length > 1 ? variant.label : null, variant.text, i === 0 ? "Say" : null));
    });
    if (node.tip) cards.appendChild(tipCard(node.tip));
    view.appendChild(cards);

    renderOptions(view, node.options, node.optionsLabel);
  }

  function renderPain(node) {
    view.appendChild(el("h1", "step-title", node.title));

    const heard = el("div", "heard-card");
    heard.appendChild(el("div", "eyebrow", "They said"));
    heard.appendChild(el("p", "heard-text", "“" + node.heard + "”"));
    view.appendChild(heard);

    view.appendChild(sayCard(null, node.followUp, "Follow up with"));

    const pic = el("div", "pic-box");
    pic.appendChild(el("div", "pic-name", node.pic.name));
    [
      ["Problem", node.pic.problem],
      ["Root cause", node.pic.cause],
      ["Business impact", node.pic.impact]
    ].forEach(([k, v]) => {
      const row = el("div", "pic-row");
      row.appendChild(el("div", "pic-key", k));
      row.appendChild(el("div", "pic-val", v));
      pic.appendChild(row);
    });
    view.appendChild(pic);

    if (node.flag) {
      const flag = el("div", "flag-card");
      flag.appendChild(el("span", null, "★ " + node.flag));
      view.appendChild(flag);
    }

    const attack = el("div", "attack-card");
    attack.appendChild(el("div", "eyebrow good", "Then attack with"));
    attack.appendChild(el("p", "attack-text", node.attack));
    view.appendChild(attack);

    if (node.say) view.appendChild(sayCard(null, node.say, "Word for word"));

    renderOptions(view, [{ label: node.next.label, to: node.next.to, primary: true }], "When they've opened up");
  }

  function renderCard(node) {
    const card = DATA.cards[state.ctx.card] || DATA.cards.unknown;

    const head = el("div", "card-head");
    const titles = el("div");
    titles.appendChild(el("div", "card-eyebrow", "Battle card " + card.number));
    titles.appendChild(el("h1", "step-title", card.name));
    head.appendChild(titles);
    view.appendChild(head);

    const chips = el("div", "chip-row");
    const win = el("span", "chip win");
    win.appendChild(el("strong", null, "We win on "));
    win.appendChild(el("span", null, card.winOn));
    const lose = el("span", "chip lose");
    lose.appendChild(el("strong", null, "We lose on "));
    lose.appendChild(el("span", null, card.loseOn));
    chips.appendChild(win);
    chips.appendChild(lose);
    view.appendChild(chips);

    const know = el("div", "know-card");
    know.appendChild(el("div", "eyebrow", "Know your opponent"));
    know.appendChild(el("p", null, card.know));
    view.appendChild(know);

    const split = el("div", "split");

    const dontCol = el("div", "col dont");
    dontCol.appendChild(el("div", "col-head", "Don't discuss"));
    dontCol.appendChild(el("div", "col-sub", "Their strength, you won't win here"));
    card.dont.forEach((d) => {
      const item = el("div", "col-item");
      item.appendChild(el("div", "item-title", d.title));
      item.appendChild(el("p", "item-text", d.text));
      if (d.pivot) {
        const pivot = el("div", "pivot");
        pivot.appendChild(el("span", "pivot-label", "Pivot"));
        pivot.appendChild(el("span", null, d.pivot));
        item.appendChild(pivot);
      }
      dontCol.appendChild(item);
    });

    const doCol = el("div", "col do");
    doCol.appendChild(el("div", "col-head", "Do discuss"));
    doCol.appendChild(el("div", "col-sub", "Our ground, attack here"));
    card.do.forEach((d) => {
      const item = el("div", "col-item");
      item.appendChild(el("div", "item-title", d.title));
      item.appendChild(el("p", "item-text", d.text));
      doCol.appendChild(item);
    });

    split.appendChild(dontCol);
    split.appendChild(doCol);
    view.appendChild(split);

    const killer = el("div", "killer");
    killer.appendChild(el("div", "options-label", "Killer questions"));
    card.killer.forEach((q) => {
      const item = el("button", "q-item");
      item.appendChild(el("span", "q-mark"));
      item.appendChild(el("span", "q-text", q));
      item.addEventListener("click", () => item.classList.toggle("asked"));
      killer.appendChild(item);
    });
    view.appendChild(killer);

    renderOptions(view, [{ label: node.next.label, to: node.next.to, primary: true }], "When you've asked one");
  }

  function renderEnd(node) {
    const card = el("div", "end-card" + (node.tone === "success" ? " success" : ""));
    card.appendChild(el("h1", "end-title", node.title));
    card.appendChild(el("p", "end-text", node.text));
    const list = el("ul", "check-list");
    node.checklist.forEach((c) => list.appendChild(el("li", null, c)));
    card.appendChild(list);
    view.appendChild(card);

    renderOptions(view, [{ label: "Start the next call", to: "start", primary: node.tone === "success" }], "Wrap up");
  }

  const RENDERERS = {
    probe: renderProbe,
    script: renderScript,
    pain: renderPain,
    card: renderCard,
    end: renderEnd
  };

  function render() {
    const node = DATA.tree[state.nodeId];
    view.innerHTML = "";
    renderRail(node.stage);
    renderCtxBar();
    (RENDERERS[node.kind] || renderScript)(node);
    backBtn.disabled = state.history.length === 0;
    window.scrollTo(0, 0);
  }

  /* ---------- panels ---------- */

  function openPanel(key) {
    const panel = DATA.panels[key];
    overlayTitle.textContent = panel.title;
    overlayBody.innerHTML = "";

    if (panel.note) overlayBody.appendChild(tipCard(panel.note));

    panel.sections.forEach((section) => {
      const sec = el("div", "panel-section");
      sec.appendChild(el("h3", null, section.heading));

      if (section.rows) {
        const scroll = el("div", "table-scroll");
        const table = el("table", "pic-table");
        const thead = el("thead");
        const hrow = el("tr");
        ["Topic", "Problem", "Root cause", "Business impact"].forEach((h) => hrow.appendChild(el("th", null, h)));
        thead.appendChild(hrow);
        table.appendChild(thead);
        const tbody = el("tbody");
        section.rows.forEach((r) => {
          const tr = el("tr");
          tr.appendChild(el("td", "topic-cell", r.topic));
          tr.appendChild(el("td", null, r.problem));
          tr.appendChild(el("td", null, r.cause));
          tr.appendChild(el("td", null, r.impact));
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        scroll.appendChild(table);
        sec.appendChild(scroll);
      }

      if (section.pairs) {
        const list = el("div", "pair-list");
        section.pairs.forEach((p) => {
          const pair = el("div", "pair");
          pair.appendChild(el("div", "pair-q", "✗ " + p.q));
          pair.appendChild(el("div", "pair-a", p.a));
          list.appendChild(pair);
        });
        sec.appendChild(list);
      }

      if (section.items) {
        const ul = el("ul");
        section.items.forEach((item) => ul.appendChild(el("li", null, item)));
        sec.appendChild(ul);
      }

      overlayBody.appendChild(sec);
    });

    overlay.hidden = false;
    overlayBody.scrollTop = 0;
    overlayClose.focus();
  }

  function closePanel() {
    overlay.hidden = true;
  }

  document.querySelectorAll("[data-panel]").forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.dataset.panel));
  });

  overlayClose.addEventListener("click", closePanel);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePanel();
  });

  /* ---------- keyboard ---------- */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return closePanel();
    if (!overlay.hidden) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key >= "1" && e.key <= "9") {
      const buttons = view.querySelectorAll(".option-btn");
      const idx = Number(e.key) - 1;
      if (buttons[idx]) buttons[idx].click();
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      back();
    }
  });

  backBtn.addEventListener("click", back);
  restartBtn.addEventListener("click", restart);

  render();
})();
