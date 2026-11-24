/* ==========================================================================
   First Fidelity Escrow, Inc. — Interactive Open Escrow Order Intake Engine
   - Dynamically adapts required fields for all 6 escrow transaction types:
     1. Residential Purchase & Resale
     2. Refinance & Reverse Mortgages
     3. Commercial & Construction Escrows
     4. 1031 Tax-Deferred Exchanges
     5. For Sale By Owner (FSBO)
     6. Short Sales & Seller Carry-Backs
   - Automatically sends formatted order email to orders@ffescrow.com
   ========================================================================== */

const FFE_ORDERS_EMAIL = 'orders@ffescrow.com';

const TRANSACTION_SCHEMAS = {
  'residential-purchase': {
    code: '01',
    title: 'Residential Purchase & Resale',
    pageUrl: 'residential-purchase.html',
    subtitle: 'Open a new residential purchase or resale escrow order. Provide the property, contract terms, buyer/seller, and agent details below.',
    priceLabel: 'Purchase / Sale Price ($)',
    pricePlaceholder: 'e.g. $1,250,000',
    showDeposit: true,
    depositLabel: 'Initial Earnest Money Deposit (EMD)',
    showCloseDate: true,
    closeDateLabel: 'Estimated Close of Escrow Date',
    party1Title: 'Buyer Information',
    party1NameLabel: 'Buyer(s) Full Legal Name(s) *',
    party1EmailLabel: 'Buyer Email',
    party1PhoneLabel: 'Buyer Phone',
    party1VestingLabel: 'Proposed Vesting (if known)',
    showParty2: true,
    party2Title: 'Seller Information',
    party2NameLabel: 'Seller(s) Full Legal Name(s)',
    party2EmailLabel: 'Seller Email',
    party2PhoneLabel: 'Seller Phone',
    showAgents: true,
    agent1Title: 'Listing Agent / Broker (Seller Side)',
    agent2Title: 'Selling / Buyer’s Agent / Broker',
    showLender: true,
    lenderTitle: 'Lender / Loan Officer & Financing',
    extraFields: [
      { id: 'financing_type', label: 'Financing Type *', type: 'select', options: ['Conventional Loan', 'VA Loan', 'FHA Loan', 'Jumbo Loan', 'All Cash', 'Other'] },
      { id: 'hoa_applicable', label: 'Subject to an HOA?', type: 'select', options: ['Yes — Single HOA', 'Yes — Master & Sub HOA', 'No HOA', 'Unknown'] },
      { id: 'home_warranty', label: 'Home Warranty Included?', type: 'select', options: ['Yes — Ordered by Agent', 'No', 'TBD per RPA'] },
      { id: 'preferred_officer', label: 'Preferred Escrow Officer', type: 'select', options: ['First Available Officer', 'Melissa Carson', 'Nina Latham'] }
    ]
  },

  'refinance-reverse': {
    code: '02',
    title: 'Refinance & Reverse Mortgages',
    pageUrl: 'refinance-reverse.html',
    subtitle: 'Open a refinance, HELOC, or reverse mortgage (HECM) escrow order for fast payoff demand ordering and notary signing coordination.',
    priceLabel: 'New Loan Amount ($)',
    pricePlaceholder: 'e.g. $850,000',
    showDeposit: false,
    showCloseDate: true,
    closeDateLabel: 'Target Funding / Signing Date',
    party1Title: 'Borrower / Homeowner Information',
    party1NameLabel: 'Borrower(s) Full Legal Name(s) *',
    party1EmailLabel: 'Borrower Email *',
    party1PhoneLabel: 'Borrower Phone *',
    party1VestingLabel: 'Current Title Vesting (Trust / Individual)',
    showParty2: false,
    showAgents: false,
    showLender: true,
    lenderTitle: 'Submitting Lender / Mortgage Broker Details',
    extraFields: [
      { id: 'refi_purpose', label: 'Loan Transaction Type *', type: 'select', options: ['Rate & Term Refinance', 'Cash-Out Refinance', 'Reverse Mortgage (HECM / Proprietary)', 'HELOC / Second Trust Deed', 'Commercial Refinance'] },
      { id: 'existing_lender', label: 'Current Lender(s) to Be Paid Off', type: 'text', placeholder: 'e.g. Wells Fargo (1st), Chase (HELOC)' },
      { id: 'estimated_payoff', label: 'Estimated Existing Payoff Balance ($)', type: 'text', placeholder: 'e.g. $620,000' },
      { id: 'title_company', label: 'Preferred Title Insurance Company', type: 'text', placeholder: 'e.g. First American, Chicago Title, Fidelity, WFG' },
      { id: 'preferred_officer', label: 'Preferred Escrow Officer', type: 'select', options: ['First Available Officer', 'Melissa Carson', 'Nina Latham'] }
    ]
  },

  'commercial-construction': {
    code: '03',
    title: 'Commercial & Construction Escrows',
    pageUrl: 'commercial-construction.html',
    subtitle: 'Open a commercial acquisition, multi-family/industrial transaction, or construction fund control & disbursement escrow.',
    priceLabel: 'Contract / Project Amount ($)',
    pricePlaceholder: 'e.g. $4,500,000',
    showDeposit: true,
    depositLabel: 'Initial Escrow Deposit ($)',
    showCloseDate: true,
    closeDateLabel: 'Target Closing Date',
    party1Title: 'Purchasing Entity / Borrower / Developer',
    party1NameLabel: 'Buyer Entity / LLC / LP / Individual Name *',
    party1EmailLabel: 'Authorized Signer Email *',
    party1PhoneLabel: 'Authorized Signer Phone *',
    party1VestingLabel: 'Entity State of Formation & Signer Title',
    showParty2: true,
    party2Title: 'Selling Entity / Property Owner',
    party2NameLabel: 'Seller Entity / Owner Name',
    party2EmailLabel: 'Seller Contact Email',
    party2PhoneLabel: 'Seller Contact Phone',
    showAgents: true,
    agent1Title: 'Listing Commercial Broker / Advisory',
    agent2Title: 'Buyer’s Commercial Broker / Legal Counsel',
    showLender: true,
    lenderTitle: 'Commercial / Construction Lender',
    extraFields: [
      { id: 'asset_class', label: 'Property / Asset Class *', type: 'select', options: ['Retail / Mixed-Use', 'Office / Medical', 'Industrial / Warehouse', 'Multi-Family / Apartment', 'Vacant Land / Ground-Up Construction', 'Hospitality / Special Purpose'] },
      { id: 'due_diligence_days', label: 'Due Diligence / Contingency Period', type: 'text', placeholder: 'e.g. 30 Days from Opening' },
      { id: 'involves_1031', label: 'Involves a 1031 Exchange or Leases?', type: 'select', options: ['Yes — Tenant Leases & Estoppels', 'Yes — 1031 Exchange Involved', 'Both Leases & 1031 Exchange', 'No'] },
      { id: 'preferred_officer', label: 'Preferred Escrow Officer', type: 'select', options: ['First Available Officer', 'Melissa Carson', 'Nina Latham'] }
    ]
  },

  '1031-exchange': {
    code: '04',
    title: '1031 Tax-Deferred Exchanges',
    pageUrl: '1031-exchange.html',
    subtitle: 'Open an IRC Section 1031 tax-deferred exchange escrow (Relinquished Sale, Replacement Purchase, or Reverse Exchange).',
    priceLabel: 'Transaction Price ($)',
    pricePlaceholder: 'e.g. $1,850,000',
    showDeposit: true,
    depositLabel: 'Earnest Money Deposit ($)',
    showCloseDate: true,
    closeDateLabel: 'Target Close Date',
    party1Title: 'Exchanger (Taxpayer) Information',
    party1NameLabel: 'Exchanger Full Legal / Entity Name *',
    party1EmailLabel: 'Exchanger Email *',
    party1PhoneLabel: 'Exchanger Phone *',
    party1VestingLabel: 'Taxpayer Vesting (Must Match Relinquished/Replacement)',
    showParty2: true,
    party2Title: 'Counterparty (Buyer or Seller)',
    party2NameLabel: 'Counterparty Full Name / Entity',
    party2EmailLabel: 'Counterparty Email',
    party2PhoneLabel: 'Counterparty Phone',
    showAgents: true,
    agent1Title: 'Exchanger’s Real Estate Agent / Broker',
    agent2Title: 'Cooperating Agent / Broker',
    showLender: true,
    lenderTitle: 'Lender & Qualified Intermediary (QI)',
    extraFields: [
      { id: 'exchange_leg', label: '1031 Exchange Phase *', type: 'select', options: ['Relinquished Property (Downleg Sale)', 'Replacement Property (Upleg Purchase)', 'Simultaneous / Reverse Exchange', 'Both Legs with First Fidelity Escrow'] },
      { id: 'qi_company', label: 'Qualified Intermediary (QI) Company & Contact', type: 'text', placeholder: 'e.g. Asset Preservation, IPX1031, Exeter — Contact Name/Email' },
      { id: 'id_deadline', label: '45-Day ID / 180-Day Exchange Deadline (if active)', type: 'text', placeholder: 'e.g. 45-Day ID: MM/DD/YYYY' },
      { id: 'preferred_officer', label: 'Preferred Escrow Officer', type: 'select', options: ['First Available Officer', 'Melissa Carson', 'Nina Latham'] }
    ]
  },

  'fsbo': {
    code: '05',
    title: 'For Sale By Owner (FSBO)',
    pageUrl: 'fsbo.html',
    subtitle: 'Direct buyer-and-seller escrow without real estate agents. We guide both parties neutrally through disclosures, title, and closing.',
    priceLabel: 'Agreed Sale Price ($)',
    pricePlaceholder: 'e.g. $975,000',
    showDeposit: true,
    depositLabel: 'Agreed Earnest Money Deposit ($)',
    showCloseDate: true,
    closeDateLabel: 'Agreed Closing Date',
    party1Title: 'Seller Information',
    party1NameLabel: 'Seller(s) Full Legal Name(s) *',
    party1EmailLabel: 'Seller Email *',
    party1PhoneLabel: 'Seller Phone *',
    party1VestingLabel: 'Existing Mortgage Lender to Pay Off (if any)',
    showParty2: true,
    party2Title: 'Buyer Information',
    party2NameLabel: 'Buyer(s) Full Legal Name(s) *',
    party2EmailLabel: 'Buyer Email *',
    party2PhoneLabel: 'Buyer Phone *',
    showAgents: false,
    showLender: true,
    lenderTitle: 'Buyer’s Mortgage Lender (Leave blank if All Cash)',
    extraFields: [
      { id: 'fsbo_submitter', label: 'Who Is Submitting This Order? *', type: 'select', options: ['I am the Seller', 'I am the Buyer', 'I am the Buyer’s Lender / Attorney'] },
      { id: 'written_agreement', label: 'Do You Have a Signed Purchase Agreement?', type: 'select', options: ['Yes — Ready to Upload/Email', 'In Progress — Need Escrow Instructions', 'No — Need Guidance on Opening'] },
      { id: 'fsbo_financing', label: 'Buyer Payment Method *', type: 'select', options: ['New Mortgage Loan', 'All Cash', 'Seller Carry-Back Financing', 'Assumed Loan / Other'] },
      { id: 'hoa_applicable', label: 'Is the Property in an HOA?', type: 'select', options: ['Yes', 'No', 'Not Sure'] }
    ]
  },

  'short-sales-carryback': {
    code: '06',
    title: 'Short Sales & Seller Carry-Backs',
    pageUrl: 'short-sales-carryback.html',
    subtitle: 'Open a specialized short sale escrow (lender payoff approval) or seller carry-back (seller-financed note & deed of trust) transaction.',
    priceLabel: 'Contract Sale Price ($)',
    pricePlaceholder: 'e.g. $1,100,000',
    showDeposit: true,
    depositLabel: 'Earnest Money Deposit ($)',
    showCloseDate: true,
    closeDateLabel: 'Estimated Close Date / Approval Window',
    party1Title: 'Buyer / Borrower Information',
    party1NameLabel: 'Buyer(s) Full Legal Name(s) *',
    party1EmailLabel: 'Buyer Email',
    party1PhoneLabel: 'Buyer Phone',
    party1VestingLabel: 'Proposed Buyer Vesting',
    showParty2: true,
    party2Title: 'Seller / Carry-Back Beneficiary Information',
    party2NameLabel: 'Seller(s) Full Legal Name(s) *',
    party2EmailLabel: 'Seller Email',
    party2PhoneLabel: 'Seller Phone',
    showAgents: true,
    agent1Title: 'Listing Agent / Short Sale Negotiator',
    agent2Title: 'Buyer’s Agent / Broker',
    showLender: true,
    lenderTitle: 'Lienholder / Servicing Lender Details',
    extraFields: [
      { id: 'special_tx_type', label: 'Transaction Structure *', type: 'select', options: ['Seller Carry-Back (1st Trust Deed Note)', 'Seller Carry-Back (2nd Trust Deed behind Institutional 1st)', 'Short Sale (Single Lienholder)', 'Short Sale (Multiple Lienholders / 1st & 2nd)', 'All-Inclusive Trust Deed (AITD)'] },
      { id: 'carryback_or_servicer', label: 'Carry-Back Note Terms OR Short Sale Servicer', type: 'text', placeholder: 'e.g. $300k Carry-Back @ 6.5% for 5 yrs OR Short Sale Lender: Mr. Cooper' },
      { id: 'short_sale_status', label: 'Approval / Note Preparation Status', type: 'select', options: ['Need FFE to Draft Carry-Back Note & Deed of Trust', 'Short Sale Package Submitted to Lender', 'Short Sale Approval Letter Received', 'Just Opening Escrow'] },
      { id: 'preferred_officer', label: 'Preferred Escrow Officer', type: 'select', options: ['First Available Officer', 'Melissa Carson', 'Nina Latham'] }
    ]
  }
};

