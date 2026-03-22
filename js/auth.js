const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// SIGNUP
async function signup() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) return alert(error.message);

  // Insert user into DB
  await supabaseClient.from("users").insert({
    id: data.user.id,
    email: email
  });

  alert("Signup successful! Please login.");
}

// LOGIN
async function login() {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) return alert(error.message);

  showUserUI(data.user.id);
}

// LOGOUT
async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}
