# create-rwsdk

A simple CLI wrapper for creating RedwoodSDK starter projects with support for multiple templates.

## Installation

You can use this package directly with npx:

```bash
npx create-rwsdk my-project
```

## Usage

```bash
create-rwsdk [project-name] [options]
```

### Commands

- `create`: Create a new project (default command when no command is specified)
- `list`: List and interactively select from available templates

### Arguments

- `[project-name]`: Name of the project directory to create (optional, will prompt if not provided)

### Options

- `-f, --force`: Force overwrite if directory exists
- `-t, --template <template>`: Starter template to use (standard, minimal) [default: "standard"]
- `-h, --help`: Display help information
- `-V, --version`: Display version number

## Examples

Create a new project with the default (standard) template:

```bash
create-rwsdk my-awesome-app
```

Create a new project with an interactive prompt for the project name:

```bash
create-rwsdk
# You will be prompted: What is the name of your project?
```

List and interactively select from available templates:

```bash
create-rwsdk list
# You will see a list of templates to choose from and then be prompted for a project name
```

Create a project with the minimal template:

```bash
create-rwsdk my-awesome-app --template minimal
```

Force overwrite an existing directory:

```bash
create-rwsdk my-awesome-app --force
```

## What it does

This tool is a simple wrapper around the following commands, depending on the template you choose:

### Standard template (default)

```bash
npx tiged redwoodjs/sdk/starters/standard <project-name>
```

### Minimal template

```bash
npx tiged redwoodjs/sdk/starters/minimal <project-name>
```

## Next steps after creating a project

```bash
cd <project-name>
pnpm install
pnpm dev
```

Check out the full [RedwoodSDK documentation](https://rwsdk.com/docs).

## License

MIT
