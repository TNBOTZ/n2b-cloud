async function buyPro() {
  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: 99900,
    currency: "INR",
    name: "TNWEEBZ",

    handler: async function () {
      const { data } = await supabaseClient.auth.getUser();

      await supabaseClient.from("users")
        .update({ plan: "pro" })
        .eq("id", data.user.id);

      alert("Pro Activated 🚀");
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
