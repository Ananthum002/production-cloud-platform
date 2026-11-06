FROM nginx:alpine
COPY application/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY application/frontend/index.html application/frontend/style.css application/frontend/app.js /usr/share/nginx/html/
EXPOSE 80
