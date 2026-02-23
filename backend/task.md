👤 2️⃣ User Management APIs (Admin Only)
Base Route: /api/users

GET /
→ Get all users

GET /:id
→ Get single user

PUT /:id
→ Update user

DELETE /:id
→ Deactivate user

🏢 3️⃣ Department APIs
Base Route: /api/departments

POST /
→ Create department

GET /
→ Get all departments

GET /:id
→ Get single department

PUT /:id
→ Update department

DELETE /:id
→ Delete department (or soft delete)

🔢 4️⃣ Meter Reading APIs
Base Route: /api/meter-readings

POST /
→ Add monthly meter reading

GET /
→ Get all readings

GET /department/:departmentId
→ Get readings of specific department

GET /:id
→ Get single reading

PUT /:id
→ Update reading (before bill generation)

DELETE /:id
→ Delete reading (if bill not generated)

💰 5️⃣ Tariff APIs
Base Route: /api/tariffs

POST /
→ Create tariff

GET /
→ Get active tariff

PUT /:id
→ Update tariff

PATCH /:id/activate
→ Activate specific tariff

🧾 6️⃣ Bill APIs
Base Route: /api/bills

POST /generate/:meterReadingId
→ Generate bill from meter reading

GET /
→ Get all bills

GET /:id
→ Get single bill

GET /department/:departmentId
→ Get bills of specific department

PATCH /:id/status
→ Update bill status (optional manual update)

DELETE /:id
→ Delete bill (only if unpaid)

💳 7️⃣ Payment APIs
Base Route: /api/payments

POST /
→ Record payment

GET /
→ Get all payments

GET /bill/:billId
→ Get payments of specific bill

GET /department/:departmentId
→ Get payment history of department

📊 8️⃣ Dashboard / Report APIs (Very Important for Viva)
Base Route: /api/reports

GET /monthly-summary?month=&year=
→ Total generated vs collected

GET /outstanding
→ List unpaid bills

GET /department-summary/:departmentId
→ Department billing history summary

🔄 Complete Data Flow Using APIs

Admin logs in → /api/auth/login

Admin creates department → /api/departments

Admin adds meter reading → /api/meter-readings

Admin generates bill → /api/bills/generate/:meterReadingId

User pays bill → /api/payments

Dashboard shows reports → /api/reports


---

### 2. The Variant Selection Flow (SKU Logic)

**User Story:** As a customer, I want to see real-time stock and price changes when I select a different color or size.

* **UI (Frontend) Task:**
* Product page par "Color Swatches" aur "Size Chips" dikhana.
* User jab color badle, toh main product image ko update karna.
* Agar select kiya hua variant stock mein nahi hai, toh "Add to Cart" button ko disable karke "Out of Stock" dikhana.


* **Backend Task:**
* `GET /api/products/:slug` par saare associated **SKUs** ki list bhejna.
* Inventory table se check karna ki har SKU ka `quantity - reserved` balance kitna hai.



---

### 3. Add to Cart & Reservation Flow

**User Story:** As a customer, I want my items to be "held" for me for 10 minutes while I enter my payment details.

* **UI (Frontend) Task:**
* "Add to Cart" par loading spinner dikhana.
* Checkout page par ek countdown timer dikhana ("Your items are reserved for 09:59").


* **Backend Task:**
* `POST /api/cart/add` par Inventory table mein `reserved` count ko +1 karna.
* Ek **Cron Job** ya **Redis TTL** set karna jo 10 mins baad agar payment nahi hui, toh reservation ko automatically -1 kar de (Release stock).



---

### 4. Checkout & Order Snapshotting

**User Story:** As a customer, I want to receive a fixed invoice that doesn't change even if the store prices go up later.

* **UI (Frontend) Task:**
* Order Summary screen par item ki price, tax, aur shipping ka breakdown dikhana.
* Order success ke baad "Invoice Download" ka option dena jo backend se generated PDF dikhaye.


* **Backend Task:**
* **Order Snapshotting:** `Order` document create karte waqt Product ka name, current price, aur image URL string format mein store karna (References nahi, actual data).
* User ka shipping address copy karke `order.shippingAddress` mein save karna.
* Cart ko clear karna (`cart.items = []`).



---

### 5. Vendor Dashboard (Marketplace Flow)

**User Story:** As a seller, I want to see which of my products are running low on stock so that I can refill them.

* **UI (Frontend) Task:**
* Seller dashboard par "Low Stock Alerts" ka ek section dikhana.
* Ek table jisme har SKU ka current stock aur sales velocity (last 30 days) dikhe.


* **Backend Task:**
* `GET /api/business/inventory/low-stock` endpoint banana jo `Inventory` table ko query kare jahan `quantity <= lowStockThreshold`.
* Seller ID ke basis par results ko filter karna (Data Privacy).



---

### 6. Admin Security (Audit Logs)

**User Story:** As a Super Admin, I want to know which employee changed a product price to ensure there is no internal fraud.

* **UI (Frontend) Task:**
* Admin Settings mein "Activity Feed" ya "Audit Log" ka page banana.
* Filters lagana (Filter by Admin Name, Filter by Date).


* **Backend Task:**
* Ek **Middleware** banana jo har `PUT` aur `DELETE` request par `AuditLog` model mein entry insert kare.
* Entry mein `req.user.id`, `oldValue`, aur `newValue` record karna.



---

### Tasks Priority List (For Development)

| Priority | Feature | Complexity |
| --- | --- | --- |
| **P0** | Auth & User Profile | Medium |
| **P0** | Product & Category Browsing | Low |
| **P1** | SKU & Inventory Management | High |
| **P1** | Cart & Order Snapshotting | High |
| **P2** | Payment Gateway Integration | Medium |
| **P3** | Audit Logs & Admin Analytics | Medium |

**Kya aap chahte hain ki main inme se kisi ek story ka "Backend Controller" aur uski corresponding "Frontend API Call" ka code likh kar dikhaun?**