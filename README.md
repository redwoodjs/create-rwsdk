# create-rwsdk

A simple CLI wrapper for creating RedwoodSDK starter projects.

## Installation

You can use this package directly with npx:

```bash
npx create-rwsdk my-project
```

## Usage

```bash
create-rwsdk [project-name] [options]
```

### Arguments

- `[project-name]`: Name of the project directory to create (optional, will prompt if not provided)

### Options

- `-f, --force`: Force overwrite if directory exists
- `-h, --help`: Display help information
- `-V, --version`: Display version number

## Examples

Create a new project:

```bash
create-rwsdk my-awesome-app
```

Create a project with an interactive prompt for the project name:

```bash
create-rwsdk
# You will be prompted: What is the name of your project?
```

Force overwrite an existing directory:

```bash
create-rwsdk my-awesome-app --force
```

## Next steps after creating a project

```bash
cd <project-name>
npm install
npm run dev
```

Check out the full [RedwoodSDK documentation](https://rwsdk.com/docs).

## License

MIT
