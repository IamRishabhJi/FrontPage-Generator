/* ============================================================
   FRONT PAGE GENERATOR - script.js   5 Designs x 8 Colours
============================================================ */

// ── COLOUR CONFIG ───────────────────────────────────────────
const COLORS = {
    blue:   { primary:'#002D62', accent:'#00BFFF', pRGB:[0,45,98],    aRGB:[0,191,255]   },
    red:    { primary:'#7B0000', accent:'#E53935', pRGB:[123,0,0],    aRGB:[229,57,53]   },
    green:  { primary:'#1B5E20', accent:'#43A047', pRGB:[27,94,32],   aRGB:[67,160,71]   },
    purple: { primary:'#311B92', accent:'#7C4DFF', pRGB:[49,27,146],  aRGB:[124,77,255]  },
    teal:   { primary:'#004D5C', accent:'#00BCD4', pRGB:[0,77,92],    aRGB:[0,188,212]   },
    orange: { primary:'#BF360C', accent:'#FF6D00', pRGB:[191,54,12],  aRGB:[255,109,0]   },
    rose:   { primary:'#880E4F', accent:'#E91E63', pRGB:[136,14,79],  aRGB:[233,30,99]   },
    gold:   { primary:'#1A1A1A', accent:'#C5A021', pRGB:[26,26,26],   aRGB:[197,160,33]  },
};
const DESIGN_NAMES = { 1:'Classic', 2:'Futuristic', 3:'Geometric', 4:'Aesthetic', 5:'Premium' };

let activeDesign = 1;
let activeColor  = 'blue';
let logoDataURL  = null;

const LOGO_DEFAULTS = {
    d1Logo: '<span>LOGO</span>',
    d2Logo: '<span>LOGO</span>',
    d3Logo: '<span>LOGO</span>',
    d4Logo: '<span>LOGO</span>',
    d5Logo: '<span class="d5-icon">🏛️</span>',
};

// ── DOM READY ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submissionDate').value = new Date().toISOString().split('T')[0];
    loadDefaultLogo();
    updateAllPreviews();
    applyColor(activeColor);

    document.querySelectorAll('.design-card').forEach(card => {
        card.addEventListener('click', () => switchDesign(parseInt(card.dataset.design)));
    });

    document.querySelectorAll('.color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            sw.classList.add('active');
            activeColor = sw.dataset.color;
            applyColor(activeColor);
        });
    });

    ['universityName','department','subject','subjectCode','topic','academicYear',
     'name','roll_no','class','semester','section','teacher'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateAllPreviews);
    });

    document.getElementById('submissionDate').addEventListener('change', updateAllPreviews);

    document.getElementById('logoInput').addEventListener('change', function() {
        const file = this.files[0];
        if (!file) { logoDataURL = null; updateAllLogos(null); return; }
        if (file.size > 200*1024) { showError('Logo must be under 200 KB.'); this.value = ''; return; }
        const reader = new FileReader();
        reader.onload = ev => { logoDataURL = ev.target.result; updateAllLogos(logoDataURL); };
        reader.readAsDataURL(file);
    });

    document.getElementById('frontPageForm').addEventListener('submit', handleSubmit);

    const toggleBtn    = document.getElementById('previewToggleBtn');
    const previewPanel = document.getElementById('previewPanel');
    if (toggleBtn && previewPanel) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = previewPanel.classList.toggle('preview-visible');
            toggleBtn.textContent = isOpen ? '✕ Hide Preview' : '👁 Show Preview';
            toggleBtn.setAttribute('aria-expanded', isOpen);
            toggleBtn.classList.toggle('active', isOpen);
            if (isOpen) previewPanel.scrollIntoView({ behavior:'smooth', block:'start' });
        });
    }
});

// ── DESIGN SWITCHER ────────────────────────────────────────
function switchDesign(n) {
    document.querySelectorAll('.preview-design').forEach(d => d.classList.remove('active'));
    document.getElementById('previewD' + n).classList.add('active');
    document.querySelectorAll('.design-card').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-design="' + n + '"]').classList.add('active');
    document.getElementById('activeName').textContent = DESIGN_NAMES[n];
    activeDesign = n;
}

// ── COLOUR APPLIER ─────────────────────────────────────────
function applyColor(colorKey) {
    const c = COLORS[colorKey];
    if (!c) return;
    document.documentElement.style.setProperty('--theme-primary', c.primary);
    document.documentElement.style.setProperty('--theme-accent',  c.accent);
}

