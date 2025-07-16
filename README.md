# 🧾 Vendor Management Interface

A responsive and high-performance web application built with **React**, **Tailwind CSS**, and **ShadCN UI**, designed to manage enterprise-scale vendor data efficiently. This project addresses major UX and performance concerns of outdated systems and provides a modern, accessible, and modular vendor management experience.

---

## 🚀 Features

### 📊 Vendor Table
- Displays vendors with the following details:
  - **ID**, **Name**, **Category**, **Location**, **Status**
- **Row Actions**:
  - 🛠️ **Edit** – Opens a modal to update vendor details
  - ✉️ **Resend Email** – Displays toast: _"Email Sent"_

### 🔍 Filters & Search
- **Search Bar**: Search by `name`, `code`, `category`, or `city`
- **Dropdown Filters**:
  - Category (All, Electrical, Mechanical, Diesel, etc.)
  - Type (SAP, Temp)
  - Region
  - Status (Active / Inactive)
  - Date Range Picker

### 📦 Pagination & Performance
- Customizable entries per page: `10`, `25`, `50`, `100`
- Pagination controls
- ✅ Debounced search (for performance on large datasets)
- ✅ Smart loading for smoother UX with 10,000+ records

### 📤 Action Bar
- 📥 Fetch Vendor by Code (Input + Fetch Button)
- 📆 Fetch Vendor by Date (From - To Date Picker)
- 📄 Export to Excel (Downloads dummy `.csv`)

### ✏️ Edit Vendor Modal
- Side modal for editing vendor info
- Built-in validation and clear error messaging

---

## 🛠️ Tech Stack

| Tech               | Usage                        |
|--------------------|------------------------------|
| ⚛️ React.js        | Frontend framework            |
| ⚡ Vite.js          | Project setup & fast build    |
| 🎨 Tailwind CSS    | Utility-first styling         |
| 🧩 ShadCN UI       | Accessible, prebuilt UI       |
| 📦 react-hook-form | Form handling and validation |
| 🔄 Zustand / Redux | (Optional) state management  |
| 📁 FileSaver.js     | For downloading CSV exports   |

---

## 📱 Responsive Design

- Optimized for **mobile**, **tablet**, and **desktop**
- Mobile-first design using Tailwind's responsive utilities
- Horizontal scroll and stacking implemented for small screens

---

## 📄 AI_USAGE.md

This project utilized **ChatGPT** for:
- Structuring component logic
- Writing this README.md
- Designing reusable, accessible components
- Implementing responsive and UX-friendly layout strategies

See the full log in `AI_USAGE.md`.

---

## ✅ Accessibility Considerations

- All interactive elements are keyboard-navigable
- Uses **ARIA roles**, **focus rings**, and semantic HTML
- Modal traps focus and returns it on close

---

## ✨ Improvements Over Legacy System

| Issue in Old System     | Improvement in This App                    |
|--------------------------|--------------------------------------------|
| Cluttered UI             | Clean layout with clear hierarchy          |
| Poor mobile support      | Fully responsive design                    |
| Performance lags (10K+)  | Debounced search, pagination               |
| Inconsistent components  | Unified with ShadCN UI                     |
| Lack of accessibility    | Screen reader & keyboard-friendly elements |

---

## 🧰 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/kPratik07/vendor-management-interface.git
cd vendor-management-interface
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

> The app will be available at `http://localhost:5173`

---

## 👨‍💻 Author

**Pratik Raj**  
[Portfolio](https://my-portfolio-kpratik0709.vercel.app/) • [GitHub](https://github.com/kPratik07) • [Email](mailto:kpratik071997@gmail.com)

---

## 🙏 Thanks for visiting!

> “Good design is invisible. Great design is unforgettable.” ✨