$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
invoke-expression 'cmd /c start powershell -NoExit -Command {
    $ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path;
    cd server;
    node server.js;
    }';
cd chat-app
Write-Host "Current script directory is $ScriptDir"
npm start
Read-Host -Prompt "Press Enter to exit"
