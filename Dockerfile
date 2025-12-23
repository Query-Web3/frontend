FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN apk add --no-cache bash;

COPY ./hacks/nginx.conf /etc/nginx/nginx.conf
COPY ./dist /usr/share/nginx/html
COPY ./hacks/cert/ /srv

EXPOSE 80 443

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
