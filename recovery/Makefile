VERSION = 0.9.3

pdf:
	cat README.md | grip --title=' ' --export - | pandoc -f html -V geometry:"top=2cm, bottom=1.5cm, left=1.5cm, right=1.5cm" -o recovery-$(VERSION).pdf --variable mainfont="Times New Roman" --variable sansfont="Courier New"
