# Ensar API
visa
authentication-and-authorization-with-jwts-in-express-js/
knex migrate:latest
Run in postman
curl --location --request POST 'http://localhost:3000/admin/login' \
--header 'accept: applcation/json' \
--header 'Content-Type: application/json' \
--header 'Cookie: AuthSu_ADMIN=N1dbNE6vy1VnwgyAeJtY4zc9BCuKk1qfiMNPIVLLfcTF17fNS4UQ1Pfifjtpl99R' \
--data-raw '{"username":"admin@itcraft.pl","password":"test"}'

curl --location --request GET 'http://localhost:3000/admin/emails' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGl0Y3JhZnQucGwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NzA4NjE3MzAsImV4cCI6MTY3MDg2MjkzMH0.SkwhdtHS_UX4AAmxeFOjdtWTtq1aU-opDf6g33QDZRw'

curl --location --request POST 'http://localhost:3000/admin/nistfunctions' \
--header 'Content-Type: application/json' \
--header 'Cookie: AuthSu_ADMIN=mUHvTv7Juvtv5VcOKTUo7acJ1kPXyGZ6oqgpdfBNS735Pv3ctmHkBICYeDQwMjz3' \
--data-raw '{"name":"ID2"}'

--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGl0Y3JhZnQucGwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NzA4NjE3MzAsImV4cCI6MTY3MDg2MjkzMH0.SkwhdtHS_UX4AAmxeFOjdtWTtq1aU-opDf6g33QDZRw'
