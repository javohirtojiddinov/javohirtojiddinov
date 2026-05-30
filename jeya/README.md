# JEYA — O'zbek AI Yordamchi Platformasi

JEYA — o'zbek tilida ovozli va matnli muloqot qiluvchi, hujjat yarataydigan, fayllarni tahlil qiluvchi sun'iy intellekt platformasi.

## Texnologiyalar

### Frontend
- **Next.js 14** — React freymvork
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS** — Utility-first CSS
- **Zustand** — State management
- **Framer Motion** — Animatsiyalar
- **Axios** — HTTP klient
- **WebSocket** — Real-vaqt chat

### Backend
- **FastAPI** — Python veb freymvork
- **PostgreSQL** — Asosiy ma'lumotlar bazasi
- **SQLAlchemy (async)** — ORM
- **Alembic** — DB migratsiyalari
- **Redis** — Keshlash
- **MinIO** — Fayl saqlash (S3 protokoli)
- **Anthropic Claude** — AI modeli
- **OpenAI Whisper** — Ovozdan matn

## Demo rejimi (backendsiz, tezkor sinov)

Platformani **backend, ma'lumotlar bazasi yoki API kalitlarsiz** to'liq sinab ko'rish mumkin.
Demo rejimida JEYA mock (namunaviy) javoblar bilan ishlaydi.

```bash
cd frontend
npm install
npm run dev
# Brauzerda: http://localhost:3000
# Kirish sahifasida "🚀 Demo bilan kirish" tugmasini bosing
```

Demo rejimi standart holatda yoqilgan (`NEXT_PUBLIC_DEMO_MODE=true`).
Haqiqiy backend bilan ishlash uchun `.env.local` da `NEXT_PUBLIC_DEMO_MODE=false` qiling.

## Tez boshlash (Docker)

```bash
# 1. Repozitoriyani klonlash
git clone <repo-url>
cd jeya

# 2. .env faylini sozlash
cp .env.example .env
# .env faylini tahrirlang va API kalitlarini qo'shing

# 3. Barcha xizmatlarni ishga tushirish
docker compose up -d

# 4. Ma'lumotlar bazasi migratsiyalari
docker compose exec backend alembic upgrade head

# 5. Brauzerda ochish
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API docs: http://localhost:8000/docs
# MinIO console: http://localhost:9001
```

## Lokal rivojlantirish

### Backend

```bash
cd backend

# Virtual muhit yaratish
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Kutubxonalarni o'rnatish
pip install -r requirements.txt

# .env faylini sozlash
cp ../.env.example .env

# Ma'lumotlar bazasini ishga tushirish (Docker orqali)
docker compose up -d postgres redis minio

# Migratsiyalar
alembic upgrade head

# Serverni ishga tushirish
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Paketlarni o'rnatish
npm install

# .env.local faylini sozlash
cp .env.local.example .env.local

# Rivojlantirish serverini ishga tushirish
npm run dev
```

## Muhit o'zgaruvchilari

| O'zgaruvchi | Tavsif | Majburiy |
|---|---|---|
| `DATABASE_URL` | PostgreSQL ulanish URL | Ha |
| `REDIS_URL` | Redis ulanish URL | Ha |
| `SECRET_KEY` | JWT token imzolash kaliti | Ha |
| `ANTHROPIC_API_KEY` | Claude API kaliti | Ha |
| `OPENAI_API_KEY` | Whisper STT / TTS uchun | Ixtiyoriy |
| `S3_ENDPOINT` | MinIO/S3 endpoint | Ixtiyoriy |
| `MOHIR_AI_API_KEY` | Mohir.ai ovoz xizmati | Ixtiyoriy |

## Arxitektura

```
jeya/
├── frontend/                 # Next.js 14 ilovasi
│   └── src/
│       ├── app/              # App Router sahifalari
│       │   ├── page.tsx      # Bosh sahifa (landing)
│       │   ├── auth/         # Kirish / ro'yxatdan o'tish
│       │   └── dashboard/    # Dashboard sahifalari
│       ├── components/       # Qayta ishlatiladigan komponentlar
│       ├── store/            # Zustand state management
│       └── lib/              # API klient va yordamchilar
│
├── backend/                  # FastAPI ilovasi
│   └── app/
│       ├── api/v1/           # REST API va WebSocket endpointlar
│       ├── core/             # Konfiguratsiya, DB, xavfsizlik
│       ├── models/           # SQLAlchemy modellari
│       ├── schemas/          # Pydantic schemalar
│       ├── services/         # Biznes mantiq (LLM, fayllar, xotira)
│       └── dependencies/     # FastAPI dependency'lar
│
├── docker-compose.yml        # Barcha xizmatlar
└── .env.example              # Muhit o'zgaruvchilari namunasi
```

## API Hujjatlar

Backend ishga tushgandan keyin:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Asosiy imkoniyatlar

- **Matnli chat** — WebSocket orqali real-vaqt suhbat
- **Ovozli chat** — Mikrofon orqali gapirish, Whisper STT
- **Hujjat yaratish** — AI yordamida xat, hisobot, ariza va boshqalar
- **Fayl tahlili** — PDF, Word, rasm fayllarini yuklash va tahlil qilish
- **Shaxsiy xotira** — Muhim ma'lumotlarni saqlash va qidirish
- **JWT autentifikatsiya** — Xavfsiz foydalanuvchi tizimi
