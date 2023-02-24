---
title: 'Mastering VS Code: Sneaky Tips and Tricks for Beginner Coders'
metaTitle: 'VsCode Tips and Tricks'
metaDesc: 'We will learn how vscode makes life easy'
socialImage: images/react.jpg
date: '2022-10-24'
published: true
tags: -vscode
---

### Keyboard shortcuts

Using keyboard shortcuts in Visual Studio Code (VS Code) can greatly enhance your coding productivity and save you time. Instead of manually navigating through the menus, keyboard shortcuts allow you to quickly execute commands and perform tasks, such as opening and closing files, searching for code, or debugging your application.

With practice and familiarity, keyboard shortcuts can become second nature, allowing you to focus on the task at hand and avoid distractions caused by menu navigation. Additionally, using keyboard shortcuts can reduce the strain on your hands and wrists, as you can avoid repetitive mouse movements and clicks.

Overall, mastering keyboard shortcuts in VS Code can help you work faster and more efficiently, allowing you to spend more time coding and less time on repetitive tasks.
**Some Useful Shortcuts Are Mentioned Below -**

- **Ctrl + G** - Goto line
- **Alt + ↑** - Take line to upper
- **Alt + ↓** - Take line to lower
- **Ctrl + L** - Select whole line
- **Ctrl + Shift + L** - Select all occurrence
- **Ctrl + Alt + / or Alt + mouse click** - Select multiple lines
- **Alt + Shift + ↑ or Alt + Shift + ↓** - Copy line above or down
- **Ctrl + ]** - Indent lines
- **Ctrl + [** - Outdent lines
- **Ctrl + Alt + ->(Arrow Keys)** - Move code to new tab group

#### Use these with vscode plugins ->

- **Ctrl + Alt + l** - Console log (turbo console log)
- **Alt + Shift + d** - Console log delete (turbo console log)
- **Alt + Shift + u** - Console log uncomment (turbo console log)
- **Alt + Shift + c** - Console log comment (turbo console log)

## Top Vscode Extentions

## Themes

1. Dracula official
2. Ayu
3. Community material
4. One dark pro
5. Andromeda

## Icons

1. Vscode icons
2. Material icon theme

## Snippets

1. ES7, React, Redux & GraphQL Snippets
2. Tailwind Css Intellisense

## Path

1. Path intellisense [For completing filepath’s]
2. Path AutoComplete
3. npm intellisense
4. Auto import

## Tags

1. Autoclose Tag
2. AutorenameTag
3. Html tag wrapper

## Spelling

1. Code spell checker

## Screenshot

1. Codesnap

## Sidebar

1. Peacock

## Formatting

1. Prettier
2. Bracket Pair Colorizer
3. Inline fold (For tailwind)

## Debugging

1. Live server
2. Turbo console log
3. Emoji snippets
4. GitLens
5. Githistory
6. Import Cost
7. Quokka.js

## Tracking

1. Todo tree
2. Better Comments
3. Sapling(React hierarchy )

## Copilot

1. Tabnine
2. Github Copilot

## Speedy coding

1. Glean(React Refactor)
2. Multiple cursor case preserve

#### Todo Tree Config:

```
"todo-tree.highlights.defaultHighlight": {
        "icon": "alert",
        "type": "tag",
        "foreground": "black",
        "background": "white",
        "fontWeight": "bold",
        "iconColour": "blue",
        "gutterIcon": true,
    },
    "todo-tree.highlights.customHighlight": {
        "TODO": {
            "icon": "check",
            "foreground": "white",
            "background": "orange",
            "iconColour": "white",
        },
        "NOTE": {
            "icon": "note",
            "foreground": "white",
            "background": "#832561",
            "iconColour": "#832561",
        },
        "COMMENT": {
            "icon": "note",
            "foreground": "white",
            "background": "gray",
            "iconColour": "gray",
        },
        "FIXME": {
            "foreground": "white",
            "rulerLane":"none",
            "background": "pink",
            "iconColour": "yellow",
        },
        "BUG": {
            "foreground": "black",
            "background": "red",
            "iconColour": "red",
        },
        "[ ]": {
            "icon": "check",
            "foreground": "black",
            "background": "white",
            "iconColour": "yellow",
        },
        "[x]": {
            "icon": "check",
            "foreground": "white",
            "background": "green",
            "iconColour": "green",
        }
    },"todo-tree.general.tags": [
        "BUG",
        "HACK",
        "FIXME",
        "TODO",
        "NOTE",
        "COMMENT",
        "[ ]",
        "[x]"
    ],
```
