// PrettyTrick JavaScript - Consolidated & Fixed

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
//  9. (disabled) RIGHT-CLICK / DRAG GUARD ... commented out, inactive
// 10. HEADER & FOOTER INJECTION ............ fetch header.html / footer.html
// 11. PRODUCT LISTING (JSON-driven) ........ load/paginate/render product cards
// 12. PRODUCT IMAGE MODAL .................. click-to-zoom main image
// 13. WHATSAPP & SOCIAL BAR INJECTION ...... fetch whatsapp.html / socialmedia.html
// 14. CONTACT FORM (EmailJS) ............... handleSubmit
// ============================================================

// ── MENU & NAVIGATION ──
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

function toggleMobileProducts(btn) {
  var sub = document.getElementById('mobileProductsSub');
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

// ── FAQ ACCORDION ──
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

// ── SCROLL REVEAL ──
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

// ── HERO PARALLAX (FIXED) ──
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

// ── BEST SELLER CAROUSEL ──
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

// ── HERO SLIDER ──

const heroSlideImages = document.querySelectorAll(".hero-slide");


const heroContent = [

  {
    tagline: "",
    title: "",
    sub: ""
  },

  {
    tagline: "",
    title: "",
    sub: ""
  },

  {
    tagline: "",
    title: "",
    sub: ""
  }

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

  // Update text
  const slide = heroContent[currentHero];
  const content = document.querySelector(".hero-content");

  document.getElementById("heroTagline").innerHTML = slide.tagline;
  document.getElementById("heroTitle").innerHTML = slide.title;
  document.getElementById("heroSub").innerHTML = slide.sub;
  if (content) {
    content.classList.add('show');
    content.classList.remove('slide-0', 'slide-1', 'slide-2');
    content.classList.add('slide-' + currentHero);
  }

  updateHeroDots();

  // Reset auto-play timer
  clearInterval(heroAutoPlayTimer);
  heroAutoPlayTimer = setInterval(changeHeroImage, 5000);
}

function changeHeroImage() {

  if (heroSlideImages.length === 0) return;

  const content = document.querySelector(".hero-content");
  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  // fade out text (skip on mobile)
  if (content && !isMobile) {
    content.classList.add("fade-out");
  }

  // change after fade
  setTimeout(() => {

    // image
    heroSlideImages[currentHero].classList.remove("active");

    currentHero++;

    if (currentHero >= heroSlideImages.length) {
      currentHero = 0;
    }

    heroSlideImages[currentHero].classList.add("active");

    // text - UPDATE AFTER incrementing currentHero
    const slide = heroContent[currentHero];

    document.getElementById("heroTagline").innerHTML = slide.tagline;
    document.getElementById("heroTitle").innerHTML = slide.title;
    document.getElementById("heroSub").innerHTML = slide.sub;
    if (content) {
      content.classList.add('show');
      content.classList.remove('slide-0', 'slide-1', 'slide-2');
      content.classList.add('slide-' + currentHero);
    }

    // fade in (skip on mobile)
    if (content && !isMobile) {
      content.classList.remove("fade-out");
    }

    updateHeroDots();

  }, isMobile ? 0 : 500);

}

if (heroSlideImages.length > 0) {
  const initialSlide = heroContent[currentHero];
  const initialContent = document.querySelector(".hero-content");
  document.getElementById("heroTagline").innerHTML = initialSlide.tagline;
  document.getElementById("heroTitle").innerHTML = initialSlide.title;
  document.getElementById("heroSub").innerHTML = initialSlide.sub;
  if (initialContent) {
    initialContent.classList.add('show');
    initialContent.classList.add('slide-' + currentHero);
  }

  updateHeroDots();
  heroAutoPlayTimer = setInterval(changeHeroImage, 5000);
}


// ── ENHANCED MOTION SYSTEM ──
// Adds staggered reveal timing automatically
document.querySelectorAll('.reveal').forEach(function (el, index) {
  el.style.transitionDelay = (index % 5) * 80 + 'ms';
});


// subtle magnetic buttons
document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) / 15}px, ${(e.clientY - r.top - r.height / 2) / 15}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ── PAGE LOADER ──
//Prevent scrolling on loading page
window.addEventListener("load", function () {

  const loader = document.querySelector(".page-loader");

  setTimeout(() => {

    loader.classList.add("loaded");

    document.body.classList.remove("loading");

  }, 1200);

});

