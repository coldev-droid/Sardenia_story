const { execSync } = require('child_process');

async function checkAndBuild() {
    let allDone = false;
    while (!allDone) {
        let count = 0;
        try {
            const out = execSync('ps aux | grep node | grep run_ch_').toString();
            count = out.split('\n').filter(l => l.includes('run_ch_')).length;
        } catch (e) {
            count = 0;
        }
        if (count === 0) {
            allDone = true;
        } else {
            console.log(`Waiting on ${count} batch processes...`);
            await new Promise(r => setTimeout(r, 20000));
        }
    }
    console.log("All generation processes finished. Building UI...");
    execSync('npm run build', { stdio: 'inherit' });
    console.log("Done.");
}

checkAndBuild().catch(console.error);
