/* ============================================================
   FRONT PAGE GENERATOR â€“ script.js
   Modules: Goal Analyzer | Validator | Planner | PDF Engine
============================================================ */

// â”€â”€ THEME CONFIG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const THEMES = {
    blue:   { dark: [0, 45, 98],    light: [0, 191, 255],  name: "Classic Blue"  },
    red:    { dark: [123, 0, 0],    light: [229, 57, 53],  name: "Bold Red"      },
    green:  { dark: [27, 94, 32],   light: [67, 160, 71],  name: "Royal Green"   },
    purple: { dark: [49, 27, 146],  light: [124, 77, 255], name: "Deep Purple"   }
};
let activeTheme = "blue";
let logoDataURL  = null;   // set when user uploads a logo
let defaultLogoElement = null; // set when logo.png loads at startup

// â”€â”€ LIVE PREVIEW FIELDS MAP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const liveMap = {
    universityName : "prev-uni",
    department     : "prev-dept",
    name           : "prev-name",
    roll_no        : "prev-roll",
    section        : "prev-section",
    subject        : "prev-subject",
    subjectCode    : "prev-code",
    topic          : "prev-topic",
    teacher        : "prev-to",
};

// â”€â”€ DEFAULT LOGO LOADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Loads logo.png from same folder and converts to dataURL for PDF use.
function loadDefaultLogo() {
    // XHR works on file:// for same-origin resources; produces a real dataURL for jsPDF.
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "logo.png", true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 0) { // status 0 = file:// success
            const reader = new FileReader();
            reader.onload = function (e) {
                logoDataURL = e.target.result; // store as dataURL for PDF use
                const box = document.getElementById("prev-logoBox");
                if (box) box.innerHTML = '<img src="logo.png" alt="logo">';
            };
            reader.readAsDataURL(xhr.response);
        }
    };
    xhr.onerror = () => { /* logo.png not found – placeholder stays */ };
    xhr.send();
}

// â”€â”€ DOM READY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.addEventListener("DOMContentLoaded", () => {

    // Set default submission date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("submissionDate").value = today;
    updateDatePreview();

    // Load logo.png as the default logo
    loadDefaultLogo();

    // â”€â”€ Theme cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.querySelectorAll(".theme-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            activeTheme = card.dataset.theme;
            applyThemeToPreview(activeTheme);
        });
    });

    // â”€â”€ Live preview: text inputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    Object.keys(liveMap).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => updatePreviewField(id));
    });

    // class + semester â†’ combined preview
    ["class", "semester"].forEach(id => {
        document.getElementById(id).addEventListener("input", updateClassSemPreview);
    });

    // submission date
    document.getElementById("submissionDate").addEventListener("change", updateDatePreview);

    // â”€â”€ Logo upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.getElementById("logoInput").addEventListener("change", function () {
        const file = this.files[0];
        if (!file) { logoDataURL = null; resetLogoPreview(); return; }
        if (file.size > 200 * 1024) {
            showError("Logo must be under 200 KB."); this.value = ""; return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            logoDataURL = ev.target.result;
            const box = document.getElementById("prev-logoBox");
            box.innerHTML = `<img src="${logoDataURL}" alt="logo">`;
        };
        reader.readAsDataURL(file);
    });

    // â”€â”€ Department preview special format â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.getElementById("department").addEventListener("input", function () {
        const val = this.value.trim() || "Computer Science";
        document.getElementById("prev-dept").textContent = `Department: ${val}`;
    });

    // â”€â”€ University Name preview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.getElementById("universityName").addEventListener("input", function () {
        const val = this.value.trim().toUpperCase() || "ABC UNIVERSITY";
        document.getElementById("prev-uni").textContent = val;
    });

    // â”€â”€ Academic year â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.getElementById("academicYear").addEventListener("input", function () {
        const val = this.value.trim() || "2025-26";
        document.getElementById("prev-year").textContent = `Academic Year ${val}`;
    });

    // â”€â”€ Form submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.getElementById("frontPageForm").addEventListener("submit", handleSubmit);

    // Initial preview
    applyThemeToPreview(activeTheme);

    // â”€â”€ Mobile preview toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const toggleBtn   = document.getElementById("previewToggleBtn");
    const previewPanel = document.getElementById("previewPanel");
    if (toggleBtn && previewPanel) {
        toggleBtn.addEventListener("click", () => {
            const isOpen = previewPanel.classList.toggle("preview-visible");
            toggleBtn.textContent    = isOpen ? "X Hide Preview" : "👁 Show Preview";
            toggleBtn.setAttribute("aria-expanded", isOpen);
            toggleBtn.classList.toggle("active", isOpen);
            if (isOpen) {
                previewPanel.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }
});

// â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function val(id) { return document.getElementById(id).value.trim(); }

function updatePreviewField(inputId) {
    const targetId = liveMap[inputId];
    const v = val(inputId);
    const previewEl = document.getElementById(targetId);
    if (!previewEl) return;

    if (inputId === "name") {
        previewEl.textContent = v || "â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”";
        document.getElementById("prev-by").textContent = v || "â€”â€”â€”â€”â€”â€”â€”â€”";
    } else {
        previewEl.textContent = v || (previewEl.dataset.placeholder || "â€”â€”â€”â€”");
    }
}

function updateClassSemPreview() {
    const cls = val("class"); const sem = val("semester");
    const combined = [cls, sem ? `Sem ${sem}` : ""].filter(Boolean).join(" | ");
    document.getElementById("prev-classem").textContent = combined || "â€”â€”â€”â€”â€”â€”â€”â€”";
}

function updateDatePreview() {
    const raw = document.getElementById("submissionDate").value;
    if (!raw) { document.getElementById("prev-date").textContent = "â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”"; return; }
    const d = new Date(raw);
    document.getElementById("prev-date").textContent = d.toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric"
    });
}

