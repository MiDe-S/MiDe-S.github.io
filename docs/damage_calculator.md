## Damage Calculator General Information

The damage calculator is somewhat of a mess, I apologize in advance.

The damage calculator makes use of three JSON files and three JavaScript files.
| File      | Description |
| ----------- | ----------- |
| [moves.json](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/data/moves.json)      | Contains all character/move/hitbox information      |
| [connect.json](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/data/connect.json)   | Connects move types/effects to what effects affect them  |
| [effects.json](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/data/effects.json) | Contains all the effect information |
| | |
| [data_handler.js](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/damage_calculator/js/data_handler.js) | Handles reading JSON files and converting them into JS objects |
| [dynamic_inputs.js](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/damage_calculator/js/dynamic_inputs.js)| Responsible for dynamic input fields and input validation |
| [calculate.js](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/damage_calculator/js/calculate.js)| Handles everything related to calculating move damage |

Let's say you wanted to add in a checkbox for Wii Fit Trainer's Deep Breathing ability. You would then have to
- Add a checkbox to the [HTML page](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/damage_calculator/index.html) that has a default display style of "none"
- Add some JS code to the [generateMoves function](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/damage_calculator/js/data_handler.js) so that the checkbox appears when WFT is selected and disappears when they aren't selected
- Add some JS code to the [calculate function](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/damage_calculator/js/calculate.js) so that when WFT is selected, it figures out the necessary multiplier to use
- Also add the following JS code to that same section so that the multiplier shows up in the summary table
```sh
            addRow(["Deep Breathing", 1.05], table_id, false);
```
Assuming no mistakes were made this *should* be all you need to add something to the calculator.
