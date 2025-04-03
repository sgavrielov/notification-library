/**
 * Default options for the Notification system.
 * @typedef {Object} NotificationOptions
 * @property {string} [position="top-right"] - Position on screen.
 * @property {number|false} [autoClose=3000] - Time in ms before auto close. False to disable.
 * @property {boolean} [canClose=true] - Wether user can manually close it.
 * @property {boolean} [showProgress=true] - Wether to show progress bar.
 * @property {boolean} [pauseOnHover=true] - Pause timer on hover.
 * @property {boolean} [pauseOnFocusLoss=true] - Pause timer when tab loses focus.
 * @property {Function} [onClose]
 */
const DEFAULT_NOTIFICATION_OPTIONS = {
  position: "top-right",
  autoClose: 3000,
  canClose: true,
  showProgress: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  onClose: () => {},
};

/**
 * Class representing a notification.
 */
class Notification {
  /** @type {HTMLDivElement} The DOM element of the notification */
  #notificationElement;

  /** @type {number} requestAnimationFrame ID for autoClose */
  #autoCloseInterval;

  /** @type {number} requestAnimationFrame ID for progress bar */
  #progressInterval;

  /** @type {Function} Bound reference to remove method */
  #removeBind;

  /** @type {number} How long the notification has been visible */
  #timeVisible = 0;

  /** @type {number|false} Auto close time in ms */
  #autoClose;

  /** @type {boolean} Is notification currently paused */
  #isPaused = false;

  /** @type {Function} Unpauses the notification timer */
  #unpause;

  /** @type {Function} Pauses the notification timer */
  #pause;

  /** @type {Function} Handles tab visibility change */
  #visibilityChange;

  /** @type {boolean} Whether to reset timer after tab becomes visible */
  #shouldUnPause;

  /**
   * Create a new Notification.
   * @param {NotificationOptions} options - Configuration options for the notification.
   */
  constructor(options) {
    this.#notificationElement = document.createElement("div");
    this.#notificationElement.classList.add("notification");

    requestAnimationFrame(() =>
      this.#notificationElement.classList.add("show")
    );

    this.#removeBind = this.remove.bind(this);

    this.#unpause = () => (this.#isPaused = false);
    this.#pause = () => (this.#isPaused = true);

    this.#visibilityChange = () => {
      this.#shouldUnPause = document.visibilityState === "visible";
    };

    this.update({ ...DEFAULT_NOTIFICATION_OPTIONS, ...options });
  }

  /**
   * Set the auto-close timeout.
   * @param {number|false} value
   */
  set autoClose(value) {
    this.#autoClose = value;
    this.#timeVisible = 0;
    if (value === false) return;

    let lastTime;
    const func = (time) => {
      if (this.#shouldUnPause) {
        lastTime = null;
        this.#shouldUnPause = false;
      }

      if (lastTime == null) {
        lastTime = time;
        this.#autoCloseInterval = requestAnimationFrame(func);
        return;
      }

      if (!this.#isPaused) {
        this.#timeVisible += time - lastTime;

        if (this.#timeVisible >= this.#autoClose) {
          this.onClose();
          this.remove();
          return;
        }
      }

      lastTime = time;
      this.#autoCloseInterval = requestAnimationFrame(func);
    };

    this.#autoCloseInterval = requestAnimationFrame(func);
  }

  /**
   * Set the notification's screen position.
   * @param {string} value
   */
  set position(value) {
    const currentContainer = this.#notificationElement.parentElement;
    const selector = `.notification-container[data-position='${value}']`;
    const container =
      document.querySelector(selector) || createContainer(value);

    container.append(this.#notificationElement);

    if (currentContainer === null || currentContainer.hasChildNodes()) return;

    currentContainer.remove();
  }

  /**
   * Set the text content of the notification.
   * @param {string} message
   */
  set text(message) {
    this.#notificationElement.textContent = message;
  }

  /**
   * Set whether the notification can be manually closed.
   * @param {boolean} value
   */
  set canClose(value) {
    this.#notificationElement.classList.toggle("can-close", value);
    if (value) {
      this.#notificationElement.addEventListener("click", () => {
        cancelAnimationFrame(this.#autoCloseInterval);
        this.remove();
      });
    } else {
      this.#notificationElement.removeEventListener("click", this.#removeBind);
    }
  }

  /**
   * Apply custom inline styles.
   * @param {Object} styles
   */
  set style(styles) {
    Object.entries(styles).forEach(([key, value]) => {
      this.#notificationElement.style[key] = value;
    });
  }

  /**
   * Enable or disable progress bar display.
   * @param {boolean} value
   */
  set showProgress(value) {
    this.#notificationElement.classList.toggle("progress", value);
    this.#notificationElement.style.setProperty("--progress", 1);

    if (value) {
      let lastTime;

      const func = (time) => {
        if (lastTime == null) {
          lastTime = time;
          this.#progressInterval = requestAnimationFrame(func);
          return;
        }

        if (!this.#isPaused) {
          this.#notificationElement.style.setProperty(
            "--progress",
            1 - this.#timeVisible / this.#autoClose
          );
        }

        lastTime = time;
        this.#progressInterval = requestAnimationFrame(func);
      };

      this.#progressInterval = requestAnimationFrame(func);
    }
  }

  /**
   * Enable or disable pause on hover.
   * @param {boolean} value
   */
  set pauseOnHover(value) {
    this.#notificationElement.classList.toggle("can-close", value);
    if (value) {
      this.#notificationElement.addEventListener("mouseover", this.#pause);
      this.#notificationElement.addEventListener("mouseleave", this.#unpause);
    } else {
      this.#notificationElement.removeEventListener("mouseover", this.#pause);
      this.#notificationElement.removeEventListener(
        "mouseleave",
        this.#unpause
      );
    }
  }

  /**
   * Enable or disable pause on focus loss.
   * @param {boolean} value
   */
  set pauseOnFocusLoss(value) {
    this.#notificationElement.classList.toggle("can-close", value);
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilityChange);
    } else {
      document.removeEventListener("visibilitychange", this.#visibilityChange);
    }
  }

  /**
   * Update the notification with new options.
   * @param {NotificationOptions} options
   */
  update(options) {
    if (typeof options === "object") {
      Object.entries(options).forEach(([key, value]) => {
        this[key] = value;
      });
    } else {
      console.error("options must be type of object");
      return;
    }
  }

  /**
   * Remove the notification from the DOM.
   */
  remove() {
    cancelAnimationFrame(this.#autoCloseInterval);
    cancelAnimationFrame(this.#progressInterval);

    const container = this.#notificationElement.parentElement;

    this.#notificationElement.classList.remove("show");

    this.#notificationElement.addEventListener("transitionend", () => {
      this.#notificationElement.remove();

      if (container.hasChildNodes()) return;

      container.remove();
    });
  }
}

/**
 * Creates a container for notifications if not already existing.
 * @param {string} position - Position of the notification container.
 * @returns {HTMLElement} - The created container element.
 */
function createContainer(position) {
  const container = document.createElement("div");
  container.classList.add("notification-container");

  container.dataset.position = position;

  document.body.append(container);

  return container;
}
