PACKAGE = nodelint
NODEJS = $(if $(shell test -f /usr/bin/nodejs && echo "true"),nodejs,node)

PREFIX ?= /usr/local
BINDIR ?= $(PREFIX)/bin
DATADIR ?= $(PREFIX)/share
LIBDIR ?= $(PREFIX)/lib
ETCDIR = /etc
PACKAGEDATADIR ?= $(DATADIR)/$(PACKAGE)

BUILDDIR = dist

$(shell if [ ! -d $(BUILDDIR) ]; then mkdir $(BUILDDIR); fi)

all: build

build: stamp-build

stamp-build: jslint/jslint.js nodelint config.js
	touch $@;
	cp $^ $(BUILDDIR);
	perl -pi -e 's{^\s*SCRIPT_DIRECTORY =.*?\n}{}ms' $(BUILDDIR)/nodelint
	perl -pi -e 's{path\.join\(SCRIPT_DIRECTORY, '\''config.js'\''\)}{"$(ETCDIR)/nodelint.conf"}' $(BUILDDIR)/nodelint
	perl -pi -e 's{path\.join\(SCRIPT_DIRECTORY, '\''jslint/jslint\.js'\''\)}{"$(PACKAGEDATADIR)/jslint.js"}' $(BUILDDIR)/nodelint

install: build
	install --directory $(PACKAGEDATADIR)
	install --mode 0644 $(BUILDDIR)/jslint.js $(PACKAGEDATADIR)/jslint.js
	install --mode 0644 $(BUILDDIR)/config.js $(ETCDIR)/nodelint.conf
	install --mode 0755 $(BUILDDIR)/nodelint $(BINDIR)/nodelint

uninstall:
	rm -rf $(PACKAGEDATADIR)/jslint.js $(ETCDIR)/nodelint.conf $(BINDIR)/nodelint

clean:
	rm -rf $(BUILDDIR) stamp-build

.PHONY: test install uninstall build all
