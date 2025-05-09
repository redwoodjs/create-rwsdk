# create-rwsdk

A simple CLI wrapper for creating RedwoodSDK starter projects, using the standard template.

## Installation

You can use this package directly with npx:

```bash
npx create-rwsdk my-project
```

Or install it globally:

```bash
npm install -g create-rwsdk
create-rwsdk my-project
```

## Usage

```bash
create-rwsdk <project-name> [options]
```

### Arguments

- `<project-name>`: Name of the project directory to create (required)

### Options

- `-f, --force`: Force overwrite if directory exists
- `-h, --help`: Display help information
- `-V, --version`: Display version number

## Examples

Create a new project:

```bash
create-rwsdk my-awesome-app
```

Force overwrite an existing directory:

```bash
create-rwsdk my-awesome-app --force
```

## What it does

This tool is a simple wrapper around:

```bash
npx degit redwoodjs/sdk/starters/standard <project-name>
```

It provides a more user-friendly interface with helpful messages and error handling.

## Next steps after creating a project

```bash
cd <project-name>
pnpm install
pnpm dev
```

Check out the full [RedwoodSDK documentation](https://rwsdk.com/docs).

## License

MIT
