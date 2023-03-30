FROM ubuntu:latest
RUN apt-get update && \
	apt-get install -y curl && \
	curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
	apt-get install -y nodejs ruby lftp git && \
	gem install sass && \
	npm install -g gulp-cli && \
	rm -rf /var/lib/apt/lists/*
ENTRYPOINT []