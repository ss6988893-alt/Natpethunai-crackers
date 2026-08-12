"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./admin.module.css";

type View = "overview" | "orders" | "inventory" | "customers";
type OrderStatus = "New" | "Confirmed" | "Packing" | "Ready";

type Order = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  amount: number;
  status: OrderStatus;
  time: string;
};

const navItems: { id: View; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "orders", label: "Orders", icon: "▤" },
  { id: "inventory", label: "Inventory", icon: "◇" },
  { id: "customers", label: "Customers", icon: "◎" },
];

const orders: Order[] = [
  { id: "NTC-1048", customer: "Arun Kumar", phone: "•••• 2318", product: "Grand Family Combo", amount: 7000, status: "New", time: "8 min ago" },
  { id: "NTC-1047", customer: "Meena R", phone: "•••• 8842", product: "Celebration Combo", amount: 5000, status: "Confirmed", time: "24 min ago" },
  { id: "NTC-1046", customer: "Sathish M", phone: "•••• 0906", product: "Festival Max Combo", amount: 10000, status: "Packing", time: "51 min ago" },
  { id: "NTC-1045", customer: "Priya Devi", phone: "•••• 6129", product: "Spark Combo × 2", amount: 6000, status: "Ready", time: "1 hr ago" },
  { id: "NTC-1044", customer: "Vignesh S", phone: "•••• 7450", product: "Aerial assortment", amount: 4250, status: "Confirmed", time: "2 hrs ago" },
  { id: "NTC-1043", customer: "Lakshmi P", phone: "•••• 3371", product: "Flower pot collection", amount: 2800, status: "Ready", time: "3 hrs ago" },
];

const inventory = [
  { name: "15 Shot Colour Rider", category: "Aerial", stock: 8, level: 18, sku: "AR-015" },
  { name: "Deluxe Flower Pots", category: "Fountains", stock: 12, level: 27, sku: "FP-204" },
  { name: "Festival Max Combo", category: "Combos", stock: 5, level: 13, sku: "CB-010" },
  { name: "30 cm Electric Sparklers", category: "Sparklers", stock: 16, level: 36, sku: "SP-030" },
];

const customers = [
  { name: "Arun Kumar", detail: "3 orders · ₹18,500", last: "Today", initials: "AK" },
  { name: "Meena R", detail: "2 orders · ₹12,000", last: "Today", initials: "MR" },
  { name: "Sathish M", detail: "5 orders · ₹39,250", last: "Yesterday", initials: "SM" },
  { name: "Priya Devi", detail: "2 orders · ₹9,000", last: "2 days ago", initials: "PD" },
  { name: "Vignesh S", detail: "1 order · ₹4,250", last: "2 days ago", initials: "VS" },
];

const activity = [
  { tone: "orange", title: "New order NTC-1048", detail: "Grand Family Combo · ₹7,000", time: "8 min" },
  { tone: "green", title: "Order ready for pickup", detail: "NTC-1045 · Priya Devi", time: "1 hr" },
  { tone: "blue", title: "Inventory updated", detail: "24 product quantities reviewed", time: "2 hrs" },
  { tone: "violet", title: "New customer added", detail: "Vignesh S · WhatsApp enquiry", time: "2 hrs" },
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`${styles.status} ${styles[`status${status}`]}`}>{status}</span>;
}

