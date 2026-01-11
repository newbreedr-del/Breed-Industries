document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinksWrapper = document.querySelector(".nav-links");
  const yearEl = document.querySelector(".js-year");
  const accordions = document.querySelectorAll(".accordion-item");
  const fadeElements = document.querySelectorAll(".fade-up, .fade-in-up");
  const cards = document.querySelectorAll(
    ".package-card, .pricing-card, .benefit-card, .accordion-item, .addon-card, .contact-card, .footer-col, .social-contact-card"
  );
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const heroSection = document.querySelector(".hero.has-parallax");
  const tabGroups = document.querySelectorAll('[data-component="tabs"]');
  const progressContainer = document.querySelector(".scroll-progress");
  const progressBar = document.querySelector(".scroll-progress__bar");
  const cursorRing = document.createElement("span");
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  const rippleTargets = document.querySelectorAll(
    ".btn, .btn-gradient, .btn-outline, .btn-outline--light, .whatsapp-cta"
  );

  if (mobileToggle && navLinksWrapper) {
    mobileToggle.addEventListener("click", () => {
      navLinksWrapper.classList.toggle("open");
      mobileToggle.setAttribute(
        "aria-expanded",
        navLinksWrapper.classList.contains("open") ? "true" : "false"
      );
    });

    navLinksWrapper.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinksWrapper.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (accordions.length) {
    accordions.forEach((item) => {
      const toggle = item.querySelector(".accordion-header");

      toggle?.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        accordions.forEach((accordion) => accordion.classList.remove("open"));

        if (!isOpen) {
          item.classList.add("open");
        }
      });
    });
  }

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(index % 6) * 0.1}s`;
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${(index % 6) * 0.1}s`;
  });

  if (tabGroups.length) {
    tabGroups.forEach((group) => {
      const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
      const panels = Array.from(group.querySelectorAll('[role="tabpanel"]'));

      const activateTab = (tabToActivate) => {
        const targetPanelId = tabToActivate.getAttribute("aria-controls");

        tabs.forEach((tab) => {
          const isActive = tab === tabToActivate;
          tab.classList.toggle("is-active", isActive);
          tab.setAttribute("aria-selected", isActive ? "true" : "false");
          tab.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        panels.forEach((panel) => {
          const isMatch = panel.id === targetPanelId;
          panel.classList.toggle("is-active", isMatch);
          panel.hidden = !isMatch;
        });
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(tab));
        tab.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

          event.preventDefault();
          const lastIndex = tabs.length - 1;
          let nextIndex = index;

          if (event.key === "ArrowRight") {
            nextIndex = index === lastIndex ? 0 : index + 1;
          } else if (event.key === "ArrowLeft") {
            nextIndex = index === 0 ? lastIndex : index - 1;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = lastIndex;
          }

          const nextTab = tabs[nextIndex];
          nextTab.focus();
          activateTab(nextTab);
        });
      });

      const initialTab = tabs.find((tab) => tab.classList.contains("is-active")) || tabs[0];
      if (initialTab) {
        activateTab(initialTab);
      }
    });
  }

  const headerOffset = 80;
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");

      if (targetId?.length && targetId !== "#") {
        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  if (heroSection && window.innerWidth >= 992) {
    const background = heroSection.querySelector(".gold-particles");
    const floatIcons = heroSection.querySelectorAll(".float-icon");

    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      if (background) {
        background.style.transform = `translateY(${scrolled * -0.5}px)`;
      }
      floatIcons.forEach((icon, idx) => {
        const speed = idx % 2 === 0 ? -0.7 : -0.6;
        icon.style.transform = `translateY(${scrolled * speed}px)`;
      });
      requestAnimationFrame(handleParallax);
    };

    requestAnimationFrame(handleParallax);
  }

  if (progressBar && progressContainer) {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  if (statNumbers.length) {
    const runCounter = (el) => {
      const target = Number(el.dataset.target || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const decimals = Number(el.dataset.decimals || 0);
      const duration = 2000;
      let start = null;

      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const value = target * progress;
        const formatted = decimals
          ? value.toFixed(decimals)
          : Math.floor(value).toString();

        el.textContent = `${prefix}${progress === 1 ? target.toFixed(decimals).replace(/\.0+$/, "") : formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals).replace(/\.0+$/, "")}${suffix}`;
        }
      };

      requestAnimationFrame(animate);
    };

    const statsObserver = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = "true";
            runCounter(entry.target);
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    statNumbers.forEach((numberEl) => {
      numberEl.textContent = `${numberEl.dataset.prefix || ""}0${numberEl.dataset.suffix || ""}`;
      statsObserver.observe(numberEl);
    });
  }

  if (rippleTargets.length) {
    const createRipple = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      target.querySelectorAll(".ripple").forEach((existingRipple) => existingRipple.remove());
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    rippleTargets.forEach((btn) => {
      btn.addEventListener("pointerdown", createRipple, { passive: true });
    });
  }

  if (window.innerWidth >= 992) {
    cursorRing.className = "cursor-ring is-hidden";
    document.body.appendChild(cursorRing);

    const manageCursor = (e) => {
      cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorRing.classList.remove("is-hidden");
    };

    const interactiveSelectors = "a, button, .card, .pricing-card, .accordion-header, .whatsapp-cta, .social-icon";
    const interactiveElements = document.querySelectorAll(interactiveSelectors);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-ring--active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-ring--active"));
    });

    document.addEventListener("mousemove", manageCursor);
    document.addEventListener("mouseleave", () => cursorRing.classList.add("is-hidden"));
  }

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
});
