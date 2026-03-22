async function checkUser() {
  const { data } = await supabaseClient.auth.getUser();

  if (data.user) {
    showUserUI(data.user.id);
  }
}

async function showUserUI(userId) {
  loginCard.style.display = "none";
  uploadCard.style.display = "block";
  searchCard.style.display = "block";
  historyCard.style.display = "block";

  await loadFiles(userId);
  await checkAdmin(userId);
}
