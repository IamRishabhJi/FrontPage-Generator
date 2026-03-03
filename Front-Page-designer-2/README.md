# 📄 Assignment Front Page Generator

> **Made by Rishabh**

A clean, fully client-side web application that lets students instantly generate professional **assignment front pages** and download them as A4 PDFs — no backend, no signup, no install required.

---

## 🔗 Live Demo

> Open [`index.html`](index.html) locally in any modern browser, or visit the hosted version at:  
> **https://rishabh.ct.ws/Front-page-generator/index.html**

---

## ✨ Key Features

| Feature | Details |
|---------|---------|
| 🎨 **5 Unique Designs** | Classic · Futuristic · Geometric · Aesthetic · Premium |
| 🌈 **8 Colour Themes** | Blue · Red · Green · Purple · Teal · Orange · Rose · Gold |
| 👁 **Live Preview** | Every keystroke instantly updates the A4 preview panel |
| ⬇ **One-Click PDF** | Generates a pixel-perfect A4 PDF via jsPDF (no server call) |
| 🖼 **Logo Upload** | Upload your institution's logo (PNG / JPG, max 200 KB) |
| 📝 **Smart Defaults** | University name, department, and academic year pre-filled |
| ✅ **Input Validation** | Required-field checks with clear inline error/success messages |
| 📱 **Responsive UI** | Works on desktop, tablet, and mobile; mobile uses a toggle preview |

---

## 🗂️ Project Structure

```
Front-Page-designer-2/
├── index.html              # Main application — UI, form, and all 5 live previews
├── style.css               # All styles: layout, themes, design-specific rules, responsive
├── script.js               # App logic: live preview, color theming, validation, PDF engine
├── logo_b64.txt            # Default university logo stored as a Base64 string
├── README.md               # Project documentation (this file)
└── Designs (you can take reference)/
    ├── Design1.html        # Standalone reference: Classic design
    ├── design2.html        # Standalone reference: Futuristic design
    ├── design3.html        # Standalone reference: Geometric design
    ├── design4.html        # Standalone reference: Aesthetic design
    └── design5.html        # Standalone reference: Premium design
```

---

## 🚀 Getting Started

No installation, build step, or internet connection required — this is a **pure HTML/CSS/JavaScript** project.

### Option A — Open directly

```
Double-click index.html  →  opens in your default browser
```

> **Tip:** If the default logo does not appear, use **VS Code Live Server** or any local HTTP server instead of opening via `file://`.

### Option B — VS Code Live Server

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. The app opens at `http://127.0.0.1:5500/index.html`.

### Option C — Any static server

```bash
# Python 3
python -m http.server 5500

# Node.js (npx)
npx serve .
```

Then open `http://localhost:5500` in your browser.

---

## 🖥️ How to Use

1. **Choose a Design** — Click one of the 5 design cards at the top of the left panel.
2. **Choose a Colour** — Click one of the 8 colour swatches below the design grid.
3. **Fill in the Form** — Enter your details in the left panel:

   | Section | Fields |
   |---------|--------|
   | University / College | Name, Department, Logo upload |
   | Assignment Details | Subject, Subject Code, Topic / Title, Academic Year |
   | Student Details | Name, Roll No, Class, Semester, Section |
   | Submission | Submitted To, Date of Submission |

4. **Watch the Live Preview** — The right panel updates in real time as you type.  
   *(On mobile, tap **👁 Show Preview** to toggle the preview panel.)*
5. **Download the PDF** — Click **⬇ Generate & Download PDF**.  
   The file saves as `front-page.pdf` — a properly formatted A4 document.

---

## 🎨 Designs

| # | Name | Visual Style | Background | Typography |
|---|------|-------------|------------|------------|
| 1 | **Classic** | Thick outer border, decorative corner triangles, info table | White | Poppins |
| 2 | **Futuristic** | Dark background, neon bracket corners, SVG circuit lines, glassmorphism topic card | Deep dark | Orbitron / Rajdhani |
| 3 | **Geometric** | Bold side colour strip with vertical text, oversized split heading, accent info boxes | White | Inter / Space Mono |
| 4 | **Aesthetic** | Soft white, SVG floral/watercolour corner accents, cursive heading | Off-white | Playfair Display / Cinzel |
| 5 | **Premium** | Double border frame, diamond ornament, faint watermark, royal heading | Cream/parchment | Cinzel / Montserrat |

---

## 🌈 Colour Themes

Each theme applies a **Primary** (dark) and **Accent** (vivid) colour pair across all five designs — backgrounds, borders, highlights, and PDF fills all update automatically.

