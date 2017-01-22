# ROUTER-INT (internal router) configuration file

These are change date and the version of JunOS running on the device.

	## Last changed: 2016-11-26 12:08:53 UTC
	version 12.1X47-D15.4;
	
This is the system hierarchy, where system services are configured.
	
	system {
	
Set the host name of the router to `router-ext.localnet`

		host-name router-ext.localnet;
		
This is the encrypted password for the root user.

		root-authentication {
			encrypted-password "$1$69YG1r9g$nwcifpgZqGt6YPT6uM5/x/"; ## SECRET-DATA
		}
		
Tell the router who does name resolution.

		name-server {
			192.168.1.2;
		}

Get the time from an NTP server in the DK pool.

		ntp {
			server 77.243.43.213;
		}

Enable SSH on all interfaces and access to the web management 
interface on ge-0/0/0.0

		services {
			ssh;
			web-management {
				http {
					interface ge-0/0/0.0;
					port 8001;
				}
			}
		}
		
Logging configuration.

		syslog {
		
Notify all users in case of an emergency!

			user * {
				any emergency;
			}
			
Log anything coming from anywhere, and specifically log authorization
info, at that level, to a file.

			file messages {
				any any;
				authorization info;
			}
			
Log everything typed in at the console (does this cover the web
interface?)

			file interactive-commands {
				interactive-commands any;
			}
		}
		
Where to get the licensing information?

		license {
			autoupdate {
				url https://ae1.juniper.net/junos/key_retrieval;
			}
		}
	}
	
Interface configuration.

	interfaces {
	
Configure interface ge-0/0/0 with a static IP of 10.1.0.1. This
interface is connected to the internal router network.

		ge-0/0/0 {
			unit 0 {
				family inet {
					address 10.1.0.1/24;
				}
			}
		}

Configure interface ge-0/0/1 with a static IP of 10.0.0.1. This
interface is connected to the DMZ network.

		ge-0/0/1 {
			unit 0 {
				family inet {
					address 10.0.0.1/24;
				}
			}
		}

Configure interface ge-0/0/2 to use DHCP. This interface is connected to
to VMWare NAT network.

		ge-0/0/2 {
			unit 0 {
				family inet {
					dhcp;
				}
			}
		}
	}
	
Setup static routes in the router to:

 * Send traffic destined for the DMZ network out on interface ge-0/0/1
 * Send traffic destined for the USRLAN network out on interface ge-0/0/0
 * Send traffic destined for the SRVLAN network out on interface ge-0/0/0
 * Send all other traffic out on interface ge-0/0/2

Here we go:

	routing-options {
		static {
			route 10.0.0.0/24 next-hop 10.0.0.1;
			route 192.168.0.0/24 next-hop 10.1.0.1;
			route 192.168.1.0/24 next-hop 10.1.0.1;
			route 0.0.0.0/0 next-hop 192.168.206.2;
		}
	}
	
Trying for OSPF.

	protocols {
		ospf {
			area 0.0.0.0 {
				interface ge-0/0/0.0;
				interface ge-0/0/1.0 {
					passive;
				}
			}
		}
	}
	
