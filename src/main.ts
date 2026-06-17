import './index.css';
import { culturalEvents, fomoStats, valueProps } from './data';
import { CulturalEvent } from './types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ovuywtzriwenjieaejnu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dXl3dHpyaXdlbmppZWFlam51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTc3NjMsImV4cCI6MjA5NzI3Mzc2M30.9kBLMlzmIz9in4FQZ1fTqvMncPhzSsbyvuR6JngecaI";
const supabase = createClient(supabaseUrl, supabaseKey);


// Let's hold local application state
let isMuted = true;
let selectedPlan: 'free' | 'founding' = 'free';
let explorerCount = 111;
let hasSubmitted = false;

const waitlistForm = document.getElementById('waitlist-inputs-form') as HTMLFormElement;

  waitlistForm?.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop page reload

    // Grab values from inputs
    const nameInput = (document.getElementById('form-input-name')as HTMLInputElement).value;
    const emailInput = (document.getElementById('form-input-email')as HTMLInputElement).value;
    const phoneInput = (document.getElementById('form-input-phone')as HTMLInputElement).value;

    // Insert into Supabase table "NaaduCustomer"
    const { data, error } = await supabase
      .from("NaaduCustomer")
      .insert([
        { name: nameInput, Email: emailInput, phoneNor: phoneInput }
      ]);

    if (error) {
      console.error("Error inserting into Supabase:", error.message);
      alert("Signup failed: " + error.message);
    } else {
      console.log("User added successfully:", data);
      alert("You’ve been added to the waitlist!");
      waitlistForm.reset(); // clear form after success
    }
  });




// Simulated increment to make the waitlist feel "alive" over time
setInterval(() => {
  if (!hasSubmitted) {
    explorerCount += Math.floor(Math.random() * 2) + 1;
    const countEl = document.getElementById('explorers-count-el');
    if (countEl) {
      countEl.textContent = explorerCount.toLocaleString();
    }
  }
}, 12000);

// Transition Helpers matching React AnimatePresence
function openModal(dialogEl: HTMLElement) {
  dialogEl.classList.remove('hidden');
  // Trigger layout pass before starting transition
  requestAnimationFrame(() => {
    dialogEl.classList.add('opacity-100');
    const container = dialogEl.querySelector('.relative');
    if (container) {
      container.classList.remove('scale-95');
      container.classList.add('scale-100');
    }
  });
}

function closeModal(dialogEl: HTMLElement) {
  dialogEl.classList.remove('opacity-100');
  const container = dialogEl.querySelector('.relative');
  if (container) {
    container.classList.remove('scale-100');
    container.classList.add('scale-95');
  }
  setTimeout(() => {
    dialogEl.classList.add('hidden');
  }, 350);
}

// Render dynamic elements upon boot
document.addEventListener('DOMContentLoaded', () => {
  renderMarquees();
  renderFomoStats();
  renderValueProps();
  setupInteractions();
});

// 1. POPULATE THE DECORATIVE INFINITE MARQUEES
function renderMarquees() {
  const track1 = document.getElementById('marquee-track-1');
  const track2 = document.getElementById('marquee-track-2');
  if (!track1 || !track2) return;

  // Duplicate cards for seamless looping
  const listOne = [...culturalEvents, ...culturalEvents];
  const listTwo = [...[...culturalEvents].reverse(), ...culturalEvents];

  // Populate row 1 (forward scroll)
  listOne.forEach((event, idx) => {
    const card = createEventCard(event, `row1-${idx}`);
    track1.appendChild(card);
  });

  // Populate row 2 (reverse scroll)
  listTwo.forEach((event, idx) => {
    const card = createEventCard(event, `row2-${idx}`);
    track2.appendChild(card);
  });
}

