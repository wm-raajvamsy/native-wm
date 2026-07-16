const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..',);

const build = () => {
    fs.copyFileSync(path.join(projectRoot, 'package.json'), path.join(projectRoot, 'build', 'package.json'));
};

build();
