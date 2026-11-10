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

    // Initialize Page
    document.addEventListener("DOMContentLoaded", () => {
      initHeroObserver();
      renderMenu();
      updateCartUI();
    });

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
          case "select-payment": selectPayment(target); break;
          case "modal-overlay": closeModalOnOverlay(event); break;
          case "modal-close": closeDetailModal(); break;
          case "modal-qty": adjustModalQty(Number(target.dataset.delta)); break;
          case "modal-add": addCurrentModalToCart(); break;
          case "cart-toggle": toggleCartDrawer(); break;
          case "cart-checkout": proceedToCheckoutFromCart(); break;
          case "success-close": closeSuccessModal(); break;
        }
      }
    });

    document.getElementById("checkoutForm").addEventListener("submit", handlePlaceOrder);

    // Auto-hide sidebar on Hero, show & fix on Menu/Checkout
    function initHeroObserver() {
      const heroSection = document.getElementById("home");
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
            <i class="fa ${item.icon} food-placeholder-icon"></i>
            <span class="food-placeholder-text">Photo Placeholder</span>
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
        summaryHtml = `<div class="w3-text-grey w3-center w3-padding-16">No items selected yet. Choose your favorite meals from the menu above!</div>`;
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
                <b>${item.name}</b> <span class="w3-text-grey">&times; ${qty}</span>
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
