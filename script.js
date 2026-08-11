// script.js — Dedicated JavaScript Layer for Signal/Noise
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Reading Progress Bar Logic
    const progressBar = document.createElement("div");
    progressBar.id = "read-progress-bar";
    progressBar.style.cssText = "position: fixed; top: 0; left: 0; height: 3px; background: #0f62fe; width: 0%; z-index: 9999; transition: width 0.1s ease-out;";
    document.body.prepend(progressBar);

    window.addEventListener("scroll", function () {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 2. Smooth Scrolling Interceptor for Header Nav Links
    const navLinks = document.querySelectorAll(".header-nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 85;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll-Spy Active Header Highlighting
    const sections = document.querySelectorAll(".doc-section");
    window.addEventListener("scroll", function () {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.style.color = "#525252"; 
            link.style.fontWeight = "500";
            if (link.getAttribute("data-target") === current) {
                link.style.color = "#0f62fe"; 
                link.style.fontWeight = "600";
            }
        });
    });
});