function createEventCard(event: CulturalEvent, identifier: string): HTMLElement {
  const card = document.createElement('div');
  card.className = "relative w-64 md:w-80 h-96 shrink-0 rounded-sm overflow-hidden border border-white/10 bg-[#1a1310]/80 cursor-pointer shadow-lg group hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300";
  card.setAttribute('data-id', event.id);

  card.innerHTML = `
    <img
      src="${event.imageUrl}"
      alt="${event.name}"
      class="absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-105 transition duration-700 ease-out"
      referrerpolicy="no-referrer"
    />
    <!-- cinematic gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#130d0b] via-[#1a1310]/40 to-transparent"></div>
    
    <!-- Top metadata tags -->
    <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
      <span class="text-[10px] font-mono tracking-wider bg-black/60 text-brand-text/90 px-2.5 py-1 rounded-sm border border-white/5 backdrop-blur-sm">
        ${event.location.split(',')[1]?.trim() || event.location}
      </span>
      <span class="flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase bg-brand-red text-brand-text px-2 md:px-2.5 py-1 rounded-sm shadow-sm font-semibold ${identifier.includes('row1') ? 'animate-pulse bg-[#B0341F]' : 'bg-[#5C4D3C]'}">
        ${identifier.includes('row1') ? `<span class="w-1.5 h-1.5 rounded-full bg-white block"></span>` : ''}
        ${identifier.includes('row1') ? event.tag : event.seasonMonth}
      </span>
    </div>

    <!-- Bottom detail summary -->
    <div class="absolute bottom-4 left-4 right-4 z-10 transition">
      <p class="text-[10px] font-mono text-[#E8900A] uppercase tracking-widest font-semibold mb-1">
        ${event.location.split(',')[0]}
      </p>
      <h3 class="font-serif text-lg md:text-xl text-brand-text font-normal group-hover:text-[#E8900A] transition-colors">
        ${event.name}
      </h3>
      <p class="text-[11px] text-[#A89B89] line-clamp-2 mt-1.5 group-hover:text-brand-text transition duration-200">
        ${event.description}
      </p>
    </div>
  `;

  // Attach card click listener
  card.addEventListener('click', () => {
    openEventDetailDialog(event);
  });

  return card;
}

