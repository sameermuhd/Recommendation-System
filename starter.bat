@echo off

REM Start Flask Backend Server
start cmd /k "cd .\Backend && python app.py"

REM Start React Frontend App
start cmd /k "cd .\Frontend\reco-system && npm run dev"
