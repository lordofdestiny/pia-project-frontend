const os = require('os');
const {join}= require('path');
const {writeFileSync}= require('fs');

// Get local IPv4 address of the machine
const networkInterfacesDict = os.networkInterfaces();   
const ipv4 = Object.keys(networkInterfacesDict)
    .map((key) => networkInterfacesDict[key])
    .flat()
    .filter(({ family }) => family === 'IPv4')
    .filter(({ internal }) => !internal)
    .map(({ address }) => address);

    ipv4.push('127.0.0.1');

writeFileSync(join(__dirname,'assets', 'ipv4.json'), JSON.stringify(ipv4));