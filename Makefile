NAME=OpenViaUCSF
VERSION:=1.4.0

spell:
	Rscript -e "spelling::spell_check_files(c('README.md', 'DESCRIPTION.txt', 'ChromeExtension/OpenViaUCSF/NEWS.md', 'ChromeExtension/OpenViaUCSF/chrome-web-store-comments.md'), ignore=readLines('WORDLIST'))"

zip: ChromeExtension/$(NAME).zip

ChromeExtension/$(NAME).zip:
	cd "$(@D)"; \
	zip -r "$(@F)" $(NAME)

