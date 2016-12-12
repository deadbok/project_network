# Server Configuration 2nd Draft

![Simplified HTTP Request](../images/network-diagram-http.png)

# 1 Software

## 1.1 Nginx

Install Nginx using `apt-get install`.

```bash
sudo apt-get install nginx
```

## 1.2 Git

Install Git and clone the GitHub Repository with all project files.

```bash
sudo apt-get install git
git clone https://git@github.com/deadbok/project_network.git
```

# 2 Files

- Nginx Server Blocks:`project_network/server-dmz-web/etc/nginx/sites-available/network.tools`
- Network Interfaces: `project_network/server-dmz-web/etc/network/interfaces`
- Website Folder: `project_network/server-dmz-web/var/www/network.tools/`

> Global Path Example: /home/%user%/project_network/server-dmz-web/...


```bash
# Copy Site Files
sudo cp -r project_network/server-dmz-web/var/www/* /var/www/

# Copy Nginx Server Block
sudo cp project_network/server-dmz-web/etc/nginx/sites-available/network.tools /etc/nginx/sites-available/

# Enable Server Block by symbolic link to 'sites-enabled' directory
sudo ln -s /etc/nginx/sites-available/network.tools /etc/nginx/sites-enabled/

# Remove Default Server Block
sudo rm /etc/nginx/sites-available/default
# Default Server Block Symbolic Link
sudo rm /etc/nginx/sites-enabled/default

# Assign Nginx directory permissions
# May not be needed
sudo chown -R www-data:www-data /var/www/
sudo chmod 755 -R /var/www/network.tools/

# Restart Nginx to apply settings
sudo service nginx restart
```

# Further Reading
- [How to install Git on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04)
- [How to set up Nginx Server Blocks](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04)
- [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
