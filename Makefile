# Top level file to generate router configuaion files from the from
# the Markdown commented ones, and and a .pdf version of the recovery guide.

.PHONY: router-conf recovery all

router-conf:
	$(MAKE) -C router-int-conf/
	$(MAKE) -C router-ext-conf/

recovery:
	$(MAKE) -C recovery/

all: router-conf recovery

