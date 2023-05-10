# 🤖 Mobile app testing easier with Maestro 👽

<p align="center">
  <a href="https://github.com/tuantvk/rnmaestro/issues">
    <img src="https://img.shields.io/github/issues/tuantvk/rnmaestro.svg" alt="issues" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/forks/tuantvk/rnmaestro.svg" alt="forks" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/stars/tuantvk/rnmaestro.svg" alt="stars" />
  </a>
  <a href="https://github.com/tuantvk/rnmaestro/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/tuantvk/rnmaestro.svg" alt="LICENSE" />
  </a>
</p>

| ![Twitter Example](https://raw.githubusercontent.com/mobile-dev-inc/maestro-docs/main/.gitbook/assets/twitter_continuous_v3_fast.gif) | 
|:--:| 
| *Twitter Example - maestro.mobile.dev* |


### Languages

* 🇻🇳 [Tiếng Việt](VI_README.md)


I used [Detox](https://wix.github.io/Detox/) to test React Native apps. At that time, Detox was so "cool", saving both the time and effort of the dev team and the tester team. However, later on, I saw the complexity, as well as the "difficulty" with new team members, that's when **Maestro** came to me as a savior. I know Maestro through an article on [dev.to](https://dev.to/), but my team's "noob" is truthly 😂 (but my teammates don't believe it).


### Table of Contents
* [What is Maestro ?](#what-is-maestro)
* [Setting up the development environment and initializing the app](#setting-up-the-development-environment-and-initializing-the-app)
* [Installing Maestro](#installing-maestro)
* [Test flows](#test-flows)
* [Maestro studio](#maestro-studio)
* [Test case](#test-case)
* [Interaction with a component by testID](#interaction-with-a-component-by-testid)
* [External parameters](#external-parameters)
* [runFlow](#runflow)
* [Recording your flow](#recording-your-flow)
* [Tags](#tags)
* [Maestro Cloud](#maestro-cloud)
* [Videos testing of Maestro](#videos-testing-of-maestro)


## What is Maestro ?

[Maestro](https://maestro.mobile.dev/) is the simplest and most effective mobile UI testing framework. Maestro is built on learnings from its predecessors (Appium, Espresso, UIAutomator, XCTest) and allows you to easily define and test your Flows.

What are Flows? Think of Flows as parts of the user journey in your app. Login, Checkout and Add to Cart are three examples of possible Flows that can be defined and tested using Maestro. Declarative yet powerful syntax and write your tests in a `yaml` or `yml` file. Read more [Why Maestro?](https://maestro.mobile.dev/#why-maestro)

Platform Support:

| Platform     | Support |
|--------------| --------|
| iOS          | ✅ |
| Android      | ✅ |
| React Native | ✅ |
| Flutter      | ✅ |
| Web Views    | ✅ |

Personally, I like using Maestro for mobile app testing. Installing and writing tests is also very easy for all those who do not know how to use the Casio FX-570 calculator.
In this example, I will guide you to install and write some common test cases. I use Mac OS and a simple app written in React Native.


## Setting up the development environment and initializing the app

First, you must have the application to be tested. To create a React Native project, you can refer to the full steps at [Setting up the development environment](https://reactnative.dev/docs/environment-setup).

Assuming you already have the environment, proceed with initializing the application:

```sh
npx react-native init RNMaestro
```

After initialization, notice the **applicationId** of Android (`android/app/build.gradle -> applicationId`) and iOS (`Project in Xcode -> Signing & Capabilities -> Bundle Identifier`). You can optionally edit them for later use, in this tutorial I edit Android and iOS to `com.rnmaestro`.

In the `App.tsx` file of the project, copy & paste the code below.

```js
// App.tsx
import React, { useState } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
} from 'react-native';

const TASKS = Array.from({ length: 25 }, (_, i) => ({ title: 'Task ' + i }));

interface Item {
  title: string;
}

const App = () => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState(TASKS);

  const addTask = () => {
    if (title?.trim()?.length === 0) {
      Alert.alert('Title is required');
    } else {
      const newTasks = [...tasks];
      newTasks.unshift({ title });
      setTasks(newTasks);
      setTitle('');
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Button title={item?.title} onPress={() => Alert.alert(item?.title)} />
  );

  const keyExtractor = (item: Item, idx: number) => `${idx}`;

  return (
    <SafeAreaView>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View>
            <TextInput
              value={title}
              placeholder="Enter your title"
              onChangeText={setTitle}
            />
            <Button testID="btn_add_task" title="Add task" onPress={addTask} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default App;
```

Or you can use my project (**skip step below if you don't use it**):

* Clone repository

```sh
git clone https://github.com/tuantvk/rnmaestro.git
```

* Installing packages

```sh
cd rnmaestro; yarn install
```

* Pod (**Only for iOS**)

```sh
npx pod-install
```


## Installing Maestro

For installation information for Windows or other environments, please refer to the official documentation [Installing Maestro
](https://maestro.mobile.dev/getting-started/installing-maestro).

Run the following command to install Maestro on Mac OS, Linux:

```sh
curl -Ls "https://get.maestro.mobile.dev" | bash
```

You can check if maestro is installed by checking the version:

```sh
maestro -v
```

It should print the version number `vi.xxx.com` (E.g: 1.27.0).
In case `zsh: command not found: maestro`, restart your terminal please.

Running flows on **iOS** Simulator requires installation of [Facebook IDB](https://fbidb.io/):

```sh
brew tap facebook/fb
brew install idb-companion
```

> * Xcode recommended version is 14 or higher.
> * Maestro can't interact with real iOS devices yet. Only Simulator is supported at the moment. (May 2023)

After completing the above steps, the installation is complete. Start on writing test cases.

<p align="center">
  <img style="width:450px" src="https://media1.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif" alt="https://media1.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif" />
<p>


## Test flows

Based on the functionality of the current application, our workflow should look like this:

1. Start the app
2. Press `Add task` button
3. Check if empty message is visible
4. Enter `title`
5. Press `Add task` button
6. Check if new task is visible


## Maestro studio

<figure><img src="https://raw.githubusercontent.com/mobile-dev-inc/maestro-docs/main/.gitbook/assets/Screenshot%202023-03-10%20at%2013.23.54.png" alt=""><figcaption></figcaption></figure>

Use **Maestro Studio** to instantly discover the exact commands needed to interact with your app.

```sh
maestro studio
```

Run the command above to launch Maestro Studio in your browser, default is `http://localhost:9999`.

https://user-images.githubusercontent.com/30563960/236864010-3700e3c4-9fb8-4cee-bf59-b2755b3ae273.mp4


## Test case

Create file `.maestro/app.yaml` in root folder of the project.

```yaml
# .maestro/app.yaml
appId: com.rnmaestro # applicationId
---
- launchApp
# Check if "Title is required" is visible
- tapOn: "Add task"
- assertVisible: "Title is required"
- tapOn: "OK"

# Check if new task is visible
- tapOn: "Enter your title"
- inputText: "Task from maestro"
- hideKeyboard # Note 1
- tapOn: "Add task"
- assertVisible: "Task from maestro"
```

> **Note 1**:
> On iOS, `hideKeyboard` is done with help of scrolling up and down from the middle of the screen since there is no native API to hide the keyboard. If using this command doesn't hide the keyboard we recommend clicking on some non-tappable region with `tapOn` points command, similarly to how a user would hide the keyboard when interacting with your app. Read more [iOS implementation caveat](https://maestro.mobile.dev/api-reference/commands/hidekeyboard#ios-implementation-caveat).

Run the associated Flow using the `maestro test` command.

```sh
# run single flow
maestro test .maestro/app.yaml
# or
# run all flows in a directory
maestro test .maestro/
```

https://user-images.githubusercontent.com/30563960/236864158-dbf562bc-1a98-4352-972a-e16ff68b8f3b.mp4

In ternimal looks similar to the image below:

<p>
  <img style="width:700px" src="assets/logs.png" alt="tuantvk - maestro logs" />
<p>

Test will be automatically restarted whenever you make a change to the test file. This is particularly convenient when writing a new test from ground up. Run with `-c` argument.

```sh
maestro test -c .maestro/app.yaml
```

**Commands**

| | | | |
| ---- | ---- | ---- | ---- |
| assertVisible | assertNotVisible | assertTrue | back |
| clearKeychain | clearState | copyTextFrom | evalScript |
| eraseText | extendedWaitUntil | hideKeyboard | inputText |
| launchApp | openLink | pressKey | pasteText |
| repeat | runFlow | runScript | scroll |
| scrollUntilVisible | setLocation | stopApp | swipe |
| takeScreenshot | tapOn | travel | waitForAnimationToEnd |

Read more [Maestro - Commands](https://maestro.mobile.dev/api-reference/commands).

### Interaction with a component by `testID`

In the example above, I was instructed to write the flow by calling the contents of the screen directly. However, there will be many testing parts whose content changes after each operation, so you need to use `testID` to identify like: [View](https://reactnative.dev/docs/view#testid), [Button](https://reactnative.dev/docs/button#testid), [Text](https://reactnative.dev/docs/text#testid), [Image](https://reactnative.dev/docs/image#testid).

Example:

```yaml
# .maestro/app.yaml
appId: com.rnmaestro # applicationId
---
- launchApp
# Check if "Title is required" is visible
- tapOn:
    id: "btn_add_task" # testID here
- assertVisible: "Title is required"
- tapOn: "OK"
```


### External parameters

There might be cases where you don't want to store certain values in a test file itself, you can pass parameters to Maestro:

```sh
maestro test -e APP_ID=com.rnmaestro .maestro/app.yaml
```

And then refer to them in your flow using `${name}` notation:

```yaml
# .maestro/app.yaml
appId: ${APP_ID} # applicationId
---
- launchApp
```

Constants can be declared at the flow file level, in key `env`, above the `---` marker:

```yaml
# .maestro/app.yaml
appId: ${APP_ID} # applicationId
env:
  APP_ID: com.rnmaestro
---
- launchApp
```

If you want to run tests from `scripts` of `package.json` you can config:

```json
{
  "scripts": {
    "test": "$HOME/.maestro/bin/maestro test",
    "test-dev": "yarn test -e APP_ID=com.rnmaestro.dev",
    "test-prod": "yarn test -e APP_ID=com.rnmaestro"
  }
}
```

In case, I have 2 environments `dev` and `production`.

* `com.rnmaestro.dev` is for dev environments
* `com.rnmaestro` is for production environments

Run test:

```sh
yarn run test-prod .maestro/app.yaml
```


### runFlow

If you'd like to avoid duplication of code or otherwise modularize your Flow files, you can use the `runFlow` command to run commands from another file. Example:

```yaml
# Login.yaml
appId: com.example.app
---
- launchApp
- tapOn: Username
- inputText: Test User
- tapOn: Password
- inputText: Test Password
- tapOn: Login
```

```yaml
# Settings.yaml
appId: com.example.app
---
- runFlow: Login.yaml # Run commands from `Login.yaml`
- tapOn: Settings
- assertVisible: Switch to dark mode
```

Read more [Maestro - runFlow](https://maestro.mobile.dev/api-reference/commands/runflow).


### Recording your flow

Simply run the command below:

```sh
maestro record .maestro/app.yaml
```

After testing is complete, maestro renders a beautiful `mp4` video recording the entire process.

> Currently, Maestro versions `CLI 1.26.0`, `CLI 1.26.1`, `CLI 1.27.0`, `record` feature is not work on iOS, but it has been fixed at commit [2bd380d] (https://github.com/mobile-dev-inc/maestro/commit/2bd380da5cb068da5704f313711530d89e0ba74f), but no release yet. If you are using the above versions, it is possible that the screen recording feature will not work (Updated date: 2023-05-10).


## Tags

There is a couple of different use cases for this, but this is especially useful when you want to run some Flows at Pull Request time, and other Flows before a version release. The `--include-tags` will look for all flows containing the provided tag; it doesn't matter if those Flows also have other tags. On the other hand, the `--exclude-tags` parameter will remove from the list of Flows run any Flow that contains the provided tags. Example:

```yaml
# flowA.yaml
appId: com.example.app
tags: 
  - dev
  - pull-request
```

```yaml
# flowB.yaml
appId: com.example.app
tags: 
  - dev
```

```sh
maestro test --include-tags=dev --exclude-tags=pull-request workspaceFolder/
```

In the scenario above:

* If they use `--include-tags=dev`, flowA and flowB will run.
* If they use `--include-tags=dev,pull-request`, both flows will run.
* If they use `--exclude-tags=pull-request`, only flowB will run.
* If they use `--exclude-tags=dev` none Flow will run.
* If they use `--include-tags=dev --exclude-tags=pull-request`, only flowB will run.

Read more [Maestro - Tags](https://maestro.mobile.dev/cli/tags).


## Maestro Cloud

The easiest way to test your Flows in CI is to run your Flows on Maestro Cloud. Since your flows run in the cloud there's no need to configure any simulators or emulators on your end. Check out the [Maestro Cloud Documentation](https://cloud.mobile.dev/).

CI Support:

| CI Platform    | Support via CLI | Native Intergation |
|----------------|-----------------|--------------------|
| GitHub Actions | ✅ | ✅ |
| Bitrise        | ✅ | ✅ |
| Bitbucket      | ✅ | ✅ |
| CircleCI       | ✅ | ✅ |
| GitLab CI/CD   | ✅ | 🚧 |
| TravisCI       | ✅ | |
| Jenkins        | ✅ | |
| All other CI platforms | ✅ | |


## Videos testing of Maestro

* [Android contacts flow automation - maestro.mobile.dev](https://maestro.mobile.dev/examples/android-contacts-flow-automation)

[![Android contacts flow automation](https://i.vimeocdn.com/video/1563541340-9e646b93d630d90e1fa93b6c8d140d09a4115de74aafa491a968d0a5ec8252be-d)](https://player.vimeo.com/video/779079600?h=0b1fec8f26)

<br />

* [Facebook signup flow automation - maestro.mobile.dev](https://maestro.mobile.dev/examples/facebook-signup-flow-automation)

[![Facebook signup flow automation](https://i.vimeocdn.com/video/1537181939-8c4e67e47ff72aa7e14642a7fc104a662a457fabc20f6ce076b571d98f497a9d-d)](https://player.vimeo.com/video/765491505?h=21d7adf282)


## Resources

* Maestro: [https://maestro.mobile.dev/](https://maestro.mobile.dev/)
* Maestro Cloud: [https://cloud.mobile.dev/](https://cloud.mobile.dev/)
* Facebook IDB: [https://github.com/facebook/idb](https://github.com/facebook/idb)
* Best tips & tricks for E2E Maestro with React Native: [https://dev.to/retyui/best-tips-tricks-for-e2e-maestro-with-react-native-2kaa](https://dev.to/retyui/best-tips-tricks-for-e2e-maestro-with-react-native-2kaa)
* Test your React Native app with Maestro: [https://dev.to/b42/test-your-react-native-app-with-maestro-5bfj](https://dev.to/b42/test-your-react-native-app-with-maestro-5bfj)
* Streamline Your React Native Testing with Maestro: [https://viniciuspetrachin.medium.com/streamline-your-react-native-testing-with-maestro-bc279586125f](https://viniciuspetrachin.medium.com/streamline-your-react-native-testing-with-maestro-bc279586125f)


<p align="center">
  <img style="width:400px" src="https://media.tenor.com/blHCE4Hrc20AAAAd/bravo.gif" alt="https://media.tenor.com/blHCE4Hrc20AAAAd/bravo.gif" />
<p>

Maestro is also very new to the mobile application testing community, there are many issues to fix and upgrade. However, it is well deserved 1 star on the [Maestro Github](https://github.com/mobile-dev-inc/maestro) for the development team.

🎉 🎉 🎉 **Hope the article is useful to everyone! Thanks !** 🎉 🎉 🎉


## Contributions

Any comments and suggestions are always welcome. Please make [Issues](https://github.com/tuantvk/rnmaestro/issues) or [Pull requests](https://github.com/tuantvk/rnmaestro/pulls) for me.


## License

[MIT licensed](LICENSE).
