build:
	docker build -t infosys  .
run:
	docker run -p 3000:3000 --rm --name infosys infosys
rundev:
	docker run -p 3000:3000 -v "C:\Projects\isjkhrs:/app" -v /app/node_modules --rm --name infosys infosys
stop:
	docker stop infosys