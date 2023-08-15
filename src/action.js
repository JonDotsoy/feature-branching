"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const exec_1 = require("@actions/exec");
const core_1 = require("@actions/core");
const node_util_1 = require("node:util");
const listAvailablePRs_1 = require("./utils/gh/listAvailablePRs");
const git_1 = require("./utils/git/git");
const main = async ({ labelToFilter, baseBranch, destinationBranch }) => {
    const prs = await (0, listAvailablePRs_1.listAvailablePRs)(labelToFilter);
    await (0, exec_1.exec)("git", ["config", "user.name", "github-actions[bot]"]);
    await (0, exec_1.exec)("git", [
        "config",
        "user.email",
        "41898282+github-actions[bot]@users.noreply.github.com",
    ]);
    await (0, exec_1.exec)("git", ["branch", "-d", destinationBranch], {
        ignoreReturnCode: true,
    });
    await (0, exec_1.exec)("git", ["checkout", baseBranch]);
    await (0, exec_1.exec)("git", ["switch", "-c", destinationBranch, baseBranch]);
    if (!prs.length)
        return;
    for (const pr of prs) {
        // git merge sample1 --no-ff -m "(#1) sampel1"
        try {
            await (0, git_1.git)("merge", pr.headRefOid, "--no-ff", "-m", `(#${pr.number}) ${pr.title}`);
        }
        catch (ex) {
            if (ex instanceof Error) {
                throw new Error(`Failed merge PR #${pr.number}: ${ex.message}`);
            }
            throw ex;
        }
    }
    await (0, exec_1.exec)("git", ["push", "-f", "origin", destinationBranch]);
};
exports.main = main;
(0, exports.main)({
    labelToFilter: (0, core_1.getInput)("label_to_filter", {
        required: true,
        trimWhitespace: true,
    }),
    baseBranch: (0, core_1.getInput)("base_brach", {
        required: true,
        trimWhitespace: true,
    }),
    destinationBranch: (0, core_1.getInput)("destination_brach", {
        required: true,
        trimWhitespace: true,
    }),
})
    .then(() => {
    (0, core_1.setOutput)("pre_release_created", true);
})
    .catch((ex) => {
    (0, core_1.setOutput)("pre_release_created", false);
    console.error(ex);
    (0, core_1.setFailed)(typeof ex === "string"
        ? ex
        : ex instanceof Error
            ? ex.message
            : (0, node_util_1.inspect)(ex));
});
//# sourceMappingURL=action.js.map