## 1. Draft Model And Validation Core

- [x] 1.1 Add a publish draft/session module that stores normalized common content, target platforms, resolved publish type, selected accounts, platform answers, validation state, and preview state
- [x] 1.2 Implement draft creation and draft update flows that invalidate derived validation or preview state when dependent inputs change
- [x] 1.3 Build a draft-aware validator that derives required platform fields from canonical schema metadata and rejects unknown fields, wrong value types, invalid enum values, and mismatched account/platform selections
- [x] 1.4 Move low-level payload materialization behind an internal-only draft materializer that converts validated draft state into publish-ready account forms

## 2. OpenClaw Tool Contract Refactor

- [x] 2.1 Replace the current broad OpenClaw publish payload contract with draft-oriented tool contracts for draft mutation, field negotiation, answer submission, preview, and publish
- [x] 2.2 Update `src/mcp-server/` tool registration and schemas so preview and publish operate on draft identifiers instead of free-form `platformFields`
- [x] 2.3 Update the OpenClaw tool registration layer to align with the new draft workflow and remove OpenClaw-facing low-level payload concepts
- [x] 2.4 Rewrite MCP/system prompt guidance so the assistant follows the draft workflow and no longer attempts to assemble raw low-level publish form payloads

## 3. Schema Negotiation And Resolver Integration

- [x] 3.1 Expose machine-consumable per-platform field definitions from `platform-form-schema` for a specific draft scope, including required flags, value types, enum values, examples, and resolver hints
- [x] 3.2 Integrate preset-backed dynamic fields such as category and topics into the draft field negotiation flow using resolved account context
- [x] 3.3 Represent unsupported or incomplete dynamic resolvers as structured unresolved fields instead of allowing guessed payload submission
- [x] 3.4 Ensure preview generation consumes validated draft state and returns authoritative blockers for any unresolved required platform fields

## 4. Cleanup, Removal, And Verification

- [x] 4.1 Remove or retire OpenClaw-facing code paths, schemas, and docs that accept raw `contentPublishForm` or equivalent low-level publish payloads
- [x] 4.2 Refactor existing preview and publish orchestration to route through the new draft workflow before calling low-level publish modules
- [x] 4.3 Add or update tests covering draft lifecycle, negotiated field definitions, validation failures, preview blockers, and successful publish from validated drafts
- [x] 4.4 Verify the plugin only exposes the new publish workflow to OpenClaw callers and that obsolete boundary code has been deleted or made internal-only
