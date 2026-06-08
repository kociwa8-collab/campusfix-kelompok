// =====================================================
// THEME MANAGER - DARK MODE / LIGHT MODE
// =====================================================

class ThemeManager {
  constructor() {
    this.storageKey = 'campusfix-theme';
    this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem(this.storageKey);
    const theme = savedTheme || (this.darkModeMediaQuery.matches ? 'dark' : 'light');
    this.setTheme(theme);
    
    // Listen for system theme changes
    this.darkModeMediaQuery.addListener((e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      this.updateThemeButton('&#9790;');
    } else {
      html.removeAttribute('data-theme');
      this.updateThemeButton('&#9728;');
    }
    
    localStorage.setItem(this.storageKey, theme);
    this.applyThemeTransition();
  }

  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateThemeButton(icon) {
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.innerHTML = icon;
    }
  }

  applyThemeTransition() {
    const html = document.documentElement;
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      html.style.transition = '';
    }, 300);
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
  });
} else {
  new ThemeManager();
}

// Expose toggle function globally
window.toggleTheme = () => {
  // Find existing instance or create new one
  const manager = new ThemeManager();
  manager.toggleTheme();
};