// ── LOGO UPDATER ───────────────────────────────────────────
function updateAllLogos(src) {
    Object.entries(LOGO_DEFAULTS).forEach(([id, def]) => {
        const box = document.getElementById(id);
        if (!box) return;
        box.innerHTML = src
            ? '<img src="' + src + '" alt="logo" style="width:100%;height:100%;object-fit:contain;border-radius:3px;">'
            : def;
    });
}

function loadDefaultLogo() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'logo.png', true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 0) {
            const reader = new FileReader();
            reader.onload = ev => { logoDataURL = ev.target.result; updateAllLogos(logoDataURL); };
            reader.readAsDataURL(xhr.response);
        }
    };
    xhr.onerror = () => {};
    xhr.send();
}

// ── FIELD COMPUTER ─────────────────────────────────────────
function computeFields() {
    const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const rawDate = document.getElementById('submissionDate').value;
    let dateFmt = '—————————';
    if (rawDate) {
        dateFmt = new Date(rawDate).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
    }
    const cls  = get('class');
    const sem  = get('semester');
    const subj = get('subject');
    const code = get('subjectCode');
    const dept = get('department');
    const uni  = get('universityName');
    return {
        universityName: (uni  || 'UNIVERSITY NAME').toUpperCase(),
        deptFmt:        'Department: ' + (dept || 'Department Name'),
        yearFmt:        'Academic Year ' + (get('academicYear') || '2025-26'),
        name:           get('name')    || '—————————',
        rollNo:         get('roll_no') || '————',
        section:        get('section') || '————',
        subject:        subj           || '—————————',
        subjectCode:    code           || '————',
        topic:          get('topic')   || '"Enter Your Assignment Title Here"',
        classSem:       [cls, sem ? 'Sem ' + sem : ''].filter(Boolean).join(' | ') || '————————',
        teacher:        get('teacher') || '————————',
        dateFmt,
        department:     (dept || 'Department Name').toUpperCase(),
        subjectFull:    [subj, code].filter(Boolean).join(' | ') || '—————————',
    };
}

function updateAllPreviews() {
    const fields = computeFields();
    document.querySelectorAll('[data-field]').forEach(el => {
        const val = fields[el.dataset.field];
        if (val !== undefined) el.textContent = val;
    });
}

// ── UI HELPERS ─────────────────────────────────────────────
function v(id) { return document.getElementById(id).value.trim(); }

function showError(msg) {
    const el = document.getElementById('error-message');
    el.textContent = msg; el.classList.add('visible');
    document.getElementById('success-message').classList.remove('visible');
}
function showSuccess(msg) {
    const el = document.getElementById('success-message');
    el.textContent = msg; el.classList.add('visible');
    document.getElementById('error-message').classList.remove('visible');
}
function clearMessages() {
    document.getElementById('error-message').classList.remove('visible');
    document.getElementById('success-message').classList.remove('visible');
}

// ── VALIDATION ─────────────────────────────────────────────
function validateInput(data) {
    const errs = [];
    if (!data.name)      errs.push('Name is required.');
    if (!data.className) errs.push('Class is required.');
    if (!data.rollNo)    errs.push('Roll No is required.');
    if (!data.topic)     errs.push('Topic is required.');
    if (!data.teacher)   errs.push('Submitted To is required.');
    if (!data.semester)  errs.push('Semester is required.');
    if (data.semester && isNaN(Number(data.semester))) errs.push('Semester must be a number.');
    if (data.topic && data.topic.length >= 100)        errs.push('Topic must be under 100 characters.');
    return errs;
}

