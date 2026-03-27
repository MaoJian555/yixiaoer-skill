## Why

The current draft workflow still allows media inputs to remain in mixed raw forms such as local paths, remote URLs, or already-uploaded keys. That leaves upload behavior partially implicit inside preview/publish execution, which weakens the protocol boundary and makes draft state less predictable.

## What Changes

- Require OpenClaw publishing workflows to upload media assets before they can be used in a publish draft.
- Narrow draft media inputs to standardized uploaded asset descriptors instead of raw local-path or remote-URL sources.
- Move media preparation out of preview/publish execution so those steps operate only on already-prepared draft state.
- Update tool descriptions and workflow guidance so callers follow `upload_media -> create/update draft -> requirements -> answers -> preview -> publish`.
- **BREAKING** Publish drafts will no longer accept raw media sources as valid publish-ready inputs.
- **BREAKING** Publish execution will no longer perform implicit media uploads as a last-mile fallback for OpenClaw callers.

## Capabilities

### New Capabilities
- `openclaw-publish-drafts`: A draft-driven OpenClaw publishing workflow that requires uploaded media assets before preview and publish.

### Modified Capabilities

## Impact

- Affected code: `src/openclaw-tools/`, `src/publish/`, and publish-related tests.
- Affected APIs: OpenClaw publish draft contracts, media upload workflow expectations, and publish tool descriptions.
- Affected behavior: media upload becomes a required pre-step; preview and publish consume only standardized uploaded media assets.
- Removal scope: implicit upload fallbacks from draft publish execution and any OpenClaw-facing guidance that suggests drafts may contain raw local or remote media sources.
