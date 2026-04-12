// Dashboard — Panel de Selección BNI Academia
import { checkAuth, logout } from "./auth";
import { supabase } from "./lib/supabaseClient";

window.addEventListener("DOMContentLoaded", async () => {
  // Check if authenticated, if not redirects to login
  await checkAuth();

  // Load user data from Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  const savedName = session?.user?.email || "Usuario Académico";
  
  const profileNameEl = document.querySelector<HTMLElement>("#profile-name");
  const avatarEl = document.querySelector<HTMLElement>("#topbar-avatar");
  if (profileNameEl) profileNameEl.textContent = savedName;
  if (avatarEl) {
    // Build initials from email (e.g. "carlos.garcia@..." -> "CG")
    const namePart = savedName.split('@')[0];
    const initials = namePart
      .split(/[.\s_-]/)
      .map((part: string) => part[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("");
    avatarEl.textContent = initials || "U";
  }

  // --- Sidebar nav: highlight active item on click ---
  const navItems = document.querySelectorAll<HTMLAnchorElement>(".sidebar-nav-item:not(#btn-logout)");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (!item.id || item.id !== "btn-logout") {
        e.preventDefault();
      }
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // --- Logout ---
  const logoutBtn = document.querySelector<HTMLAnchorElement>("#btn-logout");
  logoutBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    await logout();
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = targetWidth;
      });
    });
  }
});
