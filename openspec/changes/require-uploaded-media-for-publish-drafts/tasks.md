## 1. Draft Media Boundary

- [x] 1.1 Narrow publish-draft media input types and validators so draft mutations reject raw `localPath` and `url` media sources
- [x] 1.2 Enforce publish-type media role validation against uploaded asset descriptors only
- [x] 1.3 Update draft creation and draft update error messages to instruct callers to run `upload_media` first

## 2. Workflow Guidance

- [x] 2.1 Update OpenClaw skill tool descriptions so `upload_media` is described as a required pre-step
- [x] 2.2 Update publish draft tool descriptions and prompt guidance to reflect the upload-first workflow order

## 3. Publish Execution Boundary

- [x] 3.1 Remove implicit upload fallback from draft preview and publish materialization paths
- [x] 3.2 Ensure preview and publish consume only uploaded media descriptors already stored on the draft
- [x] 3.3 Verify low-level publish payload building still works when fed uploaded-only media state

## 4. Verification

- [x] 4.1 Add or update tests covering rejection of raw media during draft mutation
- [x] 4.2 Add or update tests covering successful upload-first draft creation, preview, and publish
- [x] 4.3 Add or update tests confirming publish does not attempt implicit upload when required uploaded media are missing
