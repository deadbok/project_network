VERSION := $(shell grep -oP '\*\*Version \K[[:alnum:]]\.[[:alnum:]]\.[[:alnum:]]' README.md)

recovery-$(VERSION).pdf: README.md
	@echo Recovery doc version $(VERSION)
	@echo
	cat $< | grip --title=' ' --export - | pandoc -f html -V geometry:"top=2cm, bottom=1.5cm, left=1.5cm, right=1.5cm" -o '$@' --variable mainfont="Times New Roman" --variable sansfont="Courier New"