function applyThemeToPreview(theme) {
    const page = document.getElementById("previewPage");
    page.className = "page-container theme-" + theme;
}

function resetLogoPreview() {
    document.getElementById("prev-logoBox").innerHTML = "LOGO";
}

function showError(msg) {
    const el = document.getElementById("error-message");
    el.textContent = msg; el.classList.add("visible");
    document.getElementById("success-message").classList.remove("visible");
}
function showSuccess(msg) {
    const el = document.getElementById("success-message");
    el.textContent = msg; el.classList.add("visible");
    document.getElementById("error-message").classList.remove("visible");
}
function clearMessages() {
    document.getElementById("error-message").classList.remove("visible");
    document.getElementById("success-message").classList.remove("visible");
}

// â”€â”€ MODULE 1: GOAL ANALYZER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function analyzeGoal(data) {
    const hasMinFields = data.name && data.topic && data.teacher;
    return { valid: !!hasMinFields, intent: "generate_assignment_pdf" };
}

// â”€â”€ MODULE 2: INPUT VALIDATOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function validateInput(data) {
    const errs = [];
    if (!data.name)      errs.push("Name is required.");
    if (!data.className) errs.push("Class is required.");
    if (!data.rollNo)    errs.push("Roll No is required.");
    if (!data.topic)     errs.push("Topic is required.");
    if (!data.teacher)   errs.push("Submitted To is required.");
    if (!data.semester)  errs.push("Semester is required.");
    if (data.semester && isNaN(Number(data.semester)))
        errs.push("Semester must be a number.");
    if (data.topic && data.topic.length >= 100)
        errs.push("Topic must be less than 100 characters.");
    return errs;
}

// â”€â”€ MODULE 3: PLANNER ENGINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildTaskPlan() {
    return [
        "Validate Input", "Load Logo", "Create PDF Object",
        "Format Layout",  "Insert Text", "Insert Date", "Save PDF"
    ];
}

