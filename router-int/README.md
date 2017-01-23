# Internal Router
## Project Network

### Basic functions

The internal router has the following connections

 * `ge-0/0/0`: USRLAN network.
 * `ge-0/0/1`: SRVLAN network.
 * `ge-0/0/2`: Internal router network.
 * `ge-0/0/3`: Unconnected backup DHCP configured interface.

```
interfaces {
    ge-0/0/0 {
        unit 0 {
            family inet {
                address 10.7.100.1/24;
            }
        }
    }
    ge-0/0/1 {
        unit 0 {
            family inet {
                address 10.7.30.1/24;
            }
        }
    }
    ge-0/0/2 {
        unit 0 {
            family inet {
                address 10.7.20.2/24;
            }
        }
    }
    ge-0/0/3 {
        unit 0 {
            family inet {
                dhcp;
            }
        }
    }
}
```

Both static and OSPF is set up to route between these networks.

```
routing-options {
    static {
        route 10.7.100.0/24 next-hop 10.7.100.1;
        route 10.7.30.0/24 next-hop 10.7.30.1;
        route 10.7.20.0/24 next-hop 10.7.20.2;
        route 10.7.10.0/24 next-hop 10.7.20.1;
        route 0.0.0.0/0 next-hop 10.7.20.1;
    }
    router-id 10.7.20.2;
}
protocols {
    ospf {
        export exportstatic;
        area 0.0.0.0 {
            area-range 10.7.0.0/16;
            interface ge-0/0/0.0;
            interface ge-0/0/1.0;
            interface ge-0/0/2.0;
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

### DHCP request from USRLAN

The internal router is configured to pass any DHCP request, coming from the
USRLAN network on to SERVER-SRVLAN-DNS.

```
forwarding-options {
    helpers {
        bootp {
            server 10.7.30.2;
            maximum-hop-count 4;
            interface {
                ge-0/0/0;
            }
        }
    }
}
```
### Configuring file

The whole configuration file is here: [https://github.com/deadbok/project_network/blob/master/router-int/conf/router-int.conf](https://github.com/deadbok/project_network/blob/master/router-int/conf/router-int.conf)
