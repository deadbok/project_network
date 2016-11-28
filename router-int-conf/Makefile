# Convert a Markdown commented JunOS SRX configuration file into raw
# format for pushing to the device, by removing all lines not starting
# with an tab character (this is the grep part). Remove the initial tab
# character (the sed part).

router-int.conf: router-int.conf.md
	grep -Po '^\t.*' $< | sed 's/^\t//' > $@