// â”€â”€ MODULE 4: PDF EXECUTION ENGINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generatePDF(data, theme, logoDataURL) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageW = 210, pageH = 297;
    const mL = 20, mR = 20;
    const T = theme ? THEMES[theme] : THEMES.blue;
    const [dr, dg, db] = T.dark;
    const [lr, lg, lb] = T.light;
    const cornerSize = 28; // mm

    // â”€â”€ BORDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setDrawColor(dr, dg, db);
    pdf.setLineWidth(3.5);
    pdf.rect(1.5, 1.5, pageW - 3, pageH - 3, "S");

    // â”€â”€ CORNER TRIANGLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setFillColor(lr, lg, lb);
    const s = cornerSize;
    // top-left
    pdf.lines([[s, 0], [-s, s]], 0, 0, [1,1], "F", true);
    // top-right
    pdf.lines([[s, 0], [0, s]], pageW - s, 0, [1,1], "F", true);
    // bottom-left
    pdf.lines([[s, s], [-s, 0]], 0, pageH - s, [1,1], "F", true);
    // bottom-right  — start at (pageW-s, pageH), go right then up
    pdf.lines([[s, 0], [0, -s]], pageW - s, pageH, [1,1], "F", true);

    let y = 32;

    // â”€â”€ LOGO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Use user-uploaded dataURL first, then default logo.png dataURL (loaded via XHR at startup)
    const logoSource = logoDataURL;
    if (logoSource) {
        try {
            const imgW = 28, imgH = 28;
            pdf.addImage(logoSource, "PNG", (pageW - imgW) / 2, y, imgW, imgH);
            y += imgH + 12;
        } catch (_) { y += 12; }
    } else {
        // Logo placeholder box
        pdf.setDrawColor(lr, lg, lb);
        pdf.setLineWidth(1);
        const bw = 22, bh = 22, bx = (pageW - bw) / 2;
        pdf.rect(bx, y, bw, bh, "S");
        pdf.setFontSize(8); pdf.setTextColor(lr, lg, lb);
        pdf.setFont("helvetica", "bold");
        pdf.text("LOGO", pageW / 2, y + 13, { align: "center" });
        y += bh + 12;
    }

    // â”€â”€ UNIVERSITY NAME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setTextColor(dr, dg, db);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    const uniLines = pdf.splitTextToSize((data.universityName || "UNIVERSITY NAME").toUpperCase(), 160);
    pdf.text(uniLines, pageW / 2, y, { align: "center" });
    y += uniLines.length * 9 + 2;

    // â”€â”€ DEPARTMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setFontSize(12);
    pdf.setTextColor(lr, lg, lb);
    pdf.setFont("helvetica", "bold");
    pdf.text("Department: " + (data.department || ""), pageW / 2, y, { align: "center" });
    y += 8;

    // â”€â”€ ASSIGNMENT LABEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setFontSize(16);
    pdf.setTextColor(dr, dg, db);
    pdf.setFont("helvetica", "bold");
    pdf.text("Assignment", pageW / 2, y, { align: "center" });
    y += 7;

    // â”€â”€ ACADEMIC YEAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    pdf.text("Academic Year " + (data.academicYear || ""), pageW / 2, y, { align: "center" });
    y += 10;

    // â”€â”€ INFO BOX â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const boxX = mL, boxW = pageW - mL - mR;
    const rowH  = 9, rowPad = 5, lblX = boxX + 5, dotX = boxX + 50;
    const dotW  = boxW - 55;

    // Measure box height (5 rows of info â€” matches HTML preview exactly)
    const infoRows = [
        ["Student Name",       data.name],
        ["Roll No",            data.rollNo + (data.section ? `   |   Section: ${data.section}` : "")],
        ["Subject",            data.subject + (data.subjectCode ? `   |   Code: ${data.subjectCode}` : "")],
        ["Topic",              data.topic],
        ["Date of Submission", data.submissionDate],
    ];
    const boxH = infoRows.length * rowH + rowPad * 2;

    pdf.setDrawColor(0); pdf.setLineWidth(0.8);
    pdf.rect(boxX, y, boxW, boxH, "S");

    // Shadow effect
    pdf.setFillColor(200, 200, 200);
    pdf.rect(boxX + 4, y + 4, boxW, boxH, "F");
    pdf.setFillColor(255, 255, 255);
    pdf.rect(boxX, y, boxW, boxH, "F");
    pdf.setDrawColor(0); pdf.rect(boxX, y, boxW, boxH, "S");

    let ry = y + rowPad + 5;
    infoRows.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(20, 20, 20);
        pdf.text(label + ":", lblX, ry);

        // dotted line
        pdf.setLineDashPattern([0.8, 1.5], 0);
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.3);
        pdf.line(dotX, ry, dotX + dotW, ry);
        pdf.setLineDashPattern([], 0);

        // value text (italic)
        pdf.setFont("helvetica", "bolditalic");
        pdf.setTextColor(dr, dg, db);
        const vLines = pdf.splitTextToSize(value || "", dotW);
        pdf.text(vLines, dotX + dotW / 2, ry - 1.5, { align: "center" });
        ry += rowH;
    });
    y += boxH + 10;

    // â”€â”€ SUBMISSION DETAILS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Sub-details â€” matches HTML preview: Class/Semester first, then Submitted By/To
    const subRows = [
        ["Class / Semester", `${data.className}  |  Sem ${data.semester}`],
        ["Submitted By",     data.name],
        ["Submitted To",     data.teacher],
    ];
    const subLblX = mL + 5, subValX = mL + 45;
    const subValW  = pageW - mR - subValX;

    subRows.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(12);
        pdf.setTextColor(dr, dg, db);
        pdf.text(label + ":", subLblX, y);

        // dotted underline
        pdf.setLineDashPattern([1, 1.8], 0);
        pdf.setDrawColor(dr, dg, db); pdf.setLineWidth(0.5);
        pdf.line(subValX, y, subValX + subValW, y);
        pdf.setLineDashPattern([], 0);

        pdf.setFont("helvetica", "italic"); pdf.setFontSize(11);
        pdf.setTextColor(40, 40, 40);
        pdf.text(value || "", subValX + subValW / 2, y - 1.5, { align: "center" });
        y += 12;
    });

    // â”€â”€ SIGNATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    y = pageH - 28;
    const sigW = 55;
    const sig1X = mL + 8, sig2X = pageW - mR - sigW - 8;

    pdf.setDrawColor(40, 40, 40); pdf.setLineWidth(0.6);
    pdf.line(sig1X, y, sig1X + sigW, y);
    pdf.line(sig2X, y, sig2X + sigW, y);

    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Student Signature",   sig1X + sigW / 2, y + 5, { align: "center" });
    pdf.text("Professor Signature", sig2X + sigW / 2, y + 5, { align: "center" });

    // â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    pdf.setFont("helvetica", "italic"); pdf.setFontSize(8);
    pdf.setTextColor(160, 160, 160);
    pdf.text("Generated by Front Page Generator", pageW / 2, pageH - 5, { align: "center" });

    // â”€â”€ SAVE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const fileName = `${(data.name || "FrontPage").replace(/\s+/g,"_")}_FrontPage.pdf`;
    pdf.save(fileName);
    return fileName;
}

