# How to add tier lists to the archive

### If the category already exists

First, add the tier list image to the appropriate folder based on game and category.
Both Smash 4 and Smash Ultimate have a corresponding JSON file that holds all the information about the image. The meta field contains information about what meta this tier list is for. For Smash Ultimate those being "Vanilla", or "Spirits". For Smash 4 those being "Vanilla", or "Equipment". "Both" is also an acceptable option.

```sh
  {
    "filepath": "CTL/4-18-2020.png",
    "meta": "Vanilla",
    "date": "4-18-2020"
  }
```
Then add the JSON data according to the above template to the appropriate json file. Make sure to add the JSON data in such a way that the list maintains chronological order. So if you are adding the most recent tier list, it should go at the bottom of the list for that category. The image does not have to have the name of its creation date, it just helps for organization to have it that way.

### If the category does not already

First, make a folder in the correct game folder with the name of the category. Then, add the tier list picture to that new folder.
The json file is formatted as a list of categories that contain a list of associated tier lists.
```sh
  {
    "name": "Amiibots",
    "lists": [
      {
        "filepath": "Amiibots/8-13-2021.png",
        "meta": "Vanilla",
        "date": "8-13-2021"
      }
    ]
  }
```
The "name" field in the JSON file **must** match the name of the newly made folder.
When you add a new category to the JSON file, make sure to maintain alphabetical order.
