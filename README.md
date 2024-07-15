# Notification Library

## Options

| Options          | Type           | Description                                                                                          |
| :--------------- | :------------- | :--------------------------------------------------------------------------------------------------- |
| text             | string         | Notcification message                                                                                |
| position         | string         | One of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left                     |
| autoClose        | bool \| number | Delay in ms to close the notification. If set to false, the notification needs to be closed manually |
| style            | object         | Add optional inline style to the notification element                                                |
| canClose         | bool           | Dismiss notification close functionality                                                             |
| showProgress     | bool           | Display or not the progress bar below the notification(remaining time)                               |
| pauseOnHover     | bool           | Keep the timer running or not on hover                                                               |
| pauseOnFocusLoss | bool           | Pause the timer when the window loses focus                                                          |

## Default Options

| Options          | Default      |
| :--------------- | :----------- |
| text             | empty string |
| position         | top-right    |
| autoClose        | 3000         |
| style            | empty object |
| canClose         | true         |
| showProgress     | true         |
| pauseOnHover     | true         |
| pauseOnFocusLoss | true         |

## Usages

```js
// After the notification has been closed by autoClose or by the user
// You will not be able to use it again notification variable
// To use it more than one time make sure that you disable the autoClose & canClose
const notification = new Notification({
  text: 'Hello World !',
});

// The update function will run only if the notification still visible
setTimeout(() => {
  notification.update({
    style: {
      background: '#2e344e',
      color: '#ffffff',
      transition: 'all 350ms linear',
    },
  });
}, 1500);
```
