# OrderIn — SmartOrder (Frontend)

Frontend for OrderIn SmartOrder built with Next.js + Tailwind.

Live demo: https://orderin-smart-order-fe.vercel.app/

---

## ✅ Demo access (test accounts)
- Email: `pelayan@orderin.com` — Password: `(password)`
- Email: `pelayan2@orderin.com` — Password: `(password)`
- Email: `kasir@orderin.com` — Password: `(password)`

> Gunakan akun di atas untuk mencoba fitur utama (pesanan, pembayaran, dll.) pada demo.

---

## 🚀 Local setup (frontend)
1. Clone repository

   git clone <repo-url>
   cd orderin-smartorder-fe

2. Install dependencies

   pnpm install

3. (Optional) Set API base URL

   - Default: `http://127.0.0.1:8000/api/v1`
   - To override: set `NEXT_PUBLIC_API_URL` in your environment

4. Run development server

   pnpm dev

   Open http://localhost:3000

---

## 🔧 Build / Production

pnpm build
pnpm start

---

## 📌 Important notes (what I changed)
- ✅ Login button now shows a loading state while authentication is in progress.
- ✅ Login forms disable inputs while submitting to prevent duplicate requests.
- ✅ Dashboard navbar improved for small screens (compact user controls & responsive search width).

If you'd like the navbar behavior adjusted further (e.g. add profile dropdown, avatar), tell me what you prefer.

---

## 🛠 Environment & troubleshooting
- API base URL: `NEXT_PUBLIC_API_URL` (fallback to `http://127.0.0.1:8000/api/v1`)
- If login fails, check browser console / network tab for API errors.

---

## 📚 Resources
- Next.js: https://nextjs.org
- Tailwind CSS: https://tailwindcss.com

---