async function checkAdmin(userId) {
  const { data } = await supabaseClient
    .from("users")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (data && data.is_admin) {
    adminPanel.style.display = "block";
    loadAdmin();
  }
}

async function loadAdmin() {
  const { count: users } = await supabaseClient
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: files } = await supabaseClient
    .from("files")
    .select("*", { count: "exact", head: true });

  usersCount.innerText = users;
  filesCount.innerText = files;
}
