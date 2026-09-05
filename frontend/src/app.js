import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { ExecutionResult, TransactionStatus } from "genlayer-js/types";

const STUDIONET_CHAIN_ID = "0xf22f";
const REPOSEAL_CONTRACT_ADDRESS = "0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F";
const STUDIONET_CHAIN = {
  chainId: STUDIONET_CHAIN_ID,
  chainName: "GenLayer Studionet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: ["https://studio.genlayer.com/api"],
  blockExplorerUrls: ["https://explorer-studio.genlayer.com"],
};

const state = {
  account: null,
  client: null,
  contractAddress: localStorage.getItem("reposeal_contract_address") || REPOSEAL_CONTRACT_ADDRESS,
  verificationId: "",
  lastTx: "",
};

const $ = (id) => document.getElementById(id);
const activity = (message) => { $("activity-message").textContent = message; };

function setButtonBusy(button, busy, label) {
  if (!button) return;
  button.disabled = busy;
  if (busy) button.dataset.previousLabel = button.textContent;
  button.textContent = busy ? label : (button.dataset.previousLabel || button.textContent);
}

function requireContract() {
  if (!state.contractAddress) throw new Error("Add the deployed RepoSeal contract address first.");
  if (!/^0x[a-fA-F0-9]{40}$/.test(state.contractAddress)) throw new Error("The contract address must be a valid 20-byte address.");
  return state.contractAddress;
}

async function ensureStudionet() {
  if (!window.ethereum) throw new Error("MetaMask was not detected in this browser.");
  const current = await window.ethereum.request({ method: "eth_chainId" });
  if (current.toLowerCase() === STUDIONET_CHAIN_ID) return;
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: STUDIONET_CHAIN_ID }] });
  } catch (error) {
    if (error?.code !== 4902) throw error;
    await window.ethereum.request({ method: "wallet_addEthereumChain", params: [STUDIONET_CHAIN] });
  }
}

async function connectWallet() {
  if (!window.ethereum) throw new Error("Install MetaMask to sign RepoSeal transactions.");
  await ensureStudionet();
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  state.account = accounts?.[0] || null;
  if (!state.account) throw new Error("No wallet account was returned.");
  state.client = createClient({ chain: studionet, account: state.account, provider: window.ethereum });
  await state.client.connect("studionet");
  $("connect-wallet").textContent = `${state.account.slice(0, 6)}…${state.account.slice(-4)}`;
  activity("Wallet connected. Ready for a signed action.");
}

function readClient() {
  return state.client || createClient({ chain: studionet });
}

async function readVerification(id) {
  const client = readClient();
  return client.readContract({ address: requireContract(), functionName: "get_verification", args: [id] });
}

