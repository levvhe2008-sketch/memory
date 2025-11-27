# Memory AI — Starter

Это стартовый проект Vite + React + Tailwind для Memory AI (MVP).

Как запустить:
1. Установите зависимости: `npm install`
2. Запустите dev: `npm run dev`

В проект включены базовые страницы: Home, Dashboard, AlbumPage, и SQL миграция.

## Деплой (Vercel + Supabase) — быстрые шаги

1. Создайте проект в Supabase (https://app.supabase.com) и сохраните `SUPABASE_URL` и `SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE`.
2. В Supabase: создайте storage bucket `media` и примените SQL миграцию `infra/001_create_tables.sql` (через SQL Editor → Run).
3. Создайте репозиторий на GitHub и отправьте код в `main` ветку.
4. На Vercel: импортируйте репозиторий и добавьте следующие Environment Variables в Settings → Environment Variables:
   - SUPABASE_URL = <ваш SUPABASE_URL>
   - SUPABASE_ANON_KEY = <ANON KEY>
   - SUPABASE_SERVICE_ROLE = <SERVICE ROLE KEY>
5. В Vercel включите Deployment и дождитесь успешного билда.
6. Для загрузок используйте `api/upload-url` для получения signed URL, загружайте файл напрямую на Supabase Storage, затем вызовите `api/create-media` с информацией о загруженном файле для создания записи в БД.

## CI

В репозитории уже есть workflow `.github/workflows/ci.yml`, который запускает `npm ci`, unit тесты (Vitest), E2E (Playwright) и билд.
