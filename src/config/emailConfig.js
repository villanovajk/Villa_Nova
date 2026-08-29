// ============================================================================
// OWNER EMAIL NOTIFICATION SETUP
// ============================================================================
// This site sends a "New Booking" email to the owner using EmailJS
// (https://www.emailjs.com), a service that lets a front-end-only site like
// this one send real emails without needing a custom backend server.
//
// TO ACTIVATE THIS FEATURE, follow these steps (takes ~5 minutes, free tier
// covers 200 emails/month which is plenty for a single villa):
//
// 1. Go to https://www.emailjs.com and click "Sign Up" (free).
// 2. Once logged in, go to "Email Services" -> "Add New Service" -> choose
//    Gmail -> connect the villanovajk@gmail.com account. This gives you a
//    SERVICE ID (looks like "service_abc1234").
// 3. Go to "Email Templates" -> "Create New Template". Design the email
//    however you like, using these variable placeholders in the template
//    body (double curly braces), which this app will fill in automatically:
//      {{reservation_ref}}   {{booking_type}}   {{villa_name}}
//      {{check_in}}          {{check_out}}      {{guests}}
//      {{guest_name}}        {{guest_email}}    {{guest_phone}}
//      {{special_requests}}  {{total_amount}}   {{owner_email}}
//    Set the template's "To Email" field to {{owner_email}}.
//    Save it — this gives you a TEMPLATE ID (looks like "template_xyz5678").
// 4. Go to "Account" -> "General" to find your PUBLIC KEY.
// 5. Paste all three values into the constants below.
//
// Until these are filled in, the site will still work perfectly for
// browsing and booking — it will just skip sending the notification email
// and log a note to the browser console instead of throwing an error.
// ============================================================================

export const emailConfig = {
  serviceId: "service_ujtcufs",
  templateId: "template_bq0kkod",
  publicKey: "d1pp35zf12EkV-3Ru", // Removed trailing space
  ownerEmail: "villanovajk@gmail.com",
};

export const isEmailConfigured = () => {
  const s = emailConfig.serviceId?.trim();
  const t = emailConfig.templateId?.trim();
  const p = emailConfig.publicKey?.trim();

  return (
    s && s !== "" && s !== "YOUR_EMAILJS_SERVICE_ID" &&
    t && t !== "" && t !== "YOUR_EMAILJS_TEMPLATE_ID" &&
    p && p !== "" && p !== "YOUR_EMAILJS_PUBLIC_KEY"
  );
};

