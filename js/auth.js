const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// LOGIN
async function login() {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) return alert(error.message);

  window.location.href = "index.html";
}

// SIGNUP
async function signup() {
  const { data, error } = await supabaseClient.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) return alert(error.message);

  await supabaseClient.from("users").insert({
    id: data.user.id,
    email: emailInput.value
  });

  alert("Account created!");
  window.location.href = "login.html";
}

// LOGOUT
async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}
