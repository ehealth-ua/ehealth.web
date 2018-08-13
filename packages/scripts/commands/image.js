exports.command = "image <command>";

exports.describe = "Manage Docker images of the package";

exports.builder = yargs => yargs.commandDir("image");

exports.handler = () => {};
