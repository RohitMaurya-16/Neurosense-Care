@echo off

rem Always run relative to this .bat folder (fixes wrong cwd when launched from explorer)
cd /d "%~dp0"

cd backend

if not exist "venv\Scripts\activate.bat" (
  echo Creating virtual environment...
  python -m venv venv 2>nul
  if errorlevel 1 py -3 -m venv venv
  if errorlevel 1 (
    echo Could not create venv: install Python from https://www.python.org and/or use "py -3".
    pause
    exit /b 1
  )
)

call venv\Scripts\activate.bat

echo Ensuring packages from requirements.txt are installed...
python -m pip install --upgrade pip -q
python -m pip install -r requirements.txt

echo Starting Neurosense Care...
python app.py

pause
