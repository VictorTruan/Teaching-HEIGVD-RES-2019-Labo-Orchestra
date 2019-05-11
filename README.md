# Teaching-HEIGVD-RES-2019-Labo-Orchestra

## Admin

* **Every student** must do the implementation and have a repo with the code at the end of the process.
* It is up to you if you want to fork this repo, or if you prefer to work in a private repo. However, you have to **use exactly the same directory structure for the validation procedure to work**. 
* **There will be no grade for this lab. However, if you work on it seriously, the next challenge will be very easy (just be careful: the challenge will be done on a short period, so don't be late!)**
* We expect that you will have more issues and questions than with other labs (because we have a left some questions open on purpose). Please ask your questions on Telegram, so that everyone in the class can benefit from the discussion.

## Objectives

This lab has 4 objectives:

* The first objective is to **design and implement a simple application protocol on top of UDP**. It will be very similar to the protocol presented during the lecture (where thermometers were publishing temperature events in a multicast group and where a station was listening for these events).

* The second objective is to get familiar with several tools from **the JavaScript ecosystem**. You will implement two simple **Node.js** applications. You will also have to search for and use a couple of **npm modules** (i.e. third-party libraries).

* The third objective is to continue practicing with **Docker**. You will have to create 2 Docker images (they will be very similar to the images presented in class). You will then have to run multiple containers based on these images.

* Last but not least, the fourth objective is to **work with a bit less upfront guidance**, as compared with previous labs. This time, we do not provide a complete webcast to get you started, because we want you to search for information (this is a very important skill that we will increasingly train). Don't worry, we have prepared a fairly detailed list of tasks that will put you on the right track. If you feel a bit overwhelmed at the beginning, make sure to read this document carefully and to find answers to the questions asked in the tables. You will see that the whole thing will become more and more approachable.


## Requirements

In this lab, you will **write 2 small NodeJS applications** and **package them in Docker images**:

* the first app, **Musician**, simulates someone who plays an instrument in an orchestra. When the app is started, it is assigned an instrument (piano, flute, etc.). As long as it is running, every second it will emit a sound (well... simulate the emission of a sound: we are talking about a communication protocol). Of course, the sound depends on the instrument.

* the second app, **Auditor**, simulates someone who listens to the orchestra. This application has two responsibilities. Firstly, it must listen to Musicians and keep track of **active** musicians. A musician is active if it has played a sound during the last 5 seconds. Secondly, it must make this information available to you. Concretely, this means that it should implement a very simple TCP-based protocol.

![image](images/joke.jpg)


### Instruments and sounds

The following table gives you the mapping between instruments and sounds. Please **use exactly the same string values** in your code, so that validation procedures can work.

| Instrument | Sound         |
|------------|---------------|
| `piano`    | `ti-ta-ti`    |
| `trumpet`  | `pouet`       |
| `flute`    | `trulu`       |
| `violin`   | `gzi-gzi`     |
| `drum`     | `boum-boum`   |

### TCP-based protocol to be implemented by the Auditor application

* The auditor should include a TCP server and accept connection requests on port 2205.
* After accepting a connection request, the auditor must send a JSON payload containing the list of <u>active</u> musicians, with the following format (it can be a single line, without indentation):

```
[
  {
  	"uuid" : "aa7d8cb3-a15f-4f06-a0eb-b8feb6244a60",
  	"instrument" : "piano",
  	"activeSince" : "2016-04-27T05:20:50.731Z"
  },
  {
  	"uuid" : "06dbcbeb-c4c8-49ed-ac2a-cd8716cbf2d3",
  	"instrument" : "flute",
  	"activeSince" : "2016-04-27T05:39:03.211Z"
  }
]
```

### What you should be able to do at the end of the lab


You should be able to start an **Auditor** container with the following command:

```
$ docker run -d -p 2205:2205 res/auditor
```

You should be able to connect to your **Auditor** container over TCP and see that there is no active musician.

```
$ telnet IP_ADDRESS_THAT_DEPENDS_ON_YOUR_SETUP 2205
[]
```

You should then be able to start a first **Musician** container with the following command:

```
$ docker run -d res/musician piano
```

After this, you should be able to verify two points. Firstly, if you connect to the TCP interface of your **Auditor** container, you should see that there is now one active musician (you should receive a JSON array with a single element). Secondly, you should be able to use `tcpdump` to monitor the UDP datagrams generated by the **Musician** container.

You should then be able to kill the **Musician** container, wait 10 seconds and connect to the TCP interface of the **Auditor** container. You should see that there is now no active musician (empty array).

You should then be able to start several **Musician** containers with the following commands:

```
$ docker run -d res/musician piano
$ docker run -d res/musician flute
$ docker run -d res/musician flute
$ docker run -d res/musician drum
```
When you connect to the TCP interface of the **Auditor**, you should receive an array of musicians that corresponds to your commands. You should also use `tcpdump` to monitor the UDP trafic in your system.


## Task 1: design the application architecture and protocols

| #  | Topic |
| --- | --- |
|Question | How can we represent the system in an **architecture diagram**, which gives information both about the Docker containers, the communication protocols and the commands? |
| | *Insert your diagram here...* |
|Question | Who is going to **send UDP datagrams** and **when**? |
| |Les musiciens vont envoyer des datagrammes toutes le X secondes.|
|Question | Who is going to **listen for UDP datagrams** and what should happen when a datagram is received? |
| | Les auditeurs vont écouter les paquets, ils vont fournir un JSON contenant les données recuent.|
|Question | What **payload** should we put in the UDP datagrams? |
| | The instrument, the sound, the uuid and the started time of the musician.|
|Question | What **data structures** do we need in the UDP sender and receiver? When will we update these data structures? When will we query these data structures? |
| | A list a pair key-values with "uuid", "instrument" and "activeSince" |


## Task 2: implement a "musician" Node.js application

| #  | Topic |
| ---  | --- |
|Question | In a JavaScript program, if we have an object, how can we **serialize it in JSON**? |
| |La fonction JSON stringify permet de facilement passer d'un objet à un String JSON. La fonction inverse est JSON.parse|
|Question | What is **npm**?  |
| | C'est un gestionnaire de paquet et librairie javascript |
|Question | What is the `npm install` command and what is the purpose of the `--save` flag?  |
| | Cela permet d'insaller toutes les dépendances et package  |
|Question | How can we use the `https://www.npmjs.com/` web site?  |
| | On peut rechercher quelques mots clef afin de facilement trouver une librairie proposant ce que nous voulons. (Si cela existe biensur) |
|Question | In JavaScript, how can we **generate a UUID** compliant with RFC4122? |
| | https://www.npmjs.com/package/uuid est une librairie npm permettant de facilement génerer des uuid. |
|Question | In Node.js, how can we execute a function on a **periodic** basis? |
| | Nous utilisons set interval.  Source :https://stackoverflow.com/questions/1224463/is-there-any-way-to-call-a-function-periodically-in-javascript |
|Question | In Node.js, how can we **emit UDP datagrams**? |
| | Nous pouvons utilisé 'dgram', le fonction createSocket puis send sur la socket |
|Question | In Node.js, how can we **access the command line arguments**? |
| | NNous pouvons la faire grâce à process.argv[2], comme cela est visible dans le laboratoire Thermometre. |


## Task 3: package the "musician" app in a Docker image

| #  | Topic |
| ---  | --- |
|Question | How do we **define and build our own Docker image**?|
| | Nous devons écrire un dockerfile qui est basé sur nodejs, aprés cela nous y copions notre programme puis nous lancerons l'application avec le parametre de lancement du docker comme parametre. |
|Question | How can we use the `ENTRYPOINT` statement in our Dockerfile?  |
| | ENTRYPOINT est une sorte de CMD mais qui permet de passer des arguments. |
|Question | After building our Docker image, how do we use it to **run containers**?  |
| | Nous pouvons ajouter un argument a la run afin de savoir quel musicien va jouer, lors du build nous avons préciser le nom puis nous faisons "docker run res/musician instruement"  |
|Question | How do we get the list of all **running containers**?  |
| | docker ps  |
|Question | How do we **stop/kill** one running container?  |
| | docker kill ID ou name |
|Question | How can we check that our running containers are effectively sending UDP datagrams?  |
| | Si nous connectons wireshark sur le réseau docker, nous verrons passer des datagramme UDP.  |


## Task 4: implement an "auditor" Node.js application

| #  | Topic |
| ---  | ---  |
|Question | With Node.js, how can we listen for UDP datagrams in a multicast group? |
| | Nous pouvons utiliser dgram aussi, la creation de socket puis la fonction on()  |
|Question | How can we use the `Map` built-in object introduced in ECMAScript 6 to implement a **dictionary**?  |
| | Il est possible d'utiliser l'objet map avec une paire {UUID,{Info1,Info2, ..., infoX}} puis la méthode SET(uuid) nous permet soit d'inserer la paire pour l'UUID si elle n'est pas présente sinon elle permet de mettre à jourd les valeurs pour l'UUID|
|Question | How can we use the `Moment.js` npm module to help us with **date manipulations** and formatting?  |
| | moment permet d'obtenir facilement une date lisible et utilisable pour des calcules. |
|Question | When and how do we **get rid of inactive players**?  |
| | Lorsqu'un musicien n'a pas jouer depuis 5secondes, l'auditeur elimine ce musicien de sa liste des musiciens actif. La méthode de vérification sera lancée automatiquement. |
|Question | How do I implement a **simple TCP server** in Node.js?  |
| | Avec le module "net" il est possible de crée un server et client TCP facillement |


## Task 5: package the "auditor" app in a Docker image

| #  | Topic |
| ---  | --- |
|Question | How do we validate that the whole system works, once we have built our Docker image? |
| | Un script de validation nous peremet de voir si cela fonctionne. Sans ça il faut lancer un auditeur et ce connecter en TCP avec telnet (Un tableau vide doit être reçu)Puis de lancer des containers de musiciens et refaire une connection telnet. (Cette fois nous devrions recevoir un JSON). Puis supprimer un container et voir si c'est bel et bien aprés un moment que le JSON recu en TCP perds des informations.|


## Constraints

Please be careful to adhere to the specifications in this document, and in particular

* the Docker image names
* the names of instruments and their sounds
* the TCP PORT number

Also, we have prepared two directories, where you should place your two `Dockerfile` with their dependent files.

Have a look at the `validate.sh` script located in the top-level directory. This script automates part of the validation process for your implementation (it will gradually be expanded with additional operations and assertions). As soon as you start creating your Docker images (i.e. creating your Dockerfiles), you should try to run it.
