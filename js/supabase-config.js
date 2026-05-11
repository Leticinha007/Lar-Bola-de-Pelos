/* =========================================================
   Supabase Config — Lar Bola de Pelos
   ========================================================= */
const SUPABASE_URL     = 'https://anycxkqikfhfjcpjgmrf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueWN4a3Fpa2ZoZmpjcGpnbXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Mjc4MTgsImV4cCI6MjA5MzIwMzgxOH0.mrywLXHDk9kbRcNkATSBBBMD5G8WzizX9IxU6d0Dlbg';

window._db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
