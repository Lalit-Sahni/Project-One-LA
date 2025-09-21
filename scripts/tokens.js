/* Runtime Theme Token Utilities
   - updateTokens({ '--color-primary': '#A855F7' }) to change the base hue
   - setTheme('dark' | 'light') toggles optional dark overrides
*/
(function () {
    function updateTokens(partial) {
        var root = document.documentElement;
        Object.keys(partial || {}).forEach(function (key) {
            root.style.setProperty(key, partial[key]);
        });
    }

    function setTheme(mode) {
        var root = document.documentElement;
        if (mode === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
    }

    // Expose globally for future editor integration
    window.ThemeTokens = {
        updateTokens: updateTokens,
        setTheme: setTheme
    };
})();


