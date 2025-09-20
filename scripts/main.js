importHero();
importOverview();

function importHero() {
    fetch('/sections/hero.html', { cache: 'no-store' })
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var mount = document.getElementById('app');
            mount.innerHTML = html;
            attachHeroInteractions();
        })
        .catch(function(err) { console.error('Failed to load hero:', err); });
}

function attachHeroInteractions() {
    var deadline = window.heroDeadline || new Date(Date.now() + 1000*60*60*24*7);
    var daysEl = document.querySelector('[data-time="days"]');
    var hoursEl = document.querySelector('[data-time="hours"]');
    var minutesEl = document.querySelector('[data-time="minutes"]');
    var secondsEl = document.querySelector('[data-time="seconds"]');

    function updateCountdown() {
        var now = new Date();
        var diff = deadline - now;
        if (diff < 0) diff = 0;
        var days = Math.floor(diff / (1000*60*60*24));
        var hours = Math.floor((diff / (1000*60*60)) % 24);
        var minutes = Math.floor((diff / (1000*60)) % 60);
        var seconds = Math.floor((diff / 1000) % 60);
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Animated buttons are pure CSS - no JavaScript needed for hover effects
}

function importOverview() {
    fetch('/sections/overview.html', { cache: 'no-store' })
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var mount = document.getElementById('app');
            var temp = document.createElement('div');
            temp.innerHTML = html;
            mount.appendChild(temp.firstElementChild);
            attachOverviewInteractions();
        })
        .catch(function(err) { console.error('Failed to load overview:', err); });
}

function attachOverviewInteractions() {
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tabbar .tab'));
    var panels = {
        context: document.getElementById('tab-panel-context'),
        impact: document.getElementById('tab-panel-impact'),
        solution: document.getElementById('tab-panel-solution'),
        role: document.getElementById('tab-panel-role')
    };

    function selectTab(key) {
        tabButtons.forEach(function(btn) {
            var isActive = btn.getAttribute('data-tab') === key;
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        Object.keys(panels).forEach(function(k) {
            var panel = panels[k];
            var show = k === key;
            if (!panel) return;
            panel.hidden = !show;
            panel.classList.toggle('is-hidden', !show);
        });
    }

    // Default to context
    selectTab('context');

    tabButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var key = btn.getAttribute('data-tab');
            selectTab(key);
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var key = btn.getAttribute('data-tab');
                selectTab(key);
            }
        });
    });
}


