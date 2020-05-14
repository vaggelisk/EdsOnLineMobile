# eds-online

## Build and copy to destination
```
npm run build && Xcopy dist "G:\www-purejs\EDSOnLineProd\dist" /y /S
```

## Build, remove previous and copy to destination
```
npm run build && rmdir /S /Q "G:\www-purejs\EDSOnLineMobileProd\dist" && Xcopy dist "G:\www-purejs\EDSOnLineMobileProd\dist" /y /S
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### For uploading to Server
```
cd ../EDSOnLineMobileProd

cp -r ../EDSOnLineMobile/dist ./

git add .

git commit -m "this is giorgos commit"

git push

ssh_passphrase: Ek2018!@

```

### Then go to another gitBash
```
 ssh propan@edsonline.propulsionanalytics.com
 
 cd /var/www/html/widemobile.propulsionanalytics.com/EDSOnlineMobileProd/
 
 sudo git pull

```


### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