/*// ── PREVENT RIGHT CLICK & IMAGE DRAGGING ──
// Disable right click menu
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  return false;
});

// Disable image dragging
document.addEventListener("dragstart", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
    return false;
  }
});

// Disable image selection via keyboard
document.addEventListener("selectstart", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
    return false;
  }
});

// Additional protection: disable copy for images
document.addEventListener("copy", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
    return false;
  }
});*/

// ── HEADER & FOOTER INJECTION ──
document.addEventListener("DOMContentLoaded", () => {

  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });

  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });

});

// ── PRODUCT LISTING (JSON-driven) ──
//Product Page Logic - Load JSON File and Mapping Image Folder
let allProducts = [];
let currentPage = 1;
const productsPerPage = 16;


// Load JSON
document.addEventListener("DOMContentLoaded", function () {

  loadProducts();

});


function loadProducts() {

  fetch(`product/${productFile}`)
    .then(response => response.json())
    .then(products => {

      allProducts = products;

      showProducts(1);

    })
    .catch(error => {
      console.error("Cannot load products:", error);
    });

}


// Display products
function showProducts(page, scroll = false) {

  const productGrid = document.getElementById("productGrid");

  productGrid.innerHTML = "";


  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;


  const productsToShow = allProducts.slice(start, end);


  productsToShow.forEach(product => {

    productGrid.innerHTML += createProductCard(product);

  });


  currentPage = page;

  renderPagination();


  if (scroll) {

    const productSection = document.querySelector(".product-section");

    window.scrollTo({
      top: productSection.offsetTop,
      behavior: "smooth"
    });

  }

}


// Create Product Card
function createProductCard(product) {

  const mainImageId = `main-${product.sku}`;

  const imagePath = `images/${productFolder}/`;


  return `
        <div class="product-card">

            <img 
                id="${mainImageId}"
                class="main-image"
                src="${imagePath}${product.images[0]}"
                alt="${product.sku}">


            <div class="thumbnail-row">

                ${product.images.map((image, index) => `

                    <img 
                        class="thumbnail ${index === 0 ? 'active' : ''}"
                        src="${imagePath}${image}"
                        data-main="${mainImageId}">

                `).join("")}

            </div>


            <div class="product-info">

                <div class="sku">
                    ${product.sku}
                </div>

                <div class="description">
                    ${product.name}
                </div>

            </div>

        </div>
    `;

}


// Pagination
function renderPagination() {

  const pagination = document.getElementById("pagination");

  pagination.innerHTML = "";


  const totalPages = Math.ceil(allProducts.length / productsPerPage);


  if (currentPage > 1) {

    const prev = document.createElement("button");

    prev.textContent = "Previous";

    prev.onclick = () => showProducts(currentPage - 1, true);

    pagination.appendChild(prev);

  }


  for (let i = 1; i <= totalPages; i++) {

    const btn = document.createElement("button");

    btn.textContent = i;


    if (i === currentPage) {
      btn.classList.add("active");
    }


    btn.onclick = () => showProducts(i, true);


    pagination.appendChild(btn);

  }


  if (currentPage < totalPages) {

    const next = document.createElement("button");

    next.textContent = "Next";

    next.onclick = () => showProducts(currentPage + 1, true);

    pagination.appendChild(next);

  }

}


// Hover Mouse over product image to change
function changeImage(mainImageId, thumbnail) {

  const mainImage = document.getElementById(mainImageId);

  mainImage.src = thumbnail.src;

  const thumbnails = thumbnail.parentElement.querySelectorAll(".thumbnail");

  thumbnails.forEach(img => {
    img.classList.remove("active");
  });

  thumbnail.classList.add("active");
}


