Install

	Python 3
Run

	in source directory, python3 -m http.server

File Structure

	source/

	     1. index.html - The user experience aspect of the application is defined.
	     2. index.js - The logic to handle the keyboard and mouse input and screen graph and all the functionalities.
	     3. avatar.js - Avatar class where all the avatar methods are done.
	     4. group1.js - Group class contains ball and obstacles.
	     8. model/ - This directory contains 3D model related files.

	image/

		1. image.png - Screenshot of the canvas.
		2. video.mp4 - Demo of the application.

Instructions

		User-interaction:

			Keys to select control mode:
				
				"up arrow" will move the avatar in forward motion.
				"down arrow" will move the avatar in backward motion.
				"left arrow" will rotate the avatar in anti-clockwise direction.
				"right arrow" will rotate the avatar in clockwise direction
				"C" changes to Carry mode and then with arrow buttons the ball will move along with avatar if there are intersecting. Ball motion is rest relative to avatar.
				"D" changes to Drrible mode and then with arrow buttons the ball moves on a short distance as the player moves around
				"K" will move the ball towards the goal by leaving the player.
				"X" toggles between main camera and avatar camera.
				"Z" will let toggle only avatar with arrow buttons.
				mouse movement - changes the view camera according to the movement.
			Lights controls:
				"6" will switch off all the street lights.
				"7" wil switch on all the street lights.
				"8" will increase the intensity of street lights.
				"9" will decrease the intensity of street lights.
			Second- player controls:
				"1" the 2nd player moves forward.
				"2" the 2nd player moves backward.
				"3" the 2nd player rotates in anti-clockwise direction.
				"4" the 2nd player rotates in anti-clockwise direction.
				
				
				
