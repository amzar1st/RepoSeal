import json


def to_hex(address):
    return "0x" + address.hex().lower()


def register_repo_mocks(vm, verdict="COMPLIANT", score=94, license_present=True):
    repo = "acme/widget"
    commit_hash = "abc1234"

    vm.mock_web(
        r".*api\.github\.com/repos/acme/widget/commits/abc1234.*",
        {
            "status": 200,
            "body": json.dumps(
                {
                    "sha": commit_hash,
                    "html_url": "https://github.com/acme/widget/commit/abc1234",
                    "commit": {"message": "stable release"},
                }
            ),
        },
    )
    tree_paths = ["README.md", "package.json"]
    if license_present:
        tree_paths.insert(0, "LICENSE")
    vm.mock_web(
        r".*api\.github\.com/repos/acme/widget/git/trees/abc1234.*",
        {
            "status": 200,
            "body": json.dumps(
                {
                    "sha": "tree123",
                    "tree": [{"path": path, "type": "blob"} for path in tree_paths],
                }
            ),
        },
    )
    if license_present:
        vm.mock_web(
            r".*raw\.githubusercontent\.com/acme/widget/abc1234/LICENSE.*",
            {"status": 200, "body": "MIT License\nPermission is hereby granted..."},
        )
    vm.mock_web(
        r".*raw\.githubusercontent\.com/acme/widget/abc1234/README\.md.*",
        {
            "status": 200,
            "body": "# Widget\n\nCopyright notice and MIT attribution are preserved.",
        },
    )
    vm.mock_web(
        r".*raw\.githubusercontent\.com/acme/widget/abc1234/package\.json.*",
        {
            "status": 200,
            "body": json.dumps({"name": "widget", "license": "MIT", "dependencies": {}}),
        },
    )
    vm.mock_web(
        r".*spdx\.org/licenses/MIT\.json.*",
        {
            "status": 200,
            "body": json.dumps(
                {
                    "licenseId": "MIT",
                    "name": "MIT License",
                    "isOsiApproved": True,
                    "licenseText": "Permission is hereby granted, free of charge...",
                }
            ),
        },
    )
    vm.mock_llm(
        r".*You are RepoSeal.*",
        json.dumps(
            {
                "verdict": verdict,
                "score": score,
                "reason": "The exact commit is available and the license, attribution, and dependency evidence align with the declared policy.",
                "findings": "LICENSE present; README attribution present; package manifest inspected; no direct dependency violations found.",
            }
        ),
    )
