sudo git pull
sudo systemctl stop kestrel-reforma.service
sudo dotnet publish -c Release -r debian.8-x64
sudo systemctl start kestrel-reforma.service