// ── FORM SUBMIT ────────────────────────────────────────────
function handleSubmit(e) {
    e.preventDefault(); clearMessages();
    const btn = document.getElementById('generateBtn');
    const rawDate = document.getElementById('submissionDate').value;
    const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })
        : '';
    const data = {
        universityName : v('universityName'), department   : v('department'),
        name           : v('name'),           className    : v('class'),
        rollNo         : v('roll_no'),         section      : v('section'),
        subject        : v('subject'),         subjectCode  : v('subjectCode'),
        topic          : v('topic'),           teacher      : v('teacher'),
        semester       : v('semester'),        academicYear : v('academicYear'),
        submissionDate : formattedDate,
    };
    if (!data.name || !data.topic || !data.teacher) {
        showError('Please fill in all required fields (Name, Topic, Submitted To).'); return;
    }
    const errors = validateInput(data);
    if (errors.length) { showError(errors.join('  ·  ')); return; }
    btn.disabled = true; btn.textContent = 'Generating...';
    const logoFile = document.getElementById('logoInput').files[0];
    if (logoFile) {
        if (logoFile.size > 200*1024) {
            showError('Logo must be under 200 KB.');
            btn.disabled = false; btn.textContent = '⬇ Generate & Download PDF'; return;
        }
        const reader = new FileReader();
        reader.onload  = ev => run(data, ev.target.result);
        reader.onerror = ()  => run(data, logoDataURL);
        reader.readAsDataURL(logoFile);
    } else {
        run(data, logoDataURL);
    }
    function run(d, logo) {
        try {
            const file = generatePDF(d, activeDesign, activeColor, logo);
            showSuccess('✅ "' + file + '" downloaded successfully!');
        } catch(err) {
            showError('PDF generation failed: ' + err.message);
        } finally {
            btn.disabled = false; btn.textContent = '⬇ Generate & Download PDF';
        }
    }
}

// ══════════════════════════════════════════════════════════
// PDF ROUTER
// ══════════════════════════════════════════════════════════
function generatePDF(data, designNum, colorKey, logoSrc) {
    switch(designNum) {
        case 2:  return pdfD2(data, colorKey, logoSrc);
        case 3:  return pdfD3(data, colorKey, logoSrc);
        case 4:  return pdfD4(data, colorKey, logoSrc);
        case 5:  return pdfD5(data, colorKey, logoSrc);
        default: return pdfD1(data, colorKey, logoSrc);
    }
}

function pdfFile(data, suffix) {
    return (data.name || 'FrontPage').replace(/\s+/g,'_') + '_' + suffix + '_FrontPage.pdf';
}

function addLogo(pdf, src, cx, y, sz) {
    if (!src) return 0;
    try { pdf.addImage(src, 'PNG', cx - sz/2, y, sz, sz); return sz + 8; }
    catch(_) { return 0; }
}

