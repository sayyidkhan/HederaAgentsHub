@echo off
REM Windows batch script to run Supabase migration

echo Loading environment variables...
if exist .env (
  for /f "usebackq tokens=*" %%a in (".env") do (
    set "%%a"
  )
)

if "%DATABASE_URL%"=="" (
  echo.
  echo ERROR: DATABASE_URL is not set
  echo Please set DATABASE_URL in your .env file
  pause
  exit /b 1
)

echo.
echo Running Supabase migration...
echo.

psql "%DATABASE_URL%" -f supabase-migration.sql

if %ERRORLEVEL% EQU 0 (
  echo.
  echo Migration completed successfully!
  echo The 'agents' table has been created in your Supabase database.
) else (
  echo.
  echo Migration failed. Please check the error messages above.
  pause
  exit /b 1
)

pause