document.addEventListener("click", function (e) {

  if (e.target.classList.contains("thumbnail")) {

    const thumbnail = e.target;

    const mainImageId = thumbnail.dataset.main;

    const mainImage = document.getElementById(mainImageId);

    mainImage.src = thumbnail.src;


    const thumbnails = thumbnail.parentElement.querySelectorAll(".thumbnail");

    thumbnails.forEach(function (img) {
      img.classList.remove("active");
    });


    thumbnail.classList.add("active");

  }

});

// ── PRODUCT IMAGE MODAL ──
document.addEventListener("click", function (e) {


  // Click main product image
  if (e.target.classList.contains("main-image")) {


    const modal = document.getElementById("imageModal");

    const modalImage = document.getElementById("modalImage");


    modalImage.src = e.target.src;


    modal.style.display = "flex";

  }


  // Close button
  if (e.target.classList.contains("close-modal")) {

    document.getElementById("imageModal").style.display = "none";

  }


  // Click outside image
  if (e.target.id === "imageModal") {

    e.target.style.display = "none";

  }


});

// ── WHATSAPP & SOCIAL BAR INJECTION ──
//Fetch Whatsapp
fetch("whatsapp.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("whatsapp-container").innerHTML = data;
  });

//Fetch Social Media
fetch("socialmedia.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("socialmedia-container").innerHTML = data;
  });

// ── CONTACT FORM (EmailJS) ──
//Send Email
function handleSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");

  // Disable button and show sending state
  submitBtn.disabled = true;
  btnText.textContent = "Sending...";

  // Optional: add a class for loading styles/cursor
  submitBtn.classList.add("loading");

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const company = document.getElementById("company").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // Guard clause for inputs
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
    .then(function (response) {
      // Hide form & hero, display thank you section
      const pageHero = document.getElementById('pageHero');
      const contactForm = document.getElementById('contactForm');
      const formSuccess = document.getElementById('formSuccess');

      if (pageHero) pageHero.style.display = 'none';
      if (contactForm) contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';

      document.getElementById('contactForm').reset();
    })
    .catch(function (error) {
      alert("Failed to send email. Please try again.");
      console.error("EmailJS Error:", error);
      // Re-enable button on error
      resetButton();
    });

  function resetButton() {
    submitBtn.disabled = false;
    btnText.textContent = "Submit";
    submitBtn.classList.remove("loading");
  }
}


//Gallery Loader Script
document.addEventListener("DOMContentLoaded", () => {
  if (typeof productFile !== "undefined" && typeof productFolder !== "undefined") {
    loadCollectionGallery(productFile, productFolder);
  }
});

function loadCollectionGallery(jsonPath, folder) {
  const CDN_BASE = "https://images.prettytrick.com";
  const grid = document.getElementById("productGrid");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  fetch(jsonPath)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} - Failed to load ${jsonPath}`);
      return res.json();
    })
    .then((data) => {
      grid.innerHTML = "";
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "product-card";

        // Determine if image URL is absolute or CDN-relative
        const imgSrc = item.image.startsWith("http")
          ? item.image
          : `${CDN_BASE}/${folder}/${item.image}`;

        card.innerHTML = `
          <div class="product-img-wrap">
            <img src="${imgSrc}" alt="${item.title || 'Nail Art'}" loading="lazy">
          </div>
          <div class="product-info">
            <h3 class="product-title">${item.title || ''}</h3>
            ${item.code ? `<p class="product-code">Ref: ${item.code}</p>` : ''}
          </div>
        `;

        card.addEventListener("click", () => {
          if (modal && modalImg) {
            modalImg.src = imgSrc;
            modal.classList.add("active");
          }
        });

        grid.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Gallery Error:", err);
      grid.innerHTML = `<p class="error-msg">Unable to load collection data.</p>`;
    });
}