# 🚀 Lightweight & Customizable Notification Library

A lightweight and flexible notification library designed for seamless display and management of customizable notifications.

## ✨ Features

- ✅ Customizable positioning (top-left, bottom-right, center, etc.)
- ✅ Auto-close with adjustable delay
- ✅ Inline styling support
- ✅ Dismiss or prevent closing
- ✅ Progress bar for remaining time
- ✅ Pause on hover or when the window loses focus
- ✅ On-close callback function

## ⚙️ Configuration Options

| Options            | Type               | Description                                                                                              |
| :----------------- | :----------------- | :------------------------------------------------------------------------------------------------------- |
| `text`             | `string`           | The notification message.                                                                                |
| `position`         | `string`           | Position of the notification (top-right, top-center, top-left, bottom-right, bottom-center, bottom-left) |
| `autoClose`        | `bool` \| `number` | Delay in ms to close the notification. If set to false, the notification needs to be closed manually     |
| `style`            | `object`           | Optional inline styles for the notification element.                                                     |
| `onClose`          | `function`         | Callback function triggered when the notification disappears.                                            |
| `canClose`         | `bool`             | Enables or disables manual closing.                                                                      |
| `showProgress`     | `bool`             | Displays a progress bar indicating remaining time.                                                       |
| `pauseOnHover`     | `bool`             | Pauses the timer when hovered.                                                                           |
| `pauseOnFocusLoss` | `bool`             | Pauses the timer when the window loses focus.                                                            |

## Default Options

| Options            | Default                     |
| :----------------- | :-------------------------- |
| `text`             | `""` (empty string)         |
| `position`         | `top-right`                 |
| `autoClose`        | `3000` (3 seconds)          |
| `style`            | `{}` (empty object)         |
| `onClose`          | `() => {}` (empty function) |
| `canClose`         | `true`                      |
| `showProgress`     | `true`                      |
| `pauseOnHover`     | `true`                      |
| `pauseOnFocusLoss` | `true`                      |

## 📌 Usage Examples

**Note: To update a notification, store it in a variable. Once a notification is closed, it becomes inaccessible and cannot be reused.**

### 🚀 Basic Notification (No Updates)

If you don't need to modify the notification after it appears, simply create it:

```js
new Notification({
  text: "Hello, World!",
  autoClose: 3000,
  onClose: () => console.log("DONE"),
});
```

**🔹 Once this notification closes, it cannot be modified or reused.**

### 🔄 Updating an Active Notification

```js
const notification = new Notification({
  text: "Loading...",
  canClose: false,
  autoClose: false,
});

// Modify the notification after 1.5 seconds
setTimeout(() => {
  notification.update({
    text: "Process Complete!",
    canClose: true,
    autoClose: 3000,
    style: {
      background: "#2e344e",
      color: "#ffffff",
      transition: "all 350ms linear",
    },
  });
}, 5000);
```

**🔹 Ensure autoClose: false to prevent it from closing before the update.**

## 📝 License

This project is licensed under the MIT License – feel free to use and modify.

## 📌 Contribution

Want to improve this project? Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request.
