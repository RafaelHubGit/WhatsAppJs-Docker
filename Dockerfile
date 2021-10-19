FROM node:14-slim


RUN apt-get update 
RUN apt-get install nano

# Lineas Para que funcione sharp en linux
RUN apt-get install libvips-dev -y
RUN apt-get install -y libsecret-1-dev
# Para que funcione sharp en linux --end


# se crea la carpeta donde estaran los archivos de node
# RUN mkdir -p /usr/src/app 

# Linea para decir que debe estar en esta carpeta al correr
# WORKDIR /usr/src/app

# Copiar todos los archivos package dentro del contenedor en el directorio actual (o sea /usr/src/app)
# COPY package*.json ./
# COPY package.json ./


# Lineas Para que funcione sharp en linux
RUN npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
RUN npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
RUN npm install --arch=x64 --platform=linux sharp
# Para que funcione sharp en linux - end 


# Copia el directorio actual dentro del directorio actual 
# COPY . .



# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-stable'})
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true



# Install puppeteer so it's available in the container.
# RUN npm init -y &&  \

    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/app

WORKDIR /home/pptruser/app
COPY package.json /home/pptruser/app


RUN chown -R pptruser:pptruser /home/pptruser 
# RUN chown -R pptruser:pptruser /package.json 
RUN chown -R pptruser:pptruser /home/pptruser/app/package.json
RUN npm i puppeteer
RUN chown -R pptruser:pptruser /home/pptruser/app/node_modules 
RUN chown -R pptruser:pptruser /home/pptruser/app/package-lock.json


RUN npm i -g nodemon
# RUN npm i -g typescript

RUN npm i puppeteer
RUN npm i -g puppeteer --unsafe-perm

# RUN npm i whatsapp-web.js
# RUN npm i cors
# RUN npm i dotenv
# RUN npm i express
# RUN npm i qrcode-terminal
# RUN npm i socket.io
# RUN npm i tedious

# RUN npm i @types/cors --save-dev
# RUN npm i @types/express --save-dev
# RUN npm i @types/qrcode-terminal --save-dev

# RUN npm i nodemon --save-dev
# RUN npm i tslint --save-dev
# RUN npm i typescript --save-dev


RUN npm install

# Copia el directorio actual dentro del directorio actual 
COPY . /home/pptruser/app


# Expone el puerto 3000 
EXPOSE 8002

# Run everything after as non-privileged user.
USER pptruser

# CMD ["google-chrome-stable"]
CMD ["npm", "run", "dev"]