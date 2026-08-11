(function() {
    // ─────────────── DOM REFS ───────────────
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('[data-nav]');
    const aboutImage = document.getElementById('aboutImage');
    const aboutFileInput = document.getElementById('aboutFileInput');
    const aboutImgEl = document.getElementById('aboutImgEl');
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const toast = document.getElementById('toast');
    const contactForm = document.getElementById('contactForm');
    const revealEls = document.querySelectorAll('.reveal');

    // ─────────────── TOAST ───────────────
    let toastTimer;
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ─────────────── NAVBAR SCROLL ───────────────
    function updateNavbar() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ─────────────── HAMBURGER MENU ───────────────
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ─────────────── REVEAL ON SCROLL ───────────────
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        revealEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            const revealPoint = 100;
            if (rect.top < windowHeight - revealPoint && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('resize', revealOnScroll);
    revealOnScroll();

    // ─────────────── ABOUT IMAGE UPLOAD ───────────────
    aboutImage.addEventListener('click', () => {
        aboutFileInput.click();
    });
    aboutFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('⚠️ Mohon pilih file gambar yang valid.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(ev) {
            aboutImgEl.src = ev.target.result;
            aboutImage.classList.add('has-image');
            showToast('✅ Foto sekolah berhasil diperbarui!');
        };
        reader.readAsDataURL(file);
    });

    // ─────────────── GALLERY ───────────────
    const galleryData = [
        { id: 'gallery-1', label: '🖼️ Kegiatan Upacara' },
        { id: 'gallery-2', label: '🖼️ Praktik Lab Komputer' },
        { id: 'gallery-3', label: '🖼️ Kunjungan Industri' },
        { id: 'gallery-4', label: '🖼️ Lomba Antar Kelas' },
        { id: 'gallery-5', label: '🖼️ Pentas Seni' },
        { id: 'gallery-6', label: '🖼️ Wisuda & Pelepasan' },
    ];

    function buildGallery() {
        galleryGrid.innerHTML = '';
        galleryData.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item reveal reveal-delay-' + ((index % 3) + 1);
            div.setAttribute('data-gallery-id', item.id);
            div.innerHTML = `
                <span class="gallery-placeholder">${item.label}<br><small style="opacity:0.6;">Klik untuk upload</small></span>
                <img src="" alt="Foto Galeri" style="display:none;">
                <input type="file" accept="image/*" style="display:none;" data-gallery-input="${item.id}">
            `;
            galleryGrid.appendChild(div);
        });

        const items = galleryGrid.querySelectorAll('.gallery-item');
        items.forEach(item => {
            const input = item.querySelector('input[type="file"]');
            const img = item.querySelector('img');

            item.addEventListener('click', (e) => {
                if (item.classList.contains('has-image') && img.src) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    return;
                }
                input.click();
            });

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                    showToast('⚠️ Mohon pilih file gambar yang valid.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(ev) {
                    img.src = ev.target.result;
                    img.style.display = 'block';
                    item.classList.add('has-image');
                    item.classList.add('visible');
                    showToast('✅ Foto galeri berhasil ditambahkan!');
                };
                reader.readAsDataURL(file);
            });
        });

        setTimeout(revealOnScroll, 100);
    }

    buildGallery();

    // ─────────────── LIGHTBOX ───────────────
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ''; }, 350);
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; }, 350);
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; }, 350);
        }
    });

    // ─────────────── CONTACT FORM ───────────────
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('input, textarea');
        let allFilled = true;
        inputs.forEach(inp => {
            if (!inp.value.trim()) allFilled = false;
        });
        if (!allFilled) {
            showToast('⚠️ Mohon isi semua kolom terlebih dahulu.');
            return;
        }
        showToast('✅ Pesan berhasil dikirim! Terima kasih 🙏');
        contactForm.reset();
    });

    // ─────────────── INTERAKSI TAMBAHAN ───────────────
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4')?.textContent || 'Jurusan';
            showToast(`🔍 ${title} — Informasi lebih lanjut segera hadir.`);
        });
    });

    document.querySelectorAll('.facility-item').forEach(item => {
        item.addEventListener('click', () => {
            const label = item.querySelector('span:last-child')?.textContent || 'Fasilitas';
            showToast(`✨ ${label} tersedia di SMKS PGRI 11 Ciledug.`);
        });
    });

    document.querySelectorAll('.achievement-row').forEach(row => {
        row.addEventListener('click', () => {
            const title = row.querySelector('h4')?.textContent || 'Prestasi';
            showToast(`🏆 ${title} — Dokumentasi lengkap tersedia.`);
        });
    });

    console.log('🚀 SMKS PGRI 11 Ciledug — Website siap!');
    console.log('📍 Jl. Raden Fatah, Ciledug, Kota Tangerang');
    console.log('💡 Klik area galeri & foto tentang untuk upload gambar.');
})();
