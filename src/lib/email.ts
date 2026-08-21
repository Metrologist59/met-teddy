// src/lib/email.ts
// Transactional email for MET and Teddy, sent via Resend.
// © 2026 MET Scientia, LLC
//
// Independent of MetTutor: separate Resend account, separate
// RESEND_API_KEY, hand-written templates (no shared library, no
// shared "from" domain). See docs/separation-charter.md §2.3.
//
// Degrades gracefully when no real key is configured: logs a warning
// and returns instead of throwing, so local dev and CI builds don't
// require a live Resend account.

import { Resend } from "resend"

const FROM_NAME = "MET and Teddy"

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  // .env.local ships a 2-character placeholder — treat anything
  // implausibly short as "not configured" rather than attempting a
  // call that will fail with an opaque auth error.
  if (!key || key.length < 10) {
    console.warn("[email] RESEND_API_KEY not configured — skipping send.")
    return null
  }
  return new Resend(key)
}

function wrap(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#F8FAFA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFA;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#062C28;padding:28px 32px;">
                <span style="color:#F8FAFA;font-size:20px;font-weight:700;">MET</span>
                <span style="color:#2AB8AB;font-size:20px;font-weight:700;"> Universe</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#062C28;">
                <h1 style="margin:0 0 16px;font-size:20px;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#F0F5F4;color:#6B9E97;font-size:12px;">
                MET Universe — A MET Scientia Experience<br />
                © 2026 MET Scientia, LLC
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

type WelcomeRole = "parent" | "educator" | "student"

function welcomeBody(role: WelcomeRole, firstName: string): string {
  const greeting = `<p style="font-size:15px;line-height:1.6;">Hi ${firstName},</p>`

  const byRole: Record<WelcomeRole, string> = {
    parent: `
      <p style="font-size:15px;line-height:1.6;">
        Your account is confirmed and your parental consent is on file — you're
        all set. From your dashboard you can review what your child measures,
        adjust their certification level, or revoke consent at any time.
      </p>
      <p style="font-size:15px;line-height:1.6;">
        Every measurement tells a story. We're glad you and your family are
        here to find them.
      </p>`,
    educator: `
      <p style="font-size:15px;line-height:1.6;">
        Your educator account is ready. Add students by first name and grade
        from your dashboard, and MET and Teddy will meet each one at the
        right certification level automatically.
      </p>
      <p style="font-size:15px;line-height:1.6;">
        Every measurement tells a story — we're looking forward to helping
        your classroom find theirs.
      </p>`,
    student: `
      <p style="font-size:15px;line-height:1.6;">
        You're confirmed and ready to explore. Teddy's already looking for
        something to measure.
      </p>
      <p style="font-size:15px;line-height:1.6;">
        Every measurement tells a story — let's go find yours.
      </p>`,
  }

  return greeting + byRole[role]
}

export interface SendWelcomeEmailArgs {
  to: string
  firstName: string
  role: WelcomeRole
}

export async function sendWelcomeEmail({ to, firstName, role }: SendWelcomeEmailArgs): Promise<void> {
  const resend = getResendClient()
  if (!resend) return

  const from = process.env.RESEND_FROM_EMAIL
  if (!from) {
    console.warn("[email] RESEND_FROM_EMAIL not configured — skipping send.")
    return
  }

  const html = wrap("Welcome to MET Universe", welcomeBody(role, firstName))

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${from}>`,
    to,
    subject: "Welcome to MET and Teddy",
    html,
  })

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`)
  }
}
