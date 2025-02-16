.PHONY: build
build:
	bundle exec jekyll build

.PHONY: serveDrafts
serveDrafts:
	bundle exec jekyll serve --livereload --drafts

.PHONY: serve
serve:
	bundle exec jekyll serve --livereload

.PHONY: update
update:
	bundle update
