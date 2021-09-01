# Introduction

This project is build with react native with expo for the mobile application and nodejs for the backend.

# Setting Up React Native Environment

1. Install all the dependencies of the project by running: npm i  
2. To run the application, there is a few ways.
    - <b>Running on mobile devices</b>
    - Install Expo Go from your device app store (android google play store, ios apple app store)
    - Start the mobile app by running: npm start
    - In the terminal or in the browser, there should be a QR code. Scan the QR code with the Expo Go app.
    - The app should be opened up, skip to the <b>Setting Up Backend Environment</b> section

    - <b>Running on android emulator</b>
    - Install Android Studio <a href="https://developer.android.com/studio">here</a>
    - Go through the installation and start Android Studio after the setup is complete
    - When Android Studio is opened, select "More Actions" dropdown and select AVD Manager.
    - Click on "Create Virtual Device", select any Phone (used pixel 5 for development) and press next, 
    download and choose the latest android release (R) and click next, click on the "Show Advanced Setting" button
    and scroll down, increase the Internal Storage to at least 12GB and increase the ram if you want better performance
    and click finish.
    - Click on the play button of the device, it will take sometimes to load.
    - Once loaded, go back to the project and open a terminal, run: npm start
    - In the terminal, press a to connect to the android emulator or in the browser, click run on Android device/emulator

    - <b>Running on ios emulator</b>
    - Install <a href="https://developer.apple.com/xcode/">Xcode</a> to run emulator on ios available for macos only
    - Because I do not own any macos, therefore, unable to give a very clear instruction for ios, but refer to this
    guide <a href="https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device">here</a>.
    - Once the emulator is running, go back to the project and open a terminal, run: npm start
    - In the browser, click run on IOS emulator

# Setting Up Backend

### Requirements
1. Must have node and npm installed, download <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">here</a>
2. Must have pgAdmin installed, download <a href="https://www.pgadmin.org/download/">here</a>

### Postgres Setup
1. Open up pgAdmin, and double click on server and double click PostgresSQL.
2. Right click on Login/Group Roles, select create>Login/Group Roles.
3. Input user1 for the name, select definition tab and input 123456 as the password, select Privileges tab and enable all the fields
and click save.
4. Right click on Databases, select create>database, input goalsetting for Database field and change the Owner to user1 and click save.
5. Repeat Step 4 but input goalsetting-test for Database field.
6. Right click on goalsetting, select restore, click on the folder button(...) navigate to backend folder, select "All Files" for the format,
search for this file called "table" and select it.
7. Click restore, a task will come out at the side. It should successfully restore the table (can view the table by expanding on schema>public>Tables)
8. Repeat step 6 and 7 for goalsetting-test

### Nodejs Setup
1. Change directory to backend in your terminal.
2. To install the dependencies, in the terminal run: npm i
3. In the terminal run: npm start
4. The server should be now up and running.

### To Run Test Case
1. In the terminal, run: npm test

