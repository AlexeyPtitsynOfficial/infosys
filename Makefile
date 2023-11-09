build:
	docker build -t isjkhrs  .
run:
	docker run -p 3000:3000 --rm --name isjkhrs isjkhrs
rundev:
	docker run -p 3000:3000 -v "C:\Projects\isjkhrs:/app" -v /app/node_modules --rm --name isjkhrs isjkhrs
stop:
	docker stop isjkhrs