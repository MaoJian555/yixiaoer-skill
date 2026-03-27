## Context

The original publishing flow was split across `src/mcp-server/`, `src/skill-tools/`, `src/api-service/`, and `src/modules/`. The active repository structure has since been simplified so the runtime boundary now lives in `src/openclaw-tools/` and `src/publish/`, but this document records the reasons for that consolidation. OpenClaw-facing tools previously accepted a common content payload plus loosely-typed platform overrides, then merged those values into low-level publish payloads immediately before preview or publish.

This creates three systemic problems:

- The public tool contract is broader than the system can safely validate. Platform-specific fields are dynamic, but the OpenClaw boundary currently exposes them as free-form objects.
- Validation is mostly presence-based. The system can detect some missing fields, but it does not strongly enforce field types, enum values, or unknown-field rejection before low-level payload construction.
- OpenClaw callers can conceptually bypass the intended workflow. Because low-level form concepts such as `contentPublishForm` remain visible in code and docs, the model is incentivized to assemble low-level payloads directly instead of staying inside the high-level workflow.

The repository already contains useful metadata for solving this: `platform-form-schema` describes platform field shapes, `platform-rules` describes support matrices, and the existing preview pipeline can already materialize per-platform payloads. The refactor will reorganize these assets around a draft/session protocol with a narrower public boundary.

## Goals / Non-Goals

**Goals:**

- Make the OpenClaw publishing contract explicit, narrow, and machine-validatable.
- Separate stable cross-platform content capture from platform-specific field negotiation.
- Introduce a server-owned draft lifecycle so preview and publish operate on validated draft state instead of repeated free-form payload submissions.
- Use generated platform schema metadata as the canonical source for field negotiation and validation.
- Remove OpenClaw-facing low-level payload concepts such as raw `contentPublishForm`.
- Keep low-level publish execution in existing modules where possible, but move payload materialization behind internal-only boundaries.

**Non-Goals:**

- Rewriting the underlying Yixiaoer publish transport or changing the publish task protocol itself.
- Adding long-term persistence, multi-process draft sharing, or user-facing history management in this refactor.
- Solving every dynamic resolver in the first pass; unsupported resolvers may still report structured limitations as long as the protocol remains typed and explicit.
- Preserving backward compatibility for deprecated OpenClaw publish tool payloads.

## Decisions

### 1. Introduce a process-local publish draft model

The system will create a publish draft as the first step of the workflow. A draft stores:

- Stable content: title/body/media/tags/scheduleAt
- Target definition: platforms, resolved publish type, selected accounts
- Platform answer state: per-platform field answers after validation
- Validation state: missing fields, invalid values, unresolved dynamic dependencies
- Preview state: resolved preview snapshot ready for user confirmation

Why this over repeated free-form submissions:

- It gives the server ownership of workflow state.
- It lets preview and publish consume the exact same validated state.
- It removes the need for callers to keep resending broad payloads with guessed platform shapes.

Alternative considered:

- Stateless publish requests with stronger request-time validation. Rejected because the model would still need to synthesize every platform answer in a single shot, which preserves the main failure mode.

### 2. Make negotiated field specs the only public way to express platform-specific input

The public tool flow will move to:

- create or update draft with stable fields
- fetch required platform field definitions for the current draft
- submit structured per-platform answers
- preview draft
- publish draft

Field definitions will be generated from `platform-form-schema` plus resolver-enriched metadata. Each returned field spec should include, at minimum:

- field key
- platform and publish type scope
- value type
- required flag
- enum values when available
- description and example
- whether the value is static, preset-backed, or resolver-backed

Why this over keeping `platformFields: Record<string, unknown>`:

- The caller can only answer fields the server has declared.
- Unknown fields and wrong shapes become validation errors instead of merge-time surprises.
- The schema metadata already exists and should become executable contract data, not documentation only.

Alternative considered:

- Keep `platformFields` but enrich prompt instructions. Rejected because better prompting does not create enforceable contracts.

### 3. Remove raw low-level payload concepts from the OpenClaw boundary

OpenClaw-facing tools will not accept raw `contentPublishForm`, free-form low-level platform form objects, or direct low-level publish payloads. Internal code may still build those payloads, but only inside the materialization layer just before preview or publish.

Why:

- Boundary clarity is the primary fix for bypass behavior.
- Low-level payload assembly is an implementation detail and changes with platform schema evolution.
- A caller should reason in terms of draft answers, not transport payloads.

Alternative considered:

- Leave low-level escape hatches for advanced callers. Rejected because it would preserve the exact path the model currently overuses.

### 4. Centralize validation in a dedicated draft validation/materialization layer

Validation will move from loosely distributed checks to a single draft-aware layer that can:

- reject unknown fields
- verify required fields for each targeted platform
- validate value types and enum membership
- ensure account/platform ownership matches draft scope
- resolve which missing inputs still block preview or publish

Materialization of low-level publish payloads will happen only from validated draft state.

Why:

- Today, field negotiation, merging, and publish payload construction are separated in ways that allow invalid state to survive too long.
- Draft-aware validation ensures preview and publish use one canonical interpretation of the data.

Alternative considered:

- Continue validating opportunistically in preview and publish methods. Rejected because it couples correctness to late-stage execution and duplicates logic.

### 5. Keep draft storage process-local for the first version

Drafts will live in process memory for this refactor. They are short-lived workflow state for a tool-driven conversation, not durable business records.

Why:

- It avoids introducing external storage or migration complexity during the protocol redesign.
- It matches the expected lifespan of a publish interaction.

Alternative considered:

- Persist drafts in database or filesystem. Rejected for now because it would expand scope beyond the protocol problem.

## Risks / Trade-offs

- [Process restart drops drafts] -> Use opaque draft IDs, make drafts explicitly ephemeral in tool descriptions, and design the API so persistence can be added later without changing caller semantics.
- [Schema metadata may be incomplete for some dynamic fields] -> Treat unsupported resolvers as explicit unresolved fields with structured limitation messages instead of falling back to guessed payloads.
- [Breaking API change for current OpenClaw callers] -> Remove deprecated payload shapes in one coordinated refactor and rewrite prompts/docs in the same change so the model sees only the new protocol.
- [More tool calls per publish workflow] -> Keep each tool narrow and machine-friendly, and rely on draft state to reduce repeated payload size and cognitive load.
- [Internal complexity shift] -> Accept more server-side orchestration complexity in exchange for a much safer public boundary.

## Migration Plan

1. Add draft/session management and new draft-oriented tool contracts.
2. Rebuild preview and publish on top of validated draft materialization.
3. Switch MCP/system prompts and skill tool registration to the new workflow.
4. Remove old OpenClaw-facing publish payload paths and documentation that reference raw low-level form submission.
5. Verify that all publish scenarios route through the draft workflow before deleting obsolete boundary code.

Rollback strategy:

- Revert to the previous tool registration set and old OpenClaw payload contract if the draft workflow proves incomplete during development.
- Because low-level publish execution remains on the same Yixiaoer transport, rollback is primarily a boundary/API rollback rather than a transport rollback.

## Open Questions

- Should the first implementation expose separate `create_draft` and `update_draft` tools, or allow idempotent upserts on one draft mutation tool?
- Should preview require an explicit “final validation” step, or should preview itself always return the authoritative blocker set?
- Which existing tool names should be retained as aliases, if any, versus removed outright in the same breaking refactor?
