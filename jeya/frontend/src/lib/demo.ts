// JEYA demo rejimi — backend (FastAPI, API kalitlar) bo'lmaganda
// platformani to'liq sinab ko'rish imkonini beradi.

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'false' ? false : true

export const DEMO_USER = {
  id: 'demo-user',
  full_name: 'Demo Foydalanuvchi',
  email: 'demo@jeya.uz',
  language: 'uz',
}

export const DEMO_TOKEN = 'demo-token'

// Demo rejimida JEYA javoblarini imitatsiya qiladi (oqim bilan).
export function demoReply(prompt: string): string {
  const p = prompt.toLowerCase()

  if (p.includes('salom') || p.includes('assalom') || p.includes('hi')) {
    return 'Assalomu alaykum! Men JEYA — sizning shaxsiy AI operatoringizman. Sizga qanday yordam bera olaman? Hujjat tayyorlash, fayl tahlil qilish yoki savollaringizga javob berishim mumkin.'
  }
  if (p.includes('hujjat') || p.includes('ariza') || p.includes('xat')) {
    return 'Albatta! Men siz uchun rasmiy xat, ariza, hisobot yoki rezyume tayyorlay olaman. Iltimos, hujjat turini va asosiy ma\'lumotlarni ayting — men tayyor namunani shakllantiraman.'
  }
  if (p.includes('kim') || p.includes('jeya') || p.includes('nima qila')) {
    return 'Men JEYA — Windows 11 va web uchun yaratilgan aqlli AI operator va shaxsiy yordamchiman. Men ovozli va matnli muloqot qila olaman, hujjatlar yarataman, fayllarni tahlil qilaman va muhim ma\'lumotlaringizni eslab qolaman.'
  }
  if (p.includes('fayl') || p.includes('tahlil')) {
    return 'Fayllaringizni "Fayllar" bo\'limiga yuklang — men PDF, Word va matnli hujjatlarni o\'qib, ularning mazmunini tahlil qilib beraman.'
  }
  return `Tushunarli. Siz "${prompt}" haqida so\'radingiz. Bu demo rejimi — to\'liq imkoniyatlar uchun backend (Claude API) ulanishi kerak. Lekin interfeys va barcha funksiyalar shu yerda namoyish etilgan.`
}

// Demo uchun namunaviy suhbatlar
export const DEMO_CONVERSATIONS = [
  { id: 'demo-1', title: 'JEYA bilan tanishuv', created_at: new Date().toISOString(), message_count: 2 },
  { id: 'demo-2', title: 'Ariza tayyorlash', created_at: new Date(Date.now() - 86400000).toISOString(), message_count: 4 },
]