| Swatch | Name | Primary | Accent |
|--------|------|---------|--------|
| 🟦 | Classic Blue | `#002D62` | `#00BFFF` |
| 🟥 | Bold Red | `#7B0000` | `#E53935` |
| 🟩 | Royal Green | `#1B5E20` | `#43A047` |
| 🟪 | Deep Purple | `#311B92` | `#7C4DFF` |
| 🩵 | Electric Teal | `#004D5C` | `#00BCD4` |
| 🟧 | Amber Orange | `#BF360C` | `#FF6D00` |
| 🌸 | Deep Rose | `#880E4F` | `#E91E63` |
| 🥇 | Navy Gold | `#1A1A1A` | `#C5A021` |

---

## 📋 Form Field Reference

### University / College
| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| University Name | No | I.K.G Punjab Technical University | Editable |
| Department | No | Electronics and Communication Engineering | Editable |
| Logo | No | Built-in logo (Base64) | PNG/JPG, max 200 KB |

### Assignment Details
| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| Subject | ✅ Yes | — | — |
| Subject Code | No | — | e.g. CS301 |
| Topic / Title | ✅ Yes | — | Max 99 characters |
| Academic Year | No | 2025-26 | Editable |

### Student Details
| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| Name | ✅ Yes | — | — |
| Roll No | ✅ Yes | — | — |
| Class | ✅ Yes | — | e.g. BCA 3rd Year |
| Semester | ✅ Yes | — | Must be a number |
| Section | No | — | e.g. A |

### Submission
| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| Submitted To | ✅ Yes | — | Teacher / Professor name |
| Date of Submission | No | Today's date | Date picker |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| HTML5 | — | App structure, form, and all 5 design preview templates |
| CSS3 | — | Layout (CSS Grid/Flexbox), per-design rules, 8-theme CSS variables, responsive breakpoints |
| Vanilla JavaScript | ES2020 | Real-time preview binding, color theme injection, input validation, PDF rendering logic |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | Client-side A4 PDF generation (loaded from cdnjs CDN) |
| Google Fonts | — | Poppins, Orbitron, Rajdhani, Inter, Space Mono, Playfair Display, Cinzel, Montserrat |

> **Zero dependencies to install.** jsPDF is loaded from a CDN at runtime; all other code is native browser APIs.

---

## ⚙️ How It Works (Technical Overview)

### Live Preview
- All five A4 design templates are embedded directly in `index.html` as invisible `div` blocks.
- Each data-bearing element carries a `data-field` attribute (e.g. `data-field="name"`).
- `script.js` listens to every form `input` / `change` event and iterates all `[data-field]` elements to update their text content instantly.
- Only the active design's preview block is shown; switching designs toggles CSS classes.

### Colour Theming
- On colour swatch click, `applyColor()` injects CSS custom properties (`--primary`, `--accent`, and their RGB components) onto `:root`.
- All design stylesheets reference these variables, so the entire UI repaints with no DOM manipulation beyond that single property injection.

### PDF Generation
- On form submit, the active design ID and active colour are read.
- A design-specific `buildPDF_D<n>()` function in `script.js` is called, which uses the **jsPDF** API to draw rectangles, lines, text, and the logo image onto a 210 × 297 mm canvas.
- The logo is embedded as a Base64 data URL (either the uploaded image or the default from `logo_b64.txt`).
- The finished document is saved as `front-page.pdf` via `jsPDF.save()`.

### Input Validation
- Required fields are checked before PDF generation.
- Semester must parse as a valid number.
- Logo files exceeding 200 KB are rejected immediately on selection.
- Errors are displayed in the `#error-message` box; success in `#success-message`.

---

## 📱 Responsive Behaviour

| Viewport | Layout |
|----------|--------|
| ≥ 900 px (desktop) | Side-by-side: form panel on the left, scaled A4 preview on the right |
| < 900 px (tablet / mobile) | Single-column; preview hidden by default, revealed via **👁 Show Preview** toggle button |

---

## 🗺️ Reference Designs

The `Designs (you can take reference)/` folder contains five standalone HTML files — one per design — that render at full A4 size without the form shell. These are useful for:

- Visual reference while extending or forking a design.
- Testing design changes in isolation without running the full app.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Add YourFeature"`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

This project is licensed under the **MIT License** — see the [LICENSE](../LICENSE) file for details.

---

## 📸 Preview

> Visit the live app: **https://rishabh.ct.ws/Front-page-generator/index.html**

---

**Made with ❤️ by Rishabh** 🚀
