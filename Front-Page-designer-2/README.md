# 📄 Front Page Generator

> **Made by Rishabh**

A clean, responsive web application that lets students generate professional **assignment front pages** as downloadable PDFs — instantly, without any backend or signup required.

---

## ✨ Features

- **5 Unique Designs** – Classic, Futuristic, Geometric, Aesthetic, Premium
- **8 Colour Themes** – Blue, Red, Green, Purple, Teal, Orange, Rose, Gold
- **Live Preview** – See your front page update in real-time as you fill the form
- **PDF Download** – Generates a properly formatted A4 PDF via [jsPDF](https://github.com/parallax/jsPDF)
- **Logo Upload** – Upload your university/college logo (PNG/JPG, max 200 KB)
- **Auto-populated Fields** – Pre-filled defaults for university name, department, and academic year
- **Input Validation** – Required-field checks with clear error messages
- **Responsive Design** – Works on desktop, tablet, and mobile (with a toggle-based preview on small screens)

---

## 🗂️ Project Structure

```
FrontPage-Generator/
├── index.html                    # Portfolio landing page
└── Front-page-generator/
    ├── index.html                # Main application UI & live preview
    ├── style.css                 # All styles (themes, layout, responsive)
    ├── script.js                 # App logic: validation, preview, PDF engine
    └── logo.png                  # Default university logo
```

---

## 🚀 Getting Started

No installation or build step required — this is a pure HTML/CSS/JavaScript project.

1. **Clone the repository**
   ```bash
   git clone https://github.com/IamRishabhJi/FrontPage-Generator.git
   ```

2. **Open the app**
   ```
   Open Front-page-generator/index.html in any modern browser.
   ```
   > **Note:** For the default logo to load correctly, open the file through a local server (e.g., VS Code Live Server) rather than directly via `file://`.

---

## 🖥️ Usage

1. Open the app in your browser.
2. Fill in the form fields on the left panel:
   - University / College name and department
   - Assignment subject, subject code, and topic
   - Student details (name, roll number, class, semester, section)
   - Submitted-to (teacher/professor) and submission date
3. Optionally upload a custom university logo.
4. Pick a **design** (Classic / Futuristic / Geometric / Aesthetic / Premium) from the design cards.
5. Pick a **colour theme** from the 8 colour swatches.
6. Watch the **live preview** on the right update instantly.
7. Click **⬇ Generate & Download PDF** to save the front page as a PDF.

---

## 🎨 Designs & Colour Themes

### Designs
| # | Name | Style |
|---|------|-------|
| 1 | Classic | White bg, thick border, corner triangles |
| 2 | Futuristic | Dark bg, neon brackets, glassmorphism |
| 3 | Geometric | Side strip, oversized heading, accent boxes |
| 4 | Aesthetic | Soft white, floral feel, serif typography |
| 5 | Premium | Double border, royal typography |

### Colour Themes
| Key    | Primary   | Accent    |
|--------|-----------|-----------|
| Blue   | `#002D62` | `#00BFFF` |
| Red    | `#7B0000` | `#E53935` |
| Green  | `#1B5E20` | `#43A047` |
| Purple | `#311B92` | `#7C4DFF` |
| Teal   | `#004D5C` | `#00BCD4` |
| Orange | `#BF360C` | `#FF6D00` |
| Rose   | `#880E4F` | `#E91E63` |
| Gold   | `#1A1A1A` | `#C5A021` |

---

## 🛠️ Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| HTML5     | Structure & form |
| CSS3      | Styling, themes, responsive layout |
| Vanilla JavaScript | Live preview, validation, PDF logic |
| [jsPDF 2.5.1](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js) | Client-side PDF generation |

---

## 📋 Form Fields

### University / College
- University Name *(pre-filled)*
- Department *(pre-filled)*
- Logo upload *(optional, PNG/JPG, max 200 KB)*

### Assignment Details
- Subject *(required)*
- Subject Code *(optional)*
- Topic / Title *(required, max 99 characters)*
- Academic Year *(pre-filled)*

### Student Details
- Name *(required)*
- Roll No *(required)*
- Class *(required)*
- Semester *(required, must be a number)*
- Section *(optional)*

### Submission
- Submitted To *(required)*
- Date of Submission *(defaults to today)*

---

## 📸 Screenshots

> *Open `https://rishabh.ct.ws/Front-page-generator/index.html` in your browser to see the live app.*

---

## 📄 License

This project is open source. Feel free to use and modify it for personal or educational purposes.

---

*Generated PDFs include a small footer line — author credit does not appear inside the PDF.*

---

**Made by Rishabh** 🚀
