# Files for configuring the ROUTER-INT router.

* Makefile: Make file with a rule to generate the configuration file.
* README.md: This file.
* router-int.conf.md: Router configuration file with Markdown comments.
* router-int.conf: The generated raw configuration file for the router.

## Generating the raw configuration file.

This is a Markdown formatted commented version of the actual
configuration file on the router. Along with this file comes a make file
used to process this file into the final configuration file ready for
pushing to the JunOS SRX router. To generate the raw configuration file
run this command in the current directory:

```bash
make
```
