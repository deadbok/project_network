# DNS Server
## Project Network

The DNS server uses dnsmasq ([http://www.thekelleys.org.uk/dnsmasq/doc.html](http://www.thekelleys.org.uk/dnsmasq/doc.html)) to provide DNS services to the rest of the network, and DHCP services to the USRLAN
network.

dnsmasq acts as a DNS middle man, answering local and cached DNS request but
sending everything else along to (in this case) Googles DNS servers.

### dnsmasq.conf settings

* `domain-needed`: Never forward requests without a domain part.
* `bogus-priv`: Never forward addresses in the non-routed address spaces.
* `local=/network.tools/`: Set "network.tools" as a local only domain.
* `server=8.8.8.8`: Use Google as upstream DNS server.
* `interface=ens33`: Listen on the "wired" interface.
* `expand-hosts`: Add local domain to hosts from the `/etc/hosts` file.
* `domain=network.tools`: Our domain is "network.tools".
* `dhcp-range=10.7.100.50,10.7.100.150,255.255.255.0,12h`: DHCP address pool, lease lasts 12 hours.
* `dhcp-option=option:router,10.7.100.1`: Set the default gateway send by DHCP to the internal router.
* `dhcp-option=option:dns-server,10.7.30.2`: Set ourselves as DNS ser via DHCP.

### Host names
All static internal hosts on all IP addresses, has been assigned a DNS name on the local domain in the
`/etc/hosts` configuration file.

|     IP     |           DNS name         |   Device                                                   |
|-----------:|:--------------------------:|------------------------------------------------------------|
| 10.7.0.2	 | vmnet-gw                   | VMWares gateway when using the testing NAT                 |
| 10.7.0.3	 | router-ext-world           | External router world connected interface                  |
| 10.7.0.4   | server-world-web           | Web server connection to the world.                        |
| 10.7.10.1  | router-ext-dmz             | External router interface on the DMZ network               |
| 10.7.10.2	 | server-dmz-web.localnet    | Web server                                                 |
| 10.7.30.1  | router-int-srvlan          | Internal router interface on the SRVLAN network            |
| 10.7.30.2  | server-srvlan-dns.localnet | DNS/DHCP server                                            |
| 10.7.20.1  | router-ext-router-internal | External router interface on the internal router networḱ   |
| 10.7.20.2  | router-int-router-internal | Internal router interface on the internal router network   |
| 10.7.100.1 | router-int-usrlan          | Internal router interface on the USRLAN network            |