async function sendWrite(functionName, args) {
  if (!state.account || !state.client) await connectWallet();
  const call = { address: requireContract(), functionName, args, value: BigInt(0) };
  activity(`Preparing the signed ${functionName} transaction…`);
  const txId = await state.client.writeContract(call);
  state.lastTx = txId;
  $("tx-link").innerHTML = `<a href="https://explorer-studio.genlayer.com/tx/${txId}" target="_blank" rel="noreferrer">View transaction ↗</a>`;
  activity(`${functionName} submitted. Waiting for finalization…`);
  const receipt = await state.client.waitForTransactionReceipt({ hash: txId, status: TransactionStatus.FINALIZED });
  if (receipt.txExecutionResultName !== ExecutionResult.FINISHED_WITH_RETURN) throw new Error(`Transaction finished without a successful contract result (${receipt.txExecutionResultName || "unknown"}).`);
  activity(`${functionName} finalized successfully.`);
  return txId;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function renderRecord(record) {
  if (!record) {
    $("record-card").innerHTML = '<div class="empty-state"><span class="empty-icon">⌁</span><p>No verification loaded.</p><small>Register a commit, then paste its ID here.</small></div>';
    return;
  }
  const verdict = (record.verdict || record.status || "created").toLowerCase();
  const evidence = String(record.evidence_urls || "").split("\n").filter(Boolean).slice(0, 12).map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`).join("");
  $("record-card").innerHTML = `
    <div class="record-top"><div><div class="record-id">${escapeHtml(record.verification_id)}</div><div class="record-value">${escapeHtml(record.repo_slug)}</div></div><span class="verdict-badge ${escapeHtml(verdict)}">${escapeHtml(record.verdict || record.status)}</span></div>
    <div class="record-grid">
      <div class="record-field"><span class="record-label">COMMIT</span><span class="record-value">${escapeHtml(record.commit_hash)}</span></div>
      <div class="record-field"><span class="record-label">SCORE</span><span class="record-value">${escapeHtml(record.score)} / 100</span></div>
      <div class="record-field"><span class="record-label">LICENSE</span><span class="record-value">${escapeHtml(record.declared_license)}</span></div>
      <div class="record-field"><span class="record-label">RECHECKS</span><span class="record-value">${escapeHtml(record.recheck_count)}</span></div>
    </div>
    <div class="record-reason">${escapeHtml(record.reason || "Awaiting analysis.")}</div>
    <div class="record-evidence">${evidence || '<span class="record-label">No evidence URLs stored yet.</span>'}</div>`;
}

async function loadRecord() {
  const id = $("verification-id").value.trim();
  if (!id) throw new Error("Enter a verification ID.");
  activity("Reading the latest finalized record…");
  const record = await readVerification(id);
  state.verificationId = id;
  renderRecord(record);
  activity(`Loaded ${id}.`);
}

async function createVerification(event) {
  event.preventDefault();
  const button = event.submitter;
  try {
    setButtonBusy(button, true, "Creating…");
    const txId = await sendWrite("create_verification", [
      $("repo-url").value.trim(),
      $("commit-hash").value.trim(),
      $("declared-license").value.trim(),
      $("dependency-rule").value.trim(),
    ]);
    activity(`Created successfully. Transaction: ${txId.slice(0, 12)}…`);
    alert("Verification created. Open the transaction result in MetaMask or GenLayer Studio to find the returned verification ID, then load it in the console.");
  } catch (error) { activity(error.message || "Creation failed."); alert(error.message || "Creation failed."); }
  finally { setButtonBusy(button, false); }
}

async function analyzeVerification() {
  const button = $("analyze-verification");
  try { setButtonBusy(button, true, "Consensus running…"); await sendWrite("analyze_repository", [$("verification-id").value.trim()]); await loadRecord(); }
  catch (error) { activity(error.message || "Analysis failed."); alert(error.message || "Analysis failed."); }
  finally { setButtonBusy(button, false); }
}

async function recheckVerification() {
  const button = $("recheck-verification");
  try { setButtonBusy(button, true, "Rechecking…"); await sendWrite("recheck_new_commit", [$("verification-id").value.trim(), $("new-commit-hash").value.trim()]); await loadRecord(); }
  catch (error) { activity(error.message || "Recheck failed."); alert(error.message || "Recheck failed."); }
  finally { setButtonBusy(button, false); }
}

$("contract-address").value = state.contractAddress;
$("connect-wallet").addEventListener("click", async () => { try { await connectWallet(); } catch (error) { activity(error.message || "Wallet connection failed."); alert(error.message || "Wallet connection failed."); } });
$("save-contract").addEventListener("click", () => { state.contractAddress = $("contract-address").value.trim(); localStorage.setItem("reposeal_contract_address", state.contractAddress); activity("Contract address saved in this browser."); });
$("create-form").addEventListener("submit", createVerification);
$("load-verification").addEventListener("click", async () => { try { await loadRecord(); } catch (error) { activity(error.message || "Read failed."); alert(error.message || "Read failed."); } });
$("refresh-verification").addEventListener("click", async () => { try { await loadRecord(); } catch (error) { activity(error.message || "Refresh failed."); alert(error.message || "Refresh failed."); } });
$("analyze-verification").addEventListener("click", analyzeVerification);
$("recheck-verification").addEventListener("click", recheckVerification);

if (window.ethereum) {
  window.ethereum.on?.("accountsChanged", (accounts) => { state.account = accounts?.[0] || null; $("connect-wallet").textContent = state.account ? `${state.account.slice(0, 6)}…${state.account.slice(-4)}` : "Connect MetaMask"; });
  window.ethereum.on?.("chainChanged", () => { state.client = null; activity("Network changed. Reconnect to Studionet before writing."); });
}
