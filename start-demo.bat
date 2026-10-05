@echo off
rem Double-click to run the Propel Trucking demo. Opens http://localhost:5173
rem Uses the portable Node install in C:\Users\mdc\dev\tools\node (no admin rights needed).
set PATH=C:\Users\mdc\dev\tools\node;%PATH%
cd /d "%~dp0"
start "" http://localhost:5173
npm run dev
