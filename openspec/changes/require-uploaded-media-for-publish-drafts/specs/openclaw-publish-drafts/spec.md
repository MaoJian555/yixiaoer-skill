## ADDED Requirements

### Requirement: OpenClaw publish drafts SHALL require uploaded media assets
The system SHALL require OpenClaw callers to upload required media assets before those assets can be attached to a publish draft. Publish-draft media inputs SHALL use standardized uploaded asset descriptors rather than raw local file paths or remote source URLs.

#### Scenario: Create draft with uploaded media assets
- **WHEN** an OpenClaw caller creates a publish draft using media descriptors that already contain uploaded asset keys and normalized metadata
- **THEN** the system accepts the media as valid draft state and continues draft validation

#### Scenario: Reject raw media sources during draft creation
- **WHEN** an OpenClaw caller creates or updates a publish draft using media entries that only contain `localPath` or `url` style raw upload sources
- **THEN** the system rejects the draft mutation and instructs the caller to upload media first

### Requirement: Upload media SHALL be an explicit required workflow step
The system SHALL expose media upload as an explicit OpenClaw workflow step and SHALL describe the publish workflow in the order `upload_media -> create/update draft -> requirements -> answers -> preview -> publish`.

#### Scenario: Tool guidance requires upload before draft mutation
- **WHEN** publish-related OpenClaw tools are registered or described to the caller
- **THEN** their guidance identifies media upload as a required pre-step before publish draft creation or media-changing draft updates

#### Scenario: Reuse uploaded media across draft operations
- **WHEN** an OpenClaw caller uploads media once and then reuses the returned standardized asset descriptors in draft creation, preview, and publish
- **THEN** the system treats those descriptors as the canonical media state for the workflow

### Requirement: Preview and publish SHALL NOT perform implicit media uploads
Preview and publish operations SHALL operate only on uploaded media assets already stored on the draft. They SHALL NOT ingest local files, fetch remote source URLs for upload, or perform hidden upload fallback on behalf of the OpenClaw caller.

#### Scenario: Preview uses only uploaded media state
- **WHEN** an OpenClaw caller previews a valid draft with uploaded media assets
- **THEN** the system builds the preview from the uploaded draft media state without performing upload side effects

#### Scenario: Publish rejects drafts without uploaded media
- **WHEN** an OpenClaw caller attempts to publish a draft whose required media are missing or not represented as uploaded asset descriptors
- **THEN** the system refuses to publish and returns explicit blockers instead of attempting implicit upload

### Requirement: Publish-type media validation SHALL evaluate uploaded asset roles
The system SHALL validate required media roles for each publish type against uploaded asset descriptors already attached to the draft. Video publish SHALL require an uploaded video asset and uploaded cover asset; image-text publish SHALL require uploaded content images and any required cover role; article publish SHALL require uploaded cover assets required by the targeted platform scope.

#### Scenario: Video draft requires uploaded video and cover
- **WHEN** an OpenClaw caller creates or publishes a video draft without an uploaded video asset or uploaded cover asset
- **THEN** the system reports those missing uploaded roles as blockers

#### Scenario: Image-text draft requires uploaded images
- **WHEN** an OpenClaw caller creates or publishes an image-text draft without uploaded content images
- **THEN** the system reports missing uploaded image assets as blockers
