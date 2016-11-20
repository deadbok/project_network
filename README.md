# 1. Introduction

Our design is two routers an internal and external one, three subnets DMZ, SRVLAN and
URSLAN. We set up two servers a web server running debian, a dns server, and a client
running Ubuntu. The goal of this is to have a functional network where we can access our
servers from our virtual desktop.

# 2. Overview

### Level 2 Diagram

![Level 2 Diagram](http://i.imgur.com/j6iZkeJ.png)

### Level 3 Diagram

![Level 3 Diagram](http://i.imgur.com/ynyXPjv.png)

# 3. Performance

We are doing everything very lowkey and simple therefore there will be somewhat of a latency between
the desktop and the servers. Everything is running thru virtual machines in VMWARE, and therefore we
assign each device its own amount of both gb and rams no device reaching over 2 gb and over 512 gb ram

# 4. Hardware

There is no hardware because everything is running virtually.

# 5. Protocols and Standards

we are using these protocols DNS, HTTP, TCP, IP. With DNS being the most unknown of the
4, DNS (Domain Name System) which we are using on one of our servers. DNS basically
translates a name to an IP address if for example I want to access www.google.com I type in
the name www.google.com I could also have typed in its IP address 208.80.152.2 so what the
DNS does I that when I enter www.google.com it translates it to the correct IP address
208.80.152.2 and sends you to the website.

# 6. IP Layout

![IP Layout](http://i.imgur.com/C0ff6Vy.png)

# 7. Naming Convention

Naming convention is used by first defining the device type then what network it is on and last
what service it uses.
ROUTER-EXT, ROUTER-INT, SERVER-DMZ-WEB, SERVER-SRVLAN-DNS, CLIENT-
URSLAN

# 8. Directory Layout

 * `recovery`: Contains the recovery documentation
 * `images`: Contains pictures for the documentation
 * `*-etc`: Contains configuration files for a virtual machine

