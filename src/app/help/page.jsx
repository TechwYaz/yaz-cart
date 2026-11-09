import StaticPage from "@/components/StaticPage";

export default function Help() {
  return (
    <StaticPage title="Help Center" subtitle="Answers to common questions">
      <h3 className="font-bold">How can I pay?</h3>
      <p>You can pay cash on delivery or online with your card at checkout.</p>
      <h3 className="font-bold">How long does delivery take?</h3>
      <p>Orders usually arrive within 2 to 5 working days. Orders over 500 EGP ship free.</p>
      <h3 className="font-bold">Can I return a product?</h3>
      <p>Yes, we have a 14-day return policy.</p>
      <h3 className="font-bold">I forgot my password</h3>
      <p>Use the Forgot Password link on the sign in page and we will email you a reset code.</p>
    </StaticPage>
  );
}
