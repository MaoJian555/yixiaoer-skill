## Context

The draft-based publish refactor narrowed OpenClaw publishing into a safer workflow, but media handling still spans two protocol layers. Callers can upload media first, yet drafts may still carry raw `localPath` or `url` inputs and rely on preview/publish execution to convert them into publish-ready assets. That leaves the public contract ambiguous: the workflow appears draft-driven, while media preparation still behaves like an implicit execution-time side effect.

This change tightens that boundary. The user-facing workflow must now treat media upload as a required pre-step, so draft creation, preview, and publish all operate on the same standardized asset state.

## Goals / Non-Goals

**Goals:**

- Make uploaded media a required prerequisite for OpenClaw publish drafts.
- Ensure draft state contains only publish-ready media descriptors rather than raw upload sources.
- Remove implicit media upload/materialization fallback from preview and publish execution.
- Update workflow guidance so OpenClaw callers follow a single explicit path: upload, draft, negotiate, answer, preview, publish.

**Non-Goals:**

- Reworking the underlying Yixiaoer upload API or storage contract.
- Adding durable media libraries, asset history, or draft persistence.
- Expanding this change to solve account selection UX in the same scope.
- Supporting hybrid draft states where some required media are uploaded and others remain raw.

## Decisions

### 1. Draft media inputs will be limited to uploaded asset descriptors

Publish draft input will accept only standardized media descriptors that already contain an uploaded media key plus normalized metadata such as width, height, size, and duration when applicable. Raw `localPath` and remote `url` inputs remain valid for the upload tool, but they are no longer valid as publish-draft media state.

Why:

- Draft state becomes stable, serializable workflow state instead of a mix of intent and pending side effects.
- Validation can determine publish readiness without needing to guess whether a later upload step might succeed.
- Preview and publish operate on the exact same asset references.

Alternative considered:

- Allow mixed draft media shapes and reject them only at preview/publish time. Rejected because it keeps upload semantics implicit and delays protocol failures too long.

### 2. Media upload becomes an explicit required protocol step

The OpenClaw workflow will explicitly require `upload_media` before draft creation or before any draft update that changes required media. Tool descriptions and prompt guidance will treat upload as part of the publish protocol rather than an optional convenience helper.

Why:

- Callers need a single unambiguous workflow.
- Explicit upload failures are easier to recover from than publish-time fallback failures.
- Standardized media keys can be reused across draft updates, previews, and retries.

Alternative considered:

- Keep upload optional for convenience. Rejected because optional upload reintroduces multiple media state paths and weakens the contract.

### 3. Preview and publish will stop performing implicit media uploads

Preview and publish will consume only uploaded media descriptors already stored on the draft. Internal media conversion may still normalize uploaded descriptors into low-level account payloads, but it must not perform network upload or local-file ingestion on behalf of OpenClaw callers.

Why:

- Preview and publish should be pure operations over validated draft state.
- Execution-time uploads blur the responsibility boundary and create state drift between what was previewed and what is ultimately published.
- Failure handling becomes cleaner because upload failures stay in the upload stage.

Alternative considered:

- Preserve implicit upload as a hidden fallback for backward compatibility. Rejected because it undermines the mandatory-upload rule and keeps the old ambiguity alive.

### 4. Draft validation will treat missing uploaded media as a hard blocker

Draft creation and draft updates will reject media entries that are not already standardized uploaded assets. Publish-type-specific validation will continue to enforce required roles such as video, cover, content image, or vertical cover, but it will now evaluate those roles only against uploaded assets already present on the draft.

Why:

- It keeps publish readiness checks deterministic.
- It prevents partially prepared drafts from appearing publish-ready until required assets actually exist.

Alternative considered:

- Create placeholder drafts with unresolved raw media references. Rejected because that creates a second class of draft with different semantics.

## Risks / Trade-offs

- [More explicit workflow steps] -> Keep `upload_media` narrow and reusable so callers can batch uploads once and reuse returned asset descriptors across later steps.
- [Breaking callers that send raw media in drafts] -> Update tool descriptions, prompts, and validation errors to clearly explain that raw media must be uploaded first.
- [Large uploads now fail earlier] -> Return upload results in a reusable standardized shape so callers can retry upload without rebuilding the rest of the draft.
- [Some existing tests assume publish-time conversion from raw media] -> Replace those tests with upload-first workflow coverage so the new boundary is enforced end-to-end.

## Migration Plan

1. Narrow draft media schemas and validators so raw media sources are rejected for publish drafts.
2. Update skill/tool descriptions and prompt guidance to make `upload_media` a required pre-step.
3. Remove implicit upload behavior from preview/publish materialization paths.
4. Update tests to cover upload-first draft creation, preview, and publish.

Rollback strategy:

- Restore the previous draft media schema and publish-time upload fallback if the stricter workflow blocks important scenarios.
- Because the upload transport remains unchanged, rollback is limited to the OpenClaw workflow boundary rather than storage infrastructure.

## Open Questions

- Should `upload_media` reject unsupported or missing dimension metadata up front, or keep supplying defaults as it does today?
- Should draft-update calls require re-upload only when media content changes, or also when callers merely reorder already-uploaded assets?
