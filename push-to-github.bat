@echo off
echo ============================================
echo  Breed Industries — Git Push to GitHub
echo ============================================
echo.

cd /d "C:\Users\newbr\Documents\Web Apps\Breed Industries Web App"

echo [1/4] Setting remote origin...
git remote set-url origin https://github.com/newbreedr-del/Breed-Industries.git 2>nul || git remote add origin https://github.com/newbreedr-del/Breed-Industries.git
echo.

echo [2/4] Staging changed files...
git add src/components/QuoteGenerator.tsx
git add src/app/build-package/page.tsx
git add src/app/services/page.tsx
git add src/app/tender-services/page.tsx
git add "src/app/admin/tender-clients/[id]/page.tsx"
git add src/app/admin/tender-clients/page.tsx
git add src/lib/tenderScraper.ts
git add src/app/api/admin/run-scrape/route.ts
git add src/lib/pdf/breedPdf.ts
git add src/app/api/invoices/route.ts
echo.

echo [3/4] Committing (skips if already committed)...
git commit -m "feat: tiered pricing, AI packages, scraper rewrite, fix PDF layout 5+ items, fix invoice monthly total bug"
echo.

echo [4/4] Pushing deploy/full-app branch...
git push -u origin deploy/full-app

echo.
echo ============================================
echo  Done! Check above for any errors.
echo ============================================
pause
