// PrettyTrick JavaScript - Consolidated & Cleaned

// ============================================================
// TABLE OF CONTENTS
// ============================================================
//  1. MENU & NAVIGATION ................... toggleMenu, mobile nav, nav shadow
//  2. FAQ ACCORDION ........................ toggleFaq
//  3. SCROLL REVEAL ......................... IntersectionObserver for .reveal
//  4. HERO PARALLAX ......................... background scroll effect
//  5. BEST SELLER CAROUSEL .................. infinite-scroll product strip
//  6. HERO SLIDER ........................... rotating hero text/images
//  7. MOTION / STAGGERED REVEAL ............. reveal delay + magnetic buttons
//  8. PAGE LOADER ........................... loader screen, scroll lock
//  9. HEADER & FOOTER INJECTION ............ fetch header.html / footer.html
// 10. PRODUCT LISTING (CDN & JSON-driven) ... load, paginate & render cards from R2
// 11. PRODUCT IMAGE MODAL .................. click-to-zoom main image
// 12. WHATSAPP & SOCIAL BAR INJECTION ...... fetch whatsapp.html / socialmedia.html
// 13. CONTACT FORM (EmailJS) ............... handleSubmit
// ============================================================

const CDN_BASE = "https://images.prettytrick.com";

// ── 1. MENU & NAVIGATION ──
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

function toggleMobileProducts(btn) {
  var sub = document.getElementById('mobileProductsSub');
  if (!sub) return;
  var isOpen = sub.classList.contains('open');
  sub.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

// Close menu on outside click
document.addEventListener('click', function (e) {
  var menu = document.getElementById('mobileMenu');
  var btn = document.getElementById('hamburger');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// Nav shadow on scroll
var nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', function () {
    nav.style.boxShadow = window.scrollY > 50 ? '0 4px 24px rgba(0,0,0,.12)' : '0 2px 10px rgba(0,0,0,.07)';
  }, { passive: true });
}

// ── 2. FAQ ACCORDION ──
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var answer = item.querySelector('.faq-answer');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function (el) {
    el.classList.remove('open');
    el.querySelector('.faq-answer').style.maxHeight = null;
  });
  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ── 3. SCROLL REVEAL ──
var obs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  obs.observe(el);
});

// ── 4. HERO PARALLAX ──
var heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0 && !window.matchMedia('(max-width: 600px)').matches) {
  window.addEventListener('scroll', function () {
    if (window.scrollY < window.innerHeight) {
      heroSlides.forEach(function (img) {
        img.style.transform = 'translateY(' + (window.scrollY * 0.2) + 'px)';
      });
    }
  }, { passive: true });
}

// ── 5. BEST SELLER CAROUSEL ──
(function () {
  var track = document.getElementById('bsTrack');
  if (!track) return;
  var cards = Array.from(track.children);
  var total = cards.length;
  var current = 0;
  cards.forEach(function (c) {
    track.appendChild(c.cloneNode(true));
  });
  function getCardWidth() {
    return track.children[0].offsetWidth + 16;
  }
  function next() {
    current++;
    track.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
    track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
    if (current >= total) {
      setTimeout(function () {
        track.style.transition = 'none';
        current = 0;
        track.style.transform = 'translateX(0)';
      }, 650);
    }
  }
  var timer = setInterval(next, 3000);
  track.addEventListener('mouseenter', function () {
    clearInterval(timer);
  });
  track.addEventListener('mouseleave', function () {
    timer = setInterval(next, 3000);
  });
})();

// ── 6. HERO SLIDER ──
const heroSlideImages = document.querySelectorAll(".hero-slide");
const heroContent = [
  { tagline: "", title: "", sub: "" },
  { tagline: "", title: "", sub: "" },
  { tagline: "", title: "", sub: "" }
];

let currentHero = 0;
let heroAutoPlayTimer;

function updateHeroDots() {
  document.querySelectorAll('.hero-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentHero);
  });
}

