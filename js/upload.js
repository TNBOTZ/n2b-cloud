async function upload() {
  const { data } = await supabaseClient.auth.getUser();
  const userId = data.user.id;

  const { data: user } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!(await canUpload(user))) return;

  const file = fileInput.files[0];
  if (!file) return alert("Select file");

  // TEMP (Replace later with Telegram)
  const fileUrl = URL.createObjectURL(file);

  await afterUpload(userId, fileUrl, file);

  alert("Uploaded successfully!");
  loadFiles(userId);
}

// LIMIT CHECK
async function canUpload(user) {
  const today = new Date().toISOString().split("T")[0];

  if (user.last_upload_date !== today) {
    await supabaseClient.from("users").update({
      uploads_today: 0,
      last_upload_date: today
    }).eq("id", user.id);

    user.uploads_today = 0;
  }

  if (user.is_blocked) {
    alert("You are blocked ❌");
    return false;
  }

  if (user.plan === "free" && user.uploads_today >= 5) {
    alert("Daily limit reached! Upgrade to Pro 🚀");
    return false;
  }

  return true;
}

// SAVE FILE
async function afterUpload(userId, fileUrl, file) {
  await supabaseClient.from("files").insert({
    user_id: userId,
    file_url: fileUrl,
    file_name: file.name,
    file_type: file.type
  });

  await supabaseClient.rpc("increment_upload", { uid: userId });
}
