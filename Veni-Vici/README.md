# Web Development Project 4 - *Veni-Vici*

Submitted by: **Shreya Pasupuleti**

This web app: **Feathered Friends discovers random bird observations from the iNaturalist API. Clicking "Discover a Bird" fetches a random page of research-grade, photographed bird observations and displays one at a time: common name, scientific name, location, observation date, observer, identification count, and photo. Common name, location, and observer are clickable — clicking adds them to a ban list, and future discoveries exclude any observation matching a banned species, location, or observer. Clicking a banned entry again removes it.**

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed: 

- [x] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - Displays common name, scientific name, location, observation date, observer, and identification count alongside the photo on every click
- [x] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - Only the current bird is rendered; results without a photo are filtered out before selection
- [x] **API call response results should appear random to the user**
  - Each click fetches a random page (1–20) of 50 observations from iNaturalist, then shuffles and filters candidates client-side
- [x] **Clicking on a displayed value for one attribute adds it to a displayed ban list**
  - Common name, location, and observer are rendered as `<button>` elements; clicking a value not on the ban list adds it, clicking a value already on the ban list removes it
- [x] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - Candidates are filtered against the ban list before a new bird is selected; if every candidate is banned, an error message is shown instead
  -  [x] _To ensure an accurate grade, your recording **must** show that when clicked, an attribute in the ban list is immediately removed from the list of banned attributes_


The following **optional** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list
  - Species (common name), location, and observer are all bannable independently
- [ ] Users can see a stored history of their previously displayed  results from this session

The following **additional** features are implemented:

* The currently displayed bird stays visible after banning one of its own attributes (species/location/observer), rather than disappearing immediately
* Ban list panel shows each entry's type and value, with a button to unban

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

iNaturalist's `photos[0].url` returns a `square` thumbnail by default; swapped in `medium` for a larger display image. Not every research-grade observation has a photo or full attribute set, so candidates without an image are filtered out before a bird is selected, and ban-toggle buttons are disabled when the underlying attribute (e.g. observer) is missing.

## License

    Copyright [2026] [Shreya Pasupuleti]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.