function goToHeroSlide(index) {
  if (heroSlideImages.length === 0) return;

  currentHero = index;
  heroSlideImages.forEach((img, i) => {
    img.classList.toggle('active', i === currentHero);
  });

  const slide = heroContent[currentHero];
  const content = document.querySelector(".hero-content");

  const tagEl = document.getElementById("heroTagline");
  const titleEl = document.getElementById("heroTitle");
  const subEl = document.getElementById("heroSub");

  if (tagEl) tagEl.innerHTML = slide.tagline;
  if (titleEl) titleEl.innerHTML = slide.title;
  if (subEl) subEl.innerHTML = slide.sub;

  if (content) {
    content.classList.add('show');
    content.classList.remove('slide-0', 'slide-1', 'slide-2');
    content.classList.add('slide-' + currentHero);
  }

  updateHeroDots();
  clearInterval(heroAutoPlayTimer);
  heroAutoPlayTimer = setInterval(changeHeroImage, 5000);
}

function changeHeroImage() {
  if (heroSlideImages.length === 0) return;

  const content = document.querySelector(".hero-content");
  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  if (content && !isMobile) {
    content.classList.add("fade-out");
  }

  setTimeout(() => {
    heroSlideImages[currentHero].classList.remove("active");
    currentHero = (currentHero + 1) % heroSlideImages.length;
    heroSlideImages[currentHero].classList.add("active");

    const slide = heroContent[currentHero];
    const tagEl = document.getElementById("heroTagline");
    const titleEl = document.getElementById("heroTitle");
    const subEl = document.getElementById("heroSub");

    if (tagEl) tagEl.innerHTML = slide.tagline;
    if (titleEl) titleEl.innerHTML = slide.title;
    if (subEl) subEl.innerHTML = slide.sub;

    if (content) {
      content.classList.add('show');
      content.classList.remove('slide-0', 'slide-1', 'slide-2');
      content.classList.add('slide-' + currentHero);
    }

    if (content && !isMobile) {
      content.classList.remove("fade-out");
    }

    updateHeroDots();
  }, isMobile ? 0 : 500);
}

if (heroSlideImages.length > 0) {
  const initialSlide = heroContent[currentHero];
  const initialContent = document.querySelector(".hero-content");
  const tagEl = document.getElementById("heroTagline");
  const titleEl = document.getElementById("heroTitle");
  const subEl = document.getElementById("heroSub");

  if (tagEl) tagEl.innerHTML = initialSlide.tagline;
  if (titleEl) titleEl.innerHTML = initialSlide.title;
  if (subEl) subEl.innerHTML = initialSlide.sub;

  if (initialContent) {
    initialContent.classList.add('show');
    initialContent.classList.add('slide-' + currentHero);
  }

  updateHeroDots();
  heroAutoPlayTimer = setInterval(changeHeroImage, 5000);
}

// ── 7. ENHANCED MOTION SYSTEM ──
document.querySelectorAll('.reveal').forEach(function (el, index) {
  el.style.transitionDelay = (index % 5) * 80 + 'ms';
});

document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) / 15}px, ${(e.clientY - r.top - r.height / 2) / 15}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ── 8. PAGE LOADER ──
window.addEventListener("load", function () {
  const loader = document.querySelector(".page-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("loaded");
      document.body.classList.remove("loading");
    }, 1200);
  }
});

// ── 9. HEADER & FOOTER INJECTION ──
document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  if (headerEl) {
    fetch("header.html")
      .then(res => res.text())
      .then(data => { headerEl.innerHTML = data; });
  }

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    fetch("footer.html")
      .then(res => res.text())
      .then(data => { footerEl.innerHTML = data; });
  }
});

// ── 10. PRODUCT LISTING (JSON & Cloudflare R2 Driven) ──
let allProducts = [];
let currentPage = 1;
const productsPerPage = 16;

document.addEventListener("DOMContentLoaded", function () {
  if (typeof productFile !== "undefined" && typeof productFolder !== "undefined") {
    loadProducts(productFile, productFolder);
  }
});

