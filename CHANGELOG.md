# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-alpha.1] - 2025-09-29

### Added
- Support for specific version selection with `--release <version>` option

### Changed
- Default behavior now uses GitHub's "latest" release (which includes betas marked as latest)
- `--pre` flag explicitly opts into pre-releases

### Breaking Changes
- Removed support for multiple templates. The CLI now uses a single, default starter template.
- Removed the `list` command.
- Removed the `-t, --template` option.

## [2.0.0] - 2024-03-21

### Breaking Changes
- Switched from `degit` to `tiged` for template cloning

## [1.2.0] - 2025-05-22

### Added
- Interactive project name prompt when no project name is provided
- Made project name argument optional
- Added graceful handling of prompt cancellation
- New `list` command to interactively view and select from available templates
- Restructured CLI with proper command system

### Fixed
- Bug where script would occasionally not exit properly after successful execution

## [1.1.0] - 2025-05-09

### Added
- Support for multiple starter templates:
  - `standard` (default): Uses `redwoodjs/sdk/starters/standard`
  - `starter`: Uses `redwoodjs/sdk/starter`
  - `drizzle`: Uses `redwoodjs/example-drizzle`
- New command-line option: `-t, --template <template>` to specify which template to use
- Template validation to ensure only valid templates are used
- Enhanced console output showing which template is being used

### Changed
- Updated README.md with documentation for the new template options
- Improved user interface with colored output for template names
- Renamed all instances of "RedwoodJS SDK" to "RedwoodSDK" for consistency

## [1.0.0] - 2025-05-09

### Added
- Initial release
- Basic functionality to create a RedwoodSDK project using the standard template
- Command-line interface with help and version information
- Support for force overwriting existing directories with `--force` flag
- Colored console output and spinner for better user experience
- Error handling for common issues
- README with usage instructions and examples
