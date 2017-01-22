# DNS Server
## Project Network

### Host names ###
All static IP addresses internal to the network, has been assigned a DNS names
on the local domain in `/etc/hosts` configuration file.

     IP     |           DNS name         |   Device
------------|----------------------------|------------
 10.7.10.2	|	server-dmz-web.localnet    | Web server
 10.7.30.2 	|	server-srvlan-dns.localnet | DNS/DHCP server
 10.7.10.1 	|	router-ext-dmz             | External router DMZ interface
 10.7.20.1 	|	router-ext-router-internal | External router interface on the internal router networḱ
 10.7.0.1		| router-ext-vmnet           |
 10.7.100.1 |	router-int-usrlan
 10.7.30.1 	|	router-int-srvlan
 10.7.20.2 	|	router-int-router-internal
 10.7.0.2	  | vmnet-gw
