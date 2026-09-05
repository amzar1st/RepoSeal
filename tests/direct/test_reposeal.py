from tests.direct.conftest import register_repo_mocks, to_hex


def test_create_and_read_verification(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice

    verification_id = contract.create_verification(
        "https://github.com/acme/widget",
        "abc1234",
        "MIT",
        "Only allow permissive OSI-approved dependency licenses; flag unknown or copyleft licenses.",
    )

    verification = contract.get_verification(verification_id)
    assert verification["verification_id"] == "verify-1"
    assert verification["creator"].lower() == to_hex(direct_alice)
    assert verification["repo_slug"] == "acme/widget"
    assert verification["commit_hash"] == "abc1234"
    assert verification["status"] == "CREATED"
    assert contract.get_verification_ids() == ["verify-1"]
    assert contract.get_verification_count() == 1


def test_consensus_analysis_stores_compliant_result(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice
    verification_id = contract.create_verification(
        "https://github.com/acme/widget",
        "abc1234",
        "MIT",
        "Only allow permissive OSI-approved dependency licenses; flag unknown or copyleft licenses.",
    )
    register_repo_mocks(direct_vm)

    contract.analyze_repository(verification_id)
    verification = contract.get_verification(verification_id)

    assert verification["status"] == "COMPLIANT"
    assert verification["verdict"] == "COMPLIANT"
    assert verification["score"] == 94
    assert "githubusercontent.com" in verification["evidence_urls"]
    assert "spdx.org/licenses/MIT.json" in verification["evidence_urls"]


def test_consensus_analysis_stores_non_compliant_result(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice
    verification_id = contract.create_verification(
        "https://github.com/acme/widget",
        "abc1234",
        "MIT",
        "Only allow permissive OSI-approved dependency licenses; flag unknown or copyleft licenses.",
    )
    register_repo_mocks(direct_vm, verdict="NON_COMPLIANT", score=12)

    contract.analyze_repository(verification_id)
    verification = contract.get_verification(verification_id)
    assert verification["status"] == "NON_COMPLIANT"
    assert verification["score"] == 12


def test_missing_license_can_be_inconclusive(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice
    verification_id = contract.create_verification(
        "https://github.com/acme/widget",
        "abc1234",
        "MIT",
        "Only allow permissive OSI-approved dependency licenses; flag unknown or copyleft licenses.",
    )
    register_repo_mocks(direct_vm, verdict="INCONCLUSIVE", score=40, license_present=False)

    contract.analyze_repository(verification_id)
    verification = contract.get_verification(verification_id)
    assert verification["verdict"] == "INCONCLUSIVE"


def test_only_creator_can_analyze(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice
    verification_id = contract.create_verification(
        "https://github.com/acme/widget",
        "abc1234",
        "MIT",
        "Only allow permissive dependency licenses.",
    )
    direct_vm.sender = direct_bob

    with direct_vm.expect_revert("Only the verification creator can do this"):
        contract.analyze_repository(verification_id)


def test_recheck_requires_a_new_commit_and_updates_record(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice
    verification_id = contract.create_verification(
        "https://github.com/acme/widget",
        "abc1234",
        "MIT",
        "Only allow permissive dependency licenses.",
    )

    with direct_vm.expect_revert("New commit hash must differ from the stored commit"):
        contract.recheck_new_commit(verification_id, "abc1234")

    with direct_vm.expect_revert("New commit hash must be 7-64 hexadecimal characters"):
        contract.recheck_new_commit(verification_id, "not-a-hash")


def test_invalid_repository_and_hash_are_rejected(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/reposeal.py")
    direct_vm.sender = direct_alice

    with direct_vm.expect_revert("Repository URL must start with https://github.com/"):
        contract.create_verification(
            "https://gitlab.com/acme/widget",
            "abc1234",
            "MIT",
            "Only allow permissive dependency licenses.",
        )

    with direct_vm.expect_revert("Commit hash must be 7-64 hexadecimal characters"):
        contract.create_verification(
            "https://github.com/acme/widget",
            "not-a-hash",
            "MIT",
            "Only allow permissive dependency licenses.",
        )
