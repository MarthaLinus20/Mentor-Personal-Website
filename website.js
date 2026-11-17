(function () {
  var btn = document.getElementById('menu');
  var links = document.getElementById('links');

  if (btn && links) {
    function setMenu(open) {
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    }

    btn.addEventListener('click', function () {
      setMenu(btn.getAttribute('aria-expanded') !== 'true');
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    window.matchMedia('(min-width:900px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var track = slider.querySelector('.slider-track');
    var prevBtn = slider.querySelector('.prev');
    var nextBtn = slider.querySelector('.next');
    var pauseBtn = slider.querySelector('.pause');
    var count = slider.querySelector('.slide-count');
    var countTotal = count && count.querySelector('span');
    var photoNames = [
      'WhatsApp Image 2026-11-15 at 11.39.35 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.36 PM (1).jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.36 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.37 PM (1).jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.37 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.38 PM (1).jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.38 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.39 PM (1).jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.39 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.40 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.39.41 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.37 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.40 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.44 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.48 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.49 PM (1).jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.49 PM.jpeg',
      'WhatsApp Image 2026-11-15 at 11.41.50 PM.jpeg'
    ];
    var slides = [];
    var currentIndex = 0;
    var autoAdvance;
    var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isPaused = isReducedMotion;

    if (track && prevBtn && nextBtn && photoNames.length) {
      photoNames.forEach(function (photoName, index) {
        var slide = document.createElement('div');
        var image = document.createElement('img');

        slide.className = 'slide';
        slide.dataset.index = String(index);
        image.src = 'Mrs%20Nma%20Pictures%20Enhanced/' + encodeURIComponent(photoName);
        image.alt = 'Photo ' + (index + 1) + ' from the Cheldem International School community';
        image.loading = index === 0 ? 'eager' : 'lazy';
        slide.appendChild(image);
        track.appendChild(slide);
        slides.push(slide);
      });

      if (countTotal) countTotal.textContent = '/ ' + slides.length;

      function updateCount() {
        currentIndex = Number(slides[0].dataset.index);
        if (count) count.firstChild.textContent = String(currentIndex + 1).padStart(2, '0') + ' ';
      }

      function moveSlide(direction) {
        if (track.dataset.moving === 'true') return;

        var firstSlide = slides[0];
        var lastSlide = slides[slides.length - 1];
        var step = firstSlide.getBoundingClientRect().width +
          parseFloat(window.getComputedStyle(track).gap || 0);

        if (direction < 0) {
          slides.unshift(slides.pop());
          track.insertBefore(lastSlide, track.firstChild);
        }

        if (isReducedMotion) {
          if (direction > 0) {
            slides.push(slides.shift());
            track.appendChild(firstSlide);
          }
          track.style.transform = 'translateX(0)';
          updateCount();
          return;
        }

        track.dataset.moving = 'true';
        track.style.transition = 'none';
        track.style.transform = direction < 0 ? 'translateX(-' + step + 'px)' : 'translateX(0)';
        track.offsetWidth;
        track.style.transition = '';

        if (direction > 0) {
          track.style.transform = 'translateX(-' + step + 'px)';
        } else {
          track.style.transform = 'translateX(0)';
        }

        var finished = false;
        var fallbackTimer;

        function finishMove(event) {
          if (event && (event.target !== track || event.propertyName !== 'transform')) return;
          if (finished) return;
          finished = true;
          clearTimeout(fallbackTimer);
          track.removeEventListener('transitionend', finishMove);

          if (direction > 0) {
            slides.push(slides.shift());
            track.appendChild(firstSlide);
          }

          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          track.offsetWidth;
          track.style.transition = '';
          delete track.dataset.moving;
          updateCount();
        }

        track.addEventListener('transitionend', finishMove);
        fallbackTimer = setTimeout(finishMove, 700);
      }

      function startAutoAdvance() {
        clearInterval(autoAdvance);
        if (!isPaused) autoAdvance = setInterval(function () { moveSlide(1); }, 5000);
      }

      function updatePauseButton() {
        if (!pauseBtn) return;
        pauseBtn.textContent = isPaused ? '\u25b6' : '\u275a\u275a';
        pauseBtn.setAttribute('aria-label', isPaused ? 'Resume slideshow' : 'Pause slideshow');
        pauseBtn.setAttribute('aria-pressed', String(isPaused));
      }

      prevBtn.addEventListener('click', function () {
        moveSlide(-1);
        startAutoAdvance();
      });

      nextBtn.addEventListener('click', function () {
        moveSlide(1);
        startAutoAdvance();
      });

      if (pauseBtn) {
        pauseBtn.addEventListener('click', function () {
          isPaused = !isPaused;
          updatePauseButton();
          startAutoAdvance();
        });
      }

      updateCount();
      updatePauseButton();
      startAutoAdvance();
    }
  }

  var form = document.getElementById('form');
  var sent = document.getElementById('sent');

  if (form && sent) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var ok = name && /^\S+@\S+\.\S+$/.test(email);

      sent.hidden = false;

      if (!ok) {
        sent.textContent = 'Please enter your name and a valid email address.';
        return;
      }

      sent.textContent = 'Sending your message...';

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          sent.textContent = 'Thank you, ' + name + '. Your message has been sent successfully.';
          form.reset();
        } else {
          sent.textContent = 'Your message could not be sent. Please try again.';
        }
      } catch (error) {
        sent.textContent = 'A connection error occurred. Please check your internet and try again.';
      }
    });
  }
})();
