/* ==========================================================================
   First Fidelity Escrow, Inc. — Streamlined Open Escrow Order Page Logic
   - Uses a single clean dropdown (#txTypeSelect) to switch between the 6 types
   - Supports ?type=<slug> query parameter so clicking "Open Order" from any
     individual service page pre-selects that exact transaction type
   - Automatically sends the formatted order to orders@ffescrow.com
   ========================================================================== */

const FFE_ORDERS_EMAIL = 'orders@ffescrow.com';

const ORDER_TYPES = {
  'residential-purchase': {
    label: '01 — Residential Purchase & Resale',
    helper: 'Standard home purchase or resale closing with buyer, seller, and real estate agents.',
    priceLabel: 'Sale Price *',
    pricePlaceholder: 'e.g. $1,250,000',
    closeDateLabel: 'Target Closing Date',
    showDeposit: true,
    depositLabel: 'Earnest Money Deposit (Optional)',
    depositPlaceholder: 'e.g. $37,500 or 3%',
    contextLabel: 'Financing Type',
    contextPlaceholder: 'e.g. Conventional, VA, FHA, or All Cash',
    partiesHeading: 'Buyer & Seller',
    party1NameLabel: 'Buyer Name(s) *',
    party1NamePlaceholder: 'e.g. John & Mary Smith',
    party1ContactLabel: 'Buyer Email or Phone',
    showParty2: true,
    party2NameLabel: 'Seller Name(s)',
    party2ContactLabel: 'Seller Email or Phone',
    professionalsHeading: 'Agent, Lender & Your Contact',
    showAgentField: true,
    agentLabel: 'Real Estate Agent & Brokerage',
    agentPlaceholder: 'e.g. Jane Agent — Compass',
    lenderLabel: 'Buyer’s Lender / Loan Officer (Optional)',
    lenderPlaceholder: 'e.g. CrossCountry Mortgage'
  },

  'refinance-reverse': {
    label: '02 — Refinance & Reverse Mortgage',
    helper: 'Refinance, HELOC, or HECM Reverse Mortgage closing for lenders, brokers, and homeowners.',
    priceLabel: 'New Loan Amount *',
    pricePlaceholder: 'e.g. $850,000',
    closeDateLabel: 'Target Funding / Signing Date',
    showDeposit: false,
    contextLabel: 'Current Lender Being Paid Off',
    contextPlaceholder: 'e.g. Wells Fargo / Chase',
    partiesHeading: 'Borrower / Homeowner',
    party1NameLabel: 'Borrower Name(s) *',
    party1NamePlaceholder: 'e.g. John & Mary Smith',
    party1ContactLabel: 'Borrower Email & Phone *',
    showParty2: false,
    professionalsHeading: 'Lender & Your Contact',
    showAgentField: false,
    lenderLabel: 'Submitting Lender / Mortgage Company *',
    lenderPlaceholder: 'e.g. Loan Officer Name & Company'
  },

  'commercial-construction': {
    label: '03 — Commercial & Construction Escrow',
    helper: 'Commercial acquisition, multi-family, industrial, or construction disbursement escrow.',
    priceLabel: 'Contract / Project Price *',
    pricePlaceholder: 'e.g. $4,500,000',
    closeDateLabel: 'Target Closing Date',
    showDeposit: true,
    depositLabel: 'Initial Escrow Deposit',
    depositPlaceholder: 'e.g. $100,000',
    contextLabel: 'Property / Asset Type',
    contextPlaceholder: 'e.g. Retail, Office, Multi-Family, Industrial, Land',
    partiesHeading: 'Purchasing & Selling Entities',
    party1NameLabel: 'Buyer Entity / Name *',
    party1NamePlaceholder: 'e.g. Pacific Holdings LLC',
    party1ContactLabel: 'Buyer Contact Email or Phone',
    showParty2: true,
    party2NameLabel: 'Seller Entity / Name',
    party2ContactLabel: 'Seller Contact Email or Phone',
    professionalsHeading: 'Brokers, Lender & Your Contact',
    showAgentField: true,
    agentLabel: 'Commercial Broker(s) / Firm',
    agentPlaceholder: 'e.g. CBRE / Marcus & Millichap',
    lenderLabel: 'Commercial / Construction Lender',
    lenderPlaceholder: 'Lender Name (or All Cash)'
  },

  '1031-exchange': {
    label: '04 — 1031 Tax-Deferred Exchange',
    helper: 'Relinquished property sale or replacement property purchase coordinated with a Qualified Intermediary (QI).',
    priceLabel: 'Transaction Price *',
    pricePlaceholder: 'e.g. $1,850,000',
    closeDateLabel: 'Target Close Date',
    showDeposit: true,
    depositLabel: 'Earnest Money Deposit',
    depositPlaceholder: 'e.g. $50,000',
    contextLabel: 'Exchange Phase',
    contextPlaceholder: 'e.g. Relinquished Sale or Replacement Purchase',
    partiesHeading: 'Exchanger & Counterparty',
    party1NameLabel: 'Exchanger (Taxpayer) Name *',
    party1NamePlaceholder: 'e.g. Smith Family Trust / LLC',
    party1ContactLabel: 'Exchanger Email or Phone',
    showParty2: true,
    party2NameLabel: 'Buyer / Seller Counterparty Name',
    party2ContactLabel: 'Counterparty Email or Phone',
    professionalsHeading: 'Agent, Qualified Intermediary (QI) & Your Contact',
    showAgentField: true,
    agentLabel: 'Real Estate Agent & Brokerage',
    agentPlaceholder: 'Agent Name & Brokerage',
    lenderLabel: 'Qualified Intermediary (QI) & Lender',
    lenderPlaceholder: 'e.g. IPX1031 / Asset Preservation / Exeter'
  },

  'fsbo': {
    label: '05 — For Sale By Owner (FSBO)',
    helper: 'Direct sale between buyer and seller without real estate agents. We guide both parties neutrally.',
    priceLabel: 'Agreed Sale Price *',
    pricePlaceholder: 'e.g. $975,000',
    closeDateLabel: 'Agreed Closing Date',
    showDeposit: true,
    depositLabel: 'Agreed Earnest Money Deposit',
    depositPlaceholder: 'e.g. $25,000',
    contextLabel: 'Payment Method',
    contextPlaceholder: 'e.g. Buyer New Mortgage Loan or All Cash',
    partiesHeading: 'Buyer & Seller',
    party1NameLabel: 'Buyer Name(s) *',
    party1NamePlaceholder: 'e.g. John & Mary Smith',
    party1ContactLabel: 'Buyer Email & Phone *',
    showParty2: true,
    party2NameLabel: 'Seller Name(s) *',
    party2ContactLabel: 'Seller Email & Phone *',
    professionalsHeading: 'Buyer’s Lender & Your Contact',
    showAgentField: false,
    lenderLabel: 'Buyer’s Mortgage Lender (if applicable)',
    lenderPlaceholder: 'Lender / Loan Officer Name (or All Cash)'
  },

  'short-sales-carryback': {
    label: '06 — Short Sale & Seller Carry-Back',
    helper: 'Seller-financed Carry-Back Note & Deed of Trust or lender-approved Short Sale closing.',
    priceLabel: 'Contract Sale Price *',
    pricePlaceholder: 'e.g. $1,100,000',
    closeDateLabel: 'Target Closing Date',
    showDeposit: true,
    depositLabel: 'Earnest Money Deposit',
    depositPlaceholder: 'e.g. $25,000',
    contextLabel: 'Carry-Back Note Amount OR Short Sale Lender',
    contextPlaceholder: 'e.g. $300k Seller Carry-Back OR Servicer Name',
    partiesHeading: 'Buyer & Seller',
    party1NameLabel: 'Buyer Name(s) *',
    party1NamePlaceholder: 'e.g. John & Mary Smith',
    party1ContactLabel: 'Buyer Email or Phone',
    showParty2: true,
    party2NameLabel: 'Seller Name(s) *',
    party2ContactLabel: 'Seller Email or Phone',
    professionalsHeading: 'Agent, Servicer & Your Contact',
    showAgentField: true,
    agentLabel: 'Real Estate Agent & Brokerage',
    agentPlaceholder: 'Agent Name & Brokerage',
    lenderLabel: 'Existing Lienholder / Negotiator (Optional)',
    lenderPlaceholder: 'Servicer or Negotiator Contact'
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const selectEl = document.getElementById('txTypeSelect');
  const orderForm = document.getElementById('escrowOrderForm');
  if (!selectEl || !orderForm) return;

  function updateFormForType(typeKey) {
    const cfg = ORDER_TYPES[typeKey] || ORDER_TYPES['residential-purchase'];

    document.getElementById('txTypeHelper').textContent = cfg.helper;
    document.getElementById('labelPrice').textContent = cfg.priceLabel;
    document.getElementById('tx_price').placeholder = cfg.pricePlaceholder;
    document.getElementById('labelCloseDate').textContent = cfg.closeDateLabel;

    const groupDeposit = document.getElementById('groupDeposit');
    if (cfg.showDeposit) {
      groupDeposit.style.display = '';
      document.getElementById('labelDeposit').textContent = cfg.depositLabel;
      document.getElementById('tx_deposit').placeholder = cfg.depositPlaceholder;
    } else {
      groupDeposit.style.display = 'none';
    }

    document.getElementById('labelContext').textContent = cfg.contextLabel;
    document.getElementById('tx_context').placeholder = cfg.contextPlaceholder;

    document.getElementById('headingParties').textContent = cfg.partiesHeading;
    document.getElementById('labelParty1Name').textContent = cfg.party1NameLabel;
    document.getElementById('buyer_name').placeholder = cfg.party1NamePlaceholder;
    document.getElementById('labelParty1Contact').textContent = cfg.party1ContactLabel;

    const rowParty2 = document.getElementById('rowParty2');
    if (cfg.showParty2) {
      rowParty2.style.display = '';
      document.getElementById('labelParty2Name').textContent = cfg.party2NameLabel;
      document.getElementById('labelParty2Contact').textContent = cfg.party2ContactLabel;
    } else {
      rowParty2.style.display = 'none';
    }

    document.getElementById('headingProfessionals').textContent = cfg.professionalsHeading;
    const agentGroup = document.getElementById('agent_info').closest('.form-group');
    if (cfg.showAgentField) {
      agentGroup.style.display = '';
      document.getElementById('labelAgentInfo').textContent = cfg.agentLabel;
      document.getElementById('agent_info').placeholder = cfg.agentPlaceholder;
    } else {
      agentGroup.style.display = 'none';
    }

    document.getElementById('labelLenderInfo').textContent = cfg.lenderLabel;
    document.getElementById('lender_info').placeholder = cfg.lenderPlaceholder;
  }

  // Check URL query param ?type=...
  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get('type');
  if (requestedType && ORDER_TYPES[requestedType]) {
    selectEl.value = requestedType;
  }

  updateFormForType(selectEl.value);

  selectEl.addEventListener('change', function () {
    updateFormForType(selectEl.value);
  });

  // Handle Submission -> Send to orders@ffescrow.com
  const statusEl = document.getElementById('orderFormStatus');
  const submitBtn = document.getElementById('orderSubmitBtn');

  orderForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(orderForm);
    const selectedKey = selectEl.value;
    const typeLabel = (ORDER_TYPES[selectedKey] || ORDER_TYPES['residential-purchase']).label;

    const payload = { 'Escrow Type': typeLabel };
    const lines = [`Escrow Type: ${typeLabel}`];

    for (const [key, val] of formData.entries()) {
      if (key === 'Escrow_Type') continue;
      const cleanVal = String(val).trim();
      if (cleanVal) {
        const readableKey = key.replace(/_/g, ' ');
        payload[readableKey] = cleanVal;
        lines.push(`${readableKey}: ${cleanVal}`);
      }
    }

    const propAddr = formData.get('Property_Address') || 'New Property';
    const emailSubject = `NEW ESCROW ORDER [${typeLabel}] - ${propAddr}`;
    const emailBody = `NEW ESCROW ORDER — FIRST FIDELITY ESCROW\n=========================================\n${lines.join('\n')}\n=========================================\nSubmitted via First Fidelity Escrow Online Order Form`;

    payload['_subject'] = emailSubject;
    payload['_template'] = 'table';
    payload['_captcha'] = 'false';

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Order to orders@ffescrow.com...</span>';

    let ajaxDelivered = false;
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FFE_ORDERS_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) ajaxDelivered = true;
    } catch (err) {
      ajaxDelivered = false;
    }

    const mailtoUrl = `mailto:${FFE_ORDERS_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    statusEl.hidden = false;
    statusEl.className = 'form-status success';
    statusEl.innerHTML = `
      <div class="order-confirm-box">
        <strong>Order Sent to ${FFE_ORDERS_EMAIL}!</strong>
        <p>Property: <strong>${propAddr}</strong> (${typeLabel})</p>
        <p>${ajaxDelivered
          ? 'We received your escrow order details. Have a signed Purchase Agreement (RPA) or loan sheet to attach? Click below to email your PDF directly with this order:'
          : 'Your pre-filled order email is ready — your email app will open so you can attach any contract PDFs and press Send:'
        }</p>
        <div class="confirm-actions">
          <a href="${mailtoUrl}" class="btn btn-primary btn-sm">Email &amp; Attach Contract to ${FFE_ORDERS_EMAIL}</a>
          <a href="tel:8587242146" class="btn btn-outline btn-sm">Call (858) 724-2146</a>
        </div>
      </div>
    `;

    if (!ajaxDelivered) {
      window.location.href = mailtoUrl;
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Order to First Fidelity Escrow</span>';
  });
});
