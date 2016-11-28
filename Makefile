.PHONY: router-conf recovery all

router-conf:
	$(MAKE) -C router-int-conf/
	$(MAKE) -C router-ext-conf/

recovery:
	$(MAKE) -C recovery/

all: router-conf recovery

