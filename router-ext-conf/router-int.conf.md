# ROUTER-INT (internal router) configuration file

These are change date and the version of JunOS running on the device.

	## Last changed: 2016-11-23 09:07:50 UTC
	version 12.1X47-D15.4;


This is the system heriachy, were system services are configured.

	system {


Set the host name of the router to `router-int.localnet`


		host-name router-int.localnet;


This is the encrypted password for the root user.

		root-authentication {
			encrypted-password "$1$YuOGoXYZ$xjxvjZyndl23h26.i4aKR0"; ## SECRET-DATA
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
				}
			}
		}

Logging configuration .

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
		
Where to get the licensecing information?

		license {
			autoupdate {
				url https://ae1.juniper.net/junos/key_retrieval;
			}
		}
	}

Interface configuration

	interfaces {

Configure interface ge-0/0/0 with a static IP of 192.168.0.1. This
interface is connected to the USRLAN network.

		ge-0/0/0 {
			unit 0 {
				family inet {
					address 192.168.0.1/24;
				}
			}
		}

Configure interface ge-0/0/1 with a static IP of 192.168.1.1. This
interface is connected to the SRVLAN network.

		ge-0/0/1 {
			unit 0 {
				family inet {
					address 192.168.1.1/24;
				}
			}
		}

Configure interface ge-0/0/2 with a static IP of 10.1.0.2. This
interface is connected to the internal router network.

		ge-0/0/2 {
			unit 0 {
				family inet {
					address 10.1.0.2/24;
				}
			}
		}

Configure interface ge-0/0/3 for DHCP. This interface is usually
disabled in the virtual machine, but is sometimes used to push
configuration files from the outside world via the WMware NAT network.

		ge-0/0/3 {
			unit 0 {
				family inet {
					dhcp;
				}
			}
		}
	}

Configure this router as DHCP relay forwarding packages to
SERVER-SRVLAN-DNS (192.168.1.2).

	forwarding-options {
		helpers {
			bootp {
				server 192.168.1.2;
				maximum-hop-count 4;
				interface {
					ge-0/0/0;
				}
			}
		}
	}
	
Setup static routes in the router to:

 * Send traffic destined for the USRLAN network out on interface ge-0/0/0
 * Send traffic destined for the SRVLAN network out on interface ge-0/0/1
 * Send traffic destined for the ROUTER-EXT out on interface ge-0/0/2
 * Send traffic destined for the DMZ network out on interface ge-0/0/2
 * Send all other traffic out on interface ge-0/0/2

Here we go:

	routing-options {
		router-id 10.1.0.2;
		static {
			route 192.168.0.0/24 next-hop 192.168.0.1;
			route 192.168.1.0/24 next-hop 192.168.1.1;
			route 10.1.0.0/24 next-hop 10.1.0.2;
			route 10.0.0.0/24 next-hop 10.1.0.1;
			route 0.0.0.0/0 next-hop 10.1.0.1;
		}
	}
	
Trying for OSPF.

	protocols {
		ospf {
			area 0.0.0.0 {
				interface ge-0/0/0.0 {
					passive;
				}
				interface ge-0/0/1.0 {
					passive;
				}
				interface ge-0/0/2.0;
			}
		}
	}
	
Security hierarchy

	security {

A Screen is a Layer 3 or Layer 4 intrusion protection system (IPS).

		screen {
		
Set up a screen for the untrusted zone.

			ids-option untrust-screen {
			
Block ping of death (an old overflow attack).

				icmp {
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
					
Set the limit of SYN packages per second.
					
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
			
Allow traffic from the trust zone to untrusted zone.
			
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
		}
		
Assign interfaces to zone.
		
		zones {
		
Trusted zone.

			security-zone trust {
			
Send a TCP segment with the RESET flag set, when a package arrives that
are not part of a session, and  the SYN flag is not set. See (What are TCP RST Packets?)[http://enterprise.netscout.com/content/what-are-tcp-rst-packets-protocol-expert]

				tcp-rst;

All interfaces are in the trusted zone.

				interfaces {
					ge-0/0/0.0 {
						host-inbound-traffic {
							system-services {
								all;
								dhcp;
							}
							protocols {
								all;
								ospf;
							}
						}
					}
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
					ge-0/0/2.0 {
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
					ge-0/0/3.0 {
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
			security-zone untrust {
				screen untrust-screen;
			}
		}
	}

