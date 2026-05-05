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
    document.getElementById("user-text-display").style.display = "none";
    if (btn) runButtonAnimation(btn);
    return;
  }

  if (btn) runButtonAnimation(btn);
  displayUserText(sharedText);
  const tokens = tokenize(sharedText);
  renderTokens(tokens);
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
