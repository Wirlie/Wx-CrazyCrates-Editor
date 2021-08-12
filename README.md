# Wx CrazyCrates Editor
An editor that allows you to edit Crate configurations from the Spigot Plugin [CrazyCrates](https://www.spigotmc.org/resources/crazy-crates.17599/ "CrazyCrates"), made with ReactJS, Typescript and Electron.

Currently the editor only supports MC 1.13+ versions and the latest CrazyCrates update available from Spigot.

- **Supported Minecraft Versions:** 1.13+
- **Supported CrazyCrates Version:** v1.10.1 (may work with older versions than this)
- **Supported languages:** Spanish (English coming soon...)

## How to build and install (Windows)
This project was build using NodeJS  16.3.0, but may work with other versions.

1. You do need to have NodeJS installed in your machine/environment.
2. Install node dependencies with: **npm install**
3. Run **npm run electron-pack** to pack project using Electron.
4. A `/dist` folder will be generated when the previous command ends, install the .exe file available inside in the `dist` folder.
5. After installation ends, you must be able to use the editor.

## For Linux and macOS users
I know that electron-builder can be configured to work with Linux and macOS, you must edit this repository with the appropriate modifications and run the steps described in the above section. For now, I only provide instruction for windows users because that is the OS that I use, but if you want to provide instructions for Linux/macOS users, please make a pull request.

## Suggestions/Bug reports
For suggestions or bug reports, feel free to make a new issue. Also Pull Requests are welcome.

##License
Please read the LICENSE file for more information about the license of this application.
