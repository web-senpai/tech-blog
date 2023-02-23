---
title: 'Mastering VS Code: Sneaky Tips and Tricks for Beginner Coders'
metaTitle: 'VsCode Tips and Tricks'
metaDesc: 'We will learn how vscode makes life easy'
socialImage: images/react.jpg
date: '2022-10-24'
tags:
 -vscode
---

## Keyboard shortcuts
+ **Ctrl + G>** - Goto line
+ **Ctrl + Alt +  l** - Console log (turbo space)
+ **Alt + Shift + d** - Console log delete (turbo space)
+ **Alt + Shift + u** - Console log uncomment (turbo space)
+ **Alt + Shift + c** - Console log comment (turbo space)
+ **Alt + ↑** - Take line to upper
+ **Alt + ↓** - Take line to lower
+ **Ctrl + L** - Select whole line
+ **Ctrl + Shift + L** - Select all occurrence
+ **Ctrl + Alt + / or Alt + mouse click** - Select multiple lines
+ **Alt + Shift + ↑ or Alt + Shift + ↓** - Copy line above or down
+ **Ctrl + ]** - Indent lines
+ **Ctrl + [** - Outdent lines
+ **Ctrl + Alt + ->** - Move code to new tab group


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

## Path
1. Path intellisense [For completing filepath’s]
2. Path AutoComplete
3. npm intellisense

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

## Debugging
1. Live server
2. Turbo space
3. Emoji snippets
4. GitLens
5. Githistory
6. Import Cost
7. Quokka.js

## Tracking
1. Todo tree
2. Better Comments

## Copilot
1. Tabnine

### Config:
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