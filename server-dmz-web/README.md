# Web Server
## Project Network

![Simplified HTTP Request](../images/network-diagram-http.png)

# 1. Software
In order to build the web server, we need to install a HTTP server on the VM.
There are a lot of Open Source HTTP server software packages from which we can
choose. We settled on NGINX.

For version control and file sharing we use Git. Another software package
that we need to install.

## 1.1 Nginx

Install Nginx using `apt-get install`.

```bash
sudo apt-get install nginx
```

## 1.2 Git

Install Git and clone the GitHub Repository with all project files.

```bash
# Install Git
sudo apt-get install git

# Clone GitHub Repo
git clone https://git@github.com/deadbok/project_network.git
```

# 2. Server Configuration and Website Files

- Nginx Server Blocks:`project_network/server-dmz-web/etc/nginx/sites-available/network.tools`
- Network Interfaces: `project_network/server-dmz-web/etc/network/interfaces`
- Website Folder: `project_network/server-dmz-web/var/www/network.tools/`

> Global Path Example: /home/%user%/project_network/server-dmz-web/...

## 2.1 Copy Server Files

Create a Symbolic Link for the website folder, to easily manage all files.
```bash
# Create Folder Symbolic Link
sudo ls -sr project_network/server-dmz-web/var/www/network.tools /var/www/network.tools
```
This will make sure that all files and folders from `/var/www/network.tools`
(NGINX Server Block Root Folder) will be a direct reflection of
`project_network/server-dmz-web/var/www/network.tools`(GitHub Repository Folder).

Copy NGINX Server Block configuration file from GitHub folder to NGINX
`sites-available` folder.
```bash
# Copy Nginx Server Block
sudo cp project_network/server-dmz-web/etc/nginx/sites-available/network.tools /etc/nginx/sites-available/
```

To enable the site (Server Block), we need to copy the server block
configuration file to `sites-available` folder.
In order to make sure we don't need to do that again if we change any of the
two configuration files, instead of copying the file, we create a symbolic link.
```bash
# Enable Server Block by symbolic link to 'sites-enabled' directory
sudo ln -s /etc/nginx/sites-available/network.tools /etc/nginx/sites-enabled/
```

## 2.2 Clean-up, Optional User Permission.

Since we defined the default server block to be `network.tools` (A valid domain
name, but only used for project testing - We do not have ownership of domain),
we need to remove the NGINX `default` server block.
```bash
# Remove Default Server Block
sudo rm /etc/nginx/sites-available/default
# Default Server Block Symbolic Link
sudo rm /etc/nginx/sites-enabled/default
```
The TLD which we are using from now on will be `network.tools`, which we will
have total control over our internal DNS Server.

In case you need some dynamic within your website, for example if you want to
run some Python, PHP and so on.. you will need to assign NGINX ownership over
the website folder structure.
We will be only running static files on our website, so we do not need these
settings. They are optional.
```bash
# Assign Nginx directory permissions
# May not be needed
sudo chown -R www-data:www-data /var/www/
sudo chmod 755 -R /var/www/network.tools/
```

Enable changes by restarting NGINX.
```bash
# Restart Nginx to apply settings
sudo service nginx restart
```

# 3. Conclusion

If everything worked without any errors in between, you now should be able to
display a website on HTTP requests (default http request port 80).
The website will display files from `/var/www/network.tools/`, which are a mirror
of files from `project_network/server-dmz-web/var/www/network.tools/`, which are
a mirror of the latest `https://github.com/deadbok/project_network` repository.

The online version of the website can be found on:
[https://deadbok.github.io/project_network/](https://deadbok.github.io/project_network/)

# 4. Further Reading
- [How to install Git on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04)
- [How to set up Nginx Server Blocks](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04)
- [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
