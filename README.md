# create-rwsdk

A simple CLI wrapper for creating RedwoodSDK starter projects with support for multiple templates.

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
- `-t, --template <template>`: Starter template to use (standard, minimal, drizzle) [default: "standard"]
- `-h, --help`: Display help information
- `-V, --version`: Display version number

## Examples

Create a new project with the default (standard) template:

```bash
create-rwsdk my-awesome-app
```

Create a project with the minimal template:

```bash
create-rwsdk my-awesome-app --template minimal
```

Create a project with the drizzle template:

```bash
create-rwsdk my-awesome-app --template drizzle
```

Force overwrite an existing directory:

```bash
create-rwsdk my-awesome-app --force
```

## What it does

This tool is a simple wrapper around the following commands, depending on the template you choose:

### Standard template (default)
```bash
npx degit redwoodjs/sdk/starters/standard <project-name>
```

### Minimal template
```bash
npx degit redwoodjs/sdk/starters/minimal <project-name>
```

### Drizzle template
```bash
npx degit redwoodjs/example-drizzle <project-name>
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
