File	Purpose
index.html	Prototype entry page
login.html	Role-based login for admin, branch manager and cashier
dashboard.html	Central navigation hub and operations overview
inventory.html	Master inventory management and SKU control
product-create.html	Category-based product creation
branch-inventory.html	Branch-level stock, transfers and sale readiness
pos.html	POS billing, GST invoice and live stock sync
orders.html	POS and website order management
website.html	Customer-facing website commerce flow
crm.html	Customer profiles, loyalty and segmentation
campaigns.html	WhatsApp, loyalty and promotional campaigns
returns.html	Returns, refunds, warranty and exchange workflow
analytics.html	Branch, product, CRM, return and inventory analytics
reports.html	Scheduled reports, GST summaries and exports
staff.html	Staff roles and branch-level access control
settings.html	System settings and business rules
system-map.html	Connected architecture overview
Shared files
File	Purpose
app-shell.css	Shared design tokens and reusable UI styles
app-shell.js	Shared sidebar, topbar, mobile menu and quick actions
README.md	Project documentation
Inventory states
The system uses the same inventory state model across all modules:

State	Meaning
Available	Sellable in POS and website
Reserved	Temporarily held by cart, order or POS session
Sold	Completed sale
Damaged	Not sellable, requires review
Returned	Returned item awaiting inspection
Transfer Pending	In movement between inventory locations
Warranty Claim	Electronics warranty workflow
Disposal	Not sellable, removed from customer-facing stock
Expired	Expired cosmetics or date-sensitive stock
Category logic
Category	Special logic
Clothing	Size variants, color variants, seasonal stock and exchanges
Electronics	Warranty tracking, compatibility, serial verification and warranty claims
Cosmetics	Batch tracking, expiry management, hygiene restrictions and disposal states
Accessories	Variant tracking, condition-based returns and gift/upsell logic
Core data flow
Products are created in product-create.html.
Stock is initialized in inventory.html.
Stock is allocated to branches in branch-inventory.html.
POS sales happen in pos.html.
Website orders and live stock visibility happen in website.html and orders.html.
Customer profiles update in crm.html.
Campaigns use CRM segments in campaigns.html.
Returns and refunds update inventory and CRM through returns.html.
Analytics are consolidated in analytics.html.
Reports and exports are generated in reports.html.
Role access model
Role	Access
Admin	Full system access
Branch Manager	Branch inventory, transfers, staff, returns and local reports
Cashier	POS billing, invoice lookup and limited customer assignment
Operations Head	Inventory, branches, returns and analytics
Marketing Manager	CRM, campaigns and customer reports
Finance Admin	GST reports, refunds, sales exports and payments
Shared shell usage
New pages should use:

html


<div class="min-h-screen flex" data-retail-shell>
  <main class="p-5 lg:p-8 space-y-6">
    <!-- Page content -->
  </main>
</div>
<script src="app-shell.js"></script>
The shared shell automatically injects:

Sidebar
Topbar
Branch selector
Search
Quick actions
Alerts
Live sync indicator
Profile menu
Mobile navigation
Design language
Dark enterprise SaaS interface
Slate backgrounds
Indigo primary actions
Category-specific accent colors
Rounded cards and tables
Persistent navigation
Connected lifecycle bars
Operational tables and workflow panels


---
## Phase 8 completion state
At this point, the prototype has:
| Layer | Status |
|---|---|
| Core foundation | Complete |
| Main inventory | Complete |
| Branch inventory | Complete |
| POS | Complete |
| Orders | Complete |
| Website flow | Complete |
| CRM | Complete |
| Campaigns | Complete |
| Returns | Complete |
| Analytics | Complete |
| Reports | Complete |
| Staff access | Complete |
| Settings | Added to shell |
| Shared app shell | Complete |
| Navigation hardening | Complete |