function renderOrderWidget(containerId, defaultTypeKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const activeKey = TRANSACTION_SCHEMAS[defaultTypeKey] ? defaultTypeKey : 'residential-purchase';

  container.innerHTML = `
    <div class="escrow-order-box">
      <div class="order-box-header">
        <div>
          <span class="eyebrow">ONLINE ESCROW ORDER INTAKE</span>
          <h2 id="orderFormHeading">Open a New Escrow Order</h2>
          <p id="orderFormSubtitle" class="order-box-sub"></p>
        </div>
        <div class="order-routing-pill">
          <span class="routing-dot"></span>
          <span>Direct Order Routing: <strong>${FFE_ORDERS_EMAIL}</strong></span>
        </div>
      </div>

      <!-- Transaction Type Selector Tabs -->
      <div class="tx-type-selector" role="tablist" aria-label="Select Escrow Transaction Type">
        ${Object.entries(TRANSACTION_SCHEMAS).map(([key, item]) => `
          <button type="button" class="tx-tab-btn ${key === activeKey ? 'active' : ''}" data-tx-key="${key}" role="tab" aria-selected="${key === activeKey}">
            <span class="tx-tab-num">${item.code}</span>
            <span class="tx-tab-label">${item.title}</span>
          </button>
        `).join('')}
      </div>

      <form id="escrowOrderForm" class="escrow-order-form">
        <input type="hidden" name="Transaction_Category" id="inputTxCategory" value="" />

        <!-- Section 1: Subject Property & Contract Terms -->
        <fieldset class="order-fieldset">
          <legend><span class="step-badge">1</span> Subject Property &amp; Contract Terms</legend>
          <div class="form-grid-3">
            <div class="form-group span-2">
              <label for="prop_address">Subject Property Street Address (incl. Unit/Suite) *</label>
              <input type="text" id="prop_address" name="Property_Address" required placeholder="e.g. 12636 High Bluff Dr #400" />
            </div>
            <div class="form-group">
              <label for="prop_city_zip">City, State &amp; ZIP *</label>
              <input type="text" id="prop_city_zip" name="Property_City_State_Zip" required placeholder="e.g. San Diego, CA 92130" />
            </div>
          </div>

          <div class="form-grid-4">
            <div class="form-group">
              <label for="prop_apn">APN / Parcel Number (Optional)</label>
              <input type="text" id="prop_apn" name="APN_Parcel" placeholder="e.g. 304-080-21-00" />
            </div>
            <div class="form-group">
              <label for="tx_price" id="labelTxPrice">Purchase / Sale Price ($) *</label>
              <input type="text" id="tx_price" name="Transaction_Price_or_Loan_Amount" required placeholder="e.g. $1,250,000" />
            </div>
            <div class="form-group" id="groupDeposit">
              <label for="tx_deposit" id="labelDeposit">Earnest Money Deposit ($)</label>
              <input type="text" id="tx_deposit" name="Earnest_Money_Deposit" placeholder="e.g. $37,500 (3%)" />
            </div>
            <div class="form-group" id="groupCloseDate">
              <label for="tx_close_date" id="labelCloseDate">Estimated Close Date *</label>
              <input type="date" id="tx_close_date" name="Target_Close_Date" required />
            </div>
          </div>

          <!-- Dynamic Transaction-Specific Fields -->
          <div class="form-grid-2" id="dynamicExtraFields"></div>
        </fieldset>

        <!-- Section 2: Primary Parties (Buyer / Borrower & Seller) -->
        <fieldset class="order-fieldset">
          <legend><span class="step-badge">2</span> Parties to the Transaction</legend>
          <div class="parties-split" id="partiesSplitContainer">
            <div class="party-subcard">
              <h4 id="party1Title">Buyer Information</h4>
              <div class="form-group">
                <label for="party1_name" id="party1NameLabel">Buyer(s) Full Legal Name(s) *</label>
                <input type="text" id="party1_name" name="Primary_Party_Name" required placeholder="e.g. John &amp; Mary Smith" />
              </div>
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="party1_email" id="party1EmailLabel">Email Address</label>
                  <input type="email" id="party1_email" name="Primary_Party_Email" placeholder="buyer@example.com" />
                </div>
                <div class="form-group">
                  <label for="party1_phone" id="party1PhoneLabel">Phone Number</label>
                  <input type="tel" id="party1_phone" name="Primary_Party_Phone" placeholder="(858) 555-0144" />
                </div>
              </div>
              <div class="form-group">
                <label for="party1_vesting" id="party1VestingLabel">Vesting / Notes</label>
                <input type="text" id="party1_vesting" name="Primary_Party_Vesting_or_Notes" placeholder="e.g. Husband and Wife as Community Property / Living Trust" />
              </div>
            </div>

            <div class="party-subcard" id="party2Card">
              <h4 id="party2Title">Seller Information</h4>
              <div class="form-group">
                <label for="party2_name" id="party2NameLabel">Seller(s) Full Legal Name(s)</label>
                <input type="text" id="party2_name" name="Secondary_Party_Name" placeholder="e.g. Robert &amp; Linda Davis" />
              </div>
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="party2_email" id="party2EmailLabel">Email Address</label>
                  <input type="email" id="party2_email" name="Secondary_Party_Email" placeholder="seller@example.com" />
                </div>
                <div class="form-group">
                  <label for="party2_phone" id="party2PhoneLabel">Phone Number</label>
                  <input type="tel" id="party2_phone" name="Secondary_Party_Phone" placeholder="(858) 555-0188" />
                </div>
              </div>
              <div class="form-group">
                <label for="party2_forwarding">Current / Forwarding Address (if known)</label>
                <input type="text" id="party2_forwarding" name="Secondary_Party_Address" placeholder="Street, City, State, ZIP" />
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Section 3: Real Estate Agents / Brokers -->
        <fieldset class="order-fieldset" id="fieldsetAgents">
          <legend><span class="step-badge">3</span> Real Estate Agents &amp; Commission Details</legend>
          <div class="parties-split">
            <div class="party-subcard">
              <h4 id="agent1Title">Listing Agent / Broker (Seller Side)</h4>
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="listing_agent_name">Agent Name</label>
                  <input type="text" id="listing_agent_name" name="Listing_Agent_Name" placeholder="Agent Full Name" />
                </div>
                <div class="form-group">
                  <label for="listing_brokerage">Brokerage &amp; DRE License #</label>
                  <input type="text" id="listing_brokerage" name="Listing_Brokerage_DRE" placeholder="e.g. Compass / DRE #01999999" />
                </div>
              </div>
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="listing_agent_email">Agent Email</label>
                  <input type="email" id="listing_agent_email" name="Listing_Agent_Email" placeholder="agent@brokerage.com" />
                </div>
                <div class="form-group">
                  <label for="listing_agent_phone">Agent Phone</label>
                  <input type="tel" id="listing_agent_phone" name="Listing_Agent_Phone" placeholder="(858) 555-0111" />
                </div>
                <div class="form-group">
                  <label for="listing_commission">Listing Commission (% or $)</label>
                  <input type="text" id="listing_commission" name="Listing_Commission" placeholder="e.g. 2.5%" />
                </div>
              </div>
              <div class="form-group">
                <label for="listing_tc_email">Transaction Coordinator (TC) Name &amp; Email</label>
                <input type="text" id="listing_tc_email" name="Listing_TC_Contact" placeholder="e.g. Sarah TC — tc@brokerage.com" />
              </div>
            </div>

            <div class="party-subcard">
              <h4 id="agent2Title">Selling / Buyer’s Agent / Broker</h4>
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="buying_agent_name">Agent Name</label>
                  <input type="text" id="buying_agent_name" name="Buying_Agent_Name" placeholder="Agent Full Name" />
                </div>
                <div class="form-group">
                  <label for="buying_brokerage">Brokerage &amp; DRE License #</label>
                  <input type="text" id="buying_brokerage" name="Buying_Brokerage_DRE" placeholder="e.g. Pacific Sotheby’s / DRE #" />
                </div>
              </div>
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="buying_agent_email">Agent Email</label>
                  <input type="email" id="buying_agent_email" name="Buying_Agent_Email" placeholder="buyeragent@brokerage.com" />
                </div>
                <div class="form-group">
                  <label for="buying_agent_phone">Agent Phone</label>
                  <input type="tel" id="buying_agent_phone" name="Buying_Agent_Phone" placeholder="(858) 555-0122" />
                </div>
                <div class="form-group">
                  <label for="buying_commission">Buyer Side Commission (% or $)</label>
                  <input type="text" id="buying_commission" name="Buying_Commission" placeholder="e.g. 2.5%" />
                </div>
              </div>
              <div class="form-group">
                <label for="buying_tc_email">Transaction Coordinator (TC) Name &amp; Email</label>
                <input type="text" id="buying_tc_email" name="Buying_TC_Contact" placeholder="e.g. Mike TC — tc@buyerbroker.com" />
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Section 4: Lender, Submitter & Special Instructions -->
        <fieldset class="order-fieldset">
          <legend><span class="step-badge" id="finalStepBadge">4</span> <span id="lenderTitle">Lender, Submitter &amp; Special Instructions</span></legend>
          <div class="form-grid-3" id="lenderRow">
            <div class="form-group">
              <label for="lender_company">Mortgage Company / Lender</label>
              <input type="text" id="lender_company" name="Lender_Company" placeholder="e.g. CrossCountry Mortgage / Guild" />
            </div>
            <div class="form-group">
              <label for="loan_officer_name">Loan Officer Name &amp; NMLS #</label>
              <input type="text" id="loan_officer_name" name="Loan_Officer_Name" placeholder="Loan Officer Name" />
            </div>
            <div class="form-group">
              <label for="loan_officer_contact">Loan Officer Email &amp; Phone</label>
              <input type="text" id="loan_officer_contact" name="Loan_Officer_Contact" placeholder="lo@lender.com / (858) 555-0133" />
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label for="submitter_name">Order Submitted By (Your Name) *</label>
              <input type="text" id="submitter_name" name="Submitted_By_Name" required placeholder="Your Full Name" />
            </div>
            <div class="form-group">
              <label for="submitter_email">Your Email (for Escrow Confirmation) *</label>
              <input type="email" id="submitter_email" name="Submitted_By_Email" required placeholder="you@company.com" />
            </div>
            <div class="form-group">
              <label for="submitter_phone">Your Direct Phone *</label>
              <input type="tel" id="submitter_phone" name="Submitted_By_Phone" required placeholder="(858) 555-0199" />
            </div>
          </div>

          <div class="form-group">
            <label for="special_instructions">Additional Escrow Instructions, Contingency Dates, or Notes</label>
            <textarea id="special_instructions" name="Special_Instructions" rows="3" placeholder="Include credit terms, seller concessions, title company preference, or note if you will be emailing the signed RPA/contract to orders@ffescrow.com..."></textarea>
          </div>
        </fieldset>

        <div class="order-submit-bar">
          <p class="submit-note">
            Submitting this order sends your complete intake sheet directly to <strong>${FFE_ORDERS_EMAIL}</strong> so an escrow officer can open your file and issue an Escrow Number.
          </p>
          <button type="submit" class="btn btn-primary btn-lg" id="orderSubmitBtn">
            <span>Submit &amp; Open Escrow Order</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        <div id="orderFormStatus" class="form-status" role="status" aria-live="polite" hidden></div>
      </form>
    </div>
  `;

  function applySchema(txKey) {
    const schema = TRANSACTION_SCHEMAS[txKey];
    if (!schema) return;

    // Update active tab styling
    container.querySelectorAll('.tx-tab-btn').forEach(btn => {
      const isSelected = btn.getAttribute('data-tx-key') === txKey;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    document.getElementById('inputTxCategory').value = `${schema.code} - ${schema.title}`;
    document.getElementById('orderFormHeading').textContent = `Open Escrow: ${schema.title}`;
    document.getElementById('orderFormSubtitle').textContent = schema.subtitle;

    const priceLabel = document.getElementById('labelTxPrice');
    const priceInput = document.getElementById('tx_price');
    priceLabel.textContent = schema.priceLabel + ' *';
    priceInput.placeholder = schema.pricePlaceholder;

    const groupDeposit = document.getElementById('groupDeposit');
    groupDeposit.style.display = schema.showDeposit ? '' : 'none';
    if (schema.showDeposit && schema.depositLabel) {
      document.getElementById('labelDeposit').textContent = schema.depositLabel;
    }

    const groupCloseDate = document.getElementById('groupCloseDate');
    groupCloseDate.style.display = schema.showCloseDate ? '' : 'none';
    if (schema.showCloseDate && schema.closeDateLabel) {
      document.getElementById('labelCloseDate').textContent = schema.closeDateLabel + ' *';
    }

    // Party 1
    document.getElementById('party1Title').textContent = schema.party1Title;
    document.getElementById('party1NameLabel').textContent = schema.party1NameLabel;
    document.getElementById('party1EmailLabel').textContent = schema.party1EmailLabel;
    document.getElementById('party1PhoneLabel').textContent = schema.party1PhoneLabel;
    document.getElementById('party1VestingLabel').textContent = schema.party1VestingLabel;

    // Party 2
    const party2Card = document.getElementById('party2Card');
    const partiesSplit = document.getElementById('partiesSplitContainer');
    if (schema.showParty2) {
      party2Card.style.display = '';
      partiesSplit.classList.remove('single-col');
      document.getElementById('party2Title').textContent = schema.party2Title;
      document.getElementById('party2NameLabel').textContent = schema.party2NameLabel;
      document.getElementById('party2EmailLabel').textContent = schema.party2EmailLabel;
      document.getElementById('party2PhoneLabel').textContent = schema.party2PhoneLabel;
    } else {
      party2Card.style.display = 'none';
      partiesSplit.classList.add('single-col');
    }

    // Agents
    const fieldsetAgents = document.getElementById('fieldsetAgents');
    const finalStepBadge = document.getElementById('finalStepBadge');
    if (schema.showAgents) {
      fieldsetAgents.style.display = '';
      document.getElementById('agent1Title').textContent = schema.agent1Title;
      document.getElementById('agent2Title').textContent = schema.agent2Title;
      finalStepBadge.textContent = '4';
    } else {
      fieldsetAgents.style.display = 'none';
      finalStepBadge.textContent = '3';
    }

    // Dynamic extra fields
    const extraContainer = document.getElementById('dynamicExtraFields');
    extraContainer.innerHTML = schema.extraFields.map(field => {
      if (field.type === 'select') {
        return `
          <div class="form-group">
            <label for="${field.id}">${field.label}</label>
            <select id="${field.id}" name="${field.label.replace(/[^a-zA-Z0-9]+/g, '_')}">
              ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
        `;
      }
      return `
        <div class="form-group">
          <label for="${field.id}">${field.label}</label>
          <input type="text" id="${field.id}" name="${field.label.replace(/[^a-zA-Z0-9]+/g, '_')}" placeholder="${field.placeholder || ''}" />
        </div>
      `;
    }).join('');
  }

  // Bind tab clicks
  container.querySelectorAll('.tx-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applySchema(btn.getAttribute('data-tx-key'));
    });
  });

  // Expose helper so external links can switch transaction type
  window.selectEscrowTransactionType = function(txKey) {
    if (TRANSACTION_SCHEMAS[txKey]) {
      applySchema(txKey);
    }
  };

  applySchema(activeKey);

  // Form submission handler: sends AJAX request to FormSubmit (orders@ffescrow.com) AND prepares an instant email dispatch
  const orderForm = document.getElementById('escrowOrderForm');
  const statusEl = document.getElementById('orderFormStatus');
  const submitBtn = document.getElementById('orderSubmitBtn');

  orderForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(orderForm);
    const payload = {};
    const lines = [];

    for (const [key, val] of formData.entries()) {
      const cleanVal = String(val).trim();
      if (cleanVal) {
        const readableKey = key.replace(/_/g, ' ');
        payload[readableKey] = cleanVal;
        lines.push(`${readableKey}: ${cleanVal}`);
      }
    }

    const txCat = formData.get('Transaction_Category') || 'New Escrow Order';
    const propAddr = formData.get('Property_Address') || '';
    const propCity = formData.get('Property_City_State_Zip') || '';
    const emailSubject = `NEW ESCROW ORDER [${txCat}] - ${propAddr}, ${propCity}`;
    const emailBody = `NEW ESCROW ORDER SUBMISSION — FIRST FIDELITY ESCROW\n====================================================\n${lines.join('\n')}\n====================================================\nSubmitted via First Fidelity Escrow Online Order Intake`;

    payload['_subject'] = emailSubject;
    payload['_template'] = 'table';
    payload['_captcha'] = 'false';

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Order to FFE Team...</span>';

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
      if (res.ok) {
        ajaxDelivered = true;
      }
    } catch (err) {
      ajaxDelivered = false;
    }

    const mailtoUrl = `mailto:${FFE_ORDERS_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    statusEl.hidden = false;
    statusEl.className = 'form-status success';
    statusEl.innerHTML = `
      <div class="order-confirm-box">
        <strong>Escrow Order Prepared &amp; Routed to ${FFE_ORDERS_EMAIL}!</strong>
        <p>Property: <strong>${propAddr}, ${propCity}</strong> (${txCat})</p>
        <p>${ajaxDelivered
          ? 'Your order details have been transmitted to the First Fidelity Escrow desk. If you have a signed Purchase Agreement (RPA) or loan sheet to attach, click below to open this pre-filled order in your email client and attach your documents:'
          : 'Your pre-filled escrow order is ready to send to the First Fidelity Escrow team. Your email client will open automatically so you can attach any contract PDFs and hit Send:'
        }</p>
        <div class="confirm-actions">
          <a href="${mailtoUrl}" class="btn btn-primary btn-sm">Email Order &amp; Attach Contract to ${FFE_ORDERS_EMAIL}</a>
          <a href="tel:8587242146" class="btn btn-outline btn-sm">Call Escrow Desk: (858) 724-2146</a>
        </div>
      </div>
    `;

    if (!ajaxDelivered) {
      window.location.href = mailtoUrl;
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit &amp; Open Escrow Order</span>';
  });
}
