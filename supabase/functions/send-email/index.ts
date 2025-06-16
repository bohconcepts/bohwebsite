// // Follow this setup guide to integrate the Deno runtime into your Supabase project:
// // https://supabase.com/docs/guides/functions/deno-runtime

// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// // Get environment variables
// const SMTP_HOST = Deno.env.get("SMTP_HOST") || "";
// const SMTP_PORT = Number(Deno.env.get("SMTP_PORT")) || 587;
// const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME") || "";
// const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD") || "";
// const DEFAULT_FROM_EMAIL = Deno.env.get("DEFAULT_FROM_EMAIL") || "noreply@bohconcepts.com";

// interface EmailRequest {
//   to: string;
//   subject: string;
//   html: string;
//   from?: string;
// }

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       },
//       status: 204,
//     });
//   }

//   try {
//     // Only allow POST requests
//     if (req.method !== "POST") {
//       return new Response(JSON.stringify({ error: "Method not allowed" }), {
//         headers: { "Content-Type": "application/json" },
//         status: 405,
//       });
//     }

//     // Parse request body
//     const { to, subject, html, from } = await req.json() as EmailRequest;

//     // Validate required fields
//     if (!to || !subject || !html) {
//       return new Response(
//         JSON.stringify({ error: "Missing required fields: to, subject, html" }),
//         {
//           headers: { "Content-Type": "application/json" },
//           status: 400,
//         }
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(to)) {
//       return new Response(
//         JSON.stringify({ error: "Invalid recipient email format" }),
//         {
//           headers: { "Content-Type": "application/json" },
//           status: 400,
//         }
//       );
//     }

//     // Check if SMTP credentials are configured
//     if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD) {
//       console.error("SMTP credentials not configured");
//       return new Response(
//         JSON.stringify({ error: "Email service not configured" }),
//         {
//           headers: { "Content-Type": "application/json" },
//           status: 500,
//         }
//       );
//     }

//     // Configure SMTP client
//     const client = new SmtpClient();
//     await client.connectTLS({
//       hostname: SMTP_HOST,
//       port: SMTP_PORT,
//       username: SMTP_USERNAME,
//       password: SMTP_PASSWORD,
//     });

//     // Send email
//     await client.send({
//       from: from || DEFAULT_FROM_EMAIL,
//       to,
//       subject,
//       content: html,
//       html,
//     });

//     await client.close();

//     return new Response(
//       JSON.stringify({ success: true, message: "Email sent successfully" }),
//       {
//         headers: { "Content-Type": "application/json" },
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return new Response(
//       JSON.stringify({ error: error.message || "Failed to send email" }),
//       {
//         headers: { "Content-Type": "application/json" },
//         status: 500,
//       }
//     );
//   }
// });
