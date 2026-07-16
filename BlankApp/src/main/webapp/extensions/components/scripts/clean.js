const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..',);

const clean = () => {
    const buildDir = path.join(projectRoot, 'build');
    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
    }
};

clean();
