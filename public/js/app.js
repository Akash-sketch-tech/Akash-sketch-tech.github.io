/**
 * Akash Damahe Portfolio - Frontend Application Logic
 * Integrates with Node.js & SQLite Backend
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  loadPortfolioData();
  initContactForm();
  initActiveNavSpy();
  initResumeDownload();
  initMessagesModal();
});

// ----------------------------------------------------
// 1. Theme Management (Light mode default + Dark toggle)
// ----------------------------------------------------
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
  const lightIcon = document.getElementById('theme-icon-light');
  const darkIcon = document.getElementById('theme-icon-dark');
  const lightIconMob = document.getElementById('theme-icon-light-mob');
  const darkIconMob = document.getElementById('theme-icon-dark-mob');

  // Default to 'light' per requirements, unless explicitly set to 'dark' by user
  const savedTheme = localStorage.getItem('akash_portfolio_theme') || 'light';

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateThemeIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcons(false);
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('akash_portfolio_theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    if (lightIcon && darkIcon) {
      if (isDark) {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
      } else {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
      }
    }
    if (lightIconMob && darkIconMob) {
      if (isDark) {
        lightIconMob.classList.remove('hidden');
        darkIconMob.classList.add('hidden');
      } else {
        lightIconMob.classList.add('hidden');
        darkIconMob.classList.remove('hidden');
      }
    }
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);
}

// ----------------------------------------------------
// 2. Mobile Menu Navigation
// ----------------------------------------------------
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ----------------------------------------------------
// 3. Dynamic Portfolio Data Loading (Express & SQLite)
// ----------------------------------------------------
let allProjectsData = [];

async function loadPortfolioData() {
  try {
    let result = null;

    // 1. Attempt dynamic Node.js / Express backend if running locally or on server
    try {
      const response = await fetch('/api/portfolio-data');
      if (response && response.ok) {
        result = await response.json();
      }
    } catch (e) {
      // Offline / Static hosting mode (GitHub Pages)
    }

    // 2. Fallback to static JSON file (for GitHub Pages / static hosting)
    if (!result || !result.data) {
      try {
        const staticRes = await fetch('./data/portfolio-data.json').catch(() => null) 
                       || await fetch('data/portfolio-data.json').catch(() => null);
        if (staticRes && staticRes.ok) {
          result = await staticRes.json();
        }
      } catch (e) {
        console.warn('Could not fetch static portfolio-data.json', e);
      }
    }

    if (result && result.data) {
      const { projects, education, competitions, internships, stats } = result.data;
      allProjectsData = projects || [];
      renderProjects(allProjectsData);
      renderEducation(education || []);
      renderCompetitions(competitions || []);
      renderInternships(internships || []);
      updateStats(stats);
      initProjectFilters();
    }
  } catch (err) {
    console.warn('Backend API connection note: Using existing rendered elements or local cache.', err);
  }
}

// Render Projects Cards
function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
        <p>No projects found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(proj => {
    const toolsArray = proj.tools ? proj.tools.split(',').map(t => t.trim()) : [];
    const iconSvg = getProjectIcon(proj.category);

    return `
      <article class="electric-border hover-lift bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300">
        <div>
          <!-- Header: Category & Badge -->
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              ${iconSvg}
              ${escapeHtml(proj.category)}
            </span>
            ${proj.badge ? `
              <span class="px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                ${escapeHtml(proj.badge)}
              </span>
            ` : ''}
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            ${escapeHtml(proj.title)}
          </h3>

          <!-- Summary -->
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
            ${escapeHtml(proj.summary || proj.description)}
          </p>

          <!-- Engineering Specs Highlight -->
          ${proj.highlights ? `
            <div class="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>
                Key Engineering Result
              </div>
              <p class="text-xs font-medium text-slate-800 dark:text-slate-200">${escapeHtml(proj.highlights)}</p>
            </div>
          ` : ''}

          <!-- Tech stack tags -->
          <div class="flex flex-wrap gap-1.5 mb-6">
            ${toolsArray.map(tool => `
              <span class="tech-tag px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200/80 dark:border-slate-700/80">
                ${escapeHtml(tool)}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button 
            type="button"
            onclick="openProjectModal(${proj.id})"
            class="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>View Technical Details</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </button>
          
          <div class="flex items-center gap-2">
            ${proj.github_url ? `
              <a href="${escapeHtml(proj.github_url)}" target="_blank" rel="noopener noreferrer" title="View Code" class="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
              </a>
            ` : ''}
            <a href="#contact" class="p-2 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Inquire about project">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Project filtering tabs
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });

      btn.classList.add('bg-sky-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

      const category = btn.getAttribute('data-category');
      if (!category || category === 'All') {
        renderProjects(allProjectsData);
      } else {
        const filtered = allProjectsData.filter(p => p.category === category);
        renderProjects(filtered);
      }
    });
  });
}

// Render Education Milestones
function renderEducation(educationList) {
  const container = document.getElementById('education-container');
  if (!container) return;

  container.innerHTML = educationList.map((edu, idx) => {
    const isTopper = edu.honors && edu.honors.toLowerCase().includes('topper');
    return `
      <div class="relative pl-8 sm:pl-10 pb-10 last:pb-2 border-l-2 ${isTopper ? 'border-amber-400 dark:border-amber-500' : 'border-sky-500 dark:border-sky-600'}">
        <!-- Node marker on timeline -->
        <div class="absolute -left-[17px] top-0 w-8 h-8 rounded-full ${isTopper ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 ring-4 ring-amber-400/30' : 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 ring-4 ring-sky-500/20'} flex items-center justify-center font-bold text-xs shadow-sm">
          ${isTopper ? '★' : (idx + 1)}
        </div>

        <div class="electric-border bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${isTopper ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700' : 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-700'}">
                  ${escapeHtml(edu.badge || 'Academic Milestone')}
                </span>
                <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
                  ${escapeHtml(edu.period)}
                </span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                ${escapeHtml(edu.degree)}
              </h3>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                ${escapeHtml(edu.institution)} • <span class="italic text-slate-500 dark:text-slate-400">${escapeHtml(edu.board_university)}</span>
              </p>
            </div>

            <div class="sm:text-right shrink-0">
              <div class="inline-block sm:block text-base font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-sky-100 dark:border-slate-700">
                ${escapeHtml(edu.score_grade)}
              </div>
            </div>
          </div>

          <!-- Academic Honors Callout -->
          ${edu.honors ? `
            <div class="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span>${escapeHtml(edu.honors)}</span>
            </div>
          ` : ''}

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            ${escapeHtml(edu.description)}
          </p>

          ${edu.key_subjects ? `
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Core Electrical Subjects:</span>
              <p class="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                ${escapeHtml(edu.key_subjects)}
              </p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Render Competitions & Achievements
function renderCompetitions(competitions) {
  const container = document.getElementById('competitions-grid');
  if (!container) return;

  container.innerHTML = competitions.map(comp => {
    return `
      <div class="electric-border hover-lift bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
        <div>
          <!-- Award Header -->
          <div class="flex items-center justify-between mb-3.5">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
              ${escapeHtml(comp.award)}
            </span>
            <span class="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              ${escapeHtml(comp.year)}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
            ${escapeHtml(comp.title)}
          </h3>

          <p class="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-3">
            ${escapeHtml(comp.event_name)} • <span class="text-slate-500 dark:text-slate-400 font-normal">${escapeHtml(comp.organizer)}</span>
          </p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ${escapeHtml(comp.description)}
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
          <span>Verified Certificate / Trophy Recognition</span>
        </div>
      </div>
    `;
  }).join('');
}

// Render Internships
function renderInternships(internships) {
  const container = document.getElementById('internships-container');
  if (!container) return;

  container.innerHTML = internships.map((intern, idx) => {
    return `
      <div class="electric-border hover-lift bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                ${escapeHtml(intern.type)}
              </span>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
                ${escapeHtml(intern.period)}
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">
              ${escapeHtml(intern.role)}
            </h3>
            <p class="text-sm font-semibold text-sky-600 dark:text-sky-400">
              ${escapeHtml(intern.company)} • <span class="text-slate-500 font-normal">${escapeHtml(intern.location)}</span>
            </p>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          ${escapeHtml(intern.description)}
        </p>

        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Key Field Learnings & Industrial Applications:
          </div>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            ${escapeHtml(intern.learnings)}
          </p>
        </div>
      </div>
    `;
  }).join('');
}

// Update Stats in Hero/Header
function updateStats(stats) {
  if (!stats) return;
  const statProjects = document.getElementById('stat-projects');
  const statCompetitions = document.getElementById('stat-competitions');
  const statInternships = document.getElementById('stat-internships');

  if (statProjects) statProjects.textContent = `${stats.projects}+`;
  if (statCompetitions) statCompetitions.textContent = `${stats.competitions}+`;
  if (statInternships) statInternships.textContent = `${stats.internships}`;
}

// Helper: Icons for categories
function getProjectIcon(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('power')) {
    return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
  } else if (cat.includes('solar') || cat.includes('renew')) {
    return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`;
  } else if (cat.includes('auto')) {
    return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>`;
  }
  return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>`;
}

// ----------------------------------------------------
// 4. Contact Form Handling (Express + SQLite)
// ----------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const toast = document.getElementById('toast');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Set loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Transmitting message to SQLite...
    `;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        showToast(data.message || 'Thank you! Your message has been saved to the database.', 'success');
        form.reset();
      } else {
        // Fallback for static hosting (GitHub Pages) -> open mail client directly
        const mailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`;
        window.location.href = `mailto:akashdamahe77@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        showToast('Opening default email client to send message to Akash...', 'success');
        form.reset();
      }
    } catch (err) {
      console.error('Contact form error:', err);
      const mailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`;
      window.location.href = `mailto:akashdamahe77@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
      showToast('Opening email client to send message to Akash...', 'success');
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (toastMessage) toastMessage.textContent = message;

  if (type === 'success') {
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-sm font-semibold text-white bg-slate-900 dark:bg-sky-600 border border-emerald-400/50 transition-all duration-300 transform translate-y-0 opacity-100';
    if (toastIcon) {
      toastIcon.innerHTML = `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
    }
  } else {
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-sm font-semibold text-white bg-rose-900 border border-rose-500 transition-all duration-300 transform translate-y-0 opacity-100';
    if (toastIcon) {
      toastIcon.innerHTML = `<svg class="w-5 h-5 text-rose-300 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    }
  }

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-8', 'opacity-0', 'pointer-events-none');
  }, 5000);
}

// ----------------------------------------------------
// 5. Resume Download Tracking & Feedback
// ----------------------------------------------------
function initResumeDownload() {
  const downloadBtns = document.querySelectorAll('.resume-download-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      showToast('Downloading Akash Damahe\'s Official Resume (PDF)...', 'success');
    });
  });
}

// ----------------------------------------------------
// 6. Project Modal Popup
// ----------------------------------------------------
window.openProjectModal = function(projectId) {
  const project = allProjectsData.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('project-modal-content');
  if (!modal || !modalContent) return;

  const toolsArray = project.tools ? project.tools.split(',').map(t => t.trim()) : [];

  modalContent.innerHTML = `
    <div class="p-6 sm:p-8">
      <div class="flex items-center justify-between gap-4 mb-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          ${escapeHtml(project.category)}
        </span>
        <button onclick="closeProjectModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        ${escapeHtml(project.title)}
      </h2>

      <div class="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Key Engineering Achievement & Specs</h4>
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(project.highlights || 'Comprehensive engineering solution')}</p>
      </div>

      <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Technical Description & Architecture:</h4>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
        ${escapeHtml(project.description)}
      </p>

      <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Tools, Software & Hardware Stack:</h4>
      <div class="flex flex-wrap gap-2 mb-8">
        ${toolsArray.map(tool => `
          <span class="tech-tag px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-xs border border-slate-200 dark:border-slate-700">
            ${escapeHtml(tool)}
          </span>
        `).join('')}
      </div>

      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <a href="#contact" onclick="closeProjectModal()" class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-all">
          Discuss This Project With Akash
        </a>
        <button onclick="closeProjectModal()" class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          Close Window
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

// ----------------------------------------------------
// 7. Admin / Contact Form Submissions Viewer Modal
// ----------------------------------------------------
function initMessagesModal() {
  const trigger = document.getElementById('view-messages-trigger');
  const modal = document.getElementById('messages-modal');
  const closeBtn = document.getElementById('close-messages-modal');
  const listContainer = document.getElementById('messages-list-container');

  if (trigger && modal) {
    trigger.addEventListener('click', async (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      if (listContainer) {
        listContainer.innerHTML = `
          <div class="py-12 text-center text-slate-500">
            <svg class="animate-spin h-6 w-6 mx-auto mb-2 text-sky-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading SQLite database entries...
          </div>
        `;

        try {
          const res = await fetch('/api/contacts');
          const data = await res.json();
          if (data.success && data.contacts) {
            if (data.contacts.length === 0) {
              listContainer.innerHTML = `
                <div class="text-center py-12 text-slate-500 dark:text-slate-400">
                  <p class="font-medium">No contact messages received yet in the database.</p>
                  <p class="text-xs mt-1">Submit a message via the Contact Form to test dynamic SQLite persistence!</p>
                </div>
              `;
            } else {
              listContainer.innerHTML = data.contacts.map(c => `
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="font-bold text-slate-900 dark:text-white text-sm">${escapeHtml(c.name)}</span>
                    <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <div class="text-xs text-sky-600 dark:text-sky-400 font-medium mb-1">
                    Email: ${escapeHtml(c.email)} ${c.phone ? `| Phone: ${escapeHtml(c.phone)}` : ''}
                  </div>
                  <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Subject: ${escapeHtml(c.subject)}
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                    ${escapeHtml(c.message)}
                  </p>
                </div>
              `).join('');
            }
          }
        } catch (err) {
          listContainer.innerHTML = `<div class="text-center py-8 text-rose-500">Failed to load contacts from SQLite API.</div>`;
        }
      }
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }
}

// ----------------------------------------------------
// 8. Active Nav Spy on Scroll
// ----------------------------------------------------
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-sky-600', 'dark:text-sky-400', 'font-bold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-sky-600', 'dark:text-sky-400', 'font-bold');
      }
    });
  });
}

// Utility: Escape HTML to avoid XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
