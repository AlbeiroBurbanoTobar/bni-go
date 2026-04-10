import { invoke } from "@tauri-apps/api/core";

// --- DOM Elements ---
let usernameInput: HTMLInputElement | null;
let passwordInput: HTMLInputElement | null;
let togglePasswordBtn: HTMLButtonElement | null;
let loginForm: HTMLFormElement | null;
let loginError: HTMLElement | null;
let loginErrorText: HTMLElement | null;
let btnLogin: HTMLButtonElement | null;

// --- Password Visibility Toggle ---
function setupPasswordToggle() {
  if (!togglePasswordBtn || !passwordInput) return;

  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput!.type === "password";
    passwordInput!.type = isPassword ? "text" : "password";

    const icon = togglePasswordBtn!.querySelector(".material-symbols-outlined");
    if (icon) {
      icon.textContent = isPassword ? "visibility_off" : "visibility";
    }
  });
}

// --- Show Error ---
function showError(message: string) {
  if (loginError && loginErrorText) {
    loginErrorText.textContent = message;
    loginError.classList.add("visible");

    // Remove and re-add for shake animation
    loginError.style.animation = "none";
    loginError.offsetHeight; // trigger reflow
    loginError.style.animation = "";
  }
}

// --- Hide Error ---
function hideError() {
  if (loginError) {
    loginError.classList.remove("visible");
  }
}

// --- Handle Login ---
async function handleLogin(e: Event) {
  e.preventDefault();
  hideError();

  const username = usernameInput?.value.trim() ?? "";
  const password = passwordInput?.value ?? "";

  if (!username || !password) {
    showError("Por favor, complete todos los campos.");
    return;
  }

  // Disable button while processing
  if (btnLogin) {
    btnLogin.disabled = true;
    btnLogin.querySelector("span:first-child")!.textContent = "Verificando...";
  }

  try {
    // Use the existing Tauri 'greet' command as placeholder
    // Replace with actual login logic when the backend is ready
    const result = await invoke("greet", { name: username });
    console.log("Login response:", result);

    // Store username for dashboard and navigate
    sessionStorage.setItem("bni_username", username);

    if (btnLogin) {
      btnLogin.querySelector("span:first-child")!.textContent = "¡Bienvenido!";
      btnLogin.style.background = "linear-gradient(135deg, #26A69A 0%, #1D9E75 100%)";
    }

    // Navigate to dashboard after brief success animation
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 800);
  } catch (error) {
    console.error("Login error:", error);
    showError("Error al conectar con el servidor. Intente de nuevo.");

    if (btnLogin) {
      btnLogin.disabled = false;
      btnLogin.querySelector("span:first-child")!.textContent = "Acceder al sistema";
      btnLogin.style.background = "";
    }
  }
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", () => {
  usernameInput = document.querySelector("#username");
  passwordInput = document.querySelector("#password");
  togglePasswordBtn = document.querySelector("#toggle-password");
  loginForm = document.querySelector("#login-form");
  loginError = document.querySelector("#login-error");
  loginErrorText = document.querySelector("#login-error-text");
  btnLogin = document.querySelector("#btn-login");

  setupPasswordToggle();
  loginForm?.addEventListener("submit", handleLogin);
});
