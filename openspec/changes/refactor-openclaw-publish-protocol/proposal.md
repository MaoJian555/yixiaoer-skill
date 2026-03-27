## Why

The current OpenClaw publishing flow exposes a broad, loosely-typed payload that mixes stable cross-platform content fields with platform-specific form fields. In practice this causes frequent payload-shape errors, encourages callers to guess dynamic field formats, and makes it easy to bypass the intended high-level publishing workflow and reach low-level publishing code directly.

## What Changes

- Replace the current "submit everything at once" OpenClaw publishing contract with a draft-based protocol that separates intent capture, platform field negotiation, validation, preview, and execution.
- Introduce a server-owned publish draft/session model so OpenClaw tools operate on a draft identifier instead of repeatedly resubmitting free-form platform payloads.
- Generate per-platform field requirements from the existing platform schema metadata and return machine-consumable field definitions instead of relying on descriptive prompts alone.
- Perform strong validation for platform-specific answers before preview or publish, including required fields, value types, enum values, and account/platform matching.
- **BREAKING** Remove or retire OpenClaw-facing pathways that allow direct free-form submission of low-level platform form payloads.
- **BREAKING** Narrow the OpenClaw tool boundary so low-level `contentPublishForm` construction becomes an internal implementation detail rather than a supported caller contract.

## Capabilities

### New Capabilities
- `openclaw-publish-drafts`: A draft-driven OpenClaw publishing workflow that negotiates required platform fields, validates structured answers, previews resolved payloads, and only then executes publishing.

### Modified Capabilities

## Impact

- Affected code: `src/openclaw-tools/`, `src/publish/`, and the internal publish orchestration layer.
- Affected APIs: OpenClaw/MCP tool contracts for publish-related operations.
- Affected behavior: publish preview and execution will move from broad free-form payloads to validated draft-based workflow steps.
- Removal scope: legacy OpenClaw-facing entry points and documentation that encourage direct low-level form submission should be removed or rewritten.