// ══════════════════════════════════════════════════════════
// D1 - CLASSIC
// ══════════════════════════════════════════════════════════
function pdfD1(data, colorKey, logoSrc) {
    const C = COLORS[colorKey] || COLORS.blue;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, H=297, cx=W/2;
    const [pr,pg,pb] = C.pRGB, [ar,ag,ab] = C.aRGB, S=28;
    // Border
    pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(3.5);
    pdf.rect(1.5, 1.5, W-3, H-3, 'S');
    // Corner triangles
    pdf.setFillColor(ar,ag,ab);
    pdf.lines([[S,0],[-S,S]],  0,   0,   [1,1], 'F', true);
    pdf.lines([[S,0],[0,S]],   W-S, 0,   [1,1], 'F', true);
    pdf.lines([[S,S],[-S,0]],  0,   H-S, [1,1], 'F', true);
    pdf.lines([[S,0],[0,-S]],  W-S, H,   [1,1], 'F', true);
    let y = 30;
    y += addLogo(pdf, logoSrc, cx, y, 26);
    // Uni
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(16);
    const uL = pdf.splitTextToSize((data.universityName||'UNIVERSITY').toUpperCase(), 160);
    pdf.text(uL, cx, y, {align:'center'}); y += uL.length*8+2;
    // Dept
    pdf.setFontSize(11); pdf.setTextColor(ar,ag,ab);
    const dL = pdf.splitTextToSize('Department: '+(data.department||''), 160);
    pdf.text(dL, cx, y, {align:'center'}); y += dL.length*6+4;
    // Assignment heading
    pdf.setFontSize(18); pdf.setTextColor(pr,pg,pb);
    pdf.text('Assignment', cx, y, {align:'center'}); y += 7;
    // Academic year
    pdf.setFontSize(11); pdf.setFont('helvetica','normal'); pdf.setTextColor(80,80,80);
    pdf.text('Academic Year ' + (data.academicYear||''), cx, y, {align:'center'}); y += 10;
    // Info box
    const bx=18, bw=W-36, rh=9, rp=5, lX=bx+5, vX=bx+52, vW=bw-58;
    const rows = [
        ['Student Name',       data.name],
        ['Roll No',            data.rollNo + (data.section ? '   |   Section: '+data.section : '')],
        ['Subject',            data.subject + (data.subjectCode ? '   |   Code: '+data.subjectCode : '')],
        ['Topic',              data.topic],
        ['Date of Submission', data.submissionDate],
    ];
    const bh = rows.length*rh + rp*2;
    pdf.setFillColor(200,200,200); pdf.rect(bx+4, y+4, bw, bh, 'F');
    pdf.setFillColor(255,255,255); pdf.rect(bx, y, bw, bh, 'F');
    pdf.setDrawColor(0); pdf.setLineWidth(0.8); pdf.rect(bx, y, bw, bh, 'S');
    let ry = y + rp + 5;
    rows.forEach(([lbl, val]) => {
        pdf.setFont('helvetica','bold'); pdf.setFontSize(9.5); pdf.setTextColor(20,20,20);
        pdf.text(lbl + ':', lX, ry);
        pdf.setLineDashPattern([0.8,1.5],0); pdf.setDrawColor(130,130,130); pdf.setLineWidth(0.3);
        pdf.line(vX, ry, vX+vW, ry); pdf.setLineDashPattern([],0);
        pdf.setFont('helvetica','bolditalic'); pdf.setFontSize(9); pdf.setTextColor(pr,pg,pb);
        pdf.text(pdf.splitTextToSize(val||'', vW)[0], vX+vW/2, ry-1.5, {align:'center'});
        ry += rh;
    });
    y += bh + 10;
    // Sub-details
    [['Class / Semester', (data.className||'') + ' | Sem ' + (data.semester||'')],
     ['Submitted By', data.name],
     ['Submitted To', data.teacher]].forEach(([lbl, val]) => {
        const lvX=20, vvX=70, vvW=W-20-70;
        pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.setTextColor(pr,pg,pb);
        pdf.text(lbl + ':', lvX, y);
        pdf.setLineDashPattern([1,1.8],0); pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(0.5);
        pdf.line(vvX, y, vvX+vvW, y); pdf.setLineDashPattern([],0);
        pdf.setFont('helvetica','italic'); pdf.setFontSize(10); pdf.setTextColor(40,40,40);
        pdf.text(val||'', vvX+vvW/2, y-1.5, {align:'center'}); y += 12;
    });
    // Signatures
    y = H - 26;
    pdf.setDrawColor(40,40,40); pdf.setLineWidth(0.6);
    pdf.line(22, y, 77, y); pdf.line(W-80, y, W-25, y);
    pdf.setFont('helvetica','normal'); pdf.setFontSize(8.5); pdf.setTextColor(80,80,80);
    pdf.text('Student Signature',   49,   y+5, {align:'center'});
    pdf.text('Professor Signature', W-52, y+5, {align:'center'});
    pdf.setFont('helvetica','italic'); pdf.setFontSize(7); pdf.setTextColor(160,160,160);
    pdf.text('Generated by Front Page Generator', W/2, H-5, {align:'center'});
    const fn = pdfFile(data,'Classic'); pdf.save(fn); return fn;
}

