@echo off
chcp 65001 > nul
cd /d "%~dp0"
npx tsx scripts/start-bot-polling.ts
pause
