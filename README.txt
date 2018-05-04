To open port throught FW
-  sudo /sbin/iptables -I INPUT -p tcp --destination-port 3000 -j ACCEPT
