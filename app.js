/**
 * SANKALP ENTERPRISE - POWER SOLAR SOLUTION
 * NFC Digital Business Card & Mini Website Logic
 * Powered by Khushi Creative Tech
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Business & Contact Data Configuration
  const BUSINESS_DATA = {
    name: "Sankalp Enterprise",
    fullName: "Sankalp Enterprise - Power Solar Solution",
    phone: "+919998400629",
    rawPhone: "9998400629",
    email: "sankalpenterprise2229@gmail.com",
    address: "Kuvadva, Rajkot, Gujarat 360023, India",
    instagram: "https://www.instagram.com/sankalp_enterprise_?utm_source=qr&stkn=MThlbG5yb25zdWlrZQ==",
    facebook: "https://www.facebook.com/share/1L7hgCSMjZ/",
    developerWebsite: "https://khushicreativetech.in"
  };

  // State Management
  let currentLang = localStorage.getItem('sankalp_lang') || 'gu'; // Default to Gujarati
  let selectedPack = '1 Bottle (500ml)';

  // DOM Elements
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langLabel = document.getElementById('langLabel');
  const btnSaveContact = document.getElementById('btnSaveContact');
  const stickySaveBtn = document.getElementById('stickySaveBtn');
  const btnOrderLiquid = document.getElementById('btnOrderLiquid');
  const packRadioInputs = document.querySelectorAll('input[name="packSize"]');
  const plantSlider = document.getElementById('plantSlider');
  const plantSizeDisplay = document.getElementById('plantSizeDisplay');
  const lossUnits = document.getElementById('lossUnits');
  const gainedUnits = document.getElementById('gainedUnits');
  const savedMoney = document.getElementById('savedMoney');
  const btnCalcWhatsapp = document.getElementById('btnCalcWhatsapp');
  const inquiryForm = document.getElementById('inquiryForm');
  const shareModalBtn = document.getElementById('shareModalBtn');
  const btnWebShare = document.getElementById('btnWebShare');
  const qrModal = document.getElementById('qrModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const btnModalShare = document.getElementById('btnModalShare');
  const btnCopyLink = document.getElementById('btnCopyLink');
  const copyLinkText = document.getElementById('copyLinkText');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const qrContainer = document.getElementById('qrContainer');
  const currentYearSpan = document.getElementById('currentYear');

  // Set current year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================
  // LANGUAGE SWITCHER ENGINE (GUJARATI <-> ENGLISH)
  // =========================================================
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sankalp_lang', lang);
    document.documentElement.lang = lang;

    // Toggle button label shows the opposite/alternate option
    if (lang === 'gu') {
      langLabel.textContent = 'English';
    } else {
      langLabel.textContent = 'ગુજરાતી';
    }

    // Update all elements with data-en and data-gu
    const translatableElements = document.querySelectorAll('[data-en][data-gu]');
    translatableElements.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    // Update form placeholders & options
    const custName = document.getElementById('custName');
    const custCity = document.getElementById('custCity');
    const custNote = document.getElementById('custNote');

    if (lang === 'gu') {
      if (custName) custName.placeholder = 'દા.ત. રમેશભાઈ પટેલ';
      if (custCity) custCity.placeholder = 'દા.ત. રાજકોટ / કુવાડવા / મોરબી';
      if (custNote) custNote.placeholder = 'દા.ત. ૫ બોટલ જોઈએ છે / ૧૦ કિલોવોટ પ્લાન્ટનું ક્વોટેશન જોઈએ છે...';
    } else {
      if (custName) custName.placeholder = 'e.g. Ramesh Patel';
      if (custCity) custCity.placeholder = 'e.g. Rajkot / Kuvadva / Morbi';
      if (custNote) custNote.placeholder = 'e.g. Need 5 bottles / Need quotation for 10kW system...';
    }

    // Recompute calculator text
    updateCalculator();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'gu' ? 'en' : 'gu';
      updateLanguage(newLang);
      showToast(newLang === 'gu' ? 'ગુજરાતી ભાષા પસંદ થઈ' : 'Language set to English');
    });
  }

  // Initialize Language
  updateLanguage(currentLang);

  // =========================================================
  // VCARD (.VCF) CONTACT SAVER
  // =========================================================
  function downloadVCard() {
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Enterprise;Sankalp;;;',
      'FN:Sankalp Enterprise - Power Solar Solution',
      'ORG:Sankalp Enterprise',
      'TITLE:Power Solar Solution & Solar Cleaning Services',
      `TEL;TYPE=CELL,VOICE,PREF:${BUSINESS_DATA.phone}`,
      `EMAIL;TYPE=WORK,INTERNET:${BUSINESS_DATA.email}`,
      `ADR;TYPE=WORK:;;Kuvadva;Rajkot;Gujarat;360023;India`,
      `URL;TYPE=WORK:${BUSINESS_DATA.developerWebsite}`,
      `X-SOCIALPROFILE;TYPE=instagram:${BUSINESS_DATA.instagram}`,
      `X-SOCIALPROFILE;TYPE=facebook:${BUSINESS_DATA.facebook}`,
      'NOTE:Specialized Solar Panel Cleaning Liquid (500ml), Residential & Industrial Solar Fitting, Industrial AMC Cleaning Services. Rajkot, Gujarat.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'Sankalp_Enterprise_Solar.vcf');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    const msg = currentLang === 'gu' 
      ? 'સંકલ્પ એન્ટરપ્રાઇઝ કોન્ટેક્ટ કાર્ડ ડાઉનલોડ થયું! (ઓપન કરી સેવ કરો)' 
      : 'Sankalp Enterprise Contact card downloaded! (Open to save)';
    showToast(msg);
  }

  if (btnSaveContact) {
    btnSaveContact.addEventListener('click', downloadVCard);
  }
  if (stickySaveBtn) {
    stickySaveBtn.addEventListener('click', downloadVCard);
  }

  // =========================================================
  // PRODUCT PACK SELECTION & WHATSAPP ORDER
  // =========================================================
  packRadioInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      document.querySelectorAll('.pack-option-label').forEach(label => label.classList.remove('active'));
      const parentLabel = e.target.closest('.pack-option-label');
      if (parentLabel) parentLabel.classList.add('active');
      selectedPack = e.target.value;
    });
  });

  if (btnOrderLiquid) {
    btnOrderLiquid.addEventListener('click', () => {
      let message = "";
      if (currentLang === 'gu') {
        message = `નમસ્તે સંકલ્પ એન્ટરપ્રાઇઝ,\n\nહું *સોલાર પેનલ ક્લિનિંગ લિક્વિડ (500ml)* માટે ઓર્ડર કરવા માંગુ છું.\n📦 પસંદ કરેલ પેક: *${selectedPack}*\n\nકૃપા કરીને કિંમત અને ડિલિવરીની વિગત આપો.`;
      } else {
        message = `Hello Sankalp Enterprise,\n\nI would like to order *Solar Panel Cleaning Liquid (500ml)*.\n📦 Selected Pack: *${selectedPack}*\n\nPlease provide pricing, delivery details and payment options.`;
      }
      const whatsappUrl = `https://wa.me/${BUSINESS_DATA.rawPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // =========================================================
  // SERVICE INQUIRY BUTTONS
  // =========================================================
  const serviceInquireButtons = document.querySelectorAll('.service-inquire-btn');
  serviceInquireButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      let message = "";
      if (currentLang === 'gu') {
        message = `નમસ્તે સંકલ્પ એન્ટરપ્રાઇઝ,\n\nહું આપની સર્વિસ *"${serviceName}"* વિશે પૂછપરછ અને ક્વોટેશન મેળવવા માંગુ છું.\nકૃપા કરીને વિગતવાર માહિતી આપો.`;
      } else {
        message = `Hello Sankalp Enterprise,\n\nI am interested in your *"${serviceName}"* service and would like to get a quotation and consultation.\nPlease assist.`;
      }
      const whatsappUrl = `https://wa.me/${BUSINESS_DATA.rawPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  });

  // =========================================================
  // INTERACTIVE SOLAR SAVINGS CALCULATOR
  // =========================================================
  function updateCalculator() {
    if (!plantSlider) return;
    const kw = parseInt(plantSlider.value, 10);
    if (plantSizeDisplay) {
      plantSizeDisplay.textContent = `${kw} kW`;
    }

    // Calculations based on standard solar stats in Gujarat:
    // 1 kW generates approx 120 units/month.
    // Soiling / dust loss is around 25% (30 units/kW/month).
    const monthlyUnitsLost = Math.round(kw * 30);
    const extraUnitsGained = monthlyUnitsLost;
    const estimatedSavingsRupees = Math.round(extraUnitsGained * 7.5);

    if (lossUnits) {
      lossUnits.textContent = `~${monthlyUnitsLost.toLocaleString('en-IN')} Units`;
    }
    if (gainedUnits) {
      gainedUnits.textContent = `+${extraUnitsGained.toLocaleString('en-IN')} Units`;
    }
    if (savedMoney) {
      savedMoney.textContent = `₹ ${estimatedSavingsRupees.toLocaleString('en-IN')}+`;
    }
  }

  if (plantSlider) {
    plantSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  if (btnCalcWhatsapp) {
    btnCalcWhatsapp.addEventListener('click', () => {
      const kw = plantSlider ? plantSlider.value : "5";
      const gained = gainedUnits ? gainedUnits.textContent : "150 Units";
      const saved = savedMoney ? savedMoney.textContent : "₹ 1,200+";

      let message = "";
      if (currentLang === 'gu') {
        message = `નમસ્તે સંકલ્પ એન્ટરપ્રાઇઝ,\n\nમારી પાસે *${kw} kW* નો સોલાર પ્લાન્ટ છે.\nમેં કેલ્ક્યુલેટર પર જોયું કે નિયમિત ક્લિનિંગથી મને દર મહિને *${gained}* વધુ અને અંદાજે *${saved}* ની બચત થઈ શકે છે.\n\nકૃપા કરીને આ પ્લાન્ટ માટે સોલાર ક્લિનિંગ લિક્વિડ / AMC સર્વિસનું ક્વોટેશન આપો.`;
      } else {
        message = `Hello Sankalp Enterprise,\n\nI have a *${kw} kW* Solar Plant setup.\nAs per your calculator, cleaning can help generate *${gained}* extra units and save *${saved}* per month.\n\nPlease share details and quotation for Solar Cleaning Liquid / AMC Contract for this capacity.`;
      }
      const whatsappUrl = `https://wa.me/${BUSINESS_DATA.rawPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // =========================================================
  // QUICK WHATSAPP INQUIRY FORM SUBMISSION
  // =========================================================
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const city = document.getElementById('custCity').value.trim();
      const service = document.getElementById('serviceType').value;
      const note = document.getElementById('custNote').value.trim();

      let message = "";
      if (currentLang === 'gu') {
        message = `*સંકલ્પ એન્ટરપ્રાઇઝ - નવી પૂછપરછ:*\n\n👤 નામ: ${name}\n📍 શહેર/ગામ: ${city}\n📌 રસ ધરાવતી સેવા: ${service}\n`;
        if (note) message += `📝 વિગત: ${note}\n`;
        message += `\nકૃપા કરીને મને વહેલી તકે સંપર્ક કરો. આભાર!`;
      } else {
        message = `*Sankalp Enterprise - New Lead / Inquiry:*\n\n👤 Name: ${name}\n📍 City/Location: ${city}\n📌 Requirement: ${service}\n`;
        if (note) message += `📝 Note: ${note}\n`;
        message += `\nPlease get in touch with me soon. Thank you!`;
      }

      const whatsappUrl = `https://wa.me/${BUSINESS_DATA.rawPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      showToast(currentLang === 'gu' ? 'વોટ્સએપ ખોલવામાં આવી રહ્યું છે...' : 'Opening WhatsApp...');
    });
  }

  // =========================================================
  // QR CODE & SHARING MODAL
  // =========================================================
  function renderQRCode() {
    if (!qrContainer) return;
    qrContainer.innerHTML = '';
    const shareUrl = window.location.href;

    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: shareUrl,
        width: 156,
        height: 156,
        colorDark: "#0b1728",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      // Fallback SVG QR placeholder if library fails to load
      qrContainer.innerHTML = `
        <div style="font-size:12px;color:#0369a1;text-align:center;padding:10px;">
          <i class="fa-solid fa-qrcode" style="font-size:70px;margin-bottom:8px;"></i><br>
          <strong>Sankalp Enterprise NFC Card</strong>
        </div>`;
    }
  }

  function openQRModal() {
    if (qrModal) {
      renderQRCode();
      qrModal.classList.add('active');
    }
  }

  function closeQRModal() {
    if (qrModal) {
      qrModal.classList.remove('active');
    }
  }

  if (shareModalBtn) shareModalBtn.addEventListener('click', openQRModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeQRModal);

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQRModal();
    });
  }

  // Web Share API
  async function triggerWebShare() {
    const shareData = {
      title: 'Sankalp Enterprise - Power Solar Solution',
      text: 'Check out Sankalp Enterprise: Solar Panel Cleaning Liquid (500ml), Solar Fitting & AMC Cleaning Services in Rajkot, Gujarat.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or not supported', err);
      }
    } else {
      openQRModal();
    }
  }

  if (btnWebShare) btnWebShare.addEventListener('click', triggerWebShare);
  if (btnModalShare) btnModalShare.addEventListener('click', triggerWebShare);

  // Copy Link
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (copyLinkText) {
          copyLinkText.textContent = currentLang === 'gu' ? 'લિંક કોપી થઈ ગઈ! ✔' : 'Link Copied! ✔';
          setTimeout(() => {
            copyLinkText.textContent = currentLang === 'gu' ? 'લિંક કોપી કરો' : 'Copy Link';
          }, 2500);
        }
        showToast(currentLang === 'gu' ? 'પ્રોફાઇલ લિંક ક્લિપબોર્ડમાં કોપી થઈ!' : 'Profile Link copied to clipboard!');
      });
    });
  }

  // =========================================================
  // MEDIA TABS (REAL BOTTLE <-> BANNER POSTER)
  // =========================================================
  const mediaTabBtns = document.querySelectorAll('.media-tab-btn');
  const bottleView = document.getElementById('bottleView');
  const bannerView = document.getElementById('bannerView');

  mediaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      if (target === 'bottleView') {
        if (bottleView) bottleView.style.display = 'flex';
        if (bannerView) bannerView.style.display = 'none';
      } else if (target === 'bannerView') {
        if (bottleView) bottleView.style.display = 'none';
        if (bannerView) bannerView.style.display = 'flex';
      }
    });
  });

  // =========================================================
  // TOAST NOTIFICATION HELPER
  // =========================================================
  let toastTimeout;
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }
});