// â”€â”€ MODULE 5: FORM SUBMIT / PIPELINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function handleSubmit(e) {
    e.preventDefault();
    clearMessages();

    const btn = document.getElementById("generateBtn");

    // Collect data
    const rawDate = document.getElementById("submissionDate").value;
    const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
        : "";

    const data = {
        universityName : val("universityName"),
        department     : val("department"),
        name           : val("name"),
        className      : val("class"),
        rollNo         : val("roll_no"),
        section        : val("section"),
        subject        : val("subject"),
        subjectCode    : val("subjectCode"),
        topic          : val("topic"),
        teacher        : val("teacher"),
        semester       : val("semester"),
        academicYear   : val("academicYear"),
        submissionDate : formattedDate,
    };

    // Goal analyzer
    const goal = analyzeGoal(data);
    if (!goal.valid) {
        showError("Please fill in the required fields to generate the PDF.");
        return;
    }

    // Input validation
    const errors = validateInput(data);
    if (errors.length) { showError(errors.join("  |  ")); return; }

    // Build plan (AI-style log)
    const plan = buildTaskPlan();
    console.log("[Planner] Task plan:", plan);

    // Logo check
    const logoFile = document.getElementById("logoInput").files[0];
    btn.disabled = true; btn.textContent = "Generating...";

    if (logoFile) {
        if (logoFile.size > 200 * 1024) {
            showError("Logo must be under 200 KB."); btn.disabled = false; btn.textContent = "⬇ Generate & Download PDF"; return;
        }
        const reader = new FileReader();
        reader.onload = ev => runPipeline(data, activeTheme, ev.target.result);
        reader.onerror = () => { showError("Could not read logo."); btn.disabled = false; btn.textContent = "⬇ Generate & Download PDF"; };
        reader.readAsDataURL(logoFile);
    } else {
        runPipeline(data, activeTheme, logoDataURL);
    }

    function runPipeline(data, theme, logo) {
        try {
            const file = generatePDF(data, theme, logo);
            showSuccess(`✅ "${file}" downloaded successfully!`);
        } catch (err) {
            showError("PDF generation failed: " + err.message);
        } finally {
            btn.disabled = false; btn.textContent = "⬇ Generate & Download PDF";
        }
    }
}


// â”€â”€ All old duplicate code removed. Only the 3-param generatePDF above is active. â”€â”€

