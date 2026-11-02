
/**
 * Finance Assist - Interactive Forms & UI Animations
 * File: app-interactive.js
 */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================================
  // 1. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ========================================================
  const revealElements = document.querySelectorAll(
    ".card, .pricing-card, .article-card, .form-card, .contact-info"
  );

  // Set initial hidden state styles dynamically if not in CSS
  revealElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ========================================================
  // 2. INTERACTIVE CONTACT FORM WITH REAL-TIME VALIDATION
  // ========================================================
  const contactForm = document.querySelector(".form-card form");

  if (contactForm) {
    const inputs = contactForm.querySelectorAll("input, textarea, select");
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Create a live character counter for textarea
    const messageArea = contactForm.querySelector("textarea#message");
    if (messageArea) {
      const counter = document.createElement("div");
      counter.style.cssText = "font-size: 0.8rem; color: #64748b; text-align: right; margin-top: 4px; transition: color 0.2s;";
      counter.textContent = "0 / 300 characters";
      messageArea.parentNode.appendChild(counter);

      messageArea.addEventListener("input", () => {
        const len = messageArea.value.length;
        counter.textContent = `${len} / 300 characters`;
        if (len > 300) {
          counter.style.color = "#ef4444";
        } else {
          counter.style.color = "#64748b";
        }
      });
    }

    // Helper: Show animated validation error message
    function showError(input, message) {
      clearError(input);
      input.style.borderColor = "#ef4444";
      input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.15)";
      
      const err = document.createElement("span");
      err.className = "input-error-msg";
      err.style.cssText = "display: block; font-size: 0.8rem; color: #ef4444; margin-top: 4px; animation: shake 0.3s ease-in-out;";
      err.textContent = message;
      input.parentNode.appendChild(err);
    }

    // Helper: Clear error
    function clearError(input) {
      input.style.borderColor = "#10b981";
      input.style.boxShadow = "none";
      const existing = input.parentNode.querySelector(".input-error-msg");
      if (existing) existing.remove();
    }

    // Live Validation on Blur / Input
    inputs.forEach((input) => {
      input.addEventListener("input", () => clearError(input));

      input.addEventListener("blur", () => {
        if (input.hasAttribute("required") && !input.value.trim()) {
          showError(input, "This field is required.");
        } else if (input.type === "email" && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            showError(input, "Please enter a valid email address.");
          } else {
            clearError(input);
          }
        }
      });
    });

    // Handle Form Submission with Animated Loading & Success State
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let hasError = false;
      inputs.forEach((input) => {
        if (input.hasAttribute("required") && !input.value.trim()) {
          showError(input, "This field is required.");
          hasError = true;
        }
      });

      if (hasError) return;

      // Animated Loading State on the Button
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.8";
      submitBtn.innerHTML = `
        <span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #ffffff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; margin-right: 8px;"></span>
        Sending message...
      `;

      // Simulate sending data (2 seconds)
      setTimeout(() => {
        // Animated Success Banner
        contactForm.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
            <div style="width: 55px; height: 55px; background: #d1fae5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem;">
              ✓
            </div>
            <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem; color: #0f172a;">Message Sent!</h3>
            <p style="color: #64748b; font-size: 0.95rem;">
              Thank you for reaching out. A financial advisor from Finance Assist will contact you within 24 hours.
            </p>
          </div>
        `;
      }, 1500);
    });
  }

  // ========================================================
  // 3. ANIMATED NUMBER TICKER (E.g. for Stats & Savings)
  // ========================================================
  function animateValue(obj, start, end, duration, prefix = "", suffix = "") {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const currentVal = (easeProgress * (end - start) + start).toFixed(2);
      obj.textContent = `${prefix}${currentVal}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // ========================================================
  // 4. INTERACTIVE PRICING TOGGLE (Monthly vs. Annual)
  // ========================================================
  const pricingSection = document.querySelector(".pricing-header");

  if (pricingSection && document.querySelector(".pricing-grid")) {
    // Dynamically insert an animated billing switch
    const switchContainer = document.createElement("div");
    switchContainer.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 1.5rem;";
    switchContainer.innerHTML = `
      <span style="font-weight: 600; font-size: 0.95rem; color: #0f172a;">Monthly</span>
      <label style="position: relative; display: inline-block; width: 48px; height: 26px;">
        <input type="checkbox" id="billing-toggle" style="opacity: 0; width: 0; height: 0;">
        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 26px;">
          <span class="slider-circle" style="position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%;"></span>
        </span>
      </label>
      <span style="font-weight: 600; font-size: 0.95rem; color: #64748b;">Annual <small style="background: #d1fae5; color: #059669; padding: 2px 6px; border-radius: 10px; font-size: 0.75rem; margin-left: 4px;">Save 20%</small></span>
    `;

    pricingSection.appendChild(switchContainer);

    const toggle = document.getElementById("billing-toggle");
    const sliderBg = toggle.nextElementSibling;
    const sliderCircle = sliderBg.querySelector(".slider-circle");

    // Interactive toggle animation & price calculation
    toggle.addEventListener("change", (e) => {
      const isAnnual = e.target.checked;

      // Animate Switch
      if (isAnnual) {
        sliderBg.style.backgroundColor = "#10b981";
        sliderCircle.style.transform = "translateX(22px)";
      } else {
        sliderBg.style.backgroundColor = "#cbd5e1";
        sliderCircle.style.transform = "translateX(0)";
      }

      // Smoothly animate pricing numbers
      const pricingCards = document.querySelectorAll(".pricing-card");
      pricingCards.forEach((card) => {
        const priceElement = card.querySelector(".price");
        const btn = card.querySelector(".select-plan-btn");
        if (!priceElement || !btn) return;

        const baseMonthly = parseFloat(btn.dataset.price);
        if (baseMonthly === 0) return; // Free plan stays free

        let targetPrice = isAnnual ? (baseMonthly * 0.8) : baseMonthly;
        let suffix = isAnnual ? " / mo (billed yearly)" : " / month";

        priceElement.innerHTML = `£${targetPrice.toFixed(2)}<span style="font-size: 1rem; color: #64748b; font-weight: 400;">${suffix}</span>`;
        
        // Update dataset attribute on button
        btn.dataset.cycle = isAnnual ? "annually" : "monthly";
        btn.dataset.price = targetPrice.toFixed(2);
      });
    });
  }

  // ========================================================
  // 5. MICRO-INTERACTION: BUTTON CLICK RIPPLE EFFECT
  // ========================================================
  const actionButtons = document.querySelectorAll(".btn, .btn-primary, .btn-outline, .submit-btn");

  actionButtons.forEach((btn) => {
    btn.style.position = "relative";
    btn.style.overflow = "hidden";

    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ========================================================
  // 6. INJECT KEYFRAME ANIMATIONS INTO DOCUMENT HEAD
  // ========================================================
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);
});
