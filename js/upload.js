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

  const formData = new FormData();
  formData.append("file", file);

  alert("Uploading...");

  const res = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const result = await res.json();

  const fileUrl = result.url;

  await afterUpload(userId, fileUrl, file);

  alert("Uploaded to Telegram 🚀");
  loadFiles(userId);
}
