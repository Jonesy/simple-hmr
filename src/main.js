class MyCounter extends HTMLElement {
  count = 0;

  constructor() {
    super();
    this.innerHTML = `<button>
      Count is <span>${this.count}</span>
      </button>
    `;
    this.button = this.querySelector("button");
    this.countText = this.querySelector("span");

    this.button.addEventListener("click", this);
  }

  handleEvent() {
    this.count++;
    this.countText.textContent = this.count.toString();
  }
}

customElements.define("my-counter", MyCounter);
