import chalk from "chalk";

const error = (msg) => console.log(chalk.red(msg));
const success = (msg) => console.log(chalk.green(msg));

export default {
    error,
    success
}