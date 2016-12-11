# Server Configuration 1st Draft

![Simplified HTTP Request](./images/network-diagram-http.png)

Install Nginx using `apt-get install`
```bash
sudo apt-get install nginx
```

```bash
sudo nano /etc/nginx/sites-available/network.tools
sudo ln -s /etc/nginx/sites-available/network.tools /etc/nginx/sites-enabled/
sudo chown -R www-data:www-data /var/www/
sudo chmod 755 -R /var/www/network.tools/
```

```bash
sudo apt-get install git
git clone -b gh-pages https://git@github.com/deadbok/project_network.git
```

# Further Reading
- [How to install Git on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04)
- [How to set up Nginx Server Blocks](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04)
- [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
