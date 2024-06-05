const { spawn } = require('child_process');


const command = spawn('php', ['./php/home.php']);

command.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

command.stderr.on('data', (data) => {
  console.error(`Stderr: ${data}`);
});

command.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

command.on('close', (code) => {
  console.log(`Process exited with code: ${code}`);
});
