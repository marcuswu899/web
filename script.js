// 10 Menu Items per 設計.md
    const MENU_ITEMS = [
      {
        id: "squid-ink-pasta",
        name: "Squid Ink Pasta",
        category: "staples",
        categoryLabel: "Staples",
        price: 12.99,
        icon: "fa-cutlery",
        desc: "Rich authentic squid ink linguine tossed with calamari rings, garlic butter, sea salt, and extra virgin olive oil."
      },
      {
        id: "clam-pasta",
        name: "Clam Pasta",
        category: "staples",
        categoryLabel: "Staples",
        price: 10.99,
        icon: "fa-cutlery",
        desc: "Fresh ocean clams simmered in white wine garlic broth over al dente spaghetti, finished with garden parsley."
      },
      {
        id: "shrimp-pasta",
        name: "Shrimp Pasta",
        category: "staples",
        categoryLabel: "Staples",
        price: 11.49,
        icon: "fa-cutlery",
        desc: "Tender ocean shrimp pan-seared with cherry tomatoes and tossed in a creamy sun-dried tomato pesto pasta."
      },
      {
        id: "salmon-risotto",
        name: "Salmon Risotto",
        category: "staples",
        categoryLabel: "Staples",
        price: 12.49,
        icon: "fa-spoon",
        desc: "Slow-cooked Italian arborio rice infused with savory herb broth and topped with a golden seared salmon fillet."
      },
      {
        id: "octopus-risotto",
        name: "Octopus Risotto",
        category: "staples",
        categoryLabel: "Staples",
        price: 11.99,
        icon: "fa-spoon",
        desc: "Tender braised octopus tentacles folded into a creamy saffron risotto with parmesan and lemon zest."
      },
      {
        id: "clam-risotto",
        name: "Clam Risotto",
        category: "staples",
        categoryLabel: "Staples",
        price: 10.49,
        icon: "fa-spoon",
        desc: "Velvety clam broth risotto cooked to perfection with sweet baby clams, melted butter, and fresh herbs."
      },
      {
        id: "lobster-salad",
        name: "Lobster Salad",
        category: "drinks-snacks",
        categoryLabel: "Drinks & Snacks",
        price: 8.99,
        icon: "fa-leaf",
        desc: "Chunky succulent lobster meat tossed with crisp garden greens, creamy avocado slices, and honey citrus vinaigrette."
      },
      {
        id: "crab-stick-salad",
        name: "Crab Stick Salad",
        category: "drinks-snacks",
        categoryLabel: "Drinks & Snacks",
        price: 6.99,
        icon: "fa-leaf",
        desc: "Shredded snow crab sticks paired with julienned cucumbers, sweet corn kernels, and fragrant roasted sesame dressing."
      },
      {
        id: "seafood-chowder",
        name: "Seafood Chowder",
        category: "drinks-snacks",
        categoryLabel: "Drinks & Snacks",
        price: 5.49,
        icon: "fa-coffee",
        desc: "Hearty traditional Atlantic chowder loaded with tender clams, white fish fillets, diced potatoes, and cream."
      },
      {
        id: "honey-lemon-water",
        name: "Honey lemon water",
        category: "drinks-snacks",
        categoryLabel: "Drinks & Snacks",
        price: 2.99,
        icon: "fa-glass",
        desc: "Cold freshly squeezed organic lemon juice lightly sweetened with wildflower honey and garnished with mint leaves."
      }
    ];

    // State Variables
    let currentCategory = "all";
    let currentPage = 1;
    const ITEMS_PER_PAGE = 6;
    let cart = {}; // { itemId: quantity }
    let activeModalItem = null;
    let activeModalQty = 1;
    let wheelSpinning = false;
    let wheelSpinCount = 0;
    let wheelRotation = 0;
    let lastCursorPoint = null;
    let cursorTrailTick = 0;

    // DOM Elements
    const foodGrid = document.getElementById("foodGrid");
    const pagination = document.getElementById("pagination");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sidebar = document.getElementById("mySidebar");
    const overlay = document.getElementById("myOverlay");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
    const cartCountBadge = document.getElementById("cartCountBadge");
    const cartBtnTotal = document.getElementById("cartBtnTotal");
    const floatingCartBtn = document.getElementById("floatingCartBtn");
    const cartToast = document.getElementById("cartToast");
    const cartToastItem = document.getElementById("cartToastItem");
    let cartToastTimer;

    // Initialize Page
    document.addEventListener("DOMContentLoaded", () => {
      initHeroObserver();
      initVolleyballCursor();
      initTopSellingAnimations();
      syncMusicToggle();
      renderMenu();
      updateCartUI();
    });

    function initVolleyballCursor() {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ball = document.getElementById("volleyballCursor");
      document.body.classList.add("volleyball-cursor-enabled");
      document.addEventListener("pointermove", event => {
        const x = event.clientX;
        const y = event.clientY;
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;
        if (lastCursorPoint) {
          const dx = x - lastCursorPoint.x;
          const dy = y - lastCursorPoint.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 5 && cursorTrailTick++ % 2 === 0) {
            const arc = Math.min(18, distance * 0.16);
            const particle = document.createElement("span");
            particle.className = "volleyball-trail-particle";
            particle.style.left = `${x - dx * 0.32}px`;
            particle.style.top = `${y - dy * 0.32 - arc}px`;
            particle.style.setProperty("--trail-size", `${Math.max(6, Math.min(13, distance * 0.2))}px`);
            document.body.appendChild(particle);
            particle.addEventListener("animationend", () => particle.remove(), { once: true });
          }
          if (distance > 1) {
            const heading = Math.atan2(dy, dx) * (180 / Math.PI);
            ball.style.setProperty("--fish-angle", `${heading}deg`);
          }
        }
        lastCursorPoint = { x, y };
      }, { passive: true });
      document.addEventListener("pointerleave", () => { ball.style.opacity = "0"; });
      document.addEventListener("pointerenter", () => { ball.style.opacity = "1"; });
    }

    document.addEventListener("click", event => {
      const target = event.target.closest("[data-action], .food-card, .quick-add-btn, .page-btn, .cart-qty-btn");
      if (!target) return;

      if (target.matches(".quick-add-btn")) {
        event.stopPropagation();
        quickAddToCart(target.dataset.itemId);
      } else if (target.matches(".food-card")) {
        openDetailModal(target.dataset.itemId);
      } else if (target.matches(".page-btn")) {
        const action = target.dataset.action;
        if (action === "page-previous") changePage(-1);
        else if (action === "page-next") changePage(1);
        else goToPage(Number(target.dataset.page));
      } else if (target.matches(".cart-qty-btn")) {
        changeCartItemQty(target.dataset.itemId, Number(target.dataset.delta));
      } else {
        switch (target.dataset.action) {
          case "menu-open": w3_open(); break;
          case "menu-close": w3_close(); break;
          case "top-selling-nav":
            event.preventDefault();
            w3_close();
            document.querySelector(".top-selling-section")?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
              block: "center"
            });
            break;
          case "select-payment": selectPayment(target); break;
          case "modal-overlay": closeModalOnOverlay(event); break;
          case "modal-close": closeDetailModal(); break;
          case "modal-qty": adjustModalQty(Number(target.dataset.delta)); break;
          case "modal-add": addCurrentModalToCart(); break;
          case "cart-toggle": toggleCartDrawer(); break;
          case "cart-checkout": proceedToCheckoutFromCart(); break;
          case "success-close": closeSuccessModal(); break;
          case "wheel-open": event.preventDefault(); openFoodWheel(); break;
          case "music-toggle": toggleBackgroundMusic(); break;
          case "wheel-close": closeFoodWheel(); break;
          case "wheel-overlay": if (event.target.id === "foodWheelOverlay") closeFoodWheel(); break;
          case "wheel-spin": spinFoodWheel(); break;
        }
      }
    });

    document.getElementById("checkoutForm").addEventListener("submit", handlePlaceOrder);

    function initTopSellingAnimations() {
      const section = document.querySelector(".top-selling-section");
      const bars = Array.from(document.querySelectorAll(".top-selling-track span[data-target]"));
      if (!section || !bars.length) return;
      const pendingAnimations = new Map();

      const animateBar = (bar, index) => {
        const target = Number(bar.dataset.target);
        const track = bar.closest(".top-selling-track");
        const delay = index * 130;
        const duration = 1400;

        const pending = {};
        pendingAnimations.set(bar, pending);
        pending.timer = window.setTimeout(() => {
          const startedAt = performance.now();
          const step = now => {
            if (pendingAnimations.get(bar) !== pending) return;
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            bar.style.width = `${value}%`;
            bar.textContent = `${Math.round(value)}%`;
            track.setAttribute("aria-valuenow", String(Math.round(value)));
            if (progress < 1) pending.frame = window.requestAnimationFrame(step);
            else {
              bar.style.width = `${target}%`;
              bar.textContent = `${target}%`;
              track.setAttribute("aria-valuenow", String(target));
              pendingAnimations.delete(bar);
            }
          };
          pending.frame = window.requestAnimationFrame(step);
        }, delay);
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              bars.forEach(bar => {
                const target = Number(bar.dataset.target);
                bar.style.width = `${target}%`;
                bar.textContent = `${target}%`;
                bar.closest(".top-selling-track").setAttribute("aria-valuenow", String(target));
              });
            } else {
              bars.forEach(animateBar);
            }
            return;
          }

          bars.forEach(bar => {
            const pending = pendingAnimations.get(bar);
            if (pending) {
              window.clearTimeout(pending.timer);
              if (pending.frame) window.cancelAnimationFrame(pending.frame);
              pendingAnimations.delete(bar);
            }
            bar.style.width = "0%";
            bar.textContent = "0%";
            bar.closest(".top-selling-track").setAttribute("aria-valuenow", "0");
          });
        });
      }, { threshold: 0.2 });
      observer.observe(section);
    }

    const deliverySubmarine = document.querySelector(".delivery-submarine");
    let submarineLapProgress = 0;
    let submarineLastFrame = null;
    let submarineBoostStartedAt = null;
    let submarineWakeTimer;
    const submarineLapDuration = 50000;

    function animateSubmarineLap(timestamp) {
      if (submarineLastFrame !== null && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const delta = timestamp - submarineLastFrame;
        let speed = 1;
        if (submarineBoostStartedAt !== null) {
          const boostElapsed = timestamp - submarineBoostStartedAt;
          const smoothStep = value => value * value * (3 - 2 * value);

          if (boostElapsed < 1000) {
            speed = 1 + smoothStep(boostElapsed / 1000);
          } else if (boostElapsed < 2000) {
            speed = 2;
          } else if (boostElapsed < 4000) {
            speed = 2 - smoothStep((boostElapsed - 2000) / 2000);
          } else {
            submarineBoostStartedAt = null;
          }
        }
        submarineLapProgress = (submarineLapProgress + delta * speed / submarineLapDuration) % 1;
        deliverySubmarine.style.offsetDistance = `${submarineLapProgress * 100}%`;
      }
      submarineLastFrame = timestamp;
      window.requestAnimationFrame(animateSubmarineLap);
    }
    window.requestAnimationFrame(animateSubmarineLap);

    deliverySubmarine.addEventListener("click", () => {
      window.clearTimeout(submarineWakeTimer);
      deliverySubmarine.classList.remove("boosting");
      void deliverySubmarine.offsetWidth;
      submarineBoostStartedAt = performance.now();
      deliverySubmarine.classList.add("boosting");
      submarineWakeTimer = window.setTimeout(() => deliverySubmarine.classList.remove("boosting"), 1400);
    });

    function syncMusicToggle() {
      const audio = document.getElementById("backgroundMusic");
      if (!audio) return;
      const muted = audio.muted;
      document.getElementById("musicToggleIcon").className = `fa ${muted ? "fa-volume-off" : "fa-volume-up"} fa-fw w3-margin-right`;
      document.getElementById("musicToggleLabel").textContent = muted ? "UNMUTE MUSIC" : "MUTE MUSIC";
    }

    function toggleBackgroundMusic() {
      const audio = document.getElementById("backgroundMusic");
      if (!audio) return;
      audio.muted = !audio.muted;
      if (!audio.muted) audio.play().catch(() => {});
      syncMusicToggle();
    }

    function openFoodWheel() {
      renderFoodWheel();
      wheelSpinCount = 0;
      wheelRotation = 0;
      const wheelOverlay = document.getElementById("foodWheelOverlay");
      wheelOverlay.classList.add("open");
      wheelOverlay.setAttribute("aria-hidden", "false");
      document.getElementById("wheelResult").textContent = "";
    }

    function closeFoodWheel() {
      if (wheelSpinning) return;
      const wheelOverlay = document.getElementById("foodWheelOverlay");
      wheelOverlay.classList.remove("open");
      wheelOverlay.setAttribute("aria-hidden", "true");
    }

    function renderFoodWheel() {
      const svg = document.getElementById("foodWheel");
      const colors = ["#073b4c", "#118ab2", "#06a77d", "#f4a261", "#e76f51", "#264653", "#2a9d8f", "#e9c46a", "#457b9d", "#9b5de5"];
      const cx = 250, cy = 250, radius = 242;
      const slice = 360 / MENU_ITEMS.length;
      const polar = (angle, r) => ({ x: cx + r * Math.cos((angle - 90) * Math.PI / 180), y: cy + r * Math.sin((angle - 90) * Math.PI / 180) });
      svg.innerHTML = MENU_ITEMS.map((item, i) => {
        const start = i * slice, end = start + slice;
        const p1 = polar(start, radius), p2 = polar(end, radius), mid = start + slice / 2;
        const label = polar(mid, 158);
        const words = item.name.split(" ");
        const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");
        const text = secondLine
          ? `<text x="${label.x}" y="${label.y - 8}" transform="rotate(${mid} ${label.x} ${label.y})" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="700"><tspan x="${label.x}" dy="0">${firstLine}</tspan><tspan x="${label.x}" dy="15">${secondLine}</tspan></text>`
          : `<text x="${label.x}" y="${label.y}" transform="rotate(${mid} ${label.x} ${label.y})" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="700">${firstLine}</text>`;
        return `<path d="M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y} Z" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2"/>${text}`;
      }).join("") + '<circle cx="250" cy="250" r="20" fill="#fff" stroke="#102a3a" stroke-width="4"/>';
      svg.style.transform = "rotate(0deg)";
    }

    // Auto-hide sidebar on Hero, show & fix on Menu/Checkout
    function initHeroObserver() {
      const heroSection = document.getElementById("home");
      if (!heroSection) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.body.classList.add("on-hero");
            if (window.innerWidth <= 992) {
              w3_close();
            }
          } else {
            document.body.classList.remove("on-hero");
          }
        });
      }, { threshold: 0.25 });
      observer.observe(heroSection);
    }

    function spinFoodWheel() {
      if (wheelSpinning) return;
      wheelSpinning = true;
      const btn = document.getElementById("spinWheelBtn");
      const wheel = document.getElementById("foodWheel");
      const result = document.getElementById("wheelResult");
      btn.disabled = true;
      result.textContent = "Spinning…";
      const chosenIndex = Math.floor(Math.random() * MENU_ITEMS.length);
      const slice = 360 / MENU_ITEMS.length;
      const targetSlotAngle = 360 - (chosenIndex * slice + slice / 2);
      const currentAngle = ((wheelRotation % 360) + 360) % 360;
      const alignmentTurn = (targetSlotAngle - currentAngle + 360) % 360;
      const extraTurns = wheelSpinCount === 0 ? 6 : 10;
      const targetAngle = wheelRotation + extraTurns * 360 + alignmentTurn;
      wheelSpinCount++;
      wheelRotation = targetAngle;
      wheel.style.transition = "transform 4s cubic-bezier(.12,.78,.12,1)";
      wheel.style.transform = `rotate(${targetAngle}deg)`;
      wheel.addEventListener("transitionend", () => {
        result.textContent = `You got: ${MENU_ITEMS[chosenIndex].name}!`;
        launchWheelSplashEffect();
        btn.disabled = false;
        wheelSpinning = false;
      }, { once: true });
    }

    function launchWheelSplashEffect() {
      const layer = document.getElementById("wheelWaterSplash");
      const wheelFrame = document.querySelector(".wheel-frame");
      if (!wheelFrame) return;
      const frame = wheelFrame.getBoundingClientRect();
      layer.innerHTML = "";
      const splashPoints = [];
      while (splashPoints.length < 13) {
        const position = 0.035 + Math.random() * 0.93;
        if (splashPoints.every(existing => Math.abs(existing - position) > 0.045)) {
          splashPoints.push(position);
        }
      }
      splashPoints.forEach(position => {
        const centerX = frame.left + frame.width * position + (Math.random() - 0.5) * 20;
        const centerY = frame.bottom - 8 - Math.random() * 42;
        const burstDelay = Math.random() * 220;
        const ring = document.createElement("i");
        ring.className = "wheel-splash-ring";
        ring.style.left = `${centerX}px`;
        ring.style.top = `${centerY}px`;
        ring.style.animationDelay = `${burstDelay}ms`;
        layer.appendChild(ring);

        const foamRing = document.createElement("i");
        foamRing.className = "wheel-splash-ring wheel-splash-ring-secondary";
        foamRing.style.left = `${centerX + (Math.random() - 0.5) * 12}px`;
        foamRing.style.top = `${centerY + 3}px`;
        foamRing.style.animationDelay = `${burstDelay + 100}ms`;
        layer.appendChild(foamRing);

        const count = 10;
        for (let i = 0; i < count; i++) {
          const angle = -Math.PI + (Math.PI * i) / (count - 1) + (Math.random() - 0.5) * 0.16;
          const distance = 76 + Math.random() * 124;
          const drop = document.createElement("i");
          drop.className = "wheel-splash-drop";
          if (i % 5 === 0) drop.classList.add("wheel-splash-bubble");
          drop.style.left = `${centerX}px`;
          drop.style.top = `${centerY}px`;
          drop.style.setProperty("--drop-width", `${6 + Math.random() * 8}px`);
          drop.style.setProperty("--drop-height", `${10 + Math.random() * 13}px`);
          drop.style.setProperty("--splash-x", `${Math.cos(angle) * distance}px`);
          drop.style.setProperty("--splash-y", `${Math.max(18, distance * (0.35 + Math.random() * 0.22))}px`);
          drop.style.setProperty("--splash-apex-x", `${Math.cos(angle) * distance * 0.68}px`);
          drop.style.setProperty("--splash-apex-y", `${Math.sin(angle) * distance}px`);
          drop.style.setProperty("--splash-y-out", `${Math.sin(angle) * distance * 1.5}px`);
          drop.style.setProperty("--drop-rotation", `${(angle * 180 / Math.PI) + 90}deg`);
          drop.style.animationDelay = `${burstDelay + Math.random() * 110}ms`;
          layer.appendChild(drop);
        }
      });
      window.setTimeout(() => { layer.innerHTML = ""; }, 1900);
    }

    // Sidebar functions (reference example.html)
    function w3_open() {
      sidebar.style.display = "block";
      overlay.style.display = "block";
    }

    function w3_close() {
      sidebar.style.display = "none";
      overlay.style.display = "none";
    }

    // 2. Menu Filtering & Pagination
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        currentPage = 1;
        renderMenu();
      });
    });

    function getFilteredItems() {
      if (currentCategory === "all") return MENU_ITEMS;
      return MENU_ITEMS.filter(item => item.category === currentCategory);
    }

    function renderMenu() {
      const items = getFilteredItems();
      const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const displayItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      // Render Cards
      foodGrid.innerHTML = displayItems.map(item => `
        <article class="food-card" data-item-id="${item.id}">
          <div class="food-img-container">
            <img class="food-image" src="images/meals/${item.name}.jpg" alt="${item.name}" loading="lazy" decoding="async">
          </div>
          <div class="food-card-body">
            <div class="food-header">
              <h3 class="food-title">${item.name}</h3>
              <span class="food-price">$${item.price.toFixed(2)}</span>
            </div>
            <p class="food-desc">${item.desc}</p>
            <div class="food-action">
              <span class="view-detail-hint"><i class="fa fa-info-circle"></i> Click to customize</span>
              <button type="button" class="quick-add-btn" data-item-id="${item.id}" title="Quick Add">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </article>
      `).join("");

      // Render Pagination Buttons
      if (totalPages <= 1) {
        pagination.innerHTML = "";
      } else {
        let pagHtml = `<button type="button" class="page-btn" data-action="page-previous" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;
        for (let i = 1; i <= totalPages; i++) {
          pagHtml += `<button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        pagHtml += `<button type="button" class="page-btn" data-action="page-next" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;
        pagination.innerHTML = pagHtml;
      }
    }

    function changePage(direction) {
      currentPage += direction;
      renderMenu();
      document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
    }

    function goToPage(page) {
      currentPage = page;
      renderMenu();
      document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
    }

    // 3. Detail Lightbox Modal
    function openDetailModal(itemId) {
      const item = MENU_ITEMS.find(m => m.id === itemId);
      if (!item) return;

      activeModalItem = item;
      activeModalQty = 1;

      document.getElementById("modalTitle").textContent = item.name;
      document.getElementById("modalPrice").textContent = `$${item.price.toFixed(2)}`;
      document.getElementById("modalCategory").textContent = item.categoryLabel;
      document.getElementById("modalDesc").textContent = item.desc;
      document.getElementById("modalIcon").className = `fa ${item.icon} food-placeholder-icon`;
      document.getElementById("modalQtyDisplay").textContent = activeModalQty;

      document.getElementById("detailModalOverlay").classList.add("open");
    }

    function closeDetailModal() {
      document.getElementById("detailModalOverlay").classList.remove("open");
      activeModalItem = null;
    }

    function closeModalOnOverlay(e) {
      if (e.target.id === "detailModalOverlay") {
        closeDetailModal();
      }
    }

    function adjustModalQty(delta) {
      activeModalQty = Math.max(1, activeModalQty + delta);
      document.getElementById("modalQtyDisplay").textContent = activeModalQty;
    }

    function addCurrentModalToCart() {
      if (!activeModalItem) return;
      addToCart(activeModalItem.id, activeModalQty);
      closeDetailModal();
    }

    function quickAddToCart(itemId) {
      addToCart(itemId, 1);
    }

    // 4. Cart Operations & Slide-in Drawer
    function addToCart(itemId, quantity = 1) {
      cart[itemId] = (cart[itemId] || 0) + quantity;
      updateCartUI();
      bumpCartBtn();
      showCartToast(itemId, quantity);
    }

    function showCartToast(itemId, quantity) {
      const item = MENU_ITEMS.find(menuItem => menuItem.id === itemId);
      if (!item || !cartToast || !cartToastItem) return;

      cartToastItem.textContent = `${item.name} × ${quantity}`;
      cartToast.classList.remove("show");
      void cartToast.offsetWidth;
      cartToast.classList.add("show");
      window.clearTimeout(cartToastTimer);
      cartToastTimer = window.setTimeout(() => cartToast.classList.remove("show"), 1500);
    }

    function changeCartItemQty(itemId, delta) {
      if (!cart[itemId]) return;
      cart[itemId] += delta;
      if (cart[itemId] <= 0) {
        delete cart[itemId];
      }
      updateCartUI();
    }

    function bumpCartBtn() {
      floatingCartBtn.classList.remove("bump");
      void floatingCartBtn.offsetWidth; // trigger reflow
      floatingCartBtn.classList.add("bump");
    }

    function toggleCartDrawer() {
      const isOpen = cartDrawer.classList.contains("open");
      cartDrawer.classList.toggle("open", !isOpen);
      cartDrawerOverlay.classList.toggle("open", !isOpen);
    }

    function updateCartUI() {
      let totalCount = 0;
      let totalAmount = 0;
      const cartItemsList = document.getElementById("cartItemsList");
      const checkoutSummaryList = document.getElementById("checkoutSummaryList");

      let itemsHtml = "";
      let summaryHtml = "";

      const itemIds = Object.keys(cart);

      if (itemIds.length === 0) {
        itemsHtml = `
          <div class="cart-empty-message">
            <i class="fa fa-shopping-basket cart-empty-icon"></i>
            <p>Your cart is empty.</p>
            <span class="w3-small">Add delicious dorm meals to begin!</span>
          </div>
        `;
        summaryHtml = `<div class="summary-empty-state">No items selected yet. Choose your favorite meals from the menu above!</div>`;
      } else {
        itemIds.forEach(id => {
          const item = MENU_ITEMS.find(m => m.id === id);
          if (!item) return;

          const qty = cart[id];
          const subtotal = item.price * qty;
          totalCount += qty;
          totalAmount += subtotal;

          itemsHtml += `
            <div class="cart-item">
              <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)} &times; ${qty} = $${subtotal.toFixed(2)}</span>
              </div>
              <div class="cart-item-controls">
                <button type="button" class="cart-qty-btn" data-item-id="${id}" data-delta="-1">&minus;</button>
                <span class="cart-qty-num">${qty}</span>
                <button type="button" class="cart-qty-btn" data-item-id="${id}" data-delta="1">&plus;</button>
              </div>
            </div>
          `;

          summaryHtml += `
            <div class="summary-item-row">
              <div>
                <b>${item.name}</b> <span class="summary-item-qty">&times; ${qty}</span>
              </div>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
          `;
        });
      }

      cartItemsList.innerHTML = itemsHtml;
      checkoutSummaryList.innerHTML = summaryHtml;

      cartCountBadge.textContent = totalCount;
      cartBtnTotal.textContent = `$${totalAmount.toFixed(2)}`;
      document.getElementById("cartDrawerSubtotal").textContent = `$${totalAmount.toFixed(2)}`;
      document.getElementById("checkoutSubtotal").textContent = `$${totalAmount.toFixed(2)}`;
      document.getElementById("checkoutGrandTotal").textContent = `$${totalAmount.toFixed(2)}`;
    }

    function proceedToCheckoutFromCart() {
      toggleCartDrawer();
      document.getElementById("checkoutHeader").scrollIntoView({ behavior: 'smooth' });
    }

    // 5. Checkout & Payment Selection
    function selectPayment(element) {
      document.querySelectorAll(".payment-label").forEach(l => l.classList.remove("selected"));
      element.classList.add("selected");
      element.querySelector('input[type="radio"]').checked = true;
    }

    function handlePlaceOrder(event) {
      event.preventDefault();

      const itemIds = Object.keys(cart);
      if (itemIds.length === 0) {
        alert("Your cart is empty! Please choose items from the menu before placing an order.");
        document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const studentName = document.getElementById("studentName").value.trim();
      const studentPhone = document.getElementById("studentPhone").value.trim();
      const dormBuilding = document.getElementById("dormBuilding").value;
      const roomNumber = document.getElementById("roomNumber").value.trim();
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
      const grandTotal = document.getElementById("checkoutGrandTotal").textContent;

      const orderNumber = "OB-" + Math.floor(100000 + Math.random() * 900000);

      document.getElementById("successOrderDetails").innerHTML = `
        <div><b>Order Number:</b> ${orderNumber}</div>
        <div><b>Customer:</b> ${studentName} (${studentPhone})</div>
        <div><b>Campus Delivery To:</b> ${dormBuilding}, Room ${roomNumber}</div>
        <div><b>Payment:</b> ${paymentMethod} (${grandTotal})</div>
        <div><b>Estimated Delivery Time:</b> 20 - 30 mins</div>
      `;

      document.getElementById("orderSuccessOverlay").classList.add("open");

      // Reset cart and form
      cart = {};
      updateCartUI();
      document.getElementById("checkoutForm").reset();
      selectPayment(document.querySelector('.payment-label'));
    }

    function closeSuccessModal() {
      document.getElementById("orderSuccessOverlay").classList.remove("open");
      document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
    }
