spell:
	Rscript -e "spelling::spell_check_files(c('README.md', 'DESCRIPTION.txt', 'ChromeExtension/OpenViaUCSF/NEWS.md', 'ChromeExtension/OpenViaUCSF/chrome-web-store-comments.md'), ignore=readLines('WORDLIST'))"
