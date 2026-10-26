(function () {
  var btn = document.getElementById('menu');
  var links = document.getElementById('links');

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

  var form = document.getElementById('form');
var sent = document.getElementById('sent');

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
})();