// 2. POPULATE THE DYNAMIC LOST MOMENTS FOMO GRID
function renderFomoStats() {
  const fomoGrid = document.getElementById('fomo-grid');
  if (!fomoGrid) return;

  fomoStats.forEach((stat, idx) => {
    const card = document.createElement('div');
    card.className = "border border-white/15 p-6 md:p-8 flex flex-col justify-between h-full bg-[#1a1310]/40 rounded-sm hover:-translate-y-1 hover:borderColor-brand-gold transition-all duration-300";

    // Select dynamic iconic nodes matching original styles
    let svgIcon = '';
    if (stat.id === 'stat-1') {
      svgIcon = `<svg class="w-5 h-5 text-[#E8900A] mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    } else if (stat.id === 'stat-2') {
      svgIcon = `<svg class="w-5 h-5 text-brand-red mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    } else {
      svgIcon = `<svg class="w-5 h-5 text-brand-muted mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`;
    }

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-4">
          ${svgIcon}
          <span class="text-[10px] font-mono tracking-widest text-[#B0341F] font-bold uppercase">
            0${idx + 1} / Telemetry
          </span>
        </div>
        
        <h3 class="font-serif text-lg md:text-xl text-brand-text mb-4 leading-relaxed font-normal">
          ${stat.boldText}
        </h3>
      </div>

      <div class="space-y-3 pt-6 border-t border-white/5">
        <p class="text-xs text-[#A89B89]/90 font-sans leading-relaxed">
          ${stat.subText}
        </p>
        
        <p class="font-mono text-[10px] text-[#E8900A] uppercase tracking-widest font-semibold pt-1">
          &mdash; ${stat.punch}
        </p>
      </div>
    `;
    fomoGrid.appendChild(card);
  });
}

// 3. POPULATE THE CREED VALUE PROPS GRID
function renderValueProps() {
  const valueGrid = document.getElementById('value-props-grid');
  if (!valueGrid) return;

  valueProps.forEach((prop) => {
    const card = document.createElement('div');
    card.className = "p-5 bg-black/40 border border-white/10 rounded-sm hover:-translate-y-1 hover:border-[#E8900A]/25 transition-all duration-300 shadow-md flex flex-col justify-between min-h-[290px]";

    let iconSvg = '';
    if (prop.iconName === 'Compass') {
      iconSvg = `<svg class="w-5 h-5 text-[#E8900A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
    } else if (prop.iconName === 'Tv') {
      iconSvg = `<svg class="w-5 h-5 text-[#E8900A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`;
    } else {
      iconSvg = `<svg class="w-5 h-5 text-[#E8900A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }

    const titleParts = prop.title.split(' ');
    const firstWord = titleParts[0];
    const restWords = titleParts.slice(1).join(' ');

    card.innerHTML = `
<div class="flex flex-col justify-between p-6 border border-white/10 bg-white/[0.02] rounded-sm aspect-[3/4] min-h-[340px] w-full text-left overflow-hidden">
  
  <div class="space-y-4">
    <div class="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center rounded-sm shrink-0">
      ${iconSvg}
    </div>
    
    <h3 class="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
      ${firstWord} <span class="text-[#E8900A] italic">${restWords}</span>
    </h3>
    
    <p class="text-[12px] text-[#A89B89] font-sans leading-relaxed line-clamp-4">
      ${prop.description}
    </p>
  </div>
  
  <div class="mt-auto flex items-center gap-1.5 text-[9px] text-[#E8900A] font-mono uppercase tracking-[0.15em] font-bold">
    <svg class="w-3 h-3 text-[#E8900A] animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
    </svg>
    Preservation Node
  </div>

</div>
    `;
    valueGrid.appendChild(card);
  });
}

document.getElementById('imageblurry')?.addEventListener('mouseover',() =>{
  const img = document.getElementById('imgblr');
if (img) {
  img.style.filter = 'none'; // Overrides the CSS file
}
});
document.getElementById('imageblurry')?.addEventListener('mouseout',() =>{
  const img = document.getElementById('imgblr');
if (img) {
  img.style.filter = 'blur(5px)'; // Overrides the CSS file
}
});



document.getElementById('tamilnaDiv')?.addEventListener('mouseover',() =>{
  const img = document.getElementById('tamilnaImg');
if (img) {
  img.style.filter = 'none'; // Overrides the CSS file
}
});
document.getElementById('tamilnaDiv')?.addEventListener('mouseout',() =>{
  const img = document.getElementById('tamilnaImg');
if (img) {
  img.style.filter = 'blur(5px)'; // Overrides the CSS file
}
});



document.getElementById('karnatdiv')?.addEventListener('mouseover',() =>{
  const img = document.getElementById('karnatimg');
if (img) {
  img.style.filter = 'none'; // Overrides the CSS file
}
});
document.getElementById('karnatdiv')?.addEventListener('mouseout',() =>{
  const img = document.getElementById('karnatimg');
if (img) {
  img.style.filter = 'blur(5px)'; // Overrides the CSS file
}
});


// 4. ESTABLISH INTERACTION CONTROLLER
function setupInteractions() {
  
  // NAV SCROLL ROUTERS
  const scrollToWaitlist = () => {
    document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  document.getElementById('navbar-cta-btn')?.addEventListener('click', scrollToWaitlist);
  document.getElementById('hero-cta-btn')?.addEventListener('click', scrollToWaitlist);

  // VIDEO ATMOSPHERE AUDIO CONTROL
  const videoEl = document.getElementById('hero-video') as HTMLVideoElement;
  const audioBtn = document.getElementById('volume-toggle-btn');
  const muteIcon = document.getElementById('volume-icon-muted');
  const playIcon = document.getElementById('volume-icon-playing');
  const volumeTxt = document.getElementById('volume-text');

  if (audioBtn && videoEl) {
    audioBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      videoEl.muted = isMuted;

      if (isMuted) {
        muteIcon?.classList.remove('hidden');
        playIcon?.classList.add('hidden');
        if (volumeTxt) {
          volumeTxt.textContent = "Sound Off";
          volumeTxt.className = "text-[10px] uppercase tracking-widest font-mono hidden sm:inline text-[#A89B89]";
        }
      } else {
        muteIcon?.classList.add('hidden');
        playIcon?.classList.remove('hidden');
        if (volumeTxt) {
          volumeTxt.textContent = "Listening Live";
          volumeTxt.className = "text-[10px] uppercase tracking-widest font-mono hidden sm:inline text-[#E8900A]";
        }
      }
    });
  }

  // WAITLIST METHOD SELECTOR
  const freeCard = document.getElementById('plan-free-card');
  const foundingCard = document.getElementById('plan-founding-card');
  const radioFreeDot = document.querySelector('#radio-free > div');
  const radioFoundingDot = document.querySelector('#radio-founding > div');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitBtn = document.getElementById('form-submit-btn');

  if (freeCard && foundingCard) {
    freeCard.addEventListener('click', () => {
      selectedPlan = 'free';
      
      // Update Free card selection styles
      freeCard.className = "relative p-6 rounded-sm border cursor-pointer transition-all duration-300 flex items-start gap-4 border-[#E8900A]/50 bg-black/60 shadow-md";
      // Clear Founding card select styles
      foundingCard.className = "relative p-6 rounded-sm border cursor-pointer transition-all duration-300 flex items-start gap-4 border-white/5 bg-[#18110e]/40 hover:border-white/15";

      // Show Free dot / Hide founding dot
      radioFreeDot?.classList.remove('hidden');
      radioFoundingDot?.classList.add('hidden');

      // Swap button styles
      if (submitBtnText) submitBtnText.textContent = "Join Free Waitlist";
      if (submitBtn) {
        submitBtn.className = "w-full py-3.5 mt-2 rounded-sm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition duration-350 cursor-pointer bg-brand-red text-white hover:bg-[#8e1d09]";
      }
    });

    foundingCard.addEventListener('click', () => {
      selectedPlan = 'founding';

      // Update Founding card selection styles
      foundingCard.className = "relative p-6 rounded-sm border cursor-pointer transition-all duration-300 flex items-start gap-4 bg-gradient-to-br from-[#291712] to-black/80 border-[#E8900A] shadow-[0_0_20px_rgba(232,144,10,0.1)]";
      // Clear Free card styles
      freeCard.className = "relative p-6 rounded-sm border cursor-pointer transition-all duration-300 flex items-start gap-4 border-white/5 bg-[#18110e]/40 hover:border-white/15";

      // Show Founding dot / Hide free
      radioFoundingDot?.classList.remove('hidden');
      radioFreeDot?.classList.add('hidden');

      // Swap button styles to Gold
      if (submitBtnText) submitBtnText.textContent = "Unlock Founding Membership";
      if (submitBtn) {
        submitBtn.className = "w-full py-3.5 mt-2 rounded-sm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition duration-350 cursor-pointer bg-[#F5EDE0] text-[#1a1310] hover:bg-[#E8900A]";
      }
    });
  }

  // SIGN UP FORM SUBMISSION
  const waitlistForm = document.getElementById('waitlist-inputs-form') as HTMLFormElement;
  waitlistForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = (document.getElementById('form-input-name') as HTMLInputElement).value;
    const emailInput = (document.getElementById('form-input-email') as HTMLInputElement).value;
    const phoneInput = (document.getElementById('form-input-phone') as HTMLInputElement).value;

    if (!nameInput.trim() || !emailInput.trim()) return;

    if (selectedPlan === 'free') {
      completeEnlistment(nameInput, emailInput, 'free');
    } else {
      openPCIModal(nameInput, emailInput);
    }
  });

  // DETAIL DIALOG CLOSE ACTIONS
  const detailOverlay = document.getElementById('event-dialog-overlay');
  const detailsCloseBtn = document.getElementById('event-dialog-close-btn');
  const detailsSupportBtn = document.getElementById('dialog-support-btn');

  if (detailsCloseBtn && detailOverlay) {
    detailsCloseBtn.addEventListener('click', () => closeModal(detailOverlay));
    detailOverlay.addEventListener('click', (e) => {
      if (e.target === detailOverlay) closeModal(detailOverlay);
    });
  }

  if (detailsSupportBtn && detailOverlay) {
    detailsSupportBtn.addEventListener('click', () => {
      closeModal(detailOverlay);
      scrollToWaitlist();
    });
  }

  // RESET BUTTON ACTION
  const addAnotherBtn = document.getElementById('success-add-another-btn');
  addAnotherBtn?.addEventListener('click', () => {
    // Reset outputs
    const signUpForm = document.getElementById('waitlist-form-layout');
    const successLayout = document.getElementById('waitlist-success-layout');
    
    if (signUpForm && successLayout) {
      successLayout.classList.add('hidden');
      signUpForm.classList.remove('hidden');
    }

    // Reset fields
    waitlistForm.reset();
    hasSubmitted = false;
  });
}

// 5. CULTURAL EVENTS DIALOG OVERLAY CHANGER
function openEventDetailDialog(event: CulturalEvent) {
  const overlay = document.getElementById('event-dialog-overlay');
  const img = document.getElementById('dialog-event-img') as HTMLImageElement;
  const loc = document.getElementById('dialog-event-location');
  const season = document.getElementById('dialog-event-season');
  const name = document.getElementById('dialog-event-name');
  const desc = document.getElementById('dialog-event-description');

  if (!overlay || !img || !loc || !season || !name || !desc) return;

  // Change contents
  img.src = event.imageUrl;
  img.alt = event.name;
  loc.textContent = event.location;
  season.textContent = event.seasonMonth;
  name.textContent = event.name;
  desc.textContent = event.description;

  openModal(overlay);
}

// 6. OPEN SECURE PCI PAYMENT GATEWAY MODAL
function openPCIModal(userName: string, userEmail: string) {
  const pciOverlay = document.getElementById('payment-dialog-overlay');
  const nameDisplay = document.getElementById('payment-user-name');
  if (!pciOverlay) return;

  if (nameDisplay) {
    nameDisplay.textContent = userName;
  }

  // Restore step 1 form
  const pForm = document.getElementById('payment-step-form');
  const pProc = document.getElementById('payment-step-processing');
  const pSucc = document.getElementById('payment-step-success');
  
  pForm?.classList.remove('hidden');
  pProc?.classList.add('hidden');
  pSucc?.classList.add('hidden');

  const pErrorBox = document.getElementById('payment-error');
  pErrorBox?.classList.add('hidden');

  openModal(pciOverlay);

  // Setup tab togglers inside payment modal
  const tabUpi = document.getElementById('tab-upi');
  const tabCard = document.getElementById('tab-card');
  const upiLayout = document.getElementById('payment-upi-layout');
  const cardLayout = document.getElementById('payment-card-layout');
  let selectedMethod: 'upi' | 'card' = 'upi';

  if (tabUpi && tabCard && upiLayout && cardLayout) {
    tabUpi.addEventListener('click', () => {
      selectedMethod = 'upi';
      tabUpi.className = "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-bold transition bg-[#B0341F] text-white shadow-md cursor-pointer";
      tabCard.className = "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-bold transition text-[#A89B89] hover:text-[#F5EDE0] hover:bg-white/5 cursor-pointer";
      upiLayout.classList.remove('hidden');
      cardLayout.classList.add('hidden');
    });

    tabCard.addEventListener('click', () => {
      selectedMethod = 'card';
      tabCard.className = "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-bold transition bg-[#B0341F] text-white shadow-md cursor-pointer";
      tabUpi.className = "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-bold transition text-[#A89B89] hover:text-[#F5EDE0] hover:bg-white/5 cursor-pointer";
      cardLayout.classList.remove('hidden');
      upiLayout.classList.add('hidden');
    });
  }

  // Mask Expiry / Card number behaviors
  const cardInput = document.getElementById('input-card-number') as HTMLInputElement;
  const expiryInput = document.getElementById('input-card-expiry') as HTMLInputElement;
  const cvvInput = document.getElementById('input-card-cvv') as HTMLInputElement;

  cardInput?.addEventListener('input', (e) => {
    let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    (e.target as HTMLInputElement).value = formatted;
  });

  expiryInput?.addEventListener('input', (e) => {
    let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length >= 2) {
      (e.target as HTMLInputElement).value = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      (e.target as HTMLInputElement).value = value;
    }
  });

  cvvInput?.addEventListener('input', (e) => {
    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  });

  // CLOSE BUTTON HANDLERS
  const pciClose = document.getElementById('payment-modal-close-btn');
  pciClose?.addEventListener('click', () => closeModal(pciOverlay));

  // CONFIRM PAYMENT GATEWAY TRIGGER
  const paymentForm = document.getElementById('payment-sub-form');
  paymentForm?.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // Fast credentials check
    let valid = true;
    const upiId = (document.getElementById('input-upi-id') as HTMLInputElement).value;

    if (selectedMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        valid = false;
        showPaymentError("Please provide a valid UPI ID (containing '@')");
      }
    } else {
      const num = cardInput.value.replace(/\s/g, '');
      const exp = expiryInput.value;
      const cvv = cvvInput.value;

      if (num.length < 16 || exp.length < 5 || cvv.length < 3) {
        valid = false;
        showPaymentError("Please enter valid card details (16-digit card, match MM/YY and CVV)");
      }
    }

    if (valid) {
      triggerSecureHandshake(userName, userEmail);
    }
  });
}

function showPaymentError(msg: string) {
  const errBox = document.getElementById('payment-error');
  const errMsg = document.getElementById('payment-error-msg');
  if (errBox && errMsg) {
    errMsg.textContent = msg;
    errBox.classList.remove('hidden');
  }
}

// 7. SIMULATE HANDSHAKE TIMELINE WITH PROGRESS LOGIC
function triggerSecureHandshake(userName: string, userEmail: string) {
  const pForm = document.getElementById('payment-step-form');
  const pProc = document.getElementById('payment-step-processing');
  const pSucc = document.getElementById('payment-step-success');
  const pBar = document.getElementById('processing-progressbar');

  if (!pForm || !pProc || !pSucc) return;

  // Swap to process
  pForm.classList.add('hidden');
  pProc.classList.remove('hidden');

  // Trigger loading bar movement
  if (pBar) {
    pBar.style.width = '0%';
    requestAnimationFrame(() => {
      pBar.style.width = '100%';
    });
  }

  // After loading completes
  setTimeout(() => {
    pProc.classList.add('hidden');
    pSucc.classList.remove('hidden');

    // Populate Payment Success Details block
    const sName = document.getElementById('p-success-name');
    const sCode = document.getElementById('p-success-code');
    if (sName) sName.textContent = userName;
    if (sCode) sCode.textContent = `NADU-FNDR-${explorerCount + 1001}`;

    const returnBtn = document.getElementById('payment-success-return-btn');
    returnBtn?.addEventListener('click', () => {
      closeModal(document.getElementById('payment-dialog-overlay')!);
      completeEnlistment(userName, userEmail, 'founding');
    });

  }, 3200);
}

// 8. FINAL REGISTRATION COMPLETION AND TOKEN DISPATCH
function completeEnlistment(userName: string, userEmail: string, plan: 'free' | 'founding') {
  hasSubmitted = true;
  explorerCount += 1; // Registered

  const signUpForm = document.getElementById('waitlist-form-layout');
  const successLayout = document.getElementById('waitlist-success-layout');

  if (!signUpForm || !successLayout) return;

  // Swap screens
  signUpForm.classList.add('hidden');
  successLayout.classList.remove('hidden');

  // Scroll waitlist to view card cleanly
  document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });

  // Update success ticket fields
  const ticketName = document.getElementById('success-user-name');
  const ticketIdx = document.getElementById('success-member-id');
  const cardName = document.getElementById('success-card-name');
  const cardEmail = document.getElementById('success-card-email');
  const cardToken = document.getElementById('success-card-token');
  const badgeBadge = document.getElementById('success-badge-badge');

  const assignedId = explorerCount;
  const postfixId = assignedId + 1000;

  if (ticketName) ticketName.textContent = userName.split(' ')[0];
  if (ticketIdx) ticketIdx.textContent = `#${assignedId}`;
  if (cardName) cardName.textContent = userName;
  if (cardEmail) cardEmail.textContent = userEmail;

  if (plan === 'free') {
    if (cardToken) cardToken.textContent = `NADU-EXP-${postfixId}`;
    if (badgeBadge) {
      badgeBadge.textContent = "Explorer";
      badgeBadge.className = "text-[9px] font-mono uppercase tracking-wider bg-white/10 border border-white/10 text-[#E8900A] px-3 py-1 rounded-sm";
    }
  } else {
    if (cardToken) cardToken.textContent = `NADU-FNDR-${postfixId}`;
    if (badgeBadge) {
      badgeBadge.textContent = "Founding Guardian";
      badgeBadge.className = "text-[9px] font-mono uppercase tracking-wider bg-[#E8900A]/20 border border-[#E8900A]/30 text-[#E8900A] px-3 py-1 rounded-sm font-semibold";
    }
  }

  // Trigger firelight/confetti splash
  burstConfetti();
}

function burstConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = ''; // Clear

  const colors = ['#E8900A', '#B0341F', '#F5EDE0', '#ffffff', '#F5A623'];
  for (let i = 0; i < 35; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const xPos = Math.random() * 100;
    const size = Math.random() * 6 + 4;
    const duration = Math.random() * 2 + 1.2;
    const delay = Math.random() * 0.4;
    
    el.style.position = 'absolute';
    el.style.backgroundColor = color;
    el.style.left = `${xPos}%`;
    el.style.top = `-20px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = '2px';
    el.style.opacity = '0.8.5';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.pointerEvents = 'none';

    // Apply keyframe programmatic animations directly
    el.animate([
      { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 0.9 },
      { transform: `translateY(400px) rotate(${Math.random() * 720}deg) scale(0.6)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
      fill: 'forwards'
    });

    container.appendChild(el);
  }
}
