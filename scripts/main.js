importHero();

function importHero() {
    fetch('/sections/hero.html', { cache: 'no-store' })
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var mount = document.getElementById('app');
            mount.innerHTML = html;
            attachHeroInteractions();
            // Load subsequent sections in order to avoid race conditions
            importOverview();
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
            importTimeline();
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

function importTimeline() {
    fetch('/sections/timeline.html', { cache: 'no-store' })
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var mount = document.getElementById('app');
            var temp = document.createElement('div');
            temp.innerHTML = html;
            mount.appendChild(temp.firstElementChild);
            // After markup loads, hydrate from JSON
            loadTimelineData();
            // Load rules section after timeline
            importRules();
        })
        .catch(function(err) { console.error('Failed to load timeline:', err); });
}
function loadTimelineData() {
    var section = document.getElementById('timeline');
    if (!section) return;
    var panelsContainer = section.querySelector('.timeline__panels');
    var progressEl = section.querySelector('.timeline__progress');

    // Loading state
    var loading = document.createElement('div');
    loading.className = 'timeline__loading';
    loading.textContent = 'Loading timeline...';
    section.appendChild(loading);

    fetch('/data/timeline.json', { cache: 'no-store' })
        .then(function(r) { if (!r.ok) throw new Error('' + r.status); return r.json(); })
        .then(function(data) {
            loading.remove();
            if (!Array.isArray(data) || data.length === 0) {
                var empty = document.createElement('div');
                empty.className = 'timeline__empty';
                empty.textContent = 'Timeline will be announced soon.';
                section.appendChild(empty);
                return;
            }

            // Build navigation tabs
            buildTimelineNavigation(data);
            
            // Build panels from JSON
            panelsContainer.innerHTML = '';
            // Calculate container width based on screen size
            var isMobile = window.innerWidth <= 768;
            var cardWidth = isMobile ? 100 : 50; // 100vw on mobile, 50vw on desktop
            var panelsWidth = (data.length * cardWidth) + 'vw';
            var panelsWrapper = section.querySelector('.timeline__panels');
            if (panelsWrapper) panelsWrapper.style.width = panelsWidth;

            data.forEach(function(ev, index) {
                var panel = document.createElement('div');
                panel.className = 'timeline__panel';
                panel.id = 'event-' + ev.id;
                panel.setAttribute('data-datetime', ev.date);
                panel.setAttribute('data-index', index);

                var content = document.createElement('div');
                content.className = 'timeline__panel-content';

                var dateEl = document.createElement('div');
                dateEl.className = 'timeline__panel-date';
                dateEl.textContent = formatDateSafe(ev.date, { month: 'short', day: 'numeric', year: 'numeric' });

                var titleEl = document.createElement('h2');
                titleEl.className = 'timeline__panel-title';
                titleEl.textContent = ev.title || '';

                var briefEl = document.createElement('p');
                briefEl.className = 'timeline__panel-brief';
                briefEl.textContent = ev.brief || '';

                var detailEl = document.createElement('p');
                detailEl.className = 'timeline__panel-detail';
                detailEl.textContent = ev.detail || '';

                content.appendChild(dateEl);
                content.appendChild(titleEl);
                content.appendChild(briefEl);
                content.appendChild(detailEl);

                // Add highlights as bullet points if they exist
                if (ev.highlights && Array.isArray(ev.highlights)) {
                    var highlightsEl = document.createElement('ul');
                    highlightsEl.className = 'timeline__panel-highlights';
                    
                    ev.highlights.forEach(function(highlight) {
                        var li = document.createElement('li');
                        li.textContent = highlight;
                        highlightsEl.appendChild(li);
                    });
                    
                    content.appendChild(highlightsEl);
                }

                if (ev.image) {
                    var img = document.createElement('img');
                    img.className = 'timeline__panel-image';
                    img.src = ev.image;
                    img.loading = 'lazy';
                    img.alt = ev.title || '';
                    content.appendChild(img);
                }

                if (ev.link) {
                    var link = document.createElement('a');
                    link.className = 'timeline__panel-link';
                    link.href = ev.link;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = 'Learn more';
                    content.appendChild(link);
                }

                panel.appendChild(content);
                panelsContainer.appendChild(panel);
            });

            // After building panels, setup GSAP ScrollTrigger
            setupGSAPTimeline(data);
            
            // Make all cards the same height
            setTimeout(function() {
                var panels = document.querySelectorAll('.timeline__panel');
                var maxHeight = 0;
                
                // Find the tallest panel
                panels.forEach(function(panel) {
                    var content = panel.querySelector('.timeline__panel-content');
                    if (content) {
                        var height = content.scrollHeight;
                        if (height > maxHeight) {
                            maxHeight = height;
                        }
                    }
                });
                
                // Set all panels to the same height with extra buffer
                panels.forEach(function(panel) {
                    var content = panel.querySelector('.timeline__panel-content');
                    if (content) {
                        content.style.height = (maxHeight + 300) + 'px';
                    }
                });
            }, 100);
            
            // Add resize handler to recalculate container width
            var resizeHandler = function() {
                var isMobile = window.innerWidth <= 768;
                var cardWidth = isMobile ? 100 : 50;
                var newPanelsWidth = (data.length * cardWidth) + 'vw';
                if (panelsWrapper) panelsWrapper.style.width = newPanelsWidth;
                
                // Recalculate heights on resize
                setTimeout(function() {
                    var panels = document.querySelectorAll('.timeline__panel');
                    var maxHeight = 0;
                    
                    panels.forEach(function(panel) {
                        var content = panel.querySelector('.timeline__panel-content');
                        if (content) {
                            content.style.height = 'auto'; // Reset height
                            var height = content.scrollHeight;
                            if (height > maxHeight) {
                                maxHeight = height;
                            }
                        }
                    });
                    
                    panels.forEach(function(panel) {
                        var content = panel.querySelector('.timeline__panel-content');
                        if (content) {
                            content.style.height = (maxHeight + 300) + 'px';
                        }
                    });
                }, 100);
            };
            
            window.addEventListener('resize', resizeHandler);

            // Deep link (#event-id)
            var idFromHash = (location.hash || '').replace('#', '');
            if (idFromHash) {
                var el = document.getElementById('event-' + idFromHash) || document.getElementById(idFromHash);
                if (el) {
                    // Scroll to the panel on page load
                    var panelIndex = parseInt(el.getAttribute('data-index')) || 0;
                    var scrollProgress = panelIndex / (data.length - 1);
                    window.scrollTo(0, window.innerHeight * (section.offsetTop / window.innerHeight + scrollProgress));
                }
            }
        })
        .catch(function(err) {
            loading.remove();
            var error = document.createElement('div');
            error.className = 'timeline__error';
            error.textContent = 'Failed to load timeline.';
            section.appendChild(error);
            console.error('timeline.json failed:', err);
        });
}