export default function AdminDashboard({
  user,
}: {
  user: { name: string; email: string };
}) {
  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("7 days");
  const [query, setQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<"All" | OrderStatus>("All");
  const [toast, setToast] = useState("");

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = orderFilter === "All" || order.status === orderFilter;
      const matchesSearch =
        !search ||
        [order.id, order.customer, order.product, order.status]
          .join(" ")
          .toLowerCase()
          .includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [orderFilter, query]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const goTo = (next: View) => {
    setView(next);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.adminShell}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link className={styles.brand} href="/" aria-label="Natpe Thunai Crackers storefront">
            <span className={styles.brandMark}><img src="/brand-logo.png" alt="" /></span>
            <span><strong>Natpe Thunai</strong><small>Store administration</small></span>
          </Link>
          <button className={styles.closeMenu} onClick={() => setSidebarOpen(false)} type="button" aria-label="Close menu">×</button>
        </div>

        <nav className={styles.adminNav} aria-label="Admin navigation">
          <p>Workspace</p>
          {navItems.map((item) => (
            <button
              className={view === item.id ? styles.activeNav : ""}
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>{item.label}
              {item.id === "orders" && <b>6</b>}
            </button>
          ))}
          <p>Store</p>
          <Link href="/" target="_blank"><span aria-hidden="true">↗</span>View storefront</Link>
          <Link href="/contact" target="_blank"><span aria-hidden="true">⌖</span>Contact page</Link>
        </nav>

        <div className={styles.sidebarHelp}>
          <span aria-hidden="true">?</span>
          <strong>Need assistance?</strong>
          <p>Your store workspace is connected and running normally.</p>
        </div>

        <div className={styles.sidebarUser}>
          <span>{initials(user.name)}</span>
          <div><strong>{user.name}</strong><small>{user.email}</small></div>
          <a href="/signout-with-chatgpt?return_to=/" title="Sign out" aria-label="Sign out">↪</a>
        </div>
      </aside>

      {sidebarOpen && <button className={styles.scrim} type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

      <main className={styles.adminMain}>
        <header className={styles.topbar}>
          <button className={styles.mobileMenu} type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">☰</button>
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders, customers or products"
              aria-label="Search dashboard"
            />
            <kbd>⌘ K</kbd>
          </label>
          <div className={styles.topActions}>
            <button type="button" className={styles.iconButton} aria-label="Notifications" onClick={() => showToast("You’re all caught up.")}><span>3</span>♢</button>
            <span className={styles.topAvatar}>{initials(user.name)}</span>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.pageHeading}>
            <div>
              <p className={styles.eyebrow}>Natpe Thunai workspace</p>
              <h1>{view === "overview" ? `Vanakkam, ${user.name.split(" ")[0]}` : navItems.find((item) => item.id === view)?.label}</h1>
              <p>{view === "overview" ? "Here’s what’s happening with your store today." : `Review and manage your store ${view}.`}</p>
            </div>
            <div className={styles.headingActions}>
              <label className={styles.periodSelect}>
                <span aria-hidden="true">◫</span>
                <select aria-label="Dashboard period" value={period} onChange={(event) => setPeriod(event.target.value)}>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>This season</option>
                </select>
              </label>
              <button className={styles.primaryButton} type="button" onClick={() => showToast("Order form is ready for a new entry.")}><span>＋</span>New order</button>
            </div>
          </div>

          {view === "overview" && (
            <Overview
              period={period}
              orders={filteredOrders}
              onShowOrders={() => goTo("orders")}
              onShowInventory={() => goTo("inventory")}
              onAction={showToast}
            />
          )}

          {view === "orders" && (
            <OrdersView
              orders={filteredOrders}
              filter={orderFilter}
              onFilter={setOrderFilter}
              onAction={showToast}
            />
          )}

          {view === "inventory" && <InventoryView onAction={showToast} />}
          {view === "customers" && <CustomersView onAction={showToast} />}
        </div>
      </main>

      <div className={`${styles.toast} ${toast ? styles.toastVisible : ""}`} role="status" aria-live="polite">
        <span>✓</span>{toast}
      </div>
    </div>
  );
}