// ══════════════════════════════════════════════════════════
// D2 - FUTURISTIC
// ══════════════════════════════════════════════════════════
function pdfD2(data, colorKey, logoSrc) {
    const C = COLORS[colorKey] || COLORS.blue;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, H=297, cx=W/2;
    const [pr,pg,pb] = C.pRGB, [ar,ag,ab] = C.aRGB;
    // Dark BG
    pdf.setFillColor(10,14,20); pdf.rect(0,0,W,H,'F');
    // Corner brackets
    const bk=18, bsz=14;
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(2);
    pdf.line(bk,bk,bk+bsz,bk); pdf.line(bk,bk,bk,bk+bsz);
    pdf.line(W-bk,H-bk,W-bk-bsz,H-bk); pdf.line(W-bk,H-bk,W-bk,H-bk-bsz);
    let y = 34;
    y += addLogo(pdf, logoSrc, cx, y, 20);
    // Uni name
    pdf.setTextColor(255,255,255); pdf.setFont('helvetica','bold'); pdf.setFontSize(14);
    const uL = pdf.splitTextToSize((data.universityName||'').toUpperCase(), 155);
    pdf.text(uL, cx, y, {align:'center'}); y += uL.length*7.5+3;
    // Dept tag (accent bg)
    pdf.setFillColor(ar,ag,ab);
    const dTxt = (data.department||'').toUpperCase().substring(0,68);
    const dW = Math.min(pdf.getTextWidth(dTxt)+16, 155);
    pdf.rect(cx-dW/2, y-5, dW, 9, 'F');
    pdf.setTextColor(0,0,0); pdf.setFontSize(8);
    pdf.text(dTxt, cx, y+0.5, {align:'center', maxWidth:140}); y += 10;
    // Session
    pdf.setTextColor(100,100,100); pdf.setFont('helvetica','normal'); pdf.setFontSize(9);
    pdf.text('Academic Session: '+(data.academicYear||''), cx, y+3, {align:'center'}); y += 10;
    // Separator
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.5); pdf.line(20,y,W-20,y); y += 12;
    // Topic card
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.5); pdf.rect(20,y,W-40,26,'S');
    pdf.setTextColor(100,100,100); pdf.setFontSize(7.5);
    pdf.text('ASSIGNMENT TOPIC', cx, y+6, {align:'center'});
    pdf.setTextColor(ar,ag,ab); pdf.setFont('helvetica','bold'); pdf.setFontSize(11);
    pdf.text(pdf.splitTextToSize(data.topic||'—', W-50)[0], cx, y+16, {align:'center'}); y += 36;
    // Info grid 2-col
    const grid = [
        ['STUDENT NAME', data.name],
        ['ROLL NUMBER',  data.rollNo],
        ['SUBJECT',      data.subject],
        ['SUBJECT CODE', data.subjectCode],
        ['CLASS / SEM',  (data.className||'') + (data.semester?' | Sem '+data.semester:'')],
        ['SECTION',      data.section],
    ];
    const cW = (W-40)/2, gyStart = y;
    grid.forEach(([lbl, val], i) => {
        const gx = 20 + (i%2)*cW;
        const gy = gyStart + Math.floor(i/2)*20;
        pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(1.5); pdf.line(gx,gy+5,gx,gy+15);
        pdf.setTextColor(120,120,120); pdf.setFont('helvetica','normal'); pdf.setFontSize(7);
        pdf.text(lbl, gx+5, gy+8);
        pdf.setTextColor(220,220,220); pdf.setFont('helvetica','bold'); pdf.setFontSize(9.5);
        pdf.text(pdf.splitTextToSize(val||'—', cW-12)[0], gx+5, gy+15);
    });
    y = gyStart + Math.ceil(grid.length/2)*20 + 4;
    // Date row full width
    pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(1.5); pdf.line(20,y+5,20,y+15);
    pdf.setTextColor(120,120,120); pdf.setFont('helvetica','normal'); pdf.setFontSize(7);
    pdf.text('SUBMISSION DATE', 25, y+8);
    pdf.setTextColor(220,220,220); pdf.setFont('helvetica','bold'); pdf.setFontSize(9.5);
    pdf.text(data.submissionDate||'—', 25, y+15); y += 26;
    // Tech line
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.4); pdf.line(20,y,W-20,y); y += 12;
    // Signatures
    const s1=28, s2=W-88;
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.6);
    pdf.line(s1,y+24,s1+55,y+24); pdf.line(s2,y+24,s2+55,y+24);
    pdf.setTextColor(ar,ag,ab); pdf.setFont('helvetica','bold'); pdf.setFontSize(8);
    pdf.text('SUBMITTED BY', s1+27, y+30, {align:'center'});
    pdf.text('SUBMITTED TO', s2+27, y+30, {align:'center'});
    pdf.setTextColor(180,180,180); pdf.setFont('helvetica','normal'); pdf.setFontSize(8);
    pdf.text(data.name||'—',    s1+27, y+36, {align:'center'});
    pdf.text(data.teacher||'—', s2+27, y+36, {align:'center'});
    const fn = pdfFile(data,'Futuristic'); pdf.save(fn); return fn;
}

