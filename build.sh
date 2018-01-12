sudo git pull
sudo systemctl stop kestrel-reforma.service
sudo dotnet publish -c Release
sudo systemctl start kestrel-reforma.service
