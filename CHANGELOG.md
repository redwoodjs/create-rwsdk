# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-09

### Added
- Support for multiple starter templates:
  - `standard` (default): Uses `redwoodjs/sdk/starters/standard`
  - `minimal`: Uses `redwoodjs/sdk/starters/minimal`
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
