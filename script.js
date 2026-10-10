(() => {
  "use strict";

  const TOTAL = 33;
  const STORAGE_KEY = "hiracollect-owned-v1";
  const products = [
    {
    id: 1,
    image: "images/pop_img01.webp"
    },
    {
    id: 2,
    image: "images/pop_img02.webp"
    },
    {
    id: 3,
    image: "images/pop_img03.webp"
    },
    {
    id: 4,
    image: "images/pop_img04.webp"
    },
    {
    id: 5,
    image: "images/pop_img05.webp"
    },
    {
    id: 6,
    image: "images/pop_img06.webp"
    },
    {
    id: 7,
    image: "images/pop_img07.webp"
    },
    {
    id: 8,
    image: "images/pop_img08.webp"
    },
    {
    id: 9,
    image: "images/pop_img09.webp"
    },
    {
    id: 10,
    image: "images/pop_img10.webp"
    },
    {
    id: 11,
    image: "images/pop_img11.webp"
    },
    {
    id: 12,
    image: "images/pop_img12.webp"
    },
    {
    id: 13,
    image: "images/pop_img13.webp"
    },
    {
    id: 14,
    image: "images/pop_img14.webp"
    },
    {
    id: 15,
    image: "images/pop_img15.webp"
    },
    {
    id: 16,
    image: "images/pop_img16.webp"
    },
    {
    id: 17,
    image: "images/pop_img17.webp"
    },
    {
    id: 18,
    image: "images/pop_img18.webp"
    },
    {
    id: 19,
    image: "images/pop_img19.webp"
    },
    {
    id: 20,
    image: "images/pop_img20.webp"
    },
    {
    id: 21,
    image: "images/pop_img21.webp"
    },
    {
    id: 22,
    image: "images/pop_img22.webp"
    },
    {
    id: 23,
    image: "images/pop_img23.webp"
    },
    {
    id: 24,
    image: "images/pop_img24.webp"
    },
    {
    id: 25,
    image: "images/pop_img25.webp"
    },
    {
    id: 26,
    image: "images/pop_img26.webp"
    },
    {
    id: 27,
    image: "images/pop_img27.webp"
    },
    {
    id: 28,
    image: "images/pop_img28.webp"
    },
    {
    id: 29,
    image: "images/pop_img29.webp"
    },
    {
    id: 30,
    image: "images/pop_img30.webp"
    },
    {
    id: 31,
    image: "images/pop_img31.webp"
    },
    {
    id: 32,
    image: "images/pop_img32.webp"
    },
    {
    id: 33,
    image: "images/pop_img33.webp"
    }
  ];


  const state = {
    owned: loadOwned(),
    filter: "all",
    query: ""
  };

  const els = {
    ownedCount: document.getElementById("owned-count"),
    statOwned: document.getElementById("stat-owned"),
    statMissing: document.getElementById("stat-missing"),
    progressFill: document.getElementById("progress-fill"),
    progressBar: document.getElementById("progress-bar"),
    progressPercent: document.getElementById("progress-percent"),
    progressMessage: document.getElementById("progress-message"),
    filterAllCount: document.getElementById("filter-all-count"),
    filterMissingCount: document.getElementById("filter-missing-count"),
    filterOwnedCount: document.getElementById("filter-owned-count"),
    searchInput: document.getElementById("search-input"),
    clearSearch: document.getElementById("clear-search"),
    filterButtons: [...document.querySelectorAll("[data-filter]")],
    resultsLabel: document.getElementById("results-label"),
    productGrid: document.getElementById("product-grid"),
    emptyState: document.getElementById("empty-state"),
    resetButton: document.getElementById("reset-button"),
    resetDialog: document.getElementById("reset-dialog"),
    confirmReset: document.getElementById("confirm-reset")
  };

  function loadOwned() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return new Set();
      return new Set(saved.filter(id => Number.isInteger(id) && id >= 1 && id <= TOTAL));
    } catch {
      return new Set();
    }
  }

  function saveOwned() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.owned]));
    } catch {
      // The checklist still works for this page session if storage is unavailable.
    }
  }

  function getVisibleProducts() {
    const query = state.query.trim().toLocaleLowerCase();
    return products.filter(product => {
      const isOwned = state.owned.has(product.id);
      const matchesFilter =
        state.filter === "all" ||
        (state.filter === "owned" && isOwned) ||
        (state.filter === "missing" && !isOwned);
      const matchesQuery =
        !query ||
        product.name.toLocaleLowerCase().includes(query) ||
        String(product.id).padStart(2, "0").includes(query) ||
        String(product.id).includes(query);
      return matchesFilter && matchesQuery;
    });
  }

  function renderStats() {
    const owned = state.owned.size;
    const missing = TOTAL - owned;
    const percent = Math.round((owned / TOTAL) * 100);

    els.ownedCount.textContent = owned;
    els.statOwned.textContent = owned;
    els.statMissing.textContent = missing;
    els.progressFill.style.width = `${percent}%`;
    els.progressPercent.textContent = `${percent}%`;
    els.progressBar.setAttribute("aria-valuenow", String(owned));
    els.progressBar.setAttribute("aria-valuetext", `${owned}개 수집 완료, ${percent}% 달성`);
    els.progressMessage.textContent =
      owned === TOTAL ? "MISSION COMPLETE! 33종을 모두 모았어!" :
      owned === 0 ? "히어로 수집을 시작해 보자!" :
      missing === 1 ? "마지막 한 종류만 남았어. PLUS ULTRA!" :
      `${TOTAL - owned}종 더 모으면 컬렉션 완성!`;

    els.filterAllCount.textContent = TOTAL;
    els.filterMissingCount.textContent = missing;
    els.filterOwnedCount.textContent = owned;
  }

  function renderProducts() {
    const visible = getVisibleProducts();
    els.productGrid.replaceChildren();
    els.emptyState.hidden = visible.length !== 0;

    const filterLabels = { all: "전체 제품", missing: "미수집 제품", owned: "수집 완료 제품" };
    els.resultsLabel.textContent = `${filterLabels[state.filter]} ${visible.length}종`;
    els.clearSearch.hidden = !state.query;

    visible.forEach(product => {
      const isOwned = state.owned.has(product.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `product-card${isOwned ? " is-owned" : ""}`;
      button.setAttribute("aria-pressed", String(isOwned));
      button.setAttribute("aria-label", `${product.name}, ${isOwned ? "수집 완료" : "미수집"}. 눌러서 상태 변경`);
      button.innerHTML = `
  <div class="product-visual">
    <span class="product-number">
      NO.${String(product.id).padStart(2, "0")}
    </span>

    ${
      product.image
        ? `<img
             class="product-image"
             src="${product.image}"
             alt="제품 No.${String(product.id).padStart(2, "0")}"
             loading="lazy"
           >`
        : ""
    }

    <span class="owned-mark" aria-hidden="true">✓</span>

    <span class="status-label">
      ${isOwned ? "보유 중" : "미수집"}
    </span>
  </div>
`;
      button.addEventListener("click", () => {
        if (state.owned.has(product.id)) state.owned.delete(product.id);
        else state.owned.add(product.id);
        saveOwned();
        render();
      });
      els.productGrid.appendChild(button);
    });

    els.filterButtons.forEach(button => {
      const active = button.dataset.filter === state.filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function render() {
    renderStats();
    renderProducts();
  }

  els.filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      renderProducts();
    });
  });

  els.searchInput.addEventListener("input", event => {
    state.query = event.target.value;
    renderProducts();
  });

  els.clearSearch.addEventListener("click", () => {
    state.query = "";
    els.searchInput.value = "";
    renderProducts();
    els.searchInput.focus();
  });

  els.resetButton.addEventListener("click", () => {
    if (typeof els.resetDialog.showModal === "function") els.resetDialog.showModal();
    else if (window.confirm("수집 기록을 모두 초기화할까요?")) {
      state.owned.clear();
      saveOwned();
      render();
    }
  });

  els.confirmReset.addEventListener("click", event => {
    event.preventDefault();
    state.owned.clear();
    saveOwned();
    render();
    els.resetDialog.close();
  });

  render();
})();
