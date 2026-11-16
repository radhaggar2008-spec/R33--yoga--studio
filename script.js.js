// Interactive Fee Estimator & Trial Booking Storage for R33 yoga studio
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enquiryForm");
  const planSelect = document.getElementById("planSelect");
  const addonChecks = document.querySelectorAll(".addon-check");
  const estimatedTotalEl = document.getElementById("estimatedTotal");
  const feedbackEl = document.getElementById("formFeedback");
  const savedListEl = document.getElementById("savedEnquiriesList");
  const clearBtn = document.getElementById("clearHistoryBtn");

  const STORAGE_KEY = "r33_yoga_studio_enquiries";

  // 1. Live DOM Fee Estimator
  function calculateTotal() {
    let total = parseInt(planSelect.value, 10);
    addonChecks.forEach((checkbox) => {
      if (checkbox.checked) {
        total += parseInt(checkbox.value, 10);
      }
    });
    estimatedTotalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
    return total;
  }

  planSelect.addEventListener("change", calculateTotal);
  addonChecks.forEach((cb) => cb.addEventListener("change", calculateTotal));

  // 2. Render Saved Enquiries from Local Storage
  function renderEnquiries() {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (entries.length === 0) {
      savedListEl.innerHTML = `<p class="text-muted small fst-italic">No trial enquiries saved yet for R33 yoga studio. Fill out the form to reserve your spot.</p>`;
      return;
    }

    savedListEl.innerHTML = entries
      .map(
        (item) => `
        <div class="p-3 rounded-3 border bg-light">
          <div class="d-flex justify-content-between">
            <strong>${item.name}</strong>
            <span class="badge bg-success">${item.total}</span>
          </div>
          <small class="d-block text-muted">Plan: ${item.plan} (${item.experience})</small>
          <small class="d-block text-muted">Trial Date: ${item.date} | Ph: ${item.phone}</small>
        </div>
      `
      )
      .join("");
  }

  // 3. Form Validation + Local Storage Save
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("trialDate").value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const planName = planSelect.options[planSelect.selectedIndex].dataset.name;
    const total = estimatedTotalEl.textContent;

    // Validation Checks
    if (name.length < 2) {
      feedbackEl.innerHTML = `<div class="alert alert-danger py-2">Please enter your full name.</div>`;
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      feedbackEl.innerHTML = `<div class="alert alert-danger py-2">Please enter a valid email address.</div>`;
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      feedbackEl.innerHTML = `<div class="alert alert-danger py-2">Please enter a valid 10-digit phone number.</div>`;
      return;
    }
    if (!date) {
      feedbackEl.innerHTML = `<div class="alert alert-danger py-2">Please select a preferred trial date.</div>`;
      return;
    }

    // Save to Local Storage
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    existing.unshift({ name, email, phone, date, experience, plan: planName, total });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    feedbackEl.innerHTML = `<div class="alert alert-success py-2">Trial booked at R33 yoga studio for <strong>${name}</strong>! Your quote (${total}) has been saved.</div>`;
    form.reset();
    calculateTotal();
    renderEnquiries();
  });

  // Clear Saved Data
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderEnquiries();
  });

  // Initial Load
  calculateTotal();
  renderEnquiries();
});
