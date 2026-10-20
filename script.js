// script.js — Interactive & Vibrancy Engine for Signal/Noise
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. Reading Progress Bar & Scroll Spy
    // ==========================================
    const progressBar = document.createElement("div");
    progressBar.id = "read-progress-bar";
    progressBar.style.cssText = "position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #00f2fe, #6366f1); width: 0%; z-index: 9999; transition: width 0.1s ease-out; box-shadow: 0 0 10px rgba(0, 242, 254, 0.5);";
    document.body.prepend(progressBar);

    const navLinks = document.querySelectorAll(".header-nav a");
    const sections = document.querySelectorAll(".doc-section");

    window.addEventListener("scroll", function () {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";

        // Scroll-spy active link
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 180) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-target") === current) {
                link.classList.add("active");
            }
        });
    });

    // Smooth scroll offset handling
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 110;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // 2. Theme Toggle (Dark / Light)
    // ==========================================
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");
    const themeLabel = document.getElementById("themeLabel");

    function applyTheme(isLight) {
        if (isLight) {
            document.body.classList.add("light-theme");
            if (themeIcon) themeIcon.textContent = "🌙";
            if (themeLabel) themeLabel.textContent = "Dark";
        } else {
            document.body.classList.remove("light-theme");
            if (themeIcon) themeIcon.textContent = "☀️";
            if (themeLabel) themeLabel.textContent = "Light";
        }
    }

    // Default to dark theme for maximum vibrant signal glow
    const savedTheme = localStorage.getItem("signal_noise_theme");
    if (savedTheme === "light") {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            const isLight = document.body.classList.contains("light-theme");
            applyTheme(!isLight);
            localStorage.setItem("signal_noise_theme", !isLight ? "light" : "dark");
        });
    }

    // ==========================================
    // 3. Signal vs. Noise Oscilloscope Simulator
    // ==========================================
    const canvas = document.getElementById("signalCanvas");
    const noiseSlider = document.getElementById("noiseSlider");
    const noiseValLabel = document.getElementById("noiseValLabel");
    const signalStatusBadge = document.getElementById("signalStatusBadge");

    if (canvas && noiseSlider) {
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let phase = 0;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth - 24;
            canvas.height = 110;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        function drawWave() {
            const width = canvas.width;
            const height = canvas.height;
            const clarity = parseInt(noiseSlider.value, 10) / 100; // 0 = noisy chaos, 1 = pure harmonic signal

            ctx.clearRect(0, 0, width, height);

            // Draw center baseline
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            // Draw wave
            ctx.beginPath();
            ctx.lineWidth = 2.5;

            // Gradient line
            const grad = ctx.createLinearGradient(0, 0, width, 0);
            if (clarity > 0.6) {
                grad.addColorStop(0, "#00f2fe");
                grad.addColorStop(0.5, "#38bdf8");
                grad.addColorStop(1, "#6366f1");
                ctx.shadowColor = "rgba(0, 242, 254, 0.5)";
                ctx.shadowBlur = 8;
            } else {
                grad.addColorStop(0, "#f43f5e");
                grad.addColorStop(0.5, "#f59e0b");
                grad.addColorStop(1, "#ef4444");
                ctx.shadowColor = "rgba(244, 63, 94, 0.3)";
                ctx.shadowBlur = 4;
            }
            ctx.strokeStyle = grad;

            const noiseAmount = (1 - clarity) * 35;
            const waveFreq = 0.035;
            const amp = 32;

            for (let x = 0; x < width; x++) {
                // Fundamental carrier sine wave
                const fundamental = Math.sin(x * waveFreq + phase) * amp;
                
                // Noise artifacts injected when clarity is low
                const pseudoNoise = (Math.sin(x * 0.35 + phase * 2) * Math.cos(x * 0.17 - phase * 3)) * noiseAmount;
                const jitter = (Math.random() - 0.5) * noiseAmount * 0.45;

                const y = (height / 2) + fundamental * clarity + pseudoNoise + jitter;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 0;

            phase += 0.06;
            animationFrameId = requestAnimationFrame(drawWave);
        }

        drawWave();

        noiseSlider.addEventListener("input", function () {
            const val = parseInt(this.value, 10);
            noiseValLabel.textContent = val + "% Signal";
            
            if (val >= 80) {
                signalStatusBadge.textContent = "HIGH SIGNAL (" + val + "%)";
                signalStatusBadge.style.color = "#00f2fe";
                signalStatusBadge.style.background = "rgba(0, 242, 254, 0.12)";
            } else if (val >= 50) {
                signalStatusBadge.textContent = "MODERATE DRIFT (" + val + "%)";
                signalStatusBadge.style.color = "#f59e0b";
                signalStatusBadge.style.background = "rgba(245, 158, 11, 0.12)";
            } else {
                signalStatusBadge.textContent = "CHAOTIC NOISE (" + val + "%)";
                signalStatusBadge.style.color = "#f43f5e";
                signalStatusBadge.style.background = "rgba(244, 63, 94, 0.12)";
            }
        });
    }

    // ==========================================
    // 4. Interactive Semantic Hierarchy Explorer (Section 1)
    // ==========================================
    const hierarchyData = [
        {
            title: "Stage 01: REALITY (The Enterprise Truth)",
            role: "Ground Truth",
            desc: "The factual state of your company, pricing tiers, capabilities, and software infrastructure before anyone writes a slogan or sales pitch.",
            example: "Reality: Acme delivers a cloud-hosted relational DB with Postgres wire-compatibility, starting at $49/mo, with 99.99% SLA."
        },
        {
            title: "Stage 02: ONTOLOGY (The Shared Definition)",
            role: "Organizational Consensus",
            desc: "The cross-team agreement between Engineering, Product, and Marketing on exact taxonomy. Resolves internal disputes over whether it is a 'Platform', 'SaaS', or 'Add-on'.",
            example: "Ontology Agreement: We classify this product as 'SoftwareApplication' under 'BusinessApplication', never as 'Plugin'."
        },
        {
            title: "Stage 03: SCHEMA (The Machine Bedrock)",
            role: "Deterministic JSON-LD Layer",
            desc: "The code that lives in your page's head. It anchors properties, @id entity references, sameAs social mappings, and pricing offers for automated parsers.",
            example: "{\n  \"@type\": \"SoftwareApplication\",\n  \"name\": \"Acme Cloud DB\",\n  \"applicationCategory\": \"BusinessApplication\",\n  \"offers\": { \"@type\": \"Offer\", \"price\": \"49.00\", \"priceCurrency\": \"USD\" }\n}"
        },
        {
            title: "Stage 04: CONTENT (The Human Storytelling)",
            role: "Emotion & Value Proposition",
            desc: "The creative narrative, metaphors, customer stories, and emotional appeals written for human readers. It flows cleanly from the schema without contradicting it.",
            example: "\"Empower your engineering teams with lightning-fast cloud databases that scale effortlessly with your dreams.\""
        },
        {
            title: "Stage 05: SEARCH & AI (The Discoverable Output)",
            role: "AIO, Brave Ask, Agents",
            desc: "How LLMs and autonomous procurement agents ingest, ground, and cite your solution without hallucinating your pricing or confusing your product with competitors.",
            example: "Brave Ask / Perplexity: \"Acme Cloud DB is a Postgres-compatible Database-as-a-Service priced at $49/mo with 99.99% SLA [Source: Acme].\""
        }
    ];

    const hierarchyBtns = document.querySelectorAll(".hierarchy-step-btn");
    const hierarchyDetail = document.getElementById("hierarchyDetailContent");

    function renderHierarchyDetail(index) {
        const item = hierarchyData[index];
        if (!item || !hierarchyDetail) return;
        hierarchyDetail.innerHTML = `
            <div class="hierarchy-detail-header">
                <span class="hierarchy-detail-title">${item.title}</span>
                <span class="hierarchy-detail-role">${item.role}</span>
            </div>
            <p class="hierarchy-detail-desc">${item.desc}</p>
            <div class="hierarchy-detail-example">
                <span style="color: #64748b; font-size: 0.72rem; display: block; margin-bottom: 0.25rem;">CASE STUDY PROJECTION:</span>
                <pre style="margin: 0; white-space: pre-wrap; font-family: inherit;">${item.example}</pre>
            </div>
        `;
    }

    if (hierarchyBtns.length > 0) {
        renderHierarchyDetail(0);
        hierarchyBtns.forEach((btn, index) => {
            btn.addEventListener("click", function () {
                hierarchyBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderHierarchyDetail(index);
            });
        });
    }

    // ==========================================
    // 5. LLM Extraction Lens Simulator (Section 2)
    // ==========================================
    const btnLensNoSchema = document.getElementById("btnLensNoSchema");
    const btnLensSchema = document.getElementById("btnLensSchema");
    const lensConfidenceBadge = document.getElementById("lensConfidenceBadge");
    const lensOutputCode = document.getElementById("lensOutputCode");
    const confidencePercent = document.getElementById("confidencePercent");
    const confidenceBar = document.getElementById("confidenceBar");

    const noSchemaExtraction = `// Extracted by Raw LLM Inference:
Entity Guess: "Cloud Productivity Tool"
Category Certainty: 42% (Muddled by prose)
Identified Pricing: UNKNOWN (Missing structured offer)
Verified Features: ["Ecosystem", "Synergy"] (Ambiguous)
Risk Assessment: Hallucination Risk: HIGH
AI Overview Citation: DEFAULTS TO MARKET LEADER (Incumbent)`;

    const withSchemaExtraction = `// Extracted via Deterministic JSON-LD:
@type: "SoftwareApplication"
@id: "https://example.com/#cloudsync"
name: "CloudSync Pro"
applicationCategory: "BusinessApplication"
offers: { price: "49.00", currency: "USD", billingDuration: "P1M" }
featureList: ["Cross-platform real-time sync", "SOC-2 Type II Certified"]
Grounding Certainty: 99% (Deterministic Entity Link)
AI Overview Citation: VERIFIED DIRECT CITATION [Acme]`;

    function setLensMode(withSchema) {
        if (!lensOutputCode || !confidenceBar) return;
        if (withSchema) {
            btnLensSchema.classList.add("active");
            btnLensNoSchema.classList.remove("active");
            lensConfidenceBadge.textContent = "DETERMINISTIC (99%)";
            lensConfidenceBadge.style.color = "var(--accent-emerald)";
            lensOutputCode.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; color: #38bdf8;">${withSchemaExtraction}</pre>`;
            confidencePercent.textContent = "99%";
            confidenceBar.style.width = "99%";
            confidenceBar.classList.add("high");
        } else {
            btnLensNoSchema.classList.add("active");
            btnLensSchema.classList.remove("active");
            lensConfidenceBadge.textContent = "AMBIGUOUS (42%)";
            lensConfidenceBadge.style.color = "var(--accent-rose)";
            lensOutputCode.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; color: #f43f5e;">${noSchemaExtraction}</pre>`;
            confidencePercent.textContent = "42%";
            confidenceBar.style.width = "42%";
            confidenceBar.classList.remove("high");
        }
    }

    if (btnLensNoSchema && btnLensSchema) {
        setLensMode(false);
        btnLensNoSchema.addEventListener("click", () => setLensMode(false));
        btnLensSchema.addEventListener("click", () => setLensMode(true));
    }

    // ==========================================
    // 6. Cross-Channel Entity Drift Auditor (Section 3)
    // ==========================================
    const auditWeb = document.getElementById("auditWeb");
    const auditDocs = document.getElementById("auditDocs");
    const auditMarket = document.getElementById("auditMarket");
    const auditSales = document.getElementById("auditSales");
    const auditScoreCircle = document.getElementById("auditScoreCircle");
    const auditFeedbackTitle = document.getElementById("auditFeedbackTitle");
    const auditFeedbackDesc = document.getElementById("auditFeedbackDesc");
    const btnAutoAlign = document.getElementById("btnAutoAlign");

    function evaluateAudit() {
        if (!auditWeb || !auditDocs || !auditMarket || !auditSales) return;
        const vals = [auditWeb.value, auditDocs.value, auditMarket.value, auditSales.value];
        const uniqueVals = new Set(vals);

        if (uniqueVals.size === 1 && vals[0] === "SoftwareApplication") {
            // Perfect alignment
            auditScoreCircle.textContent = "100%";
            auditScoreCircle.className = "score-circle good";
            auditFeedbackTitle.textContent = "Canonical Entity Harmony";
            auditFeedbackDesc.textContent = "All 4 touchpoints resolve to the exact same canonical entity class. Search models, Brave Ask, and procurement agents have zero ambiguity.";
        } else if (uniqueVals.size <= 2 && !vals.includes("None")) {
            // Moderate drift
            auditScoreCircle.textContent = "65%";
            auditScoreCircle.className = "score-circle";
            auditFeedbackTitle.textContent = "Moderate Semantic Drift";
            auditFeedbackDesc.textContent = "Minor friction across sales and documentation. Crawlers will expend inference tokens guessing your true product taxonomy.";
        } else {
            // High drift
            const score = vals.includes("None") ? "28%" : "38%";
            auditScoreCircle.textContent = score;
            auditScoreCircle.className = "score-circle bad";
            auditFeedbackTitle.textContent = "Severe Label Collision";
            auditFeedbackDesc.textContent = "Contradictory entity typing detected. Generative engines will fail to classify your solution and default citations to incumbent competitors.";
        }
    }

    [auditWeb, auditDocs, auditMarket, auditSales].forEach(select => {
        if (select) select.addEventListener("change", evaluateAudit);
    });

    if (btnAutoAlign) {
        btnAutoAlign.addEventListener("click", function () {
            if (auditWeb) auditWeb.value = "SoftwareApplication";
            if (auditDocs) auditDocs.value = "SoftwareApplication";
            if (auditMarket) auditMarket.value = "SoftwareApplication";
            if (auditSales) auditSales.value = "SoftwareApplication";
            evaluateAudit();
        });
    }

    // ==========================================
    // 7. Canonical Schema Generator (Section 5)
    // ==========================================
    const genBrand = document.getElementById("genBrand");
    const genProduct = document.getElementById("genProduct");
    const genCategory = document.getElementById("genCategory");
    const genPrice = document.getElementById("genPrice");
    const generatedSchemaCode = document.getElementById("generatedSchemaCode");
    const btnCopyGeneratedSchema = document.getElementById("btnCopyGeneratedSchema");

    function updateGeneratedSchema() {
        if (!generatedSchemaCode) return;
        const brand = (genBrand && genBrand.value) || "Acme Enterprise";
        const product = (genProduct && genProduct.value) || "CloudSync Pro";
        const category = (genCategory && genCategory.value) || "BusinessApplication";
        const price = (genPrice && genPrice.value) || "49 USD / Month";

        const schemaObj = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `https://${brand.toLowerCase().replace(/\s+/g, '')}.com/#organization`,
                    "name": brand
                },
                {
                    "@type": "SoftwareApplication",
                    "@id": `https://${brand.toLowerCase().replace(/\s+/g, '')}.com/#${product.toLowerCase().replace(/\s+/g, '')}`,
                    "name": product,
                    "applicationCategory": category,
                    "operatingSystem": "Web, Cloud, API",
                    "offers": {
                        "@type": "Offer",
                        "price": price,
                        "priceCurrency": "USD"
                    },
                    "provider": {
                        "@id": `https://${brand.toLowerCase().replace(/\s+/g, '')}.com/#organization`
                    }
                }
            ]
        };

        generatedSchemaCode.textContent = JSON.stringify(schemaObj, null, 2);
    }

    [genBrand, genProduct, genCategory, genPrice].forEach(input => {
        if (input) input.addEventListener("input", updateGeneratedSchema);
    });
    updateGeneratedSchema();

    if (btnCopyGeneratedSchema && generatedSchemaCode) {
        btnCopyGeneratedSchema.addEventListener("click", function () {
            navigator.clipboard.writeText(generatedSchemaCode.textContent).then(() => {
                const orig = btnCopyGeneratedSchema.textContent;
                btnCopyGeneratedSchema.textContent = "Copied! ✓";
                setTimeout(() => { btnCopyGeneratedSchema.textContent = orig; }, 1800);
            });
        });
    }

});
