// Dashboard — Panel de Selección BNI Academia

window.addEventListener("DOMContentLoaded", () => {
  // --- Load logged-in user name from session ---
  const savedName = sessionStorage.getItem("bni_username");
  if (savedName) {
    const profileNameEl = document.querySelector<HTMLElement>("#profile-name");
    const avatarEl = document.querySelector<HTMLElement>("#topbar-avatar");
    if (profileNameEl) profileNameEl.textContent = savedName;
    if (avatarEl) {
      // Build initials from username (e.g. "carlos.garcia" -> "CG")
      const initials = savedName
        .split(/[.\s_-]/)
        .map((part: string) => part[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("");
      avatarEl.textContent = initials || "U";
    }
  }

  // --- Sidebar nav: highlight active item on click ---
  const navItems = document.querySelectorAll<HTMLAnchorElement>(".sidebar-nav-item:not(#btn-logout)");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Only prevent navigation for internal nav items (not logout)
      if (!item.id || item.id !== "btn-logout") {
        e.preventDefault();
      }
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // --- Logout: back to login ---
  const logoutBtn = document.querySelector<HTMLAnchorElement>("#btn-logout");
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("bni_username");
    window.location.href = "/";
  });

  // --- CTA: Planificar Jornada ---
  document.querySelector("#btn-planificar")?.addEventListener("click", () => {
    const ciudad = (document.querySelector<HTMLSelectElement>("#select-ciudad"))?.value;
    const grado = (document.querySelector<HTMLSelectElement>("#select-grado"))?.value;

    if (!ciudad || !grado) {
      alert("Por favor, seleccione la ciudad y el nivel académico antes de planificar.");
      return;
    }
    alert(`Planificando jornada para ${ciudad} — ${grado}`);
  });

  // --- CTA: Revisar Exámenes ---
  document.querySelector("#btn-revisar")?.addEventListener("click", () => {
    alert("Módulo de revisión de exámenes en construcción.");
  });

  // --- Nueva Clase ---
  document.querySelector("#btn-nueva-clase")?.addEventListener("click", () => {
    alert("Creando nueva clase...");
  });

  // --- Animate stats bar on load ---
  const bar = document.querySelector<HTMLElement>(".stats-bar-fill");
  if (bar) {
    const targetWidth = bar.style.width;
    bar.style.width = "0%";
    bar.style.transition = "width 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s";
    // Trigger animation after a paint frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = targetWidth;
      });
    });
  }
});
