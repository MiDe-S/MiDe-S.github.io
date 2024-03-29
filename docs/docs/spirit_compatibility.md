## How to update a specific move

The table shown on the [compatibility page](https://mide-s.github.io/spirit_compatibility_chart/index.html?char=0) is really just a fancy representation of the [compatibility.json](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/spirit_compatibility_chart/compatibility.json) file.

This is an example of what the beginning of that JSON file looks like.

```sh
{
    "name": "Mario",
    "compatibility_matrix": [
      [
        "Aura",
        "Electric",
        "Energy-Shot",
        "Fire & Explosion",
        "Fist",
        "Foot",
        "Magic",
        "Physical",
        "PSI",
        "Shooting",
        "Strong Throw",
        "Toss & Meteor",
        "Water & Ice",
        "Weapon"
      ],
      [
        "Neutral attack Hit 1",
        "False",
        "False",
        "False",
        "False",
        "True",
        "False",
        "False",
        "True",
        "False",
        "False",
        "False",
        "False",
        "False",
        "False"
      ]
}
```
Each move / effect combination has 4 valid values: "True", "False", "Mixed", "Null".

Let's say you figured out that Falco's Final Smash gets buffed from Shooting Attack Up. In order to make that change to the JSON file you have to do the following things.
1. Download the [JSON file](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/spirit_compatibility_chart/compatibility.json) and this [python script](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/spirit_compatibility_chart/validate_connect_totals.py)
2. Locate the character in the JSON file
3. Locate the move
4. Find the value corresponding to that effect in the move's list
5. Change it to the proper value and save the file
6. Run the python script (this is to ensure Total values are correct, don't try to do it by hand)

That's it! Everything should be correct now.

## How to add a character
When a new character comes out, I scrape these [ssbwiki pages](https://www.ssbwiki.com/Kazuya_(SSBU)/Forward_smash) for character move data.
Then I run a python script that determines what moves are affected by what values based on their type/effect/angle/name.
Then I add the character to the bottom of this [JSON file](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/spirit_compatibility_chart/compatibility.json).
Then I run this [python script](https://github.com/MiDe-S/MiDe-S.github.io/blob/main/spirit_compatibility_chart/validate_connect_totals.py) to get accurate totals.
