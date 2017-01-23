# External Router
## Project Network

### Basic functions

The external router has the following connections

 * `ge-0/0/0`: Internal router network.
 * `ge-0/0/1`: DMZ network.
 * `ge-0/0/2`: Connection to the outside world.

```
interfaces {
    ge-0/0/0 {
        unit 0 {
            family inet {
                address 10.7.20.1/24;
            }
        }
    }
    ge-0/0/1 {
        unit 0 {
            family inet {
                address 10.7.10.1/24;
            }
        }
    }
    ge-0/0/2 {
        unit 0 {
            family inet {
                address 10.7.0.3/24;
            }
        }
    }
}
```

Both static and OSPF is set up to route between these networks.

```
routing-options {
    static {
        route 10.7.10.0/24 next-hop 10.7.10.1;
        route 10.7.30.0/24 next-hop 10.7.20.1;
        route 10.7.100.0/24 next-hop 10.7.20.1;
        route 10.7.20.0/24 next-hop 10.7.20.1;
        route 10.7.0.0/24 next-hop 10.7.0.3;
        route 0.0.0.0/0 next-hop 10.7.0.2;
    }
}
protocols {
    ospf {
        area 0.0.0.0 {
            area-range 10.7.0.0/16;
            network-summary-export exportstatic;
            interface ge-0/0/0.0;
            interface ge-0/0/1.0 {
                passive;
            }
        }
    }
}
policy-options {
    policy-statement exportstatic {
        term exportstatic {
            from protocol static;
            then accept;
        }
    }
}
```

### NAT

The external router is set up to deliver internet access to the inside using source NAT. It exposes
the internal webserver at IP address 10.7.10.2 to the world on ge-0/0/2 with the IP address 10.7.0.4,
using destination NAT and proxy arp.

```
security {
    address-book {
        global {
            address webserver 10.7.10.2/32;
            address dnsserver 10.7.30.2/32;
        }
    }
    nat {
        source {
            rule-set inside-out-trust-rs {
                from zone trust;
                to zone untrust;
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
                from zone dmz;
                to zone untrust;
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
        destination {
            pool webserver-ip {
                routing-instance {
                    default;
                }
                address 10.7.10.2/32 port 80;
            }
            rule-set outside-in-rs {
                from zone untrust;
                rule http-to-inside {
                    match {
                        source-address 0.0.0.0/0;
                        destination-address 10.7.0.4/32;
                        destination-port {
                            80;
                        }
                        protocol tcp;
                    }
                    then {
                        destination-nat {
                            pool {
                                webserver-ip;
                            }
                        }
                    }
                }
            }
        }
        proxy-arp {
            interface ge-0/0/2.0 {
                address {
                    10.7.0.4/32;
                }
            }
        }
    }
}
```
### Configuring file

The whole configuration file is here: [https://github.com/deadbok/project_network/blob/master/router-ext/conf/router-ext.conf](https://github.com/deadbok/project_network/blob/master/router-ext/conf/router-ext.conf)
