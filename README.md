# DECADENT: A DECentralized Application DEvelopmeNt Toolkit

### Table of Contents
* [Requirements](#requirements)

* [Installation](#installation)

* [Instructions](#instructions)

### Requirements
  * DECADENT was developed in a Linux Virtual Machine on Google Cloud. Consequently, a linux environment is needed for installation.
  * All frontend paths are relative to localhost. Accessing the running tool from a remote browser would result in broken paths. Therefore, it is recommendened that a webbrowser and some GUI to access the virtual machine are installed.
  * A blockchain RPC is needed for part I of DECADENT. [This link](https://medium.com/@Salmandabbakuti/deploying-ethereum-smartcontracts-on-hyperledgerfabric-532789e988dc) shows the installation of Hyperledger Fabric with Fab3. Hyperledger Sawtooth or Ethereum can also be used.
  * A modified version of Caterpillar is used for part II of DECADENT. The Docker image can be pulled and executed by running `docker run --rm -it -p 3200:3200 -p 3000:3000 -p 8090:8090 --name caterpillar jonathanvanwestendorp/caterpillar_bta:latest`. The original GitHub repository can be found [here](https://github.com/orlenyslp/Caterpillar).
  * Mongodb version 4.2.7 is used for data storage. It should be installed and ready to run on the VM.
  * Npm version 6.14.5 and Node.js version 10.20.1 were used for development of DECADENT. Other versions may also work, but it is recommended that you use the same.
  * Finally, for running docker images, Docker version 19.03.9 was used. Make sure this version or a later one is installed as well.

### Installation
Installing DECADENT is fairly straightforward. Both `server` and `client` folders are apps on its own. To install the needed packages, move to the root of this project and run `npm i`. Next, move into the `client` folder and run `npm i` again. This will install all needed packages.

### Instructions
To start the application, make sure both server and client side dependencies are installed. Then move to the root of this repo and run `./start.sh` (make sure the shell script is executable by running `chmod u+x ./start.sh`). This command starts DECADENT in development mode. See both package.json files for the commands to run in production mode. Next, start caterpillar by running `docker run --rm -it -p 3200:3200 -p 3000:3000 -p 8090:8090 --name caterpillar jonathanvanwestendorp/caterpillar_bta:latest`. This should get you all ready and set for exploring DECADENT!

Navigate to localhost:8080 from a local browser. You will find the DECADENT info page. Here, basic usage information can be found. On the other tabs, all different functionality of DECADENT can be explored. First, navigate to *start*. This is where you will choose between the simple smart contract exploration and the more extensive simulation. 

When choosing "Start from solidity!" The option is given to import a Solidity smart contract. A simple testing file is given in the `tests` folder. After selecting a .sol file, click submit to deploy it with the RPC running on the specified port. All callable function should be listed can be interacted with. If a function is called succesfully, the result will be viewable on the Transactions tab.

When choosing "Start from business process model!", you are taken to the Caterpillar tab, where you can import or create a business process model. Two BPM's for testing are available in the `tests` folder. For the best introduction, import the Crowd Journalism BPMN first. On the Simulation tab, the deployed BPM can be selected and simulated using the given parameters. All of them should be filled in for the simulation to start. Choose "Vary" to generate random values using a specified distribution. Keep in mind that the simulation can take a while so start slowly with 1 or 10 rounds!

Results of the simulation can be viewed on the Results tab. Where each collection of simulation rounds is listed. Click one of them to see the predefined analytics. For now, only timings are visible. But other metrics can be visualized easily by adding charts with Jscharting.

Thats it! DECADENT is very versatile so please take some time to explore. Also, it should be noted that this is a prototype, so it may (will) be a little buggy. Don't hesitate to create a pull request if you fix an issue!