function Overview({
  period,
  orders: visibleOrders,
  onShowOrders,
  onShowInventory,
  onAction,
}: {
  period: string;
  orders: Order[];
  onShowOrders: () => void;
  onShowInventory: () => void;
  onAction: (message: string) => void;
}) {
  const bars = [38, 54, 42, 68, 58, 81, 72, 92, 65, 78, 88, 100, 82, 96];
  return (
    <>
      <section className={styles.metrics} aria-label="Store summary">
        <article className={styles.metricCard}>
          <div><span className={`${styles.metricIcon} ${styles.orange}`}>₹</span><span className={styles.trendUp}>↗ 12.5%</span></div>
          <p>Total revenue</p><strong>₹1,84,250</strong><small>vs ₹1,63,800 last period</small>
        </article>
        <article className={styles.metricCard}>
          <div><span className={`${styles.metricIcon} ${styles.violet}`}>▤</span><span className={styles.trendUp}>↗ 8.2%</span></div>
          <p>Total orders</p><strong>48</strong><small>6 orders need attention</small>
        </article>
        <article className={styles.metricCard}>
          <div><span className={`${styles.metricIcon} ${styles.blue}`}>◎</span><span className={styles.trendUp}>↗ 5.4%</span></div>
          <p>Customers</p><strong>126</strong><small>14 new this {period.toLowerCase()}</small>
        </article>
        <article className={styles.metricCard}>
          <div><span className={`${styles.metricIcon} ${styles.red}`}>!</span><span className={styles.neutralTrend}>4 items</span></div>
          <p>Low stock</p><strong>4</strong><small>Restock before the weekend</small>
        </article>
      </section>

      <section className={styles.chartRow}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div><h2>Sales performance</h2><p>Revenue across the last {period.toLowerCase()}</p></div>
            <div className={styles.chartTotal}><span>Gross sales</span><strong>₹1.84L</strong></div>
          </div>
          <div className={styles.chart} aria-label="Sales chart trending upward">
            <div className={styles.axisLabels}><span>₹30K</span><span>₹20K</span><span>₹10K</span><span>₹0</span></div>
            <div className={styles.gridLines}><i /><i /><i /><i /></div>
            <div className={styles.bars}>
              {bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} title={`${Math.round(height * 280)} rupees`} />)}
            </div>
            <div className={styles.xLabels}><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.categoryPanel}`}>
          <div className={styles.panelHeading}><div><h2>Sales by category</h2><p>Top performers this period</p></div><button type="button" onClick={() => onAction("Category report prepared.")}>•••</button></div>
          <div className={styles.donutWrap}>
            <div className={styles.donut}><span><strong>₹1.84L</strong><small>Total sales</small></span></div>
            <ul>
              <li><span><i className={styles.donutOrange} />Combos</span><strong>42%</strong></li>
              <li><span><i className={styles.donutViolet} />Aerials</span><strong>28%</strong></li>
              <li><span><i className={styles.donutBlue} />Fountains</span><strong>18%</strong></li>
              <li><span><i className={styles.donutGray} />Others</span><strong>12%</strong></li>
            </ul>
          </div>
        </article>
      </section>

      <section className={styles.lowerGrid}>
        <article className={`${styles.panel} ${styles.ordersPanel}`}>
          <div className={styles.panelHeading}><div><h2>Recent orders</h2><p>Latest customer purchases and progress</p></div><button className={styles.textButton} type="button" onClick={onShowOrders}>View all <span>→</span></button></div>
          <OrderTable orders={visibleOrders.slice(0, 4)} onAction={onAction} />
        </article>

        <article className={`${styles.panel} ${styles.activityPanel}`}>
          <div className={styles.panelHeading}><div><h2>Recent activity</h2><p>Updates from your store</p></div></div>
          <div className={styles.activityList}>
            {activity.map((item) => <div key={item.title}><i className={styles[item.tone]} /><span><strong>{item.title}</strong><small>{item.detail}</small></span><time>{item.time}</time></div>)}
          </div>
          <button className={styles.activityButton} type="button" onClick={() => onAction("All activity is now visible.")}>View all activity</button>
        </article>
      </section>

      <section className={styles.stockStrip}>
        <div><span>!</span><p><strong>4 products are running low</strong><small>Review inventory now to avoid missing weekend sales.</small></p></div>
        <button type="button" onClick={onShowInventory}>Review inventory <span>→</span></button>
      </section>
    </>
  );
}

function OrdersView({ orders: visibleOrders, filter, onFilter, onAction }: { orders: Order[]; filter: "All" | OrderStatus; onFilter: (value: "All" | OrderStatus) => void; onAction: (message: string) => void }) {
  return (
    <section className={`${styles.panel} ${styles.fullPanel}`}>
      <div className={styles.panelHeading}>
        <div><h2>Order management</h2><p>{visibleOrders.length} orders match the current view</p></div>
        <button className={styles.secondaryButton} type="button" onClick={() => onAction("Order report exported.")}>↓ Export report</button>
      </div>
      <div className={styles.filterBar} role="group" aria-label="Filter orders by status">
        {(["All", "New", "Confirmed", "Packing", "Ready"] as const).map((item) => <button className={filter === item ? styles.activeFilter : ""} type="button" key={item} onClick={() => onFilter(item)}>{item}</button>)}
      </div>
      <OrderTable orders={visibleOrders} onAction={onAction} />
    </section>
  );
}

function OrderTable({ orders: visibleOrders, onAction }: { orders: Order[]; onAction: (message: string) => void }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th><span className={styles.srOnly}>Actions</span></th></tr></thead>
        <tbody>
          {visibleOrders.map((order) => (
            <tr key={order.id}>
              <td><strong>{order.id}</strong><small>{order.time}</small></td>
              <td><span className={styles.customerCell}><i>{initials(order.customer)}</i><span><strong>{order.customer}</strong><small>{order.phone}</small></span></span></td>
              <td>{order.product}</td><td><strong>{money.format(order.amount)}</strong></td><td><StatusBadge status={order.status} /></td>
              <td><button className={styles.rowAction} type="button" aria-label={`Open ${order.id}`} onClick={() => onAction(`${order.id} opened.`)}>›</button></td>
            </tr>
          ))}
          {visibleOrders.length === 0 && <tr><td className={styles.emptyState} colSpan={6}>No orders match your current search.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function InventoryView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className={styles.inventoryGrid}>
      {inventory.map((item) => (
        <article className={styles.inventoryCard} key={item.sku}>
          <div><span className={styles.inventoryIcon}>◇</span><span className={styles.lowBadge}>Low stock</span></div>
          <p>{item.category} · {item.sku}</p><h2>{item.name}</h2>
          <div className={styles.stockCount}><strong>{item.stock}</strong><span>units remaining</span></div>
          <div className={styles.stockMeter}><i style={{ width: `${item.level}%` }} /></div>
          <button type="button" onClick={() => onAction(`${item.name} restock reminder created.`)}>Create restock reminder</button>
        </article>
      ))}
      <article className={styles.inventorySummary}>
        <p>Inventory health</p><strong>92%</strong><div><i /></div><span>184 products in healthy stock</span>
        <button type="button" onClick={() => onAction("Full inventory report opened.")}>Open full inventory →</button>
      </article>
    </div>
  );
}

function CustomersView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <section className={`${styles.panel} ${styles.fullPanel}`}>
      <div className={styles.panelHeading}><div><h2>Customer directory</h2><p>126 customer relationships across the store</p></div><button className={styles.primaryButton} type="button" onClick={() => onAction("New customer form is ready.")}>＋ Add customer</button></div>
      <div className={styles.customerList}>
        {customers.map((customer) => <article key={customer.name}><span>{customer.initials}</span><div><strong>{customer.name}</strong><small>{customer.detail}</small></div><time>{customer.last}</time><button type="button" aria-label={`Open ${customer.name}`} onClick={() => onAction(`${customer.name}'s profile opened.`)}>›</button></article>)}
      </div>
    </section>
  );
}
