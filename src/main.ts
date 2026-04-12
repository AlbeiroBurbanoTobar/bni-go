import { invoke } from "@tauri-apps/api/core";
import { supabase } from "./lib/supabaseClient";
import { redirectIfAuthenticated } from "./auth";

// --- DOM Elements ---
let usernameInput: HTMLInputElement | null;
let passwordInput: HTMLInputElement | null;
let togglePasswordBtn: HTMLButtonElement | null;
let loginForm: HTMLFormElement | null;
let loginError: HTMLElement | null;
let loginErrorText: HTMLElement | null;
let btnLogin: HTMLButtonElement | null;
let rememberCheckbox: HTMLInputElement | null;

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

  const email = usernameInput?.value.trim() ?? ""; // Using this as email for Supabase
  const password = passwordInput?.value ?? "";

  if (!email || !password) {
    showError("Por favor, complete todos los campos.");
    return;
  }

  // Disable button while processing
  if (btnLogin) {
    btnLogin.disabled = true;
    btnLogin.querySelector("span:first-child")!.textContent = "Verificando...";
  }

  try {
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error from Supabase:", error);
      // Determine the error message
      let errorMessage = "Error al autenticar. Verifique sus credenciales.";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciales incorrectas.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor confirme su correo electrónico.";
      }
      
      showError(errorMessage);
      throw error;
    }

    // Call Tauri greet just as an example of backend integration (optional)
    await invoke("greet", { name: data.user?.email || "Usuario" });

    // Remember email logic
    if (rememberCheckbox?.checked) {
      localStorage.setItem("bni_remembered_email", email);
    } else {
      localStorage.removeItem("bni_remembered_email");
    }

    if (btnLogin) {
      btnLogin.querySelector("span:first-child")!.textContent = "¡Bienvenido!";
      btnLogin.style.background = "linear-gradient(135deg, #26A69A 0%, #1D9E75 100%)";
    }

    // Navigate to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 800);
  } catch (error) {
    if (btnLogin) {
      btnLogin.disabled = false;
      btnLogin.querySelector("span:first-child")!.textContent = "Acceder al sistema";
      btnLogin.style.background = "";
    }
  }
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", () => {
  // Check if user is already authenticated
  redirectIfAuthenticated();

  usernameInput = document.querySelector("#username");
  passwordInput = document.querySelector("#password");
  togglePasswordBtn = document.querySelector("#toggle-password");
  loginForm = document.querySelector("#login-form");
  loginError = document.querySelector("#login-error");
  loginErrorText = document.querySelector("#login-error-text");
  btnLogin = document.querySelector("#btn-login");
  rememberCheckbox = document.querySelector("#remember");

  const savedEmail = localStorage.getItem("bni_remembered_email");
  if (savedEmail && usernameInput && rememberCheckbox) {
    usernameInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  setupPasswordToggle();
  loginForm?.addEventListener("submit", handleLogin);
});
