/* Sri Anandha Poly Clinic — interactions */
(function(){
  // Scroll progress + header + hero parallax (rAF-throttled)
  const sp = document.querySelector('.scroll-progress');
  const hdr = document.querySelector('.site-header');
  const heroImg = document.querySelector('.hero-bg img');
  let scrollTicking = false;
  function onScroll(){
    if(!scrollTicking){
      requestAnimationFrame(()=>{
        const h = document.documentElement;
        const sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
        if(sp) sp.style.width = sc + '%';
        if(hdr) hdr.classList.toggle('scrolled', window.scrollY > 30);
        if(heroImg){
          const y = Math.min(window.scrollY * 0.3, 180);
          heroImg.style.transform = `translateY(${y}px)`;
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile drawer (premium side drawer)
  const drawerToggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const drawerOverlay = document.querySelector('.nav-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  if(drawerToggle && drawer){
    function openDrawer(){
      drawer.classList.add('open');
      if(drawerOverlay) drawerOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer(){
      drawer.classList.remove('open');
      if(drawerOverlay) drawerOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
    drawerToggle.addEventListener('click', openDrawer);
    if(drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.drawer-item').forEach(a => a.addEventListener('click', closeDrawer));
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=> io.observe(el));

  // Counters
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600; const start = performance.now();
      function step(t){
        const p = Math.min(1,(t-start)/dur);
        const ease = 1 - Math.pow(1-p,3);
        el.textContent = Math.floor(ease*target).toLocaleString() + (el.dataset.suffix||'');
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  },{threshold:.4});
  counters.forEach(c=> cio.observe(c));

  // Gallery filter + lightbox
  const tabs = document.querySelectorAll('.gallery-tabs button');
  const items = document.querySelectorAll('.masonry .m-item');
  tabs.forEach(t=> t.addEventListener('click', ()=>{
    tabs.forEach(x=> x.classList.remove('active'));
    t.classList.add('active');
    const f = t.dataset.filter;
    items.forEach(it=>{
      const show = f === 'all' || it.dataset.cat === f;
      it.style.display = show ? '' : 'none';
    });
  }));
  const lb = document.querySelector('.lightbox');
  if(lb){
    const lbImg = lb.querySelector('img');
    items.forEach(it=> it.addEventListener('click', ()=>{
      lbImg.src = it.querySelector('img').src;
      lb.classList.add('open');
    }));
    lb.addEventListener('click', (e)=>{ if(e.target===lb || e.target.classList.contains('close')) lb.classList.remove('open'); });
  }

  // Appointment form -> WhatsApp
  const form = document.querySelector('#appointment-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const d = new FormData(form);
      const msg = `*New Appointment Request*%0A%0AName: ${d.get('name')}%0APhone: ${d.get('phone')}%0AEmail: ${d.get('email')||'-'}%0AService: ${d.get('service')}%0ADate: ${d.get('date')}%0ATime: ${d.get('time')}%0A%0AMessage: ${d.get('message')||'-'}`;
      window.open(`https://wa.me/919443782308?text=${msg}`, '_blank');
    });
  }

  // Set active nav link
  const path = location.pathname === '/' ? '/' : location.pathname;
  document.querySelectorAll('.nav-links a, .drawer-item').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if(t){ e.preventDefault(); window.scrollTo({top: t.offsetTop - 80, behavior:'smooth'}); }
    });
  });
})();