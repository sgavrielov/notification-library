const DEFAULT_NOTIFICATION_OPTIONS = {
  position: "top-right",
  autoClose: 3000,
  canClose: true,
  showProgress: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  onClose: () => {},
};

class Notification {
  #notificationElement;
  #autoCloseInterval;
  #progressInterval;
  #removeBinded;
  #timeVisible = 0;
  #autoClose;
  #isPaused = false;
  #unpause;
  #pause;
  #visibilityChnage;
  #shouldUnPause;

  constructor(options) {
    this.#notificationElement = document.createElement("div");
    this.#notificationElement.classList.add("notification");

    requestAnimationFrame(() =>
      this.#notificationElement.classList.add("show")
    );

    this.#removeBinded = this.remove.bind(this);

    this.#unpause = () => (this.#isPaused = false);
    this.#pause = () => (this.#isPaused = true);

    this.#visibilityChnage = () => {
      this.#shouldUnPause = document.visibilityState === "visible";
    };

    this.update({ ...DEFAULT_NOTIFICATION_OPTIONS, ...options });
  }

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

  set position(value) {
    const currentContainer = this.#notificationElement.parentElement;
    const selector = `.notification-container[data-position='${value}']`;
    const container =
      document.querySelector(selector) || createContainer(value);

    container.append(this.#notificationElement);

    if (currentContainer === null || currentContainer.hasChildNodes()) return;

    currentContainer.remove();
  }

  set text(message) {
    this.#notificationElement.textContent = message;
  }

  set canClose(value) {
    this.#notificationElement.classList.toggle("can-close", value);
    if (value) {
      this.#notificationElement.addEventListener("click", () => {
        cancelAnimationFrame(this.#autoCloseInterval);
        this.remove();
      });
    } else {
      this.#notificationElement.removeEventListener(
        "click",
        this.#removeBinded
      );
    }
  }

  set style(styles) {
    Object.entries(styles).forEach(([key, value]) => {
      this.#notificationElement.style[key] = value;
    });
  }

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

  set pauseOnFocusLoss(value) {
    this.#notificationElement.classList.toggle("can-close", value);
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilityChnage);
    } else {
      document.removeEventListener("visibilitychange", this.#visibilityChnage);
    }
  }

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

function createContainer(position) {
  const container = document.createElement("div");
  container.classList.add("notification-container");

  container.dataset.position = position;

  document.body.append(container);

  return container;
}