Security hierarchy-

	security {
	
Create a global address book with the IP of the web and DNS server so
they can be referenced by name.

		address-book {
			global {
				address webserver 10.0.0.2/32;
				address dnsserver 192.168.1.2/32;
			}
		}
		
A Screen is a Layer 3 or Layer 4 intrusion protection system (IPS).		
		
		screen {

Set up a screen for the untrusted zone.

			ids-option untrust-screen {
				icmp {
				
Block ping of death (an old overflow attack).

					ping-death;
				}
				ip {
				
Block any source route option, read all about it here [IP Source Route Options](http://www.juniper.net/techpubs/software/junos-es/junos-es92/junos-es-swconfig-security/ip-source-route-options.html)

					source-route-option;
					
Block tear drop attacks.	
					
					tear-drop;
				}
				tcp {
				
Deal with SYN flood/spoofing attacks.

					syn-flood {
					
Set the limit on SYN packages per second.

						source-threshold 1024;
						destination-threshold 2048;
						
SYN cookie attack protection.	
						
						alarm-threshold 1024;
						attack-threshold 200;
						queue-size 2000;
						timeout 20;
					}
					
Block another overflow attack from the 1990's.

					land;
				}
			}
		}
		
Network address translation setup.

		nat {
		
Destination NAT, changes the destination of a package.

			destination {
			
Create a IP pool for the destination, which is the web server on the
DMZ.
			
				pool webserver-ip {
					address {
						10.0.0.2/32;
					}
				}

Create a rule for traffic coming from the VMWare NAT network.

				rule-set outside-in-rs {
				
This stuff comes into the untrusted zone.
				
					from zone untrust;
					
Allow HTTP traffic to the web server by changing the destination,
address 192.168.206.3 on the VMWare NAT, to that of the web server on 
the DMZ.
					
					rule http-to-inside {
						match {
							source-address 0.0.0.0/0;
							destination-address 192.168.206.3/32;
							destination-port 80;
							protocol tcp;
						}
						then {
							destination-nat pool webserver-ip;
						}
					}
				}
			}
			
Source NAT. Changes the source IP address to make all internal
connections to the VMware NAT look like the come from the same IP
address.

			source {
				rule-set inside-out-trust-rs {
				
Traffic coming from the trusted zone that goes to the untrusted.

					from zone trust;
					to zone untrust;
					
Change the source address to that of the ge-0/0/2 interface.

					rule trust-to-outside-rule {
						match {
							source-address 0.0.0.0/0;
							destination-address 0.0.0.0/0;
						}
						then {
							source-nat {
								interface;
							}
						}
					}
				}
				rule-set inside-out-dmz-rs {
				
Traffic coming from the dmz zone that goes to the untrusted.
				
					from zone dmz;
					to zone untrust;
					
Change the source address to that of the ge-0/0/2 interface.

					rule dmz-to-outside-rule {
						match {
							source-address 0.0.0.0/0;
							destination-address 0.0.0.0/0;
						}
						then {
							source-nat {
								interface;
							}
						}
					}
				}
			}
			
Allow the router to respond to ARP requests for the IP address
192.168.206.3 on interface ge-0/0/2.0. This is used to make the
web server in the DMZ accessible on that address.

			proxy-arp {
				interface ge-0/0/2.0 {
					address {
						192.168.206.3/32;
					}
				}
			}
		}

Security policies.

		policies {
		
Allow traffic from the trusted zone to trusted zone.	
		
			from-zone trust to-zone trust {
				policy default-permit {
					match {
						source-address any;
						destination-address any;
						application any;
					}
					then {
						permit;
					}
				}
			}
			
Allow traffic from the trusted zone to DMZ zone.	

			from-zone trust to-zone dmz {
				policy default-permit {
					match {
						source-address any;
						destination-address any;
						application any;
					}
					then {
						permit;
					}
				}
			}
			
Allow traffic from the trusted zone to untrusted zone.

			from-zone trust to-zone untrust {
				policy default-permit {
					match {
						source-address any;
						destination-address any;
						application any;
					}
					then {
						permit;
					}
				}
			}

Deny traffic from the DMZ zone to trusted zone unless it is DNS traffic.	

			from-zone dmz to-zone trust {
				policy dns-permit {
					match {
						source-address any;
						destination-address dnsserver;
						application junos-dns-udp;
					}
					then {
						permit;
					}
				}
			}
			
Allow traffic from the DMZ zone to untrusted zone.

			from-zone dmz to-zone untrust {
				policy default-permit {
					match {
						source-address any;
						destination-address any;
						application any;
					}
					then {
						permit;
					}
				}
			}
			
Deny traffic from the untrusted zone to dmz zone unless it is HTTP/HTTPS
traffic.

			from-zone untrust to-zone dmz {
				policy webserver-permit {
					match {
						source-address any;
						destination-address webserver;
						application [ junos-http junos-https ];
					}
					then {
						permit;
					}
				}
			}
			
Deny traffic from the untrusted zone to trusted zone.	

			from-zone untrust to-zone trust {
				policy default-deny {
					match {
						source-address any;
						destination-address any;
						application any;
					}
					then {
						deny;
					}
				}
			}
			
Allow traffic from the untrusted zone to untrusted zone.	

			from-zone untrust to-zone untrust {
				policy default-permit {
					match {
						source-address any;
						destination-address any;
						application any;
					}
					then {
						permit;
					}
				}
			}
		}
		
Assign interfaces to zones.

Send a TCP segment with the RESET flag set, when a package arrives that
are not part of a session, and  the SYN flag is not set. See (What are TCP RST Packets?)[http://enterprise.netscout.com/content/what-are-tcp-rst-packets-protocol-expert]

		zones {
		
The interface connected to the internal router network is in the trusted
zone.

			security-zone trust {
				tcp-rst;
				interfaces {
					ge-0/0/0.0 {
						host-inbound-traffic {
							system-services {
								all;
							}
							protocols {
								all;
								ospf;
							}
						}
					}
				}
			}

The interface connected to the DMZ network is in the... dmz zone!

			security-zone dmz {
				tcp-rst;
				interfaces {
					ge-0/0/1.0 {
						host-inbound-traffic {
							system-services {
								all;
							}
							protocols {
								all;
								ospf;
							}
						}
					}
				}
			}
			
The interface connected to the VMWare NAT network is in the trusted
zone.
			
			security-zone untrust {
				tcp-rst;
				interfaces {
					ge-0/0/2.0 {
						host-inbound-traffic {
							system-services {
								all;
							}
							protocols {
								all;
							}
						}
					}
				}
			}
		}
	}
