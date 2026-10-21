@echo off
cd /d "%~dp0"
where node >nul 2>&1
if %errorlevel%==0 goto node
where py >nul 2>&1
if %errorlevel%==0 goto python
where python >nul 2>&1
if %errorlevel%==0 goto pythonfallback
echo Instale Node.js 22.12 ou superior, ou Python 3, e execute novamente.
pause
exit /b 1
:node
start "JOCA" http://127.0.0.1:8000
node server.mjs
goto end
:python
start "JOCA" http://127.0.0.1:8000
py -3 -m http.server 8000 --bind 127.0.0.1 --directory dist
goto end
:pythonfallback
start "JOCA" http://127.0.0.1:8000
python -m http.server 8000 --bind 127.0.0.1 --directory dist
:end
pause
