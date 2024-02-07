const core = require("@actions/core");
const AElf = require("aelf-sdk");
const { deserializeLogs } = require("./deserialize-logs");
let sleep = require("util").promisify(setTimeout);

(async () => {
  try {
    const TRANSACTION_ID = core.getInput("transaction-id", { required: true });
    const NODE_URL = core.getInput("node-url", { required: true });
    const EXPLORER_URL = core.getInput("explorer-url", { required: true });

    const aelf = new AElf(new AElf.providers.HttpProvider(NODE_URL));

    let transaction = { Status: undefined },
      retryCount = 0;

    while (transaction.Status !== "MINED" && retryCount < 10) {
      transaction = await aelf.chain.getTxResult(TRANSACTION_ID);
      console.log("Transaction Status: ", transaction.Status);

      if (transaction.Status !== "MINED") {
        retryCount++;
        await sleep(2000);
      }
    }

    if (transaction.Status !== "MINED")
      throw new Error("Transaction Status: ", transaction.Status);

    const deserializeLogResult = await deserializeLogs(aelf, transaction.Logs);

    const proposalLog = deserializeLogResult?.pop();

    if (proposalLog) {
      const { proposalId } = proposalLog;
      console.log("Proposal id:", proposalId);
      core.setOutput("deployment-proposal-id", proposalId);

      const link = `${EXPLORER_URL}/proposal/proposalsDetail/${proposalId}`;

      await core.summary
        .addDetails("transactionId", TRANSACTION_ID)
        .addDetails("proposalId", proposalId)
        .addLink("View proposal on AElf Explorer", link)
        .write();
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
})();
