# fe-space-wars

### Hosted Example

[Play](http://spacewarsfront.eu-4.evennode.com/)

### Back End Repo

[Available Here](https://github.com/Mycroftd/be-space-wars)

## Summary
This project uses pixi.js to implement the front end of a 2D PvP Space Shooter Game, and uses websockets to allow communication between players via a backend server. The game has a start screen that shows instructions and allows a user to enter a player name, providing appropriate feedback if the input is inappropriate. A waiting message is displayed as the server waits for a second player to pair with, at that time a countdown is displayed then the players enter a match. Players use simple WASD and space keystrokes to increase and decrease velocity, and the mouse is used to point and shoot at the opponent. The game implements a scrolling background, asteroid obstacles in the foreground, weapons powerups, a particle effect for ship engines, explosion animation on death, and healthbars to display changes in player and opponent health when hit.

## Cloning
On the main page of this repository click 'code' and copy the URL, then at the command line do:

    git clone <URL>

## Running Locally
To install dependencies run:
    
    npm install

To open the server:

    npm start

If a browser page doesnt automatically open, open one with this address:

    localhost:3000/