// ══════════════════════════════════════════════════════════
// D3 - GEOMETRIC
// ══════════════════════════════════════════════════════════
function pdfD3(data, colorKey, logoSrc) {
    const C = COLORS[colorKey] || COLORS.orange;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, H=297;
    const [pr,pg,pb] = C.pRGB, [ar,ag,ab] = C.aRGB;
    // Side strip
    const strip=18;
    pdf.setFillColor(pr,pg,pb); pdf.rect(0,0,strip,H,'F');
    // Geometric circle
    pdf.setDrawColor(244,244,244); pdf.setLineWidth(10); pdf.circle(W+10,-10,65,'S');
    let y = 28;
    const lx = strip + 14;
    if (logoSrc) { try { pdf.addImage(logoSrc,'PNG',lx,y,20,20); y+=28; } catch(_){} }
    // Uni name
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(16);
    const uL = pdf.splitTextToSize((data.universityName||'').toUpperCase(), W-strip-26);
    pdf.text(uL, lx, y); y += uL.length*8.5+2;
    // Dept accent bar
    pdf.setFillColor(ar,ag,ab); pdf.rect(lx, y, 18, 3,'F'); y += 7;
    pdf.setTextColor(100,100,100); pdf.setFont('helvetica','bold'); pdf.setFontSize(9);
    pdf.text(data.department||'', lx, y, {maxWidth: W-strip-26}); y += 14;
    // Year badge
    pdf.setFillColor(pr,pg,pb);
    const yrT = 'ACADEMIC YEAR ' + (data.academicYear||'');
    const yrW = pdf.getTextWidth(yrT) + 8;
    pdf.rect(lx, y-5, yrW, 8, 'F');
    pdf.setTextColor(255,255,255); pdf.setFontSize(7.5); pdf.text(yrT, lx+4, y+0.5); y += 22;
    // ASSIGNMENT huge text  (font 40 — tight natural line spacing)
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(40);
    pdf.text('ASSIGN', lx, y); y += 17;
    pdf.text('MENT',   lx, y); y += 22;
    // Topic box
    pdf.setFillColor(244,244,244); pdf.rect(lx,y,W-strip-20,22,'F');
    pdf.setFillColor(ar,ag,ab);    pdf.rect(lx,y,4,22,'F');
    pdf.setTextColor(ar,ag,ab); pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5);
    pdf.text('PROJECT / ASSIGNMENT TOPIC', lx+8, y+7);
    pdf.setTextColor(pr,pg,pb); pdf.setFontSize(10);
    pdf.text(pdf.splitTextToSize(data.topic||'—', W-strip-32)[0], lx+8, y+16); y += 30;
    // Info grid 2-col
    const grid = [
        ['Student Name',     data.name],
        ['Roll Number',      data.rollNo],
        ['Subject Name',     data.subject],
        ['Subject Code',     data.subjectCode],
        ['Class / Semester', (data.className||'') + (data.semester?' | Sem '+data.semester:'')],
        ['Section',          data.section],
    ];
    const cW2 = (W-strip-26)/2;
    grid.forEach(([lbl, val], i) => {
        const gx = lx + (i%2)*cW2;
        const gy = y + Math.floor(i/2)*18;
        pdf.setDrawColor(220,220,220); pdf.setLineWidth(0.3); pdf.rect(gx, gy, cW2-4, 16, 'S');
        pdf.setTextColor(160,160,160); pdf.setFont('helvetica','normal'); pdf.setFontSize(6.5);
        pdf.text(lbl.toUpperCase(), gx+3, gy+6);
        pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(9);
        pdf.text(pdf.splitTextToSize(val||'—', cW2-10)[0], gx+3, gy+13);
    });
    y += 3*18 + 4;
    // Date full row with accent
    pdf.setFillColor(244,244,244); pdf.rect(lx,y,W-strip-20,16,'F');
    pdf.setDrawColor(220,220,220); pdf.setLineWidth(0.3); pdf.rect(lx,y,W-strip-20,16,'S');
    pdf.setTextColor(160,160,160); pdf.setFont('helvetica','normal'); pdf.setFontSize(6.5);
    pdf.text('DATE OF SUBMISSION', lx+3, y+6);
    pdf.setTextColor(ar,ag,ab); pdf.setFont('helvetica','bold'); pdf.setFontSize(9);
    pdf.text(data.submissionDate||'—', lx+3, y+13); y += 24;
    // Signatures
    pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(1.2);
    pdf.line(lx,y+18,lx+52,y+18); pdf.line(W-72,y+18,W-18,y+18);
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5);
    pdf.text('SUBMITTED BY', lx+26, y+24, {align:'center'});
    pdf.text('SUBMITTED TO', W-45,  y+24, {align:'center'});
    pdf.setTextColor(100,100,100); pdf.setFont('helvetica','normal'); pdf.setFontSize(8);
    pdf.text(data.name||'—',    lx+26, y+30, {align:'center'});
    pdf.text(data.teacher||'—', W-45,  y+30, {align:'center'});
    const fn = pdfFile(data,'Geometric'); pdf.save(fn); return fn;
}

