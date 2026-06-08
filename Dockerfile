FROM node:20-alpine AS build
WORKDIR /app
COPY src/ ./

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
