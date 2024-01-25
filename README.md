# AElf Deploy Proposal ID javascript action

This GitHub Action fetches the proposal ID for a transaction ID of a `DeployUserSmartContract` transaction on the AElf blockchain.

## Inputs

### `transaction-id`

**Required** Transaction ID of `DeployUserSmartContract` transaction.

### `node-url`

**Required** AElf Blockchain node url. Default `"https://tdvw-test-node.aelf.io"`.

## Outputs

### `deployment-proposal-id`

Deployment proposal id.

## Example usage

```yaml
uses: yongenaelf/aelf-deploy-proposal-id-action@v1.0.0
```

## For developers

### Install ncc and dependencies

```bash
npm i -g @vercel/ncc
npm install
```

### Local development (Watch mode)

Update the `.env.development` file with your desired values.

```bash
npm run dev
```

### Build

Whenever you make changes to index.js, build and push using these commands:

```bash
npm run build
git add .
git commit -m "feat: your commit message"
git tag -a -m "My release message" v1.0.0 # tag if needed
git push --follow-tags
```

### References

https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
