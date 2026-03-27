## ADDED Requirements

### Requirement: OpenClaw publish flow SHALL use a server-owned draft
The system SHALL create and manage a server-owned publish draft for every OpenClaw publishing workflow. The draft SHALL contain stable cross-platform content inputs, target platforms, resolved publish type, selected platform accounts, and platform answer state. Preview and publish operations SHALL reference the draft instead of requiring callers to resubmit a broad free-form publish payload.

#### Scenario: Create draft from common publish intent
- **WHEN** an OpenClaw caller starts a publishing workflow with body, media, target platforms, and optional stable metadata
- **THEN** the system returns a draft identifier and records the normalized common content and target scope for later negotiation, preview, and publish

#### Scenario: Update draft without rebuilding low-level payloads
- **WHEN** an OpenClaw caller changes stable content or target selection before publishing
- **THEN** the system updates the draft state and invalidates any derived validation or preview state that depends on the changed inputs

### Requirement: The system SHALL negotiate platform-specific fields from canonical schema metadata
For a given draft, the system SHALL return machine-consumable field definitions for each targeted platform and publish type using canonical platform schema metadata. Returned field definitions SHALL identify field name, required status, value type, enum values when available, descriptive guidance, and whether the field depends on preset or resolver data.

#### Scenario: Return required platform fields for a draft
- **WHEN** an OpenClaw caller requests field requirements for a draft
- **THEN** the system returns per-platform field definitions derived from the platform schema and target publish type rather than a free-form placeholder object contract

#### Scenario: Include resolver-backed field context
- **WHEN** a targeted platform requires dynamic fields such as category, topics, or location
- **THEN** the system marks those fields as resolver-backed and includes structured guidance or resolver state instead of expecting the caller to guess the payload shape

### Requirement: The system SHALL validate platform answers before preview or publish
The system SHALL accept platform-specific answers only in the context of a draft and SHALL validate them against the negotiated field definitions. The system SHALL reject unknown fields, wrong value types, invalid enum values, missing required fields, and answers that do not match the selected platform account or publish type.

#### Scenario: Reject unknown platform fields
- **WHEN** an OpenClaw caller submits a platform answer containing a field that was not negotiated for that draft
- **THEN** the system rejects the answer and reports which field is not allowed for that platform scope

#### Scenario: Reject invalid field shape
- **WHEN** an OpenClaw caller submits a field value whose type or enum value does not match the negotiated field definition
- **THEN** the system rejects the answer and returns a validation error that identifies the platform, field, and expected shape

#### Scenario: Preserve valid answers while reporting remaining blockers
- **WHEN** an OpenClaw caller submits a partial set of valid platform answers
- **THEN** the system stores the valid answers on the draft and returns the remaining blocking fields that still prevent successful preview or publish

### Requirement: Preview and publish SHALL operate on validated draft state
The system SHALL generate previews and execute publish operations from validated draft state only. A publish operation SHALL NOT require callers to submit raw low-level platform form payloads, and it SHALL fail with explicit blocker information if the draft is incomplete or invalid.

#### Scenario: Preview from draft
- **WHEN** an OpenClaw caller requests a preview for a draft
- **THEN** the system builds the preview from the draft's normalized content, validated platform answers, and resolved media assets, and returns any remaining blockers in the same response

#### Scenario: Publish only after validation passes
- **WHEN** an OpenClaw caller requests publication for a draft that still has validation blockers
- **THEN** the system refuses to publish and returns the unresolved blockers without attempting low-level publish execution

#### Scenario: Publish from materialized internal payloads
- **WHEN** an OpenClaw caller requests publication for a fully validated draft
- **THEN** the system materializes low-level per-platform payloads internally and submits the publish task without requiring raw low-level payloads from the caller

### Requirement: OpenClaw-facing publish tools SHALL NOT expose raw low-level publish forms
The OpenClaw publishing boundary SHALL NOT accept or require raw `contentPublishForm` payloads or equivalent low-level platform form objects. Low-level platform payload assembly SHALL remain an internal implementation detail.

#### Scenario: Reject legacy low-level payload shape
- **WHEN** an OpenClaw caller attempts to invoke the publish workflow with a raw low-level publish form payload
- **THEN** the system rejects the request as unsupported by the OpenClaw contract

#### Scenario: Prompts and tool docs reinforce the draft workflow
- **WHEN** the MCP or skill-layer publish tools are registered for OpenClaw use
- **THEN** their descriptions and prompt guidance direct callers through the draft workflow and do not instruct them to assemble raw low-level platform payloads
