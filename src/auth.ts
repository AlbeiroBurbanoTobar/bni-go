import { supabase } from './lib/supabaseClient';

export async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    // Si no hay sesión, redirigir al login
    window.location.href = "/";
  }
}

export async function redirectIfAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // Si ya tiene sesión, mandarlo al dashboard (proteger el login)
    window.location.href = "/dashboard.html";
  }
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/";
}
