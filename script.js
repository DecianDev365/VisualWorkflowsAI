let sharedText = "";

function tokenize(text) {
  return text.match(/[\w']+|[.,!?]/g) || [];
}

function generateId() {
  return Math.floor(Math.random() * 49901) + 100;
}

function generateEmbedding() {
  const length = Math.floor(Math.random() * 3) + 4;
  const values = [];
  for (let i = 0; i < length; i++) {
    values.push((Math.random() * 2 - 1).toFixed(2));
  }
  return values;
}

function renderTokens(tokens) {
  const tokenOutput = document.getElementById("token-output");
  tokenOutput.innerHTML = "";

  tokens.forEach((token, i) => {
    const chip = document.createElement("div");
    chip.className = "token-chip";
    chip.style.animationDelay = `${i * 0.06}s`;

    const vec = generateEmbedding();
    const vecStr = `[${vec.join(", ")}]`;

    chip.innerHTML = `
      <span class="token-text">${token}</span>
      <div class="token-meta">
        <span class="token-id">ID: ${generateId()}</span>
        <span class="token-vec" title="Vec: ${vecStr}">Vec: ${vecStr}</span>
      </div>
    `;
    tokenOutput.appendChild(chip);
  });
}

function showPlaceholder() {
  const tokenOutput = document.getElementById("token-output");
  tokenOutput.innerHTML = '<p class="token-placeholder">Enter text above to begin</p>';
}

function runButtonAnimation(btn) {
  btn.textContent = "Done";
  btn.style.pointerEvents = "none";
  btn.style.background = "#27AE60";
  btn.style.borderColor = "#27AE60";
  btn.style.color = "#FFFFFF";
  btn.style.boxShadow = "0 2px 8px rgba(39, 174, 96, 0.25)";

  setTimeout(() => {
    btn.textContent = "Run";
    btn.style.pointerEvents = "auto";
    btn.style.background = "";
    btn.style.borderColor = "";
    btn.style.color = "";
    btn.style.boxShadow = "";
  }, 1200);
}

function displayUserText(text) {
  const display = document.getElementById("user-text-display");
  display.style.display = "block";
  display.innerHTML = `
    <div class="user-label">Input</div>
    <div class="user-text">${text}</div>
  `;
}

function processSharedInput(btn) {
  if (!sharedText.trim()) {
    showPlaceholder();
    showAttentionPlaceholder();
    document.getElementById("user-text-display").style.display = "none";
    if (btn) runButtonAnimation(btn);
    return;
  }

  if (btn) runButtonAnimation(btn);
  displayUserText(sharedText);
  const tokens = tokenize(sharedText);
  renderTokens(tokens);
  renderAttention(tokens);
}

/* ---------- Attention Visualization ---------- */

function getAttentionScores(tokens) {
  const wordCounts = {};
  tokens.forEach((t) => {
    const lower = t.toLowerCase();
    wordCounts[lower] = (wordCounts[lower] || 0) + 1;
  });

  let raw = tokens.map((t) => {
    const lower = t.toLowerCase();
    let score = 0.2 + Math.random() * 0.6;

    if (t.length > 4) score += 0.15;
    if (wordCounts[lower] > 1) score += 0.1 * (wordCounts[lower] - 1);
    if (t.length <= 3 && /^[a-z]+$/i.test(t)) score -= 0.15;

    return Math.max(0.05, score);
  });

  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map((r) => r / total);
}

function scoreToColor(score, maxScore) {
  const ratio = score / maxScore;
  const colors = [
    { r: 255, g: 243, b: 163 },
    { r: 255, g: 216, b: 77 },
    { r: 255, g: 106, b: 0 },
    { r: 139, g: 0, b: 0 },
  ];

  const segment = ratio * (colors.length - 1);
  const idx = Math.min(Math.floor(segment), colors.length - 2);
  const t = segment - idx;

  const c1 = colors[idx];
  const c2 = colors[idx + 1];

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function showAttentionPlaceholder() {
  const output = document.getElementById("attention-output");
  output.innerHTML = '<p class="attention-placeholder">Enter text above to visualize attention</p>';
}

function renderAttention(tokens) {
  const output = document.getElementById("attention-output");
  output.innerHTML = "";

  const scores = getAttentionScores(tokens);
  const maxScore = Math.max(...scores);

  tokens.forEach((token, i) => {
    const block = document.createElement("div");
    block.className = "attention-block";
    block.style.animationDelay = `${i * 0.05}s`;
    block.style.background = scoreToColor(scores[i], maxScore);

    const pct = Math.round(scores[i] * 100);

    block.innerHTML = `
      <span class="att-word">${token}</span>
      <span class="att-score">Attention: ${pct}%</span>
    `;
    output.appendChild(block);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".feature-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          entry.target.style.transitionDelay = `${delay * 0.12}s`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card) => observer.observe(card));

  document.querySelectorAll('[data-scroll-target]').forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const target = document.getElementById(card.dataset.scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const globalInput = document.getElementById("global-input");
  const globalRunBtn = document.getElementById("global-run-btn");

  globalRunBtn.addEventListener("click", () => {
    sharedText = globalInput.value;
    processSharedInput(globalRunBtn);
  });

  globalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sharedText = globalInput.value;
      processSharedInput(globalRunBtn);
    }
  });
});
