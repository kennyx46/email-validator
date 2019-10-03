const execShellCommand = (cmd) => {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            // console.log('here1');
            // console.log(stdout);
            // console.log(stdout);
            // console.log(stderr);
            if (error) {
                reject(error);
            }
            resolve(stdout);
        })
        // .on('exit', code => console.log(code));
    });
}

module.exports = execShellCommand;
