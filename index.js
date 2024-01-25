const core = require("@actions/core");
const AElf = require("aelf-sdk");
const { deserializeLogs } = require("./deserialize-logs");

(async () => {
  try {
    const TRANSACTION_ID = core.getInput("transaction-id", { required: true });
    const NODE_URL = core.getInput("node-url", { required: true });

    const aelf = new AElf(new AElf.providers.HttpProvider(NODE_URL));

    const transaction = await aelf.chain.getTxResult(TRANSACTION_ID);

    const deserializeLogResult = await deserializeLogs(aelf, transaction.Logs);

    const proposalLog = deserializeLogResult?.pop();

    if (proposalLog) {
      const { proposalId } = proposalLog;
      console.log("Proposal id:", proposalId);
      core.setOutput("deployment-proposal-id", proposalId);

      await core.summary
        .addDetails("transactionId", TRANSACTION_ID)
        .addDetails("proposalId", proposalId)
        .write();
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
})();