function buildTimelineNavigation(data) {
    var navContainer = document.querySelector('.timeline__nav-container');
    if (!navContainer) return;
    
    navContainer.innerHTML = '';
    
    data.forEach(function(ev, index) {
        var tab = document.createElement('button');
        tab.className = 'timeline__nav-tab';
        tab.setAttribute('data-index', index);
        tab.setAttribute('data-event-id', ev.id);
        tab.textContent = ev.title;
        
        // Add click handler
        tab.addEventListener('click', function() {
            console.log('Nav tab clicked:', index, ev.title);
            navigateToTimelineEvent(index, data.length);
            updateActiveTab(index);
        });
        
        navContainer.appendChild(tab);
    });
    
    // Set first tab as active
    updateActiveTab(0);
}

function navigateToTimelineEvent(index, totalEvents) {
    console.log('navigateToTimelineEvent called with index:', index, 'totalEvents:', totalEvents);
    var section = document.getElementById('timeline');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Find the ScrollTrigger instance for the timeline
        var scrollTrigger = ScrollTrigger.getById('timeline') || ScrollTrigger.getAll().find(function(st) {
            return st.trigger === section;
        });

        if (scrollTrigger) {
            // Calculate the target progress (0 to 1) based on the panel index
            var targetProgress = index / (totalEvents - 1);
            // Use ScrollTrigger's progress method to scroll to the correct position
            var targetScroll = scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * targetProgress;
            console.log('Using ScrollTrigger - targetScroll:', targetScroll);

            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        } else {
            // Fallback: calculate scroll position manually
            var scrollProgress = index / (totalEvents - 1);
            var targetScroll = section.offsetTop + (window.innerHeight * scrollProgress);
            console.log('Using fallback - targetScroll:', targetScroll);

            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
    } else {
        // Fallback for when GSAP is not available
        var scrollProgress = index / (totalEvents - 1);
        var targetScroll = section.offsetTop + (window.innerHeight * scrollProgress);
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
}

function updateActiveTab(index) {
    var tabs = document.querySelectorAll('.timeline__nav-tab');
    tabs.forEach(function(tab, i) {
        tab.classList.toggle('is-active', i === index);
    });
}

function attachTimelineNavInteractions() {
    var navTabs = document.querySelectorAll('.timeline__nav-tab');
    var section = document.getElementById('timeline');
    
    console.log('Attaching timeline nav interactions to', navTabs.length, 'tabs');
    
    navTabs.forEach(function(tab, index) {
        tab.style.cursor = 'pointer'; // Make sure it looks clickable
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Tab clicked:', index);
            
            // Calculate the scroll progress for this tab
            var totalPanels = document.querySelectorAll('.timeline__panel').length;
            var scrollProgress = totalPanels > 1 ? index / (totalPanels - 1) : 0;
            
            console.log('Scroll progress:', scrollProgress);
            
            // Calculate the target scroll position
            var targetScroll = section.offsetTop + (window.innerHeight * scrollProgress);
            
            console.log('Target scroll:', targetScroll);
            
            // Smooth scroll to the target position
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });
}

function setupGSAPTimeline(data) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var panels = gsap.utils.toArray('.timeline__panel');
    var container = document.querySelector('.timeline__panels');
    var section = document.getElementById('timeline');
    var progressEl = section.querySelector('.timeline__progress');
    var navigation = section.querySelector('.timeline__navigation');
    var subtitle = section.querySelector('.timeline__subtitle');
    var header = section.querySelector('.timeline__header');

    if (!panels.length || !container) return;

    // Set initial state for parallax elements
    gsap.set(navigation, { y: 0 });
    gsap.set(subtitle, { opacity: 1 });
    gsap.set(panels, { scale: 1 });

    // Create parallax effect for navigation and subtitle
    gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=20%",
            scrub: 1,
            onUpdate: function(self) {
                var progress = self.progress;
                
                // Move navigation up and fade subtitle
                if (navigation) {
                    gsap.to(navigation, { 
                        y: -20 * progress, 
                        duration: 0.1 
                    });
                }
                
                if (subtitle) {
                    gsap.to(subtitle, { 
                        opacity: 1 - progress, 
                        duration: 0.1 
                    });
                }
                
                // Scale up panels slightly
                gsap.to(panels, { 
                    scale: 1 + (0.05 * progress), 
                    duration: 0.1 
                });
            }
        }
    });

    // Create GSAP timeline animation with custom snap logic
    gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
            id: "timeline",
            trigger: section,
            pin: true,
            scrub: 0.8,
            snap: {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.4, max: 0.8 },
                delay: 0.1,
                onComplete: function() {
                    // Update progress bar and active tab
                    if (progressEl) {
                        var progress = this.progress * 100;
                        progressEl.style.width = progress + '%';
                    }
                    // Update active tab based on current panel
                    var currentIndex = Math.round(this.progress * (panels.length - 1));
                    updateActiveTab(currentIndex);
                }
            },
            end: () => "+=" + container.offsetWidth,
            onUpdate: function(self) {
                // Update progress bar during scroll
                if (progressEl) {
                    var progress = self.progress * 100;
                    progressEl.style.width = progress + '%';
                }
                // Update active tab during scroll with more precise calculation
                var rawIndex = self.progress * (panels.length - 1);
                var currentIndex = Math.round(rawIndex);
                updateActiveTab(currentIndex);
            }
        }
    });

    // Expose runtime API
    window.Timeline = window.Timeline || {};
    window.Timeline.select = function(id) {
        try {
            var panel = document.getElementById('event-' + id);
            if (!panel) return;
            var index = parseInt(panel.getAttribute('data-index')) || 0;
            var scrollProgress = index / (panels.length - 1);
            var targetScroll = window.innerHeight * (section.offsetTop / window.innerHeight + scrollProgress);
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        } catch (_) {}
    };
}

