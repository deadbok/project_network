# Recovery Documentation
## Project network
**Version 0.9.3**

# 1 Introduction

This document describes the steps needed to create project network.
*It is assumed that you have a Windows 7/8/10 or a desktop Linux
distribution installed on the host machine as well as VMWare Workstation
12 Pro.*

The latest version of this document is available at:
[https://github.com/deadbok/project_network](https://github.com/deadbok/project_network)

Project web page:
[https://deadbok.github.io/project_network/](https://deadbok.github.io/project_network/)

# 2 Overview

This are the overall steps in recreating the system from scratch.
- Software sources
- Create virtual machines and install OSs if needed
- Define the interfaces on each machine and link them together
- Configure internal router
- Configure internal server for DHCP
- Configure the external router
- Configure the external server for HTTP services
- Configure internal machine for local DNS resolution

# 3 System Requirements

Based on the current status in recovery and testing stages, the following
hardware and software are a minimum requirement in order to run the
network. All mentioned software resources are pointing to official
manufacturer download locations and official Lillebaelt Academy
curriculum resources.

### 3.1 Hardware

- CPU: Dual-Core Processor with multi-threading and virtualisation.
- Memory: 8GB DDR3 Dual-Channel.
- Storage: 20GB HDD Free Space.

### 3.2 Software

**License Limited Software**
- Machine Virtualisation: [MWare Workstation 12 Pro](http://www.vmware.com/products/workstation/workstation-evaluation.html)

**Lillebaelt Academy Curriculum Resources**
- Network Routers: [JunOS SRX VMWare Virtual Machine OVF](https://fronter.com/eal/links/files.phtml/2080432588$548107012$/1st+Semester/Data+Communication/Software/junos-vsrx-12.1X47-D15.4-domestic.ovf)
- Network Routers: [JunOS SRX VMWare Virtual Machine VMDK](https://fronter.com/eal/links/files.phtml/2080432588$548107012$/1st+Semester/Data+Communication/Software/junos-vsrx-12.1X47-D15.4-domestic-disk1.vmdk)

**Open Source Software**
- Network Servers: [Ubuntu 16.04LTS Server Installer ISO](https://www.ubuntu.com/download/server/thank-you?version=16.04.1&architecture=amd64)
- Network Client: [Ubuntu 16.04LTS Desktop Installer ISO](https://www.ubuntu.com/download/desktop/contribute?version=16.04.1&architecture=amd64)

# 4 Creating The Virtual Machines And Install Their OSs

When creating the virtual machines do not bother with the network
configuration at this time.

## 4.1 CLIENT-USRLAN (Ubuntu 16.04LTS Desktop Client)

For the Ubuntu Desktop, but also for the Server versions use the VMWare
VM Typical settings, since it sets everything needed by default, even
the network interface to NAT, which is an essential feature needed in
the OS install and later software/service installation.
When setting up this machine in VMWare,
create a Typical custom machine (as shown in [Illustration 1](#illustration1)).

<a name="illustration1">
![Creating a Typical custom Virtual Machine](../images/vmware-typical-machine.png)
</a>
> Illustration 1: Creating a Typical custom virtual machine

Next select the downloaded Ubunto Desktop ISO as the operating system
source (as shown in [Illustration 2](#illustration2)).

<a name="illustration2">
![Selecting operating system source](../images/install-ubuntu-desktop.png)
</a>
> Illustration 2: Selecting operating system source

Setup will request adding a name for the machine, disk size, user and
password. By filling in the user information a less privileged user will
be created. When logged in as this user you can temporarily change to
the `root` account, which is the superuser of the system that has access
to all of the OS and hardware. Machine settings should resemble those in
[Illustration 3](#illustration3).

<a name="illustration3">
![VM Settings - CLIENT-USRLAN](../images/client-vm-settings.png)
</a>
> Illustration 3: VM Settings - CLIENT-USRLAN


## 4.2 SERVER-SRVLAN-DNS & SERVER-DMZ-WEB (Ubuntu 16.04LTS Server)

The Ubuntu Server Virtual Machines will follow the same steps as those
of creating the  [**CLIENT-USRLAN**](#illustration1), except using the
downloaded Ubuntu Server ISO as the operating system source
(as shown in [Illustration 5](#illustration5)).

<a name="illustration2">
![Selecting operating system source](../images/install-ubuntu-server.png)
</a>
> Illustration 5: Selecting operating system source

Settings for each server should resemble one of [Illustration 6](#illustration6)
or [Illustration 7](#illustration7).

<a name="illustration6">
![VM Settings - SERVER-SRVLAN-DNS](../images/dns-server-vm-settings.png)
</a>
> Illustration 6: VM Settings - SERVER-SRVLAN-DNS

<a name="illustration7">
![VM Settings - SERVER-DMZ-WEB](../images/web-server-vm-settings.png)
</a>
> Illustration 7: VM Settings - SERVER-DMZ-WEB

## 4.3 ROUTER-EXT & ROUTER-INT (JunOS vSRX 12.1)

Open the downloaded `junos-vsrx-12.1X47-D15.4-domestic.ovf` using the VMWare
file menu. Rename the machine “ROUTER-EXT”. Create a full clone of the
“ROUTER-EXT” machine and name that one “ROUTER-INT”. The JunOS operating system
is already installed on the image, there are no further OS installation steps for
these machines.

# 5 Configuring the virtual machines

The USRLAN-CLIENT client is connected to the internet to clone this
repository, the configuration files needed for the servers and routers
are then copied from USRLAN-CLIENT to the individual machines.

*You can switch the keyboard layout from the Ubuntu Desktop terminal by entering
the following command (which will set the layout to Danish):*

```bash
setxkbmap dk
```

# 5.1 Cloning the git repository to USRLAN-CLIENT

First start “terminal“ and install git to USRLAN-CLIENT as shown in
[Illustration 8](#illustration8).

```bash
  sudo apt install git
```

<a name="illustration8">
![Installing git in USRLAN-CLIENT](../images/install-client-git.png)
</a>
> Illustration 8: Installing git on USRLAN-CLIENT

then clone this repository onto the USRLAN-CLIENT and change in to the directory
where the repository was cloned as shown in
[Illustration 9](#illustration9).

```bash
  git clone https://github.com/deadbok/project_network
  cd project_network
```


<a name="illustration9">
![Cloning the project_network repository](../images/clone-client-git.png)
</a>
> Illustration 9: Installing git on USRLAN-CLIENT

## 5.2 Configuring the routers for SSH

The goal of these steps are to get the routers online on the NAT network,
temporarily, to copy the configuration files from the git repository now
present on USRLAN-CLIENT.

First the default network setup of the Virtual Machine is changed to allow
a connection to the same NAT network that USRLAN-CLIENT is connected to. The
default configuration is shown in [Illustration 10](#illustration10).

<a name="illustration10">
![Default router network configuration](../images/routers-initital-net.png)
</a>
> Illustration 10: Default router network configuration

Change the first network adapter to `NAT` ad disable the rest by unchecking
`Connect at power on` as shown in  [Illustration 11](#illustration11).

<a name="illustration11">
![VM configuration for router NAT access](../images/routers-nat-net.png)
</a>
> Illustration 11: VM configuration for router NAT access

The default login for the new routers are `root` and an empty password.

**These steps are to be carried out on both ROUTER-EXT and ROUTER-INT.**

```bash
#Enter the cli
cli

#Enter edit mode
edit

# Set the root password
set system root-authentication plain-text-password
New Password: type password here
Retype new password: retype password here

# Set the interface to DHCP
set interfaces ge-0/0/1 unit 0 family inet dhcp

# Delete the interface from the untrusted zone.
delete security zones security-zone untrust interfaces ge-0/0/1.0

# Put the interface in the trusted zone and allow all services
set security zones security-zone trust interfaces ge-0/0/1.0 host-inbound-traffic system-services all

# Allow all protocols
set security zones security-zone trust interfaces ge-0/0/1.0 host-inbound-traffic protocols  all

# Commit the changes
commit
```

To push the project configuration file to the router first find its IP address:


## 5.3 ROUTER-INT
To copy the configuration file onto the router when configured for SSH
access do like this:

```bash
scp router-int.conf root@172.16.189.133:~/.
```
Then on the router login and load the configuration:

```bash
# Enter the cli
cli

# Enter edit mode
edit

# Load the configuration that has just been copied to the
# router.
load override router-int.conf

# Commit the new configuration
commit
```
**When the configuration has been loaded the password will be `test12`**

## 5.4 ROUTER-EXT
To copy the configuration file onto the router when configured for SSH
access do like this:

```bash
scp router-ext.conf root@172.16.189.133:~/.
```

Then on the router login and load the configuration:

```bash
# Enter the cli
cli

# Enter edit mode
edit

# Load the configuration that has just been copied to the
# router.
load override router-ext.conf

# Commit the new configuration
commit
```
**When the configuration has been loaded the password will be `test12`**

## 5.5 SERVER-SRVLAN-DNS

* Copy the configuration files into the server
* Install dnsmasq
* Enable the dnsmasq service

Install dnsmasq on the virtual machine:

```bash
# Install dnsmasq
apt-get install dnsmasq

# Enable dnsmasq at boot
update-rc.d dnsmasq enable

# Start the service now
service dnsmasq start
```

Copy the configuration files from the host to the virtual machine:

```bash
scp -r server-srvlan-dns/* root@192.168.206.132:/.
```

## 5.6 SERVER-DMZ-WEB

 * Install Nginx
 * Enable the Nginx service

Install dnsmasq on the virtual machine:

```bash
# Install dnsmasq
apt-get install nginx

# Enable dnsmasq at boot
update-rc.d nginx enable

# Start the service now
service nginx start
```

Copy the default HTML page to the server.

```bash
scp -r server-dmz-web/* root@192.168.206.130:/.
```

## 5.7 Network setup

This configuration uses the WMWare LAN segment feature. The LAN segments
created in the first virtual machine area available to the rest as well.

Open the settings for the virtual machine and navigate to the LAN
segment settings as shown in [Illustration 12](#illustration12).

<a name="illustration12">
![Creating the LAN segments](../images/vmware-LAN-segments.png)
</a>
> Illustration 12: Creating the LAN segments

Set the interfaces of the virtual machines according to [Table 1](#table1):

<span name="table1">&nbsp;<span>

|    Machine name   |   Interface 1   | Interface 2 |   Interface 3   |  Interface 4  |
|-------------------|:---------------:|:-----------:|:---------------:|:-------------:|
| CLIENT-USRLAN     | USRLAN          |     *nc*    |      *nc*       |      *nc*     |
| ROUTER-INT        | USRLAN          |    SRVLAN   | Router internal |      *nc*     |
| ROUTER-EXT        | Router internal |     DMZ     |      *nc*       |      *nc*     |
| SERVER-SRVLAN-DNS | SRVLAN          |     *nc*    |      *nc*       |      *nc*     |
| SERVER-DMZ-WEB    | DMZ             |     *nc*    |      *nc*       |      *nc*     |

*nc*: not connected.

> Table 1: Virtual machine interface connections.