// ══════════════════════════════════════════════════════════
// D4 - AESTHETIC
// ══════════════════════════════════════════════════════════
function pdfD4(data, colorKey, logoSrc) {
    const C = COLORS[colorKey] || COLORS.rose;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, H=297, cx=W/2;
    const [pr,pg,pb] = C.pRGB, [ar,ag,ab] = C.aRGB;
    pdf.setFillColor(255,255,255); pdf.rect(0,0,W,H,'F');
    let y = 26;
    y += addLogo(pdf, logoSrc, cx, y, 22);
    // Uni name
    pdf.setTextColor(pr,pg,pb); pdf.setFont('times','bold'); pdf.setFontSize(22);
    const uL = pdf.splitTextToSize(data.universityName||'University', 170);
    pdf.text(uL, cx, y, {align:'center'}); y += uL.length*11+3;
    // Dept badge
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.6);
    const dT = (data.department||'Department').substring(0,60);
    const dtW = Math.min(pdf.getTextWidth(dT)+16, 160);
    pdf.roundedRect(cx-dtW/2, y-5, dtW, 9, 4, 4, 'S');
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(8.5);
    pdf.text(dT, cx, y+0.5, {align:'center', maxWidth:dtW-4}); y += 13;
    // Assignment heading
    pdf.setTextColor(80,80,80); pdf.setFont('times','bolditalic'); pdf.setFontSize(34);
    pdf.text('Assignment', cx, y, {align:'center'});
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.7);
    pdf.line(cx-36, y+2, cx+36, y+2); y += 13;
    // Session
    pdf.setTextColor(140,140,140); pdf.setFont('helvetica','normal'); pdf.setFontSize(9.5);
    pdf.text('Academic Year '+(data.academicYear||''), cx, y, {align:'center'}); y += 14;
    // Topic dashed box
    pdf.setDrawColor(ar,ag,ab); pdf.setLineDashPattern([2,2],0); pdf.setLineWidth(0.6);
    pdf.rect(25, y, W-50, 22, 'S'); pdf.setLineDashPattern([],0);
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5);
    pdf.text('SUBMISSION TOPIC', cx, y+7, {align:'center'});
    pdf.setFont('times','bolditalic'); pdf.setFontSize(11); pdf.setTextColor(50,50,50);
    pdf.text(pdf.splitTextToSize(data.topic||'—', W-60)[0], cx, y+17, {align:'center'}); y += 34;
    // Info card rows
    const iRows = [
        ['Student Name',     data.name],
        ['Roll Number',      data.rollNo],
        ['Subject',          data.subject],
        ['Subject Code',     data.subjectCode],
        ['Class / Semester', (data.className||'') + (data.semester?' | Sem '+data.semester:'')],
        ['Date of Submission', data.submissionDate],
    ];
    const rowH=12, cardL=25, cardW=W-50;
    iRows.forEach(([lbl, val], i) => {
        const ry2 = y + i*rowH;
        if (i < iRows.length-1) {
            pdf.setDrawColor(240,240,240); pdf.setLineWidth(0.3);
            pdf.line(cardL, ry2+rowH, cardL+cardW, ry2+rowH);
        }
        pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5);
        pdf.text(lbl.toUpperCase(), cardL+3, ry2+8);
        pdf.setTextColor(80,80,80); pdf.setFont('helvetica','normal'); pdf.setFontSize(9);
        pdf.text(pdf.splitTextToSize(val||'—', cardW-45)[0], cardL+55, ry2+8);
    });
    y += iRows.length*rowH + 10;
    // Signatures
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.6);
    pdf.line(28,y+22,83,y+22); pdf.line(W-83,y+22,W-28,y+22);
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5);
    pdf.text('SUBMITTED BY', 55,   y+28, {align:'center'});
    pdf.text('SUBMITTED TO', W-55, y+28, {align:'center'});
    pdf.setTextColor(100,100,100); pdf.setFont('helvetica','normal'); pdf.setFontSize(8);
    pdf.text(data.name||'—',    55,   y+34, {align:'center'});
    pdf.text(data.teacher||'—', W-55, y+34, {align:'center'});
    const fn = pdfFile(data,'Aesthetic'); pdf.save(fn); return fn;
}

