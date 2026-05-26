># 📋 To-Do List Application - Mahalliy Xotira Ilova

Bu to'liq funktsional **To-Do List** dastur bo'lib, barcha vazifalar **Local Storage**da saqlanadi. Hech qanday server yoki internet ulanish kerak emas!

## 🎯 Xususiyatlari

### ✨ Asosiy Funksiyalar
- ✅ **Vazifalar Qo'shish** - Matnli tavsifi va prioriyeti bilan
- ✅ **Vazifalarni Tahrirish** - O'zgartirilgan matnlar
- ✅ **Vazifalarni Belgilash** - Tugatilgan/Faol holat
- ✅ **Vazifalarni O'chirish** - Alohida yoki ko'plab
- ✅ **Filtrlash** - Hammasi, Faol, Tugatilgan
- ✅ **Prioriyeti Kategoriyalash** - 🔴 Yuqori, 🟡 O'rta, 🟢 Kam

### 💾 Xotira Boshqaruvi
- 📱 **Local Storage** - Brauzer xotirasida saqlash
- 💾 **Avtomatik Saqlash** - Har bir o'zgarishda
- 📥 **JSON Eksport** - Backup olib olish
- 📤 **JSON Import** - Backup'dan qayta tiklash
- 🔄 **Qayta O'rnatish** - Barcha vazifalarni o'chirish

### 📊 Statistika va Tahlil
- 📈 **Jami Vazifalar** - Barcha vazifalar soni
- ⏳ **Faol Vazifalar** - Tugatilmagan vazifalar
- ✅ **Tugatilgan** - Yakunlangan vazifalar
- 📊 **Bajarilish %** - Progress bar

### 🎨 Interfeys
- 🌙 **Dark Mode** - Ko'z uchun yoqimli
- 📱 **Responsive Design** - Mobil, planshet, desktop
- ⚡ **Tez Qidiruv** - Filter orqali tez topish
- 🎯 **Intuativ Dizayn** - Foydalanish oson

## 🚀 Boshlanish