function formatDateSafe(iso, opts) {
    try {
        var d = new Date(iso);
        return d.toLocaleDateString(undefined, opts || { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (_) { return iso; }
}

function attachTimelineInteractions() {
    var section = document.getElementById('timeline');
    if (!section) return;
    var items = Array.prototype.slice.call(section.querySelectorAll('.timeline__item'));
    if (items.length === 0) return;

    var milestones = items.map(function(item) {
        var iso = item.getAttribute('data-datetime');
        var date = iso ? new Date(iso) : null;
        return { item: item, date: date };
    }).filter(function(x) { return x.date instanceof Date && !isNaN(x.date); });
    if (milestones.length === 0) return;

    milestones.sort(function(a, b) { return a.date - b.date; });
    var firstDate = milestones[0].date;
    var lastDate = milestones[milestones.length - 1].date;
    var progressEl = section.querySelector('.timeline__progress');

    function updateStates() {
        var now = new Date();
        var currentIndex = milestones.findIndex(function(m) { return m.date >= now; });
        if (currentIndex === -1) currentIndex = milestones.length - 1;
        if (now <= firstDate) currentIndex = 0;

        milestones.forEach(function(m, idx) {
            m.item.classList.toggle('is-past', now > m.date && idx < currentIndex);
            var isCurrent = idx === currentIndex;
            m.item.classList.toggle('is-current', isCurrent);
            if (isCurrent) m.item.setAttribute('aria-current', 'step');
            else m.item.removeAttribute('aria-current');
        });

        if (progressEl) {
            var total = lastDate - firstDate;
            var elapsed = Math.min(Math.max(now - firstDate, 0), total);
            var pct = total > 0 ? (elapsed / total) * 100 : 0;
            progressEl.style.width = pct.toFixed(2) + '%';
        }
    }

    updateStates();
    // Update periodically to reflect time passing
    setInterval(updateStates, 60000);

    // Interactive selection & details panel
    var titleEl = null; // no separate details panel
    var dateEl = null;
    var textEl = null;
    var mediaWrap = null;
    var mediaImg = null;
    var prevBtn = null;
    var nextBtn = null;

    var selectedIndex = 0;

    function formatDate(d) {
        try {
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (_) { return d.toDateString(); }
    }

    function renderSelection(idx) {
        selectedIndex = Math.max(0, Math.min(idx, milestones.length - 1));
        milestones.forEach(function(m, i) {
            var btn = m.item.querySelector('.timeline__button');
            var isActive = i === selectedIndex;
            m.item.classList.toggle('is-current', isActive);
            if (btn) btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
        var s = milestones[selectedIndex];
        // Inline expansion is handled by CSS via .is-current .timeline__extra
        // Ensure the selected bubble is centered in the scroller
        var scroller = section.querySelector('.timeline__scroller');
        if (scroller && s.item) {
            s.item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }

        // Update URL hash for deep link
        try {
            var id = (s.item.id || '').replace(/^event-/, '');
            if (id) history.replaceState(null, '', '#' + id);
        } catch (_) {}
    }

    items.forEach(function(item, idx) {
        var btn = item.querySelector('.timeline__button');
        if (!btn) return;
        btn.addEventListener('click', function() { renderSelection(idx); });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); renderSelection(selectedIndex + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); renderSelection(selectedIndex - 1); }
        });
    });

    // Click handlers on items already set; prev/next buttons removed

    // Initialize selection on the current milestone
    var now = new Date();
    var initialIndex = milestones.findIndex(function(m) { return m.date >= now; });
    if (initialIndex === -1) initialIndex = milestones.length - 1;
    renderSelection(initialIndex);

    // Snap to nearest on scroll end
    var scroller = section.querySelector('.timeline__scroller');
    if (scroller) {
        var scrollTimeout;
        scroller.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // find the closest item to scroller center
                var rect = scroller.getBoundingClientRect();
                var center = rect.left + rect.width / 2;
                var closestIdx = 0;
                var closestDist = Infinity;
                milestones.forEach(function(m, i) {
                    var r = m.item.getBoundingClientRect();
                    var c = r.left + r.width / 2;
                    var d = Math.abs(c - center);
                    if (d < closestDist) { closestDist = d; closestIdx = i; }
                });
                renderSelection(closestIdx);
            }, 120);
        }, { passive: true });

        // Map vertical wheel scroll to horizontal movement for desktop trackpads/mice
        scroller.addEventListener('wheel', function(e) {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                // Vertical intent; convert to horizontal scroll
                e.preventDefault();
                scroller.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // Also map wheel on the whole section so vertical scroll over empty
        // space still advances the horizontal timeline.
        section.addEventListener('wheel', function(e) {
            if (!scroller) return;
            var verticallyDominant = Math.abs(e.deltaY) > Math.abs(e.deltaX);
            if (!verticallyDominant) return;
            var atStart = scroller.scrollLeft <= 0;
            var atEnd = Math.ceil(scroller.scrollLeft + scroller.clientWidth) >= scroller.scrollWidth;
            var goingRight = e.deltaY > 0;
            var goingLeft = e.deltaY < 0;
            if ((goingRight && !atEnd) || (goingLeft && !atStart)) {
                e.preventDefault();
                scroller.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // Drag/swipe navigation with Pointer Events
        var isDragging = false;
        var startX = 0;
        var startLeft = 0;
        scroller.addEventListener('pointerdown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startLeft = scroller.scrollLeft;
            try { scroller.setPointerCapture(e.pointerId); } catch(_){}
            scroller.classList.add('is-dragging');
        });
        scroller.addEventListener('pointermove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            var dx = e.clientX - startX;
            scroller.scrollLeft = startLeft - dx;
        }, { passive: false });
        function endDrag(e){
            if (!isDragging) return;
            isDragging = false;
            try { scroller.releasePointerCapture(e.pointerId); } catch(_){}
            scroller.classList.remove('is-dragging');
            // Snap after drag ends
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                var rect = scroller.getBoundingClientRect();
                var center = rect.left + rect.width / 2;
                var closestIdx = 0;
                var closestDist = Infinity;
                milestones.forEach(function(m, i) {
                    var r = m.item.getBoundingClientRect();
                    var c = r.left + r.width / 2;
                    var d = Math.abs(c - center);
                    if (d < closestDist) { closestDist = d; closestIdx = i; }
                });
                renderSelection(closestIdx);
            }, 80);
        }
        scroller.addEventListener('pointerup', endDrag);
        scroller.addEventListener('pointercancel', endDrag);
    }
}

// Legacy API for backward compatibility (now handled in setupGSAPTimeline)

function importRules() {
    fetch('/sections/rules.html', { cache: 'no-store' })
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var mount = document.getElementById('app');
            var temp = document.createElement('div');
            temp.innerHTML = html;
            mount.appendChild(temp.firstElementChild);
            attachRulesInteractions();
        })
        .catch(function(err) { console.error('Failed to load rules:', err); });
}

function attachRulesInteractions() {
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.rules .tabbar .tab'));
    var panels = {
        eligibility: document.getElementById('tab-panel-eligibility'),
        format: document.getElementById('tab-panel-format'),
        submission: document.getElementById('tab-panel-submission'),
        judging: document.getElementById('tab-panel-judging')
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

    // Default to eligibility
    selectTab('eligibility');

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