// ══════════════════════════════════════════════════════════
// D5 - PREMIUM
// ══════════════════════════════════════════════════════════
function pdfD5(data, colorKey, logoSrc) {
    const C = COLORS[colorKey] || COLORS.gold;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, H=297, cx=W/2;
    const [pr,pg,pb] = C.pRGB, [ar,ag,ab] = C.aRGB;
    // Borders
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(1.2); pdf.rect(4,4,W-8,H-8,'S');
    pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(1.5); pdf.rect(10,10,W-20,H-20,'S');
    pdf.setLineWidth(0.6); pdf.rect(12,12,W-24,H-24,'S');
    // Corner ornament
    pdf.setTextColor(ar,ag,ab); pdf.setFont('helvetica','normal'); pdf.setFontSize(14);
    pdf.text('◆', 8.5, 16.5);
    let y = 22;
    y += addLogo(pdf, logoSrc, cx, y, 24);
    // Uni name
    pdf.setTextColor(pr,pg,pb); pdf.setFont('times','bold'); pdf.setFontSize(18);
    const uL = pdf.splitTextToSize(data.universityName||'University', 165);
    pdf.text(uL, cx, y, {align:'center'});
    const lnW = Math.min(pdf.getTextWidth(uL[0])+10, 165);
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.8);
    pdf.line(cx-lnW/2, y+3, cx+lnW/2, y+3);
    y += uL.length*10+5;
    // Dept
    pdf.setTextColor(80,80,80); pdf.setFont('helvetica','bold'); pdf.setFontSize(9);
    pdf.text((data.department||'').toUpperCase(), cx, y, {align:'center', maxWidth:170}); y += 12;
    // Year + ASSIGNMENT
    pdf.setTextColor(ar,ag,ab); pdf.setFont('helvetica','bold'); pdf.setFontSize(12);
    pdf.text('Academic Year '+(data.academicYear||''), cx, y, {align:'center'}); y += 9;
    pdf.setTextColor(pr,pg,pb); pdf.setFont('times','bold'); pdf.setFontSize(30);
    pdf.text('ASSIGNMENT', cx, y, {align:'center'});
    pdf.setDrawColor(ar,ag,ab); pdf.setLineWidth(0.5); pdf.line(cx-42,y+3,cx+42,y+3); y += 15;
    // Topic box
    pdf.setFillColor(249,249,249); pdf.rect(18,y,W-36,20,'F');
    pdf.setFillColor(ar,ag,ab); pdf.rect(18,y,4,20,'F');
    pdf.setTextColor(pr,pg,pb); pdf.setFont('helvetica','bold'); pdf.setFontSize(9); pdf.text('TOPIC:', 26, y+8);
    pdf.setFont('helvetica','italic'); pdf.setTextColor(50,50,50); pdf.setFontSize(10);
    pdf.text(pdf.splitTextToSize(data.topic||'—', W-56)[0], 40, y+15); y += 28;
    // Info rows
    const rows5 = [
        ['Student Name',     data.name],
        ['Roll Number',      data.rollNo],
        ['Subject & Code',   [data.subject, data.subjectCode].filter(Boolean).join(' | ') || '—'],
        ['Class / Semester', (data.className||'') + (data.semester?' | Sem '+data.semester:'')],
        ['Section',          data.section],
        ['Date of Submission', data.submissionDate],
    ];
    rows5.forEach(([lbl, val]) => {
        pdf.setFont('helvetica','bold'); pdf.setFontSize(9); pdf.setTextColor(pr,pg,pb);
        pdf.text(lbl + ':', 18, y);
        pdf.setLineDashPattern([1.5,2],0); pdf.setDrawColor(200,200,200); pdf.setLineWidth(0.3);
        pdf.line(64, y, W-18, y); pdf.setLineDashPattern([],0);
        pdf.setFont('helvetica','normal'); pdf.setFontSize(9.5); pdf.setTextColor(40,40,40);
        pdf.text(pdf.splitTextToSize(val||'—', W-88)[0], (64+W-18)/2, y-1.5, {align:'center'});
        y += 14;
    });
    // Signatures
    y = H-30;
    pdf.setDrawColor(pr,pg,pb); pdf.setLineWidth(0.6);
    pdf.line(18,y,70,y); pdf.line(W-78,y,W-26,y);
    pdf.setFont('helvetica','bold'); pdf.setFontSize(8); pdf.setTextColor(pr,pg,pb);
    pdf.text('SUBMITTED BY', 44,   y+6, {align:'center'});
    pdf.text('SUBMITTED TO', W-52, y+6, {align:'center'});
    pdf.setFont('helvetica','normal'); pdf.setFontSize(8); pdf.setTextColor(100,100,100);
    pdf.text(data.name||'—',    44,   y+12, {align:'center'});
    pdf.text(data.teacher||'—', W-52, y+12, {align:'center'});
    const fn = pdfFile(data,'Premium'); pdf.save(fn); return fn;
}
