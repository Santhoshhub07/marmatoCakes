@echo off
echo Starting Marmato Cakes Application...

echo Starting Server...
start cmd /k "cd Server && npm start"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Starting Client...
start cmd /k "cd client && npm run dev"

echo Both server and client are now running!
echo Server: http://localhost:3000
echo Client: http://localhost:5173

echo Press any key to stop both applications...
pause > nul

echo Stopping applications...
taskkill /f /im node.exe > nul 2>&1

echo Done!
