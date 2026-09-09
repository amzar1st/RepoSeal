# Security model

## Trust boundaries

GitHub files, API responses, registry metadata, SPDX responses, and LLM output
are untrusted. Only an accepted GenLayer consensus result can change stored
analysis state.

## Controls

- Repository URLs must start with `https://github.com/` and include an owner
  and repository segment.
- Commit identifiers must be 7-64 hexadecimal characters; immutable full SHAs
  are required operationally and used in the documented live proof.
- Only a record's creator may analyze or recheck it.
- Fetched repository text is explicitly labelled as evidence, and the prompt
  forbids following instructions embedded in that text.
- Model output must be a supported verdict with numeric 0-100 score and a
  non-empty bounded explanation.
- Validators repeat evidence retrieval and analysis independently.
- Exact verdict agreement and bounded score variance are required.
- Web, prompt, file, dependency, and storage sizes are capped.
- Missing or conflicting material evidence produces `INCONCLUSIVE`.
- Failed execution or consensus reverts the write atomically.

## Known limitations

- Public endpoints can fail temporarily or enforce rate limits.
- Only supported root manifests and up to 12 direct dependencies are checked.
- Registry license fields can be absent, ambiguous, or inaccurate.
- A verdict applies only to the pinned commit and supplied policy.
- RepoSeal is not legal advice or a full software-composition analysis.

## Responsible reporting

Open a GitHub issue without secrets, private repository contents, wallet keys,
or exploit data that would put users at immediate risk. Never commit private
keys or seed phrases; deployment credentials belong in local environment
variables.
