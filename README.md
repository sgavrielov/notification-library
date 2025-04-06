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
- ✅ Notification type support: `default`, `success`, `error`, `info`

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
| `type`             | `string`           | Type of notification. Supports: `default`, `success`, `error`, `info`.                                   |

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
| `type`             | `default`                   |

## 📌 Usage Examples

**Note: To update a notification, store it in a variable. Once a notification is closed, it becomes inaccessible and cannot be reused.**

### 🚀 Basic Notification (No Updates)

If you don't need to modify the notification after it appears, simply create it:

```js
new Notification({
  text: "Hello, World!",
  autoClose: 3000,
  type: "success",
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
  type: "info",
});

// Modify the notification after 1.5 seconds
setTimeout(() => {
  notification.update({
    text: "Process Complete!",
    type: "success",
    canClose: true,
    autoClose: 3000,
    style: {
      transition: "all 350ms linear",
    },
  });
}, 1500);
```

**🔹 Ensure autoClose: false to prevent it from closing before the update.**

## 📝 License

This project is licensed under the MIT License – feel free to use and modify.

## 📌 Contribution

Want to improve this project? Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request.
