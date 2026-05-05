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

  const tokenInput = document.getElementById("token-input");
  const tokenizeBtn = document.getElementById("tokenize-btn");
  const tokenOutput = document.getElementById("token-output");

  function tokenize(text) {
    return text.match(/[\w']+|[.,!?]/g) || [];
  }

  function generateId() {
    return Math.floor(Math.random() * 49901) + 100;
  }

  function renderTokens(tokens) {
    tokenOutput.innerHTML = "";
    tokens.forEach((token, i) => {
      const chip = document.createElement("div");
      chip.className = "token-chip";
      chip.style.animationDelay = `${i * 0.06}s`;
      chip.innerHTML = `
        <span class="token-text">${token}</span>
        <span class="token-id">${generateId()}</span>
      `;
      tokenOutput.appendChild(chip);
    });
  }

  tokenizeBtn.addEventListener("click", () => {
    const text = tokenInput.value.trim();
    if (!text) return;
    const tokens = tokenize(text);
    renderTokens(tokens);
  });

  tokenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      tokenizeBtn.click();
    }
  });
});