### Shartlar
- Zamonaviy brauzer (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- HTML5 va CSS3 qo'llashni bilish

### O'rnatish

```bash
# 1. Fayllarni yuklab olish
git clone <repository-url>
cd todo-app

# 2. Brauzerda ochish
open index.html
# yoki
firefox index.html
```

### Fayllar Tuzilishi
```
todo-app/
├── index.html         # HTML struktura
├── styles.css         # CSS stillar
├── app.js             # JavaScript logika
└── README.md          # Bu fayl
```

## 📖 Foydalanish

### Vazifa Qo'shish

```html
1. Matnni kiriting (masalan: "Bazardan bugalter sotib ol")
2. Prioriyetni tanlang (Kam, O'rta, Yuqori)
3. "Qo'shish" tugmasini bosing
4. Vazifa ro'yxatga qo'shiladi ✅
```

### Vazifalarni Filtrlash

```html
📋 HAMMASI     - Barcha vazifalar
⏳ FAOL        - Tugatilmagan vazifalar
✅ TUGATILGAN  - Yakunlangan vazifalar
```

### Vazifani Belgilash (Complete)

```html
1. Checkbox'ni bosing
2. Vazifa tugatilgan deb belgilanadi
3. Matn ustiga chiziq chiziladi
4. Statistika yangilanadi
```

### Vazifani Tahrirlash

```html
1. "✏️ Edit" tugmasini bosing
2. Yangi matnni kiriting
3. OK bosing
4. Vazifa yangilanadi ✏️
```

### Vazifani O'chirish

```html
1. "🗑️ Delete" tugmasini bosing
2. Vazifa o'chiriladi 🗑️
3. Statistika yangilanadi
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Amal |
|----------|------|
| `Ctrl/Cmd + N` | Yangi vazifa input'ga o'tish |
| `Ctrl/Cmd + E` | JSON'ga eksport qilish |
| `Ctrl/Cmd + L` | Tugatilganlarni tozalash |
| `Enter` | Input'dan vazifa qo'shish |

## 💾 Local Storage

### Storage Key
```javascript
localStorage.getItem('todos_data_local_storage');
```

### Storage Format
```json
[
  {
    "id": 1234567890,
    "text": "Bazardan bugalter sotib ol",
    "priority": "high",
    "completed": false,
    "createdAt": "26.05.2026 14:30:45",
    "completedAt": null
  },
  ...
]
```

### Storage Hajmi
- Chrome: ~10MB
- Firefox: ~10MB
- Safari: ~5MB
- Edge: ~10MB

## 📥 JSON Eksport

### Eksport Qilish

```javascript
1. "📥 JSON Qilip Yuborish" tugmasini bosing
2. `todos-backup-2026-05-26.json` fayl yuklab olinadi
3. Buni xavfsiz joyda saqlang
```

### Export Format
```json
[
  {
    "id": 1234567890,
    "text": "Vazifani bajarish",
    "priority": "high",
    "completed": false,
    "createdAt": "26.05.2026 14:30:45",
    "completedAt": null
  }
]
```

### Import Qilish

```javascript
1. "📤 JSON dan Yukla" tugmasini bosing
2. Saqlangan .json faylni tanlang
3. "Ochish" bosing
4. Vazifalar import qilinadi
```

## 🎨 Prioriyetlar

### 🔴 Yuqori Priority (High)
- Rang: Qizil
- Ahamiyat: Juda ko'p
- Badge: `🔴 Yuqori`

### 🟡 O'rta Priority (Medium) - DEFAULT
- Rang: Sariq
- Ahamiyat: O'rta
- Badge: `🟡 O'rta`

### 🟢 Kam Priority (Low)
- Rang: Yashil
- Ahamiyat: Kam
- Badge: `🟢 Kam`

## 📊 Statistika

### Jami Vazifalar
```
Barcha vazifalarning umumiy soni
(Tugatilgan + Faol)
```

### Faol Vazifalar
```
Hali bajarish kerak bo'lgan vazifalar
(completed = false)
```

### Tugatilgan Vazifalar
```
Yakunlangan vazifalar
(completed = true)
```

### Bajarilish %
```
Tugatilgan / Jami × 100
Masalan: 5 ta 10 ichidan = 50%
```

## 🛠️ Technical Details

### Texnologiyalar
- **HTML5** - Struktura va markup
- **CSS3** - Styling va animations
- **Vanilla JavaScript** - Murakkab logika
- **LocalStorage API** - Xotira boshqaruvi
- **FileReader API** - JSON import
- **Blob API** - JSON eksport

### Browser Support
| Browser | Support |
|---------|---------|
| Chrome | ✅ 90+ |
| Firefox | ✅ 88+ |
| Safari | ✅ 14+ |
| Edge | ✅ 90+ |
| Opera | ✅ 76+ |

## 🐛 Muammolarni Hal Qilish

### Muammo: Vazifalar saqlanmayapti

**Yechim:**
```javascript
1. LocalStorage enabled ekanligini tekshiring
2. Brauzer privatni mode'da qayta boshlang
3. Browser cache tozalang
4. Brauzer cookies qabulini tekshiring
```

### Muammo: JSON import qilayotganda xato

**Yechim:**
```javascript
1. JSON fayl formati to'g'ri ekanligini tekshiring
2. File size'ni tekshiring (10MB dan ko'p bo'lmasin)
3. Konvert qilingan faylni qayta-qayta boshlang
```

### Muammo: Mobile'da ishlayotganda juda sekin

**Yechim:**
```javascript
1. Brauzer cache tozalang
2. Brauzer memory'sini tekshiring
3. Boshqa tablarni yoping
4. Brauzer qayta boshlang
```

## 📈 Performance

### Optimization
- ⚡ Minimal DOM manipulation
- 🚀 Event delegation
- 💾 Efficient storage access
- 🎯 CSS animations (not JavaScript)

### Load Time
- **Initial Load**: < 100ms
- **Add Todo**: < 50ms
- **Filter**: < 30ms
- **Export**: < 500ms

## 🔐 Xavfsizlik

### Mahfiy Ma'lumotlar
- ✅ Local storage'da saqlanadi (server yo'q)
- ✅ Shaxsiy ma'lumotlar xeloslanmaydi
- ✅ HTTPS shart emas
- ✅ Internet ulanish kerak emas

### HTML Sanitization
```javascript
// XSS attacks'dan himoya
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
```

## 🎓 O'rganish Resurslari

### HTML Concepts
- Document Structure
- Form Elements
- Semantic HTML5

### CSS Concepts
- Flexbox & Grid Layout
- CSS Variables
- Animations & Transitions
- Media Queries
- Dark Mode

### JavaScript Concepts
- DOM Manipulation
- Event Handling
- Class Syntax
- LocalStorage API
- JSON Parsing
- Array Methods

## 🚀 Kelajakdagi Xususiyatlar

- [ ] Cloud sync (Firebase/Supabase)
- [ ] Reminder notifications
- [ ] Due dates
- [ ] Subtasks
- [ ] Categories/Tags
- [ ] Dark/Light mode toggle
- [ ] Multi-language support
- [ ] Collaborative todo lists
- [ ] Voice input
- [ ] Recurring tasks

## 📝 License

MIT License - Bepul foydalanish mumkin

## 👨‍💻 Muallif

**Javohir Tojiddinov**

## 🙏 Minnatdorlik

- Font Awesome (Icons)
- Google Fonts (Typography)
- Open Source Community

## 📞 Aloqa

- GitHub: [@javohirtojiddinov](https://github.com/javohirtojiddinov)
- Email: javohir@example.com

---

## 🎉 Tayyor!

**Yaratish uchun o'zingizni tayyor sezasizmi?**

```bash
# 1. Fayllarni yuklab olish
git clone <repository-url>

# 2. index.html ochish
open todo-app/index.html

# 3. Vazifalarni qo'shishni boshlang!
# 4. Local Storage'da avtomatik saqlanyapti 💾
```

**Mummukin bo'lgan barcha vazifalarni tugatish uchun omad tilaymiz! 🚀✨**

---

**Versiya:** 1.0.0  
**Oxirgi yangilanish:** 26.05.2026  
**Holat:** ✅ Production Ready
