"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.git = void 0;
const exec_1 = require("@actions/exec");
const git = async (...args) => {
    let out = new Uint8Array();
    const exitCode = await (0, exec_1.exec)("git", args, {
        listeners: {
            stdout: (b) => out = new Uint8Array([...out, ...b]),
        },
        ignoreReturnCode: true,
    });
    if (exitCode)
        throw new Error(new TextDecoder().decode(out));
};
exports.git = git;
//# sourceMappingURL=git.js.map