function loadProducts(jsonFile, folder) {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  fetch(jsonFile)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to load ${jsonFile}`);
      return response.json();
    })
    .then(products => {
      allProducts = products;
      showProducts(1, false, folder);
    })
    .catch(error => {
      console.error("Cannot load products:", error);
      productGrid.innerHTML = `<p class="error-msg">Unable to load collection data.</p>`;
    });
}

function showProducts(page, scroll = false, folder = typeof productFolder !== "undefined" ? productFolder : "") {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productsToShow = allProducts.slice(start, end);

  productsToShow.forEach(product => {
    productGrid.innerHTML += createProductCard(product, folder);
  });

  currentPage = page;
  renderPagination(folder);

  if (scroll) {
    const productSection = document.querySelector(".product-section") || productGrid;
    window.scrollTo({
      top: productSection.offsetTop - 80,
      behavior: "smooth"
    });
  }
}

function createProductCard(product, folder) {
  // Support single image string or array of images
  const rawImg = Array.isArray(product.images) ? product.images[0] : (product.image || "");
  const imgSrc = rawImg.startsWith("http") ? rawImg : `${CDN_BASE}/${folder}/${rawImg}`;
  const title = product.title || product.name || "Nail Art";
  const code = product.code || product.sku || "";

  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img class="main-image" src="${imgSrc}" alt="${title}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-title">${title}</h3>
        ${code ? `<p class="product-code">Ref: ${code}</p>` : ''}
      </div>
    </div>
  `;
}

function renderPagination(folder) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  if (totalPages <= 1) return;

  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "Previous";
    prev.onclick = () => showProducts(currentPage - 1, true, folder);
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => showProducts(i, true, folder);
    pagination.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "Next";
    next.onclick = () => showProducts(currentPage + 1, true, folder);
    pagination.appendChild(next);
  }
}

// ── 11. PRODUCT IMAGE MODAL ──
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("main-image")) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    if (modal && modalImage) {
      modalImage.src = e.target.src;
      modal.style.display = "flex";
      modal.classList.add("active");
    }
  }

  if (e.target.classList.contains("close-modal") || e.target.classList.contains("modal-close")) {
    const modal = document.getElementById("imageModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("active");
    }
  }

  if (e.target.id === "imageModal") {
    e.target.style.display = "none";
    e.target.classList.remove("active");
  }
});

// ── 12. WHATSAPP & SOCIAL BAR INJECTION ──
const waContainer = document.getElementById("whatsapp-container");
if (waContainer) {
  fetch("whatsapp.html")
    .then(res => res.text())
    .then(data => { waContainer.innerHTML = data; });
}

const socialContainer = document.getElementById("socialmedia-container");
if (socialContainer) {
  fetch("socialmedia.html")
    .then(res => res.text())
    .then(data => { socialContainer.innerHTML = data; });
}

// ── 13. CONTACT FORM (EmailJS) ──
function handleSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");

  submitBtn.disabled = true;
  btnText.textContent = "Sending...";
  submitBtn.classList.add("loading");

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const company = document.getElementById("company").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!firstName || !lastName || !email || !subject || !message) {
    alert("Please fill in all required fields.");
    resetButton();
    return;
  }

  let parms = {
    firstname: firstName,
    lastname: lastName,
    company: company,
    email: email,
    subject: subject,
    message: message,
  };

  emailjs.send("service_1vc1vl5", "template_hwxlioh", parms)
    .then(function () {
      const pageHero = document.getElementById('pageHero');
      const contactForm = document.getElementById('contactForm');
      const formSuccess = document.getElementById('formSuccess');

      if (pageHero) pageHero.style.display = 'none';
      if (contactForm) contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';

      if (contactForm) contactForm.reset();
    })
    .catch(function (error) {
      alert("Failed to send email. Please try again.");
      console.error("EmailJS Error:", error);
      resetButton();
    });

  function resetButton() {
    submitBtn.disabled = false;
    btnText.textContent = "Submit";
    submitBtn.classList.remove("loading");
  }
}