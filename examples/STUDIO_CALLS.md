# Studio call examples

## Create a record

```text
create_verification(
  "https://github.com/expressjs/express",
  "023767fe9872e029271df1418f73401bff20ff40",
  "MIT",
  "All direct dependencies must have publicly identifiable licenses compatible with MIT; GPL-only dependencies are not allowed."
)
```

Save the returned `verify-N` identifier.

## Analyze

```text
analyze_repository("verify-N")
```

The creator account must submit this write. Wait for finality and successful
execution, then read the stored record.

## Read

```text
get_verification("verify-N")
get_verification_ids()
get_verification_count()
```

## Recheck another commit

```text
recheck_new_commit("verify-N", "<different immutable commit SHA>")
```

Recheck preserves the ID and policy, replaces the commit, runs fresh consensus,
and increments `recheck_count